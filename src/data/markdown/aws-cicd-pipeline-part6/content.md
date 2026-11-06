# Introduction

## What is AWS CodePipeline?

AWS CodePipeline is a fully managed continuous delivery service that automates the steps required to release software. It creates a workflow that automatically moves code changes through each stage of the release process, from source control, to build, to deployment.

In the previous projects in this series, each stage was set up separately: GitHub stores the code, CodeBuild builds and tests it, and CodeDeploy deploys it. However, each stage still had to be started by hand. CodePipeline connects these stages into a single automated workflow, providing several benefits:

- **Automation**: A push to GitHub automatically triggers a build and then a deployment, with no manual steps
- **Speed**: Changes reach the live environment as soon as they pass each stage
- **Visibility**: Every run of the pipeline shows the status of each stage and which commit it is processing
- **Consistency**: Every change follows the same path from source to deployment

## How I used CodePipeline in this project

In this project, I set up the foundation for my pipeline with three stages: Source (GitHub), Build (CodeBuild), and Deploy (CodeDeploy). I then created and ran the pipeline to see automated deployments in action, with a new push to my GitHub repository automatically triggering a build in CodeBuild (continuous integration) and then a deployment in CodeDeploy (continuous deployment).

The services I used were EC2, CodeArtifact, CodeBuild, CodeDeploy, and CodePipeline. The key concepts I learnt were version control, rollback, Infrastructure as Code, and CI/CD.

---

## Starting a CI/CD Pipeline

### Execution Mode

Execution mode determines how CodePipeline handles multiple runs of the same pipeline. There are three modes:

- **Superseded** - If a new execution is triggered while another is already in progress, the newer execution takes over and cancels the older one
- **Queued** - Executions are processed one after another; new executions wait in a queue until the current one finishes
- **Parallel** - Multiple executions run at the same time, completely independently of each other, which can speed up processing when multiple branches or changes can be built and deployed concurrently

I used **Superseded** mode. It makes sure only the latest code changes are processed, which is exactly what this CI/CD pipeline needs: there is no point finishing a deployment of code that has already been replaced by a newer commit.

### Service Role

A service role is a special type of IAM role that AWS services like CodePipeline use to perform actions on your behalf. It gives CodePipeline permission to access the other AWS resources it needs to run the pipeline, such as S3 buckets for storing artifacts and CodeBuild for building the code.

![Starting a CI/CD Pipeline](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/7ade5e2f-0020-55fb-9bba-abede6ce1de9_gdnhtm)

---

## Configuring the Pipeline Stages

The pipeline has three stages, each connected to a part of the work from earlier in the series:

1. **Source** - Connects to my GitHub repository and branch
2. **Build** - Connects to my CodeBuild project
3. **Deploy** - Connects to my CodeDeploy deployment group

### Source Stage

By specifying the **master** branch as the default branch, I told CodePipeline to monitor this branch for changes and trigger the pipeline whenever there is a commit to it.

**Webhook events:**
Webhook events let CodePipeline start the pipeline automatically whenever code is pushed to the specified branch in GitHub. This is what makes the pipeline truly "continuous": it reacts to code changes in real time, without anyone having to start it.

![Source Stage](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/7ade5e2f-0020-55fb-9bba-abede6ce1de9_sergt)

### Build Stage

Each stage passes its output to the next stage as an artifact. **Input artifacts** are the outputs from a previous stage that are used as inputs for the current stage.

In the Build stage, the input artifact is **SourceArtifact**, the ZIP file containing the source code output by the Source stage. CodeBuild takes this code and builds it using the `buildspec.yml` file set up in an earlier project.

![Build Stage](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/7ade5e2f-0020-55fb-9bba-abede6ce1de9_j1k2l3m4)

### Deploy Stage

The Deploy stage is the final step in the pipeline. It takes the application artifacts output by the Build stage and deploys them to the target environment, which in this case is the EC2 instance in my CodeDeploy deployment group.

![Deploy Stage](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/7ade5e2f-0020-55fb-9bba-abede6ce1de9_m4n5o6p7)

---

## Running the Pipeline

### Stage Statuses

After finishing the pipeline's setup, I watched it start up and connect GitHub, CodeBuild, and CodeDeploy. As the pipeline runs, each stage displays a status:

- **Grey** - The stage has not started yet
- **Blue** - The stage is currently in progress
- **Green** - The stage has completed successfully
- **Red** - The stage has failed

### Pipeline Executions

A pipeline execution represents a single run of the pipeline. Every time the pipeline is triggered, either manually or automatically by a webhook, a new execution is created. Each execution has a unique ID and shows the status and details of each stage in that particular run.

![CI/CD Stages](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/7ade5e2f-0020-55fb-9bba-abede6ce1de9_fbdetger)

---

## Testing the Pipeline

### Pushing a Code Change

Since my CI/CD pipeline is triggered by changes to the files in my GitHub repository, I tested it by adding a new line of text to the web app and pushing the change to GitHub.

The moment I pushed the change, the pipeline started a new execution. The commit message displayed under each stage showed which commit that stage was processing.

### Verifying the Deployment

Once the pipeline executed successfully, I opened the EC2 instance's Public IPv4 DNS in a new browser tab and saw the updated web application, with my change live.

![Success!](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/7ade5e2f-0020-55fb-9bba-abede6ce1de9_e1f2g3h4)

---

## Conclusion

This project completed my CI/CD pipeline on AWS. By connecting GitHub, CodeBuild, and CodeDeploy with CodePipeline, I created a workflow where a single push to GitHub automatically builds, tests, and deploys my web application, with no manual steps in between.

**Conclusion**

- CodePipeline connects the source, build, and deploy stages into a single automated workflow
- Superseded execution mode makes sure only the latest code changes are processed
- Webhook events trigger the pipeline automatically whenever code is pushed to the monitored branch
- Each stage passes its output to the next stage as an artifact
- Pipeline executions show the status of each stage and the commit being processed

This project is the final part of a DevOps series where I built a CI/CD pipeline on AWS:

1. **Part 1** - Set up a development environment on EC2 and created a Java web app
2. **Part 2** - Put the web app under version control with Git and GitHub
3. **Part 3** - Secured and centralised the app's dependencies with CodeArtifact
4. **Part 4** - Automated building and testing with CodeBuild
5. **Part 5** - Deployed the web app to a production environment with CloudFormation and CodeDeploy
6. **Part 6** - Connected every stage into an automated pipeline with CodePipeline

Together, these projects take a code change from a developer's commit all the way to a live website, automatically.
