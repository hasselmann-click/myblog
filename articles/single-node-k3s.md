---
title: "Road To Light I: A Raspberry PI as Single Node Kubernetes Cluster"
publishedAt: '2023.12.05'
estdRead: 20
---

# Road To Light I: A Raspberry PI as Single Node Kubernetes Cluster

This will be a series where I discover the possibilities of a mini computer and its eco system trying to follow a plan, but allowing myself to diverge and take a few turns. Feel free to skip my rambling if you're only interested in the technical parts. 

I'm not sorry about the section titles. My first post about using a PI needs to be about pastries. 

## The Cake

By the end of this post, I will have a Raspberry PI running a K3s single-node cluster with a hello-world application deployed, which consists of a default nginx installation and which is available in my home network under http://raspberrypi/hello. This includes setting up the PI, installing K3s, deploying the app manually with kubectl and configuring an ingress resource (managed by Traefik).

## Prologue

Recently my TV got passively fried by thunderstrike. What I mean by "passively"? I have a toggle switch between the outlet and my devices, which was off at the time of the thunderstorm. But when it was over my TV wouldn't show anything but a black screen. Luckily we found a replacement rather quickly on a second hand market, which was technically an upgrade to the last one.

But while searching I dove into the world of cool setups and what else people do in their homes. No, not like that. Get your mind out of the gutter. I meant, what gadgets they have running besides the usual smart home stuff. And some installations had really great lighting. This reminded me of my time when I was selling TVs as a student, i.a. devices from Philips, which came with background lighting, called "Ambilight".

So, could my TV get Ambilight even though it's not a Philips? Well they have an offer themselves to upgrade other TVs: [Philips Sync Box](https://www.philips-hue.com/de-de/p/Set-Entertainment-Sync-Box-Lightstrip-farbig-2-m-203-cm/121254?clickref=1011lxYqbwP8&origin=2_de_de_globald2c~ss000000_onlinecompany-partnerize___alwayson_1100l268926).
But of course it is rather pricey. Different solutions exist too like the one from Govee, which uses a camera to synchronize the screen with its LEDs: [Govee TV LED Hintergrundbeleuchtung](https://www.amazon.de/Govee-Immersion-Hintergrundbeleuchtung-App-Steuerung-kompatibel/dp/B08LYZMCGM?linkCode=ll1&tag=smarthomefox-21&linkId=f12c12fe00ea08d5044f16a99f7d1202&language=de_DE&ref_=as_li_ss_tl&th=1). But I also stumbled across a lot of DIY articles, which were rather fascinating although sounding quite complex.

So, anyway, I ordered a Raspberry PI.

## The Recipe

I'm a software engineer by trait. And to my disgrace I have to confess I don't really know a lot about hardware. Yes, I put together a computer myself at some point, but nothing fancy. If you keep it simple, it's almost like clipping blocks. Thus having the feeling the whole process of image signal splitting, controlling LEDs and what else is necessary for a synchronized background light sounds like a lot, I'm breaking this up in smaller and simpler parts. 

In a first step I would need the Raspberry PI running some "Hello World" software. Preferably this runs in a container, so it's easier in the future to deploy additional applications as well. And since I want these programs to run indefinitely, and I had a recent rendez-vous with a blackout, some kind of orchestration would be nice, so it comes back up automatically after a crash. 

The open source variant for this would arguably be [Kubernetes](https://kubernetes.io/). Some quick querying shows for low resource environments there are multiple options like [MicroK8s](https://microk8s.io/) or [K3s](https://k3s.io/). And I went with the latter simply because it looks like the community is a little bigger (25k Stars on Github vs 8k for MicroK8s), but I'm sure they're both very capable.

K3s comes with [containerd](https://containerd.io/) as container runtime by default. I thought about integrating [Podman](https://podman.io/) for running the containers, since it can run its pods root- and daemonless. But for now I'm sticking with the defaults to keep the complexity at a minimum. This results in the following picture:

![K3s Overview](./images/k3s_overview.svg)

## The Foundation

I ordered the Huto PI Starter Kit[^1] with a Raspberry PI 4 2GB. I figured as a beginner with mini computers a starter kit makes sense. And after some research I came to the conclusion that the 2GB RAM should be enough for the time being. Also, it was on sale.

### The Ingredients 

The starter kit contains everything you need to get started. The board itself, of course. But also a power supply, cable and a case. Also some heatsinks with a corresponding adhesive applied to them, so you can glue them to your PI's CPU, RAM and the Ethernet and USB controllers[^2].

I plugged in the supplied SD card and was able to connect the board to a display using the HDMI-to-MiniHDMI cable that was also included. Et voilà, I was greeted by the iconic raspberry.

So my PI came pre-flashed, with Raspberry Pi OS already installed. Otherwise there is a flashing tool, which looks quite sophisticated[^3]. But in the end it's a mini computer, so you could install the OS flavor of your choice on it, as long as it meets the hardware requirements.

### Remote Baking

I don't plan to use my PI as a desktop, so the first thing to do was to set up WiFi and SSH. For SSH I used a tutorial from [howtogeek.com | How to SSH Into Your Raspberry Pi ](https://www.howtogeek.com/768053/how-to-ssh-into-your-raspberry-pi/) and also followed their recommendation to disable the root user from SSHing in.

This is good practice but kind of a self-protection though. Many Linux distributions create an admin user on set up, which can leverage the `sudo` command with their own password. Raspberry PI OS is one of them. 
But at least you have to think about where you want to apply root privileges.

Now to use SSH, I knew from my excursions into the world of devcontainers (which you can read about [here](../devcontainers-nextjs-windows11) and  [here](../devcontainers-2-no-vscode)) that VS Code can connect to a remote environment. And tadaa:

```bash
code --folder-uri=vscode-remote://ssh-remote+hassel@raspberrypi/home/hassel
```

Even though I'm quite used to the `nano` terminal editor by now, this is still more comfortable.

## The Dough

First things first; some information before diving into the installation of K3s:

It is recommended to have look at the [requirements](https://docs.k3s.io/installation/requirements?os=pi#operating-systems) beforehand depending on the OS you are using. In my case for the standard Raspberry PI OS installation, it informed me to enable `cgroups` first. Which makes sense, since containerd, like many container runtimes, uses Control Groups to ensure container isolation on the host[^4]. 
So I did it by adding `cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory` to the `/boot/cmdline.txt` and then rebooted the device. 

I inserted the `cgroup_enable=cpuset` as well. Although not specifically mentioned in the K3s docs, some [issues](https://github.com/k3s-io/k3s/issues/2067) and [blog posts](https://www.padok.fr/en/blog/raspberry-kubernetes#Add_node_to_the_cluster) suggested to add it.

Regarding troubleshooting any issues concerning K3s and its resources it's a good idea to have a look at the logs. Actually it is always a good idea to check the available logs when figuring out problems, not only in Kubernetes. But the following commands can be handy in this situation:

- `kubectl describe <type> <name>`
  <br>Shows the configuration of the resource and other applicable meta data (e.g. recent events for a service).
- `kubectl logs <pod>`
  <br>Gets you the logs of a specific pod instance.
- `journalctl -xe [--no-page]`
  <br>Gets you the latest system logs with extra information[^5]

Also, for most interactions with kubectl a namespace is needed, except your navigating in the default namespace. Otherwise you can provide a namespace with `-n <ns>` or simply us `--all-namespaces`.

### Kneading

To install the K3s service a script is provided at https://get.k3s.io which you can download and feed some options to customize the installation, e.g. with[^6]

```bash
curl -sfL https://get.k3s.io | sh -s - server --write-kubeconfig-mode=644
```

<details>
<summary>Explanation</summary>

- curl
  - s: Silent Mode: Don't show progress messages
  - f: Fail Silently: Don't show HTTP errors
  - L: Follow redirects to their destination
- sh
  - s: Read commands from the standard input
  - -: Read the piped script from stdin
  - server: Install K3s in server mode
  - write-kubeconfig-mode=644: Set the file permission for the generated kubeconfig file to read-write for the owner and read-only for others
</details>

For the record, the kubeconfig permissions are an acceptable compromise between security and usability in this scenario. The default mode for K3s is to run as root user, which also will be the owner of the file. Which means even limiting the permissions further, e.g. to 600, requires everything to be root, which interacts with the Kubernetes API. That includes e.g. the kubectl.

There is a mode to run K3s rootless to mitigate the risks regarding container-breakout attacks, but it's [experimental](https://docs.k3s.io/advanced#running-rootless-servers-experimental).
Ultimately it's always a trade-off between security and usability and since my cluster is supposed to run in my trusted network only and not providing any services to the public, I can live with that.

But I'll definitely keep an eye on that rootless mode.

For the record the second, the installation will also deploy an uninstall script. If you, for whatever reason, want to reset your cluster installation, you will find it at: `/usr/local/bin/k3s-uninstall.sh`[^7]

### Missing Salt

I experimented a little with the installation parameters. K3s comes with some sensible default components to make it as quick and easy to setup and deploy a fully fledged Kubernetes cluster. But I thought in my single node setup, maybe I don't need the networking component. So I tried to run the install script with the `--flannel-backend=none` option.

In my understanding, Flannel is a plugin which provides a networking layer, which makes it possible for containers on multiple nodes to talk to each other by implementing the CNI (Container Networking Interface) and using a backend like VXLAN. 
Here is a deeper dive into the Flannel topic: [K8s Under the Hood](https://mvallim.github.io/kubernetes-under-the-hood/documentation/kube-flannel.html)

But a CNI plugin is also needed for pods to communicate on the same host as well as some apps simply assume that a CNI plugin exists. After this and some other misconfiguration experiments I removed my K3s installation with the provided k3s-uninstall-script and started anew.

## The Filling

For my first "Hello World" application I want a simple web server to test out the connectivity in my local network. This means creating a `Deployment` manually by writing the config in a file and applying it via `kubectl -f hello-world.yml`[^8].

<details>
<summary>hello-world.yml</summary>

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-world
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: hello-world
        image: nginx:mainline-alpine3.18-slim
        ports:
        - containerPort: 80
```
</details>

I'm using the `nginx:mainline-alpine3.18-slim` image without configuring anything. This means I expect a plain webserver welcoming me at the root path and give me a 404 on every other path.

When I now have  a look at `kubectl get pod` I'll see my `hello-world-234hj234-57q5s` pod running in the default namespace. But to access it from my local network I need to expose the node functionality via another layer of resources: Services.

If my cluster was to be running in a cloud, I would probably want to use the provider's load balancing capabilities, thus exposing a service of type `LoadBalancer`, so my cloud service controller[^9] can pick them up and communicate them to the external load balancer.

Or I could simply use type `NodePort` and expose a specific port on each node instance the app is running on. In my case this would look something like this:

```bash
hassel@raspberrypi:~ $ kubectl expose deployment hello-world --type=LoadBalancer
service/hello-world exposed
hassel@raspberrypi:~ $ kubectl get service hello-world
NAME          TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
hello-world   NodePort       10.43.86.99   <none>        80:31778/TCP   1m
```

Now when I navigate to http://raspberrypi:31778 I'll see the nginx welcome page.

## The Frosting

Unfortunately this requires me to remember the port of my ultra important service, which is kind of unattractive. And since I'm here to learn something, I will go with the following approach: I'll deploy a service of type `ClusterIP`, which is only available inside the cluster.

```bash
hassel@raspberrypi:~ $ kubectl delete services hello-world
service "hello-world" deleted
hassel@raspberrypi:~ $ kubectl expose deployment hello-world --type=ClusterIP
service/hello-world exposed
```

Then I'll create an ingress resource which will be managed by the default ingress controller Traefik[^10] and provides path mapping for http/s traffic.

<details>
<summary>hello-world-ingress.yml</summary>

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-world-ingress
  namespace: default
spec:
  rules:
  - host: raspberrypi
    http:
      paths:
      - path: /hello
        pathType: Prefix
        backend:
          service:
            name: hello-world
            port:
              number: 80
```
</details>

This let's me access my nginx server at http://raspberrypi/hello and... wait, I'll see a page from nginx but it's a 404!

I set the ingress' path type to "prefix", so everything at "/hello/*" will be routed to this service. But I didn't expect the prefix to also be passed down. Since I don't have anything deployed on path "/hello" it returns a 404. If I update the ingress path to root and navigate to "/", I'll see the expected welcome page.

Details like this grind my gears, so let's fix that. 

### Cherry on Top

In Kubernetes objects can have annotations. These will be used for many use cases, e.g. meta data and documentation, but also to provide hints at directives and behaviours. If you're using the nginx ingress controller, you could use an annotation like `nginx.ingress.kubernetes.io/rewrite-target: /` to, well, rewrite the target path from your prefix to root.

Since V2, Traefik doesn't support many annotations anymore, but uses a flexible system of services, routes and middlewares[^11]. That means I need to convert my ingress resource to an `IngressRoute` which uses a `Middleware` that handles the stripping of the prefix.

<details>
<summary>strip-prefix-middleware.yml</summary>

```yml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: strip-prefix-middleware
  namespace: default
spec:
  stripPrefix:
    prefixes:
      - /hello
```
</details>
<br />
<details>
<summary>hello-world-ingress-route.yml</summary>

```yml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: hello-world-ingressroute
  namespace: default
spec:
  entryPoints:
    - web
  routes:
  - match: Host(`raspberrypi`) && PathPrefix(`/hello`)
    kind: Rule
    services:
    - name: hello-world
      port: 80
```
</details>

Et voilà http://raspberrypi/hello shows the nginx welcome page.

## Bon Appetit
Setting up a local Kubernetes cluster was a quite streamlined experience and, as long as you stick to the defaults, I could describe it as almost hassle free. But even if you have specific requirements you will have enough sources and documentation available. And lots of sophisticated open source options to choose from.

Using kubectl to see what's going on in your cluster, deploying and exposing a sample app, and working with ingress resources to map the services to routes in my local network convinced me that I can have a clean setup with multiple self hosted services with little effort.

And hopefully at some point I will remember to provide the namespaces right from the start.

### Next Time

A raspberry pi running an empty nginx server can certainly be improved in terms of usefulness and applying every resource individually by hand also seems kind of last decade. The next steps in the grand scheme of my TV backlighting setup would be using [Helm](https://helm.sh/docs/topics/charts/) to install different beneficial applications such as the [kubernetes/dashboard](https://github.com/kubernetes/dashboard) or a [Pi-hole](https://pi-hole.net/) before  an LED controlling software to 

Thank you for reading and happy code.. öhm configuring!

## Remarks & Sources

[^1]: Could only find it at my swiss merchant: [HutoPi Raspberry Pi 4 2GB Starter Kit - kaufen bei digitec](https://www.digitec.ch/de/s1/product/hutopi-raspberry-pi-4-2gb-starter-kit-entwicklungsboard-kit-21655619)
[^2]: [How to install heat sinks on a Raspberry Pi 4 (Quick Guide)](https://youtu.be/WMIniPIvYjM)
[^3]: [Raspberry Pi OS – Raspberry Pi](https://www.raspberrypi.com/software/)
[^4]: [GitHub - containerd/cgroups: cgroups package for Go](https://github.com/containerd/cgroups)
[^5]: [How to Use journalctl Command to Analyze Logs in Linux (linuxhandbook.com)](https://linuxhandbook.com/journalctl-command/)
[^6]: https://docs.k3s.io/quick-start
[^7]: https://docs.k3s.io/installation/uninstall
[^8]: [Using kubectl to Create a Deployment | Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)
[^9]: [Cloud Controller Manager | Kubernetes](https://kubernetes.io/docs/concepts/architecture/cloud-controller/#:~:text=The%20cloud-controller-manager%20is%20a%20Kubernetes%20control%20plane%20component,from%20components%20that%20only%20interact%20with%20your%20cluster.)
[^10]: [GitHub - traefik/traefik: The Cloud Native Application Proxy](https://github.com/traefik/traefik)
[^11]: [Kubernetes Ingress Routing Configuration - Traefik](https://doc.traefik.io/traefik/routing/providers/kubernetes-ingress/)

