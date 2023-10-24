# Dev Containers Without VS Code
In my last post I kind of raved about dev containers and I'm still a big fan. But I also looked at it with their tight integration in VS Code through its [DevContainers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers). But recently I wanted to try [Cursor](https://www.trycursor.com/), an "AI first" code editor. 
Since this is a fork of VS code the DevContainer Extension might work eventually, but currently there appear to be some [versioning issues.](https://github.com/getcursor/cursor/issues/718) So, let's take a look at how we could use dev containers without the extension.

## Spinning It Up: Docker CLI
Since a dev container is just a container like any other, we can use the container runtime of our choice, Docker in my case, to run it "manually", e.g. the proposed image for Node + Typescript:
```bash
docker run mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye
```
This would download the image, start the container, and happily exit it. What? 
Well the container needs something to run, but the image alone doesn't have an entry point, only some preinstalled dev tools. Opening a shell will do. 
But since we also want to actually develop with these tools, we need to add the source files to the container by mounting them as a volume. In my case it was a web app, so I also needed to add some port forwarding for the development server[^1].
That means we can run it as follows:
```bash
docker run -it --entrypoint /bin/bash -p 3000:3000 -v \\wsl.localhost\my\repo:/workspace mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye
```
<details>
<summary>Explanation</summary>
<ul>
<li>docker run &ltimage&gt: Run the image as container
<li>-it: interactive mode
<li>--entrypoint &ltcommand&gt: override the entrypoint and execute the command. Opening a bash in our case.
<li>-p &lthostport&gt:&ltcontainerport&gt: Forward the host port to the container
<li>-v &ltpath to source&gt:&ltmount path&gt: Mount the host path as volume to the container workspace 
</ul>
</details>
Of course this could all be defined in a dockerfile as well or using an orchestration tool like Docker Compose. But this is only the raw container part. It doesn't incorporate a potential devcontainer.json configuration, so let's change that.

## Spinning It Up 2: Devcontainer CLI
Admittedly not in version > 1.0 -- I'm using 0.52.0 -- we can still use the [devcontainer CLI](https://code.visualstudio.com/docs/devcontainers/devcontainer-cli) to spin up our dev containers. The caveat is that we need to have i.a. Node installed, which kind of objects with my idea of having a clean-as-possible host machine. For this I'm sure we could figure something out with docker multi-stage builds or similar, but I leave that for another post.
Assuming your project contains a devcontainer.json file -- if not, go read [my previous post](../previous) to find out more -- , we can use the following to spin up the devcontainer:
```bash
devcontainer up --workspace-folder \\wsl.localhost\my\repo
``` 
The devcontainer CLI will create a label from the workspace folder location to determine if the container already exists or needs to be newly build. But you can also give it custom labels explicitly via the `--id-label <name>=<value>` option and reference them with other devcontainer commands, e.g. `devcontainer exec --id-label MyName=MyDevEnv /bin/bash`. 
To update a container we would need to rebuild it, which we could either do by manually deleting the container or use the `--remove-existing-container` option. We can also specify that the build should not use any caching and redownload from source with the `--build-no-cache` option.

 <details>
 <summary>Summary: Useful Options</summary>
 <ul>
 <li>--id-label &ltname&gt=&ltvalue&gt: Adds custom labels to the container
 <li>--remove-existing-container: Removes the devcontainer first, if it already exists (default: false)
 <li>--build-no-cache: Builds from image with `--no-cache` if the container does **not** exist
 <li>--secrets-file: You can provide a secrets file which will be passed to the environment variables of the container
 </ul>
 </details>
 
Now that the container is running we can connect to it and we're good to go:
```bash
devcontainer exec --workspace-folder \\wsl.localhost\my\repo /bin/bash
```
## Inset: Permission Issue with Next.js
 When starting the dev server, I ran into a permission issue which I shortly wanted to show here:
```bash 
node ➜ /workspaces/nextjs-blog(main)$ npm run dev
	> dev
	> next dev
- ready started server on [::]:3000, url: http://localhost:3000

[Error: EACCES: permission denied, unlink '/workspaces/nextjs-blog/.next/server/middleware-build-manifest.js'] {
	errno: -13,
	code: 'EACCES',
	syscall: 'unlink',
	path: '/workspaces/nextjs-blog/.next/server/middleware-build-manifest.js'
}
```
Since it's an access error I checked the Linux permissions in the project and indeed some files belonged to the current user (node) and some to root, especially in the `.next/server` folder. It is generally considered a bad practice to have a user with root privileges involved in your development work based on the Principle of Least Privileges, so I changed the owner of the project folder to the local node user: `sudo chown -R node:node ./nextjs-blog`
Unfortunately I don't know why the files were mounted with root privileges in the first place, but I'm sure that couldn't have been my fault. Never.. Anyway I will try to recreate it when I start another project and to write an update.

## User Experience
Putting it all together I would work with it as follows:
1. Start my editor of choice opening the project at the WSL path
2. Use a (preferably integrated) terminal to spin up the projects dev container(s)
3. Connect to the workspace container by opening a shell to be able to execute commands (e.g. starting a dev server)
4. Start coding

There is a caveat of course and it's a big one. Your editor only has access to anything installed on your local machine by default. If you're relying on any plugins or extensions which are dependent on certain developer tools, you'll need to find another way to use them or configure them to run remotely in the devcontainer.

## Conclusion and Outlook
Using devcontainers without VS Code is definitely possible and I'm sure, this can be fully automated as well so you can enjoy clean workspaces with any editor you like. The drawback is, that if you want certain quality of life support from your editor or any tools which need preinstalled dev tools, they would either need to be installed locally or have remote capabilities.
This all comes prepackaged with the VS Code DevContainer Extension, which sets up the VS Code experience remotely, i.e. all predefined extensions work in the container as well without having anything installed locally. I will thus continue to use VS Code (or a fork, e.g. Cursor, depending on my evaluation and whether they fix their DevContainer Extension issue).

In the future I want to spin up devcontainers in the cloud and see how that affects the development workflow. I also read about [Docker Compose Watch](https://www.docker.com/blog/announcing-docker-compose-watch-ga-release/) recently, which appears to be the solution for making file system synchronization easier.

Thank you for reading and happy coding!


## Remarks & Sources

[^1]: The Dev Container Extension appears to be able to temporary open a port without having it preconfigured. This is not supported natively by the Docker CLI, so if any of you know how they're doing it, please enlighten me.
