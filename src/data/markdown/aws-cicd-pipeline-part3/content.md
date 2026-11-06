# Introduction

## What is AWS CodeArtifact?

AWS CodeArtifact is a fully managed artifact repository service that stores, publishes, and shares software packages used in your development process. It functions as a secure, centralised storage solution for dependencies—the external libraries and frameworks that your applications rely upon to function.

In modern software development, projects depend on hundreds of external packages. Rather than downloading these directly from public repositories like Maven Central or npm, CodeArtifact acts as an intermediary proxy that caches packages locally within your AWS infrastructure. This provides three critical benefits:

- **Security**: Control which packages your teams can access and scan dependencies for vulnerabilities
- **Reliability**: Ensure builds succeed even if upstream repositories are unavailable
- **Control**: Track which versions are in use and enforce organisational policies on package consumption

CodeArtifact integrates seamlessly with popular package managers (Maven, npm, pip, NuGet) and supports upstream repositories that automatically fetch packages from public sources whilst caching them for future use.

## How I used CodeArtifact in this project

In this project, I configured an AWS EC2 instance to use CodeArtifact as its package repository, established secure authentication using IAM roles, and successfully compiled a Java web application whilst storing all dependencies in CodeArtifact. This demonstrates a fundamental DevOps pattern where package management is centralised and secured at the infrastructure level.

This project took me approximately 2-3 hours to complete, including time spent understanding IAM policy configuration and debugging authentication issues. The most valuable lesson was recognising how IAM roles provide temporary credentials automatically to EC2 instances, eliminating the need for credential management within applications.

---

## Understanding CodeArtifact Components

### Domains and Repositories

**CodeArtifact domain:**
A domain is an organisational construct that groups related repositories together under a single namespace. It serves as a central location to manage permissions and security settings that apply to all repositories within it. For this project, I created a domain called "nextwork" that houses my application repositories.

**Why domains matter:**
Domains enable consistent security controls across multiple repositories in your organisation. Rather than configuring IAM policies for each individual repository, you can grant permissions at the domain level, simplifying governance whilst maintaining security.

**CodeArtifact repository:**
A repository is the actual storage location for your packages. Think of it as a library that holds specific types of packages (Maven for Java, npm for JavaScript, etc.). My repository is configured to work with Maven, the build automation tool for Java projects.

### Upstream Repositories

A CodeArtifact repository can connect to an upstream repository—a fallback source that CodeArtifact queries when a requested package isn't available locally. When your build tool requests a dependency, CodeArtifact searches its own storage first; if the package isn't found, it fetches it from the upstream repository, caches it locally, and serves it to your application.

**My configuration:**
I configured Maven Central as my upstream repository. Maven Central is the largest public repository for Java libraries, hosting hundreds of thousands of open-source packages. By caching these packages in CodeArtifact, subsequent builds retrieve them from AWS infrastructure rather than downloading from the internet each time, improving build speed and reliability.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_n4o5p6q7)

---

## Securing CodeArtifact Access with IAM

### The Authentication Challenge

To authenticate with CodeArtifact, applications must obtain an authorisation token that proves they have permission to access the repository. When I initially attempted to retrieve this token from my EC2 instance, the request failed with an access denied error.

**Why this happens:**
By default, EC2 instances have no permissions to interact with other AWS services. This follows the principle of least privilege—services start with zero access and must explicitly be granted permissions for specific actions.

### Resolution: IAM Roles

To resolve the authentication error, I created an IAM role with policies authorising CodeArtifact access, then attached this role to my EC2 instance. An IAM role provides temporary security credentials that are automatically rotated by AWS, eliminating the need to store long-term credentials on the instance.

**Why IAM roles are best practice:**
When applications run on EC2 instances with attached IAM roles, they automatically receive temporary credentials that can be used to make AWS API calls. This approach offers significant security advantages:

- **No credential storage**: No need to embed access keys in code or configuration files
- **Automatic rotation**: Credentials expire and refresh automatically
- **Fine-grained control**: Policies specify exactly which actions are permitted
- **Audit trail**: CloudTrail logs all API calls made using the role

### The IAM Policy

The JSON policy attached to my role grants four specific permissions:

1. **GetAuthorizationToken**: Retrieves a temporary token for authenticating with CodeArtifact
2. **GetRepositoryEndpoint**: Obtains the URL endpoint for the CodeArtifact repository
3. **ReadFromRepository**: Allows downloading packages from the repository
4. **GetServiceBearerToken**: Obtains bearer tokens from AWS Security Token Service (STS)

This policy follows the principle of least privilege by granting only the permissions required for my EC2 instance to download packages from CodeArtifact, without allowing destructive actions like deleting repositories or publishing packages.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_23rp7q8r9)

---

## Configuring Maven with CodeArtifact

### The settings.xml Configuration File

Maven uses a configuration file called `settings.xml` to define repository locations, authentication credentials, and other build settings. To connect Maven to CodeArtifact, I modified this file to include:

**Server credentials:**
A `<server>` block specifying the CodeArtifact repository ID and authentication token. Maven uses this to authenticate when downloading dependencies.

**Repository definitions:**
A `<repository>` block containing the CodeArtifact endpoint URL. This tells Maven where to look for packages instead of defaulting to Maven Central.

**Mirror configuration:**
A `<mirror>` block that redirects all Maven requests through CodeArtifact, ensuring no packages are downloaded directly from public repositories without being cached in CodeArtifact first.

Together, these configuration blocks establish a complete connection between Maven and CodeArtifact, defining repository URLs, authentication details, and routing rules.

### Compiling the Application

To test the connection, I ran Maven's compile command:

```bash
mvn compile
```

**What compilation does:**
The compile phase translates human-readable Java source code into bytecode—a format that the Java Virtual Machine (JVM) can execute. During this process, Maven identifies all dependencies declared in the project's `pom.xml` file, downloads them from CodeArtifact, and includes them in the build classpath.

**Build output:**
The Maven build succeeded, confirming that CodeArtifact was correctly configured and all required packages were retrieved and cached.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_c17eace8)

---

## Verifying Package Storage

After compilation completed, I navigated to the CodeArtifact console and examined the `nextwork-devops-cicd` repository. The interface displayed all packages that had been downloaded during the Maven build, now cached in CodeArtifact for future use.

**What this demonstrates:**
By inspecting the repository contents, I confirmed that CodeArtifact successfully intercepted Maven's dependency requests, downloaded packages from Maven Central (the upstream repository), and stored them locally within AWS infrastructure.

Future builds on any EC2 instance with access to this CodeArtifact repository will retrieve these packages from the cache rather than downloading them from the internet, improving build performance and reliability.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-devops-codeartifact-updated_1d79e699)

---

## Conclusion

This project demonstrated how to secure and centralise package management using AWS CodeArtifact, establishing a foundation for reliable, controlled software builds in a DevOps environment. By connecting an EC2 instance to a CodeArtifact repository through IAM role-based authentication, I created a system where all application dependencies are cached within AWS infrastructure, providing security, reliability, and control over the package supply chain.

**Conclusion**

- CodeArtifact serves as a secure proxy between build tools and public package repositories
- Domains provide organisational structure and centralised security management
- IAM roles enable secure, credential-free authentication for EC2 instances
- Upstream repositories allow CodeArtifact to fetch packages from public sources whilst caching them locally
- Maven's settings.xml file configures repository connections and authentication

This project forms part of a DevOps series where I'm building a CI/CD pipeline. The next project will integrate automated testing and deployment, leveraging CodeArtifact to ensure consistent, secure dependency management throughout the continuous integration process.
