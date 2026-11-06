# Introduction

Hello everyone! This is Part 4 of a series of articles documenting how I built a CI/CD pipeline on AWS, which will be divied into different parts. This project is part of an assignment in my university course - Professional Practice in Computing.

1. [Setup of Web App in the Cloud](#/article/aws-cicd-pipeline-part1)
2. [Connecting GitHub Repository with AWS](#/article/aws-cicd-pipeline-part2)
3. [Secure Packages with CodeArtifact](#/article/aws-cicd-pipeline-part3)
4. _YOU ARE HERE!_ Continuous Integration with CodeBuild
5. [Initial Deployment with CodeDeploy](#/article/aws-cicd-pipeline-part5)
6. [Continuous Deployment with CodePipeline](#/article/aws-cicd-pipeline-part6)

## What is AWS CodeBuild?

AWS CodeBuild is a fully managed continuous integration (CI) service that compiles source code, runs tests, and produces software packages ready for deployment. It acts as a quality control checkpoint that automatically kicks in whenever changes are made to the codebase, verifying that everything still works as expected before those changes move further down the pipeline.

Without a CI service, building and testing typically happens manually on a developer's machine, which is slow, inconsistent, and easy to skip. CodeBuild removes this burden by running builds in clean, temporary environments managed by AWS. This provides several key benefits:

- **Consistency**: Every build runs in an identical, freshly provisioned environment, eliminating "it works on my machine" problems
- **Automation**: Builds and tests run without manual intervention, catching issues early
- **No servers to manage**: AWS provisions and scales build environments on demand, and you only pay for build minutes used
- **Integration**: Connects natively with GitHub, CodeArtifact, S3, CloudWatch, and CodePipeline

## How I used CodeBuild in this project

In this project, I created a CodeBuild project from scratch, connected it to my GitHub repository using AWS CodeConnections, and defined the build process in a `buildspec.yml` file. I configured CodeBuild to retrieve dependencies from CodeArtifact, store the packaged application in Amazon S3, and log every build to CloudWatch. Finally, I extended the build to run automated tests.

This project took me approximately 2-3 hours to complete, including time spent troubleshooting two failed builds. The most valuable lesson was that build failures are informative—each error pointed directly to a missing piece of configuration, from the absent buildspec file to the missing IAM permissions.

---

## Setting Up the Environment

Before creating the CodeBuild project, I prepared the components it depends on, building on the previous projects in this series:

1. **Development EC2 instance**: Launched an instance, connected via SSH, installed the required tools, and cloned my web app's code from GitHub
2. **CodeArtifact repository**: Created a repository to host the application's Maven dependencies
3. **IAM policy and role**: Created a policy granting access to CodeArtifact and attached it to the EC2 instance through a role
4. **Maven configuration**: Completed the connection settings between CodeArtifact and Maven in `settings.xml`

With these in place, the web app's code is in GitHub and its dependencies are available in CodeArtifact—everything CodeBuild needs to build the application.

---

## Setting Up a CodeBuild Project

### Source Configuration

A CodeBuild project's source configuration tells AWS where to find the code it needs to build. This is the starting point of the CI process. For this project, I selected **GitHub** as the source provider and pointed it to my web app's repository.

![Setting up a CodeBuild Project](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codebuild-updated_fewgrhte)

### Connecting CodeBuild with GitHub

CodeBuild needs permission to read from my GitHub repository. GitHub supports several credential types for this:

- **GitHub App** - A dedicated app installed on your GitHub account with fine-grained, repository-specific permissions
- **OAuth App** - Authorises AWS to act on your behalf using your GitHub account's permissions
- **Personal Access Token (PAT)** - A manually generated token with defined scopes that must be rotated and stored securely

I used the **GitHub App** because it is the simplest to set up and the most secure. It can be restricted to specific repositories, and its credentials are managed automatically rather than stored as long-lived tokens.

**AWS CodeConnections:**
The connection itself is handled by AWS CodeConnections, a service that acts as a secure bridge between AWS and external code repositories such as GitHub, GitLab, and Bitbucket. Once a connection is created, it can be reused by other AWS services, including CodePipeline later in this series.

![Connecting CodeBuild with GitHub](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codebuild-updated_a7c98e2d)

---

## CodeBuild Configurations

### Environment

The environment defines the machine CodeBuild uses to run each build. My configuration was:

- **Operating system**: Amazon Linux
- **Runtime**: Standard
- **Image**: An Amazon Linux standard image that includes Corretto 8 (Java)
- **Service role**: A new service role, which grants CodeBuild permission to interact with other AWS services on my behalf

### Artifacts

Build artifacts are the tangible outputs of a build process—what actually gets deployed to servers or distributed to users. My build produces a **`.war` file** (Web Application Archive), which packages the Java web application and everything it needs to run on a web server. CodeBuild stores this artifact in an **Amazon S3 bucket**.

### Packaging

I chose to package the artifacts as a **zip file**. Zipping produces a single, compact file that is quicker to transfer and simpler to manage during deployment than a folder of loose files.

### Monitoring

For monitoring, I enabled **CloudWatch Logs**, which record everything that happens during a build: every command run, its output, and any errors that occur. These logs are essential for troubleshooting failed builds.

---

## Troubleshooting Build Failure #1: buildspec.yml

### The Error

My first build failed because the repository did not contain a `buildspec.yml` file. Without it, CodeBuild has no instructions for how to build the application.

### What is buildspec.yml?

A `buildspec.yml` file is a step-by-step instruction manual for CodeBuild. It lives in the root of the repository, and CodeBuild runs through its phases in order, executing the commands specified in each:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      java: corretto8
  pre_build:
    commands:
      - echo Initializing environment
      - export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain nextwork --domain-owner <aws-account-id> --region <region> --query authorizationToken --output text`
  build:
    commands:
      - echo Build started on `date`
      - mvn -s settings.xml compile
  post_build:
    commands:
      - echo Build completed on `date`
      - mvn -s settings.xml package

artifacts:
  files:
    - target/nextwork-web-project.war
  discard-paths: no
```

**Phase breakdown:**

- `install` - Sets up the runtime, in this case Java (Corretto 8)
- `pre_build` - Prepares for the build by retrieving an authorisation token for CodeArtifact, so Maven can download dependencies
- `build` - Uses Maven to compile the source code
- `post_build` - Packages the compiled application into a `.war` file
- `artifacts` - Tells CodeBuild which output files to upload to S3

The first two phases prepare the environment and dependencies, while the last two produce the application itself. The `-s settings.xml` flag tells Maven to use the repository's settings file, which points it to CodeArtifact.

![buildspec.yml](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codebuild-updated_35588a47)

---

## Troubleshooting Build Failure #2: IAM Permissions

### The Error

After adding the buildspec file, I re-ran the build. It failed again, this time with a permissions error: CodeBuild's service role was not authorised to access CodeArtifact.

**Why this happens:**
The service role created alongside the CodeBuild project only has the permissions needed for basic operations, such as reading source code and writing logs. Like all AWS identities, it follows the principle of least privilege—it cannot reach CodeArtifact until it is explicitly granted permission. The IAM role I created earlier applies only to my EC2 instance, not to CodeBuild.

### Resolution

To resolve the error, I attached the CodeArtifact access policy to CodeBuild's service role. This grants the role permission to retrieve an authorisation token and read packages from the CodeArtifact repository.

### Verifying the Build

When I ran the build again, it succeeded. To verify the result, I checked the S3 bucket and found the packaged artifact. Seeing the artifact in S3 confirmed that CodeBuild had pulled the code from GitHub, retrieved dependencies from CodeArtifact, compiled and packaged the application, and uploaded the output.

![Success!](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codebuild-updated_d9cc6191)

---

## Automating Testing

### Why Test in the Build?

A successful build only proves that the code compiles. Adding tests to the build process verifies that the application is also in the expected state, catching problems before they reach deployment. Because CodeBuild runs on every build, these checks happen automatically every time.

### Adding a Test Script

I wrote a test script containing simple validation tests that check the project's structure, confirming that the expected files and folders are present. I added the script to the repository, included it in the build process, and pushed the changes to GitHub.

### Viewing the Results

After pushing the changes, I ran the CodeBuild project again and opened the build logs in CloudWatch. The results of the validation tests appeared in the log output alongside the build steps, confirming that testing was now part of every build.

![Automating Testing](https://nextwork.ai/motivated_indigo_zealous_griffin/uploads/aws-devops-codebuild-updated_sm-test-script-upload)

---

## Conclusion

This project demonstrated how to automate building and testing a Java web application with AWS CodeBuild, adding the continuous integration stage to my CI/CD pipeline. By connecting CodeBuild to GitHub, CodeArtifact, S3, and CloudWatch, I created a repeatable process that turns source code into a deployable artifact without manual intervention.

**Conclusion**

- CodeBuild runs builds in clean, managed environments, providing consistent results
- AWS CodeConnections and the GitHub App provide a secure link between AWS and GitHub
- The `buildspec.yml` file defines each phase of the build process
- CodeBuild's service role needs explicit IAM permissions to access CodeArtifact
- Build artifacts are stored in S3 and build activity is logged in CloudWatch
- Tests can be added to the build so every change is validated automatically

This project forms part of a DevOps series where I'm building a CI/CD pipeline. The next project will take the artifact produced by CodeBuild and deploy it to a server, moving the pipeline from continuous integration towards continuous delivery.
