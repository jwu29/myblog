# Secure Packages with CodeArtifact

**Project Link:** [View Project](http://learn.nextwork.org/projects/aws-devops-codeartifact-updated)

**Author:** Yi Cheng Josiah Wu  
**Email:** josiahwu29@gmail.com

---

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_1d79e699)

---

## Introducing Today's Project!

In Step #1, we'll launch an EC2 instance.
In Step #2, we'll set up your web app in the EC2 instance.
In Step #3, we'll connect your web app's code to a GitHub repository.
In Step #4, we'll create a CodeArtifact repository.
In Steps #5 and #6, we're setting up your EC2 instance's permissions to access the CodeArtifact repository.
In Step #7, we'll see the CodeArtifact repository store your web app's packages!

### Key tools and concepts

Services I used wdere... Key concepts I learnt include...

### Project reflection

This project took me approximately... The most challenging part was... It was most redwarding to...

This project is part three of a series of DevOps projects where I'm building a CI/CD pipeline! I'll be working on the next project...d

---

## CodeArtifact Repository

CodeArtifact is a secure, central place to store all your software packages. Engineering teams use artifact repositories because it has three main benefits - Security, Reliability and Control.

A domain is a single place to manage permissions and security settings that apply to all repositories inside it. With domains, I can ensure consistent security controls across all your package repositories in an efficient way. My domain is called 'nextwork'.

A CodeArtifact repository can have an upstream repository, which is like a backup library that my primary repository can access when it doesn't have what I need. My repository's upstream repository is Maven Central, which is the most popular public repository where developers publish and share Java libraries.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_n4o5p6q7)

---

## CodeArtifact Security

### Issue

To access CodeArtifact, we need to export the authorization token to my repository. I ran into an error when retrieving a token because, by default, an EC2 instance doesn't have permission to access your other AWS services

### Resolution

To resolve the error with my security token, I attached the EC2 instance with an IAM role containing the IAM policy authorizing access to CodeArtifact. This resolved the error because now the instance has authority to do so.

It's a security best practice to use IAM roles because when applications are running on the instance, we can automatically use these temporary credentials to make AWS API calls without having to handle credential management.

---

## The JSON policy attached to my role

The JSON policy I set up, for all resources:

- allows getting an authorization token for CodeArtifact.
- allows retrieving the endpoint for a CodeArtifact repository
- allows reading packages from a CodeArtifact repository.
- allows calling the GetServiceBearerToken action from the AWS Security Token Service (STS)

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_23rp7q8r9)

---

## Maven and CodeArtifact

### To test the connection between Maven and CodeArtifact, I compiled my web app using settings.xml

The settings.xml file configures Maven to add lists of servers, profiles and mirrors needed to set up the connection with CodeArtifact. Together, the code snippets define repository URLs, authentication details, and other settings so that Maven knows how to connect with CodeArtifact to fetch and store your project's dependencies.

Compiling means translating your project's code into a language that computers can understand and run.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_c17eace8)

---

## Verify Connection

After compiling, I checked my `nextwork-devops-cicd` repo. I noticed that all the packages I need are neatly stored in CodeArtifatct.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_1d79e699)

---

## Uploading My Own Packages

- Create your own custom package
- Publish it directly to your CodeArtifact repository
- Experience the full package lifecycle by downloading your own package
- Showcase advanced package management skills in your documentation!

To create my own package, I converted a text file into a tar.gz file. I also generated a security hash because it is required to verify its integrity.

To publish the package, I used the AWS CLI command `aws codeartifact publish-package-version`. When I look at the package details in CodeArtifact, I can see the new package being installed.

To validate my packages, I then decompressed the tar.gz file using the command `tar -xzvf secret-mission.tar.gz`. I then saw my original secret message!

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_sm12-upload)

---

---
