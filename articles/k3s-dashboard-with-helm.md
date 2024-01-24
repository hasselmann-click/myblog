---
title: "Road to Light II: Kubernetes App Management with Helm"
publishedAt: '2024.01.24'
estdRead: 5
---

# Road to Light II: Kubernetes App Management with Helm

This is the second entry in my series where I discover the possibilities of a mini-computer and its ecosystem trying to follow a plan but allowing myself to diverge and take a few turns. Feel free to skip my rambling if you're only interested in the technical parts. 
By the end of this post, I will have installed the Kubernetes Dashboard via Helm and made my own Helm Chart for my test application.

## What is Helm

[Helm](https://helm.sh/) is a package manager for Kubernetes and handles the configuration files for users by providing parameterized templates to install. A collection of templates is called a "Helm Chart". These charts are testable, versionable, and shareable via artifactories. Their basic structure looks like this:

```bash
mychart/
  Chart.yaml 	# meta data
  values.yaml	# default values
  templates/	# config file templates
  ...			# other, e.g. subcharts
```

When Helm installs a chart to the cluster, i.e. deploying a "Release", the content of the `templates/` folder is evaluated by the template rendering engine. The templates can reference built-in objects, like a "Release" object or the contents of the `Chart.yaml`. Of course, they can also reference the default values, which may be overridden by the user on installation.
The chart can then be packaged and hosted in a Helm package repository.

## Installing the Kubernetes Dashboard

The [Kubernets Dashboard](https://github.com/kubernetes/dashboard) is a simple way to get visual information about your K8s cluster's resources and applications. Since version 3 the installation via Helm should be hassle-free, but requires an installation from scratch.
You can follow [this guide](https://artifacthub.io/packages/helm/k8s-dashboard/kubernetes-dashboard) to install the dashboard with Helm by adding the artifactory and installing the chart with your parameters. I went with the defaults.

### Kubernetes cluster unreachable

Helm wasn't amused by my installation and printed something akin to the following:

```bash
Error: Kubernetes cluster unreachable: Get "[http://localhost:8080/version] http://localhost:8080/version)": dial tcp [::1]:8080: connect: connection refused
```

As the error message says, Helm can't reach the cluster. Mostly this means Helm can't find your Kubernetes config, which was the case with my K3s installation[^1]. To make the configuration file known, I could pass the command line option `--kubeconfig` to the command. But then I would have to do that for every Helm command.
The other option is to export an environment variable: 

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

To prevent that it's reset every logout, you can add it to the `.profile` file, so it's reloaded every time you log in. You could either go global in `/etc/profile` or user-specific in `~/.profile`. 

### Login to the Dashboard

If the dashboard was deployed successfully, you can find the port it's listening to via the following:

```bash
kubectl get service -n kubernetes-dashboard
NAME                            TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)         AGE
kubernetes-dashboard            LoadBalancer   10.43.44.239   <pending>     443:30969/TCP   72d
kubernetes-dashboard-nodeport   LoadBalancer   10.43.117.76   <pending>     80:31443/TCP    72d
```


If I now navigate to https://raspberrypi:30969 in my browser, it asks for a token to authorize. But to create a token, we need a user first. So I followed [this guide](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md#getting-a-bearer-token-for-serviceaccount) to create an admin user. Now I can create the authorization token with the following command and use that, to log in to the dashboard.

```bash
kubectl -n kubernetes-dashboard create token admin
```

The guide also explains how to make that token long-lived and if you want to map the dashboard login page to a feasible path, you can have a look at [my last post](https://www.hasselmann.click/single-node-k3s#:~:text=nginx%20welcome%20page.-,The%20Frosting,-Unfortunately%20this%20requires), where I explain how to map my test application to a path via Traefik IngressRoutes.


## Creating my own Helm chart

Using a package manager isn't particularly hard. But I want to see what goes into creating such a package a.k.a. Helm chart.
In the first entry of this series, I manually deployed a test application to my single node k3s cluster. This application only consists of an empty nginx server, which shows the nginx hello page at raspberrypi/hello.
To achieve that, I had to create multiple Kubernetes resources configuration files, i.e. a service, a Traefik ingress route, and a Traefik middleware, and apply or expose them all, respectively, via `kubectl`. For more sophisticated programs this can become cumbersome rather quickly. 

I want to convert my manual installation to a Helm-managed one. Having the [Helm | Getting Started](https://helm.sh/docs/chart_template_guide/getting_started/) doc guide me, I created a new chart directory via `helm create MyHelloWorld`, removed all generated templates including the tests, copied all my "Hello World" app templates into the template folder, and, just for fun, replaced the hard coded replica count in my `hello-world.yml` with a variable, read from the values.yml Helm config file.

```yml
hello-world.yml:
	replicas: {{ .Values.replicaCount }}
values.yml:
	replicaCount: 1
```

When I wanted to install my test application via `helm install hello-world ./MyHelloWorld`, Helm reminded me that some of the resources already existed in the cluster, and it couldn't integrate them in the release because of differentiating metadata. Especially the owner field was an issue. 
Now I could try to meddle with the metadata, or simply manually delete the manually deployed resources and let Helm tell me, which resource I needed to delete next via "kubectl delete <resource type> <name>", e.g. `kubectl delete middleware strip-prefix-middleware`. Et voila:

```
$ helm list
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /etc/rancher/k3s/k3s.yaml
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /etc/rancher/k3s/k3s.yaml
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
hello-world     default         1               2024-01-16 17:14:08.730967906 +0100 CET deployed        MyHelloWorld-0.1.0      1.0.0  
```

### Concerned Helm

With every command, Helm warns me that my Kubernetes configuration files are either group- or even world-readable, which they consider insecure. In general, it is good practice to take warnings seriously and evaluate whether or not they apply to your current situation. So what do these warnings mean in my case? Basically, everyone and their sister can read the Kubernetes configuration, if they have access to my cluster, a.k.a my Raspberry Pi. But is this really an issue? I don't think so if you don't store sensitive information in it, which I harshly advise against anyway -- use Kubernetes Secrets for that.

All in all, I stick to my decision from [my first post about this project](https://www.hasselmann.click/single-node-k3s#:~:text=all%2Dnamespaces.-,Kneading,-To%20install%20the) and consider the risk very low, that someone accesses my home network, connects to my Raspberry Pi physically or exploits a running service, to blow up my cluster.
But if I ever want to expose some service to the public, I'll make sure to read the [CIS Hardening Guide | K3s](https://docs.k3s.io/security/hardening-guide) in depth.

### Testing

Delivering proper packages requires them to be testable. In the sense of Helm this means, that after the installation of a release, the test configurations can be executed to check, whether the application was installed correctly. After reading their [Helm | Chart Tests] (https://helm.sh/docs/topics/chart_tests/) documentation and being inspired by their default connection test, I came up with the following for my test app:

```yml
apiVersion: v1
kind: Pod
metadata:
  name: "hello-world-test-connection"
  labels:
    app: hello-world
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['hello-world:{{ .Values.service.port }}']
  restartPolicy: Never
```

This test simply spins up a container with the "busybox" image in my cluster and executes a `wget` to my hello-world service on its port. I had to alter the values of the injected variables from the Helm generated "default test", since I deleted all generated files to start from scratch. 

After that change, I can upgrade and test my "hello-word" release:

```bash
hasselmann@raspberrypi:~/kube/helm $ helm upgrade hello-world ./MyHelloWorld/
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /etc/rancher/k3s/k3s.yaml
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /etc/rancher/k3s/k3s.yaml
Release "hello-world" has been upgraded. Happy Helming!
NAME: hello-world
LAST DEPLOYED: Tue Jan 23 15:40:33 2024
NAMESPACE: default
STATUS: deployed
REVISION: 2

hasselmann@raspberrypi:~/kube/helm $ helm test hello-world
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /etc/rancher/k3s/k3s.yaml
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /etc/rancher/k3s/k3s.yaml
NAME: hello-world
LAST DEPLOYED: Tue Jan 23 15:40:33 2024
NAMESPACE: default
STATUS: deployed
REVISION: 2
TEST SUITE:     hello-world-test-connection
Last Started:   Tue Jan 23 15:41:03 2024
Last Completed: Tue Jan 23 15:41:13 2024
Phase:          Succeeded
```

## Conclusion

Installing and managing applications with Helm is as easy as adding dependencies to your favorite code framework, may that be npm, nuget, maven/gradle, etc. Of course, I just went with a simple example, but reading the documentation, the use cases for Helm Charts can be quite complex. With its flexible template rendering engine, it supports you in creating and handling the different configuration files and makes your installations testable. 
If you are deploying your own applications to a Kubernetes cluster, I can only recommend using Helm Charts. You will have a lot more confidence in future releases if you let Helm manage their structure and make the installations testable.

Alright, I'm out installing a Pi-Hole on my cluster. With Helm, this will only take a few minutes. Right?

Thank you for reading and happy ~~coding~~ helming!

## Remarks & Sources

[^1]: [Error: Kubernetes cluster unreachable: Get "http://localhost:8080/version?timeout=32s": dial tcp 127.0.0.1:8080: connect: connection refused - Stack Overflow](https://stackoverflow.com/questions/63066604/error-kubernetes-cluster-unreachable-get-http-localhost8080-versiontimeou)
