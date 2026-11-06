# Introduction

## What is AWS CodeDeploy?

AWS CodeDeploy is a fully managed deployment service that automates releasing application updates to servers such as Amazon EC2 instances. Where CodeBuild produces a packaged application, CodeDeploy takes that package and installs it on the servers that will run it, following a set of instructions defined alongside the code.

Deploying manually means connecting to each server, copying files, and running commands by hand, which is slow and error-prone. CodeDeploy automates this process, providing several benefits:

- **Automation**: Deployment steps run the same way every time, without manual intervention
- **Repeatability**: Deployment scripts and configuration live with the code, so any version can be deployed consistently
- **Control**: Deployment configurations determine how quickly updates are rolled out across servers
- **Recovery**: Deployments can be rolled back if something goes wrong

## How I used CodeDeploy in this project

In this project, I launched a deployment environment using AWS CloudFormation, wrote deployment scripts to automate deployment commands, and deployed my web app with CodeDeploy to see it live. I also looked at a disaster recovery technique: rolling back a deployment.

The services I used were CodeArtifact, CodeBuild, CloudFormation, and CodeDeploy. The key concepts I learnt were CI/CD and Infrastructure as Code.

---

## Deployment Environment

### Why a Separate Instance?

To set up for CodeDeploy, I launched a new EC2 instance and VPC created specifically for running the application in a live, production environment. Having a separate EC2 instance for deployment means code changes and new features are never tested in the same environment that users see.

### Infrastructure as Code with CloudFormation

Instead of launching these resources manually, I used AWS CloudFormation. CloudFormation creates resources from a template file, an approach known as **Infrastructure as Code**. Because every resource is defined in the template, the whole environment can be created, replicated, or modified consistently.

When I need to delete these resources, deleting the CloudFormation stack removes all of the resources it created in one step.

### Resources in the Template

Besides the EC2 instance, the template creates:

- **VPC** - The private network that the deployment environment runs in
- **Subnet** - A section of the VPC where the EC2 instance is placed
- **Route tables** - Rules that direct network traffic within the VPC
- **Internet gateway** - Connects the VPC to the internet so users can reach the web app
- **Security group** - Controls which traffic is allowed to and from the EC2 instance

Including these in the template produces a complete, secure, and configurable infrastructure that can be easily replicated or modified.

![Deployment Environment](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codedeploy-updated_val-5)

---

## Deployment Scripts

Scripts are like mini-programs that automate tasks. CodeDeploy uses scripts to carry out each step of the deployment on the EC2 instance. I wrote three:

### install_dependencies.sh

This script sets up all the software needed to run the website by installing **Tomcat** and **Apache**, the programs that host the application and handle internet traffic.

### start_server.sh

This script starts both Tomcat (the Java application server) and Apache (the web server), and makes sure they restart automatically if the EC2 instance ever reboots.

### stop_server.sh

This script stops the web server services, but first checks whether they are running. It uses `pgrep` to look for running Apache (`httpd`) and Tomcat processes, and only attempts to stop a service if it is actually active. This prevents errors from trying to stop services that aren't running.

---

## appspec.yml

### The Instruction Manual for CodeDeploy

Next, I wrote an `appspec.yml` file, the instruction manual for CodeDeploy. It tells CodeDeploy what to install and which scripts to run at each stage of the deployment. Its key sections are:

- `version` - The version of the AppSpec file format
- `os` - The operating system of the target instance
- `files` - Which files from the build artifact to copy, and where to place them on the instance
- `hooks` - Which scripts to run at each CodeDeploy lifecycle event

### Updating buildspec.yml

I also updated `buildspec.yml` to include `appspec.yml` and the scripts folder in the build artifact. CodeDeploy deploys from this artifact, so it needs these files to properly deploy the application.

![appspec.yml](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/836cda66-f725-5082-bdb3-0152b1d7a61b_val-12)

---

## Setting Up CodeDeploy

### Applications and Deployment Groups

CodeDeploy organises deployments using two components:

- **CodeDeploy application** - A namespace or container that groups the deployment configurations, deployment groups, and revisions for a specific application
- **Deployment group** - A collection of EC2 instances grouped together to receive the same deployment, along with the settings for deploying to them

### IAM Role

To set up a deployment group, I also created an IAM role. CodeDeploy needs an IAM role to get permission to access and manage AWS resources on my behalf.

### Tags

Tags are helpful for flexibility, self-documentation, and integration. I used a tag so that CodeDeploy can identify which EC2 instances to deploy to: any instance with the matching tag becomes part of the deployment group.

![Setting Up CodeDeploy](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codedeploy-updated_val-18)

### Deployment Configuration

The deployment configuration determines how quickly the application is rolled out. I used **CodeDeployDefault.AllAtOnce**, which deploys the application to all instances in the deployment group at the same time.

### CodeDeploy Agent

For CodeDeploy to work with an EC2 instance, the instance needs the **CodeDeploy Agent**. The agent is software that receives deployment instructions from CodeDeploy and carries them out on the instance, such as running the deployment scripts.

![Deployment configurations](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codedeploy-updated_val-20)

---

## Deploying the Web App

### Creating a Deployment

A CodeDeploy deployment represents a single update to the application, with its own unique ID and history. This differs from a deployment group, which holds the settings for deploying to a set of instances. Each time I deploy, a new deployment is created within the same deployment group.

### Revision Location

To create the deployment, I configured a revision location, which is where CodeDeploy looks for the application's build artifact. My revision location was the S3 bucket where CodeBuild stores its output.

### Verifying the Deployment

To check that the deployment succeeded, I visited the EC2 instance's Public IPv4 DNS in my browser and saw the working website.

![Success!](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/836cda66-f725-5082-bdb3-0152b1d7a61b_val-27)

---

## Conclusion

This project added the deployment stage to my CI/CD pipeline. By launching a dedicated environment with CloudFormation and deploying the build artifact with CodeDeploy, I took the web app from a packaged file in S3 to a live website.

**Conclusion**

- CloudFormation launches a complete deployment environment from a template (Infrastructure as Code)
- Deployment scripts automate installing, starting, and stopping the web servers
- The `appspec.yml` file tells CodeDeploy which files to copy and which scripts to run
- Deployment groups use tags to identify which EC2 instances to deploy to
- The CodeDeploy Agent carries out deployment instructions on each instance
- The deployment configuration controls how quickly updates are rolled out

This project forms part of a DevOps series where I'm building a CI/CD pipeline. The next and final project will connect GitHub, CodeBuild, and CodeDeploy with CodePipeline, so that every push to GitHub is automatically built and deployed.
