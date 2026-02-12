# Introduction

## What is Amazon VPC?

Amazon Virtual Private Cloud (VPC) is a foundational AWS networking service that enables you to provision a logically isolated section of the AWS cloud where you can launch AWS resources in a virtual network that you define. Think of it as your own private data center within AWS, but with the flexibility and scalability of cloud infrastructure.

VPC gives you complete control over your virtual networking environment, including:

- **IP address range selection**: You define your own IP address space using CIDR blocks (e.g., 10.0.0.0/16)
- **Subnet creation**: Divide your VPC into public and private subnets across multiple Availability Zones for high availability
- **Route table configuration**: Control how traffic flows between subnets and to the internet
- **Network gateway management**: Configure internet gateways for public access and NAT gateways for private subnet internet access
- **Security controls**: Implement multiple layers of security using security groups and network access control lists (NACLs)

This level of network control is crucial because it allows you to:

1. Isolate sensitive workloads from the public internet
2. Implement defence-in-depth security strategies
3. Meet compliance requirements for data isolation
4. Control costs by managing data transfer and routing
5. Create hybrid cloud architectures connecting to on-premises infrastructure

## How I used Amazon VPC in this project

In this project, I designed and implemented a VPC architecture to enable secure communication between an EC2 instance and Amazon S3. While S3 is a regional service accessible over the internet, using a VPC provides several advantages:

- **Network isolation**: The EC2 instance runs in a private network environment, protected by security groups
- **Controlled access**: Traffic patterns are explicitly defined through route tables and security rules
- **Cost optimisation**: By using VPC endpoints (optional advanced step), S3 traffic can stay within the AWS network
- **Security best practices**: Demonstrates enterprise-grade architecture patterns used in production environments

This architecture pattern is extremely common in real-world applications—any time you have application servers that need to store or retrieve data from S3, you'll use a similar setup.

## One thing I didn't expect in this project was...

One thing I didn't expect in this project was how straightforward it was to connect EC2 to S3 once the proper authentication was configured. I anticipated needing to set up VPC endpoints or complex routing rules, but S3's design as a public AWS service means it's accessible from VPC instances with just an internet gateway and proper IAM permissions. The AWS SDK and CLI handle all the complexity of authentication and API communication behind the scenes.

However, I also learned that while access keys work for this demonstration, the IAM role approach is significantly more secure and just as easy to implement—a valuable lesson in cloud security best practices.

This project took me approximately 1-2 hours to complete from initial setup to final validation, including time spent understanding the networking concepts and testing different authentication methods.

---

## In the first part of my project...

### Step 1 - Architecture Setup

In this foundational step, I will configure the complete VPC networking infrastructure and launch an EC2 instance. This involves several interconnected components:

**VPC Components I'll Configure:**

- **VPC**: The container for all networking resources, with a defined CIDR block (e.g., 10.0.0.0/16)
- **Subnet**: A segment of the VPC's IP address range where I'll launch the EC2 instance. I'll create a public subnet that can communicate with the internet.
- **Internet Gateway (IGW)**: Enables communication between resources in the VPC and the internet. Without this, the EC2 instance would be completely isolated.
- **Route Table**: Defines the rules for routing network traffic. I'll configure it to send internet-bound traffic (0.0.0.0/0) to the Internet Gateway.
- **Security Group**: Acts as a virtual firewall controlling inbound and outbound traffic. I'll configure it to allow SSH access (port 22) for connecting to the instance.

These components work together to provide the foundational network and compute infrastructure needed to access and interact with S3. The VPC provides isolation, the subnet provides IP address space, the IGW enables internet connectivity (required to reach S3's public endpoints), the route table directs traffic appropriately, and the security group ensures only authorized connections are allowed.

### Step 2 - Connect to My EC2 Instance

In this step, I will establish an SSH connection to the EC2 instance through its public IP address over the internet. This is the quickest and most straightforward method to access the instance for initial configuration.

**Why SSH access matters:**

- It gives us command-line access to configure the AWS CLI
- We can install additional software if needed
- We can run commands to interact with S3
- It's the standard method for managing Linux instances in AWS

The connection uses a key pair (public/private key cryptography) for authentication, which is more secure than password-based authentication. When launching the EC2 instance, AWS lets you create or specify an existing key pair—the private key file (.pem) stays on your local machine and is required to establish the SSH connection.

### Step 3 - Set Up Access Keys

In this step, I will configure AWS credentials on the EC2 instance to grant it access to AWS services. The EC2 instance needs proper authentication credentials to interact with AWS APIs, particularly S3's API for listing buckets, uploading files, and downloading objects.

**Why authentication is required:**

- AWS uses an authentication and authorisation model where every API request must be signed
- Without credentials, the AWS CLI would have no way to prove it's authorized to access your S3 buckets
- Access keys provide programmatic access to AWS services
- The credentials include an Access Key ID (public identifier) and Secret Access Key (private key for signing requests)

In this tutorial, I'll demonstrate the access key method first because it's straightforward and helps illustrate how AWS authentication works. However, I'll also show the more secure IAM role approach, which is what you should use in production environments.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_3e1e79a2)

---

## Architecture Setup

This diagram illustrates the complete network architecture for this project:

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_4334d777)

**Key Architecture Components:**

1. **VPC (Virtual Private Cloud)**: The outer boundary representing our isolated network environment with a defined CIDR block
2. **Public Subnet**: A subdivision of the VPC where our EC2 instance resides. It's "public" because it has a route to the Internet Gateway
3. **Internet Gateway**: Attached to the VPC, it enables two-way communication between resources in the VPC and the internet
4. **EC2 Instance**: Our compute resource running Amazon Linux, which will interact with S3
5. **Route Table**: Associated with the public subnet, containing a route that directs internet traffic (0.0.0.0/0) to the Internet Gateway
6. **Security Group**: Attached to the EC2 instance, controlling inbound (SSH on port 22) and outbound traffic
7. **S3 Bucket**: While not technically inside the VPC, it's accessible from the EC2 instance through the internet gateway

**Traffic Flow:**
When the EC2 instance makes an S3 API call, the traffic flows: EC2 → Route Table → Internet Gateway → AWS S3 Service Endpoint → Response back through the same path. The security group ensures only authorized traffic leaves the instance, and AWS IAM credentials (access keys or IAM role) authorize the API requests at the application layer.

---

## Running CLI Commands

The AWS Command Line Interface (CLI) is a unified tool for managing AWS services directly from the terminal. It provides a powerful, scriptable interface to AWS APIs, allowing you to control multiple AWS services and automate tasks through scripts.

**Why I have immediate access to AWS CLI:**
Amazon Linux 2 and Amazon Linux 2023 AMIs (Amazon Machine Images) come with AWS CLI pre-installed, which is one of the benefits of using AWS-provided AMIs. If you were using Ubuntu, CentOS, or another operating system, you would need to manually install the AWS CLI first.

### Initial Command: Testing S3 Access

The first command I ran was:

```bash
aws s3 ls
```

**What this command does:**

- `aws` invokes the AWS CLI tool
- `s3` specifies we're working with the S3 service
- `ls` is the "list" operation

This command attempts to list all S3 buckets in your AWS account. At this point, without configured credentials, the command will fail with an authentication error—this is expected and confirms that AWS requires proper authentication.

**Expected error output (before configuration):**

```
Unable to locate credentials. You can configure credentials by running "aws configure".
```

This error message is actually helpful because it tells us exactly what we need to do next.

### Configuring AWS Credentials

The second command I ran was:

```bash
aws configure
```

**What this interactive command does:**
This command launches an interactive configuration wizard that prompts you for four pieces of information:

1. **AWS Access Key ID**: Your public identifier (looks like: AKIAIOSFODNN7EXAMPLE)
2. **AWS Secret Access Key**: Your private key for signing requests (looks like: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY)
3. **Default region name**: The AWS region you want to work in (e.g., us-east-1, us-west-2, eu-west-1)
4. **Default output format**: How you want AWS CLI to format responses (json, text, or table)

**Where these credentials are stored:**
After running `aws configure`, the AWS CLI stores your credentials in two files:

- `~/.aws/credentials` - Contains your Access Key ID and Secret Access Key
- `~/.aws/config` - Contains your default region and output format preferences

These configuration files persist across sessions, so you only need to run `aws configure` once unless you need to change credentials or regions.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_e7fa8776)

---

## Access Keys

### Understanding AWS Credentials

To set up my EC2 instance to interact with my AWS environment, I configured AWS access keys using the `aws configure` command, which securely stores the credentials in the instance's file system.

**What are Access Keys?**
Access keys are long-term credentials that provide programmatic access to AWS services. They consist of two parts:

1. **Access Key ID** (Public identifier):
   - Looks like: `AKIAIOSFODNN7EXAMPLE`
   - Can be shared or visible in logs without immediate security risk
   - Used to identify which IAM user or account is making the request
   - Analogous to a username

2. **Secret Access Key** (Private key):
   - Looks like: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
   - Must be kept confidential and secure
   - Used to cryptographically sign API requests to prove authenticity
   - Analogous to a password, but used programmatically
   - **Can only be viewed/downloaded once when created**—if you lose it, you must create a new access key

**How Access Keys Work:**
When you run an AWS CLI command like `aws s3 ls`, the AWS CLI:

1. Retrieves your access keys from `~/.aws/credentials`
2. Creates an API request to the S3 service
3. Uses your Secret Access Key to create a digital signature for the request
4. Sends the request with the Access Key ID and signature to AWS
5. AWS verifies the signature using your Secret Access Key (which they have on file)
6. If valid, AWS checks the IAM permissions associated with that access key
7. If authorised, AWS processes the request and returns the results

**Important Security Note:**
While this tutorial refers to "secret access keys for logging into AWS console," this is slightly inaccurate. Access keys are specifically for programmatic access (CLI, SDKs, APIs)—you cannot use them to log into the AWS Console web interface. For console access, you use your AWS account email/password or IAM user credentials. This distinction is important for security.

### Creating Access Keys

To create access keys for this project:

1. Log into the AWS Console
2. Navigate to IAM (Identity and Access Management)
3. Go to "Users" and select your IAM user (or create one)
4. Click the "Security credentials" tab
5. Under "Access keys," click "Create access key"
6. Choose "Command Line Interface (CLI)" as the use case
7. Download the access key information immediately (you can't retrieve the secret key later)

### Best Practice

Although I'm using access keys in this project for demonstration purposes, the best practice alternative is to create an IAM role and attach it to the EC2 instance. This approach is more secure, requires no manual credential management, and is the recommended method for production environments. I'll demonstrate this approach in detail in the next section.

---

## Upgrading to IAM Roles (Recommended Approach)

While access keys work for demonstration purposes, let me show you the more secure approach using IAM roles. This is what you should use in production environments.

### What are IAM Roles?

IAM (Identity and Access Management) roles are AWS identities with specific permissions that can be assumed by AWS services like EC2. Instead of embedding credentials (access keys) in your instance, you attach a role to the instance that grants it permissions to access other AWS services.

### How to set up IAM Roles for EC2

**Step 1: Create an IAM Role**

- Go to IAM service in AWS Console
- Click "Roles" then "Create role"
- Select "AWS service" as the trusted entity type
- Choose "EC2" as the use case
- Click "Next"

**Step 2: Attach S3 Permissions**

- Search for and select the "AmazonS3FullAccess" policy (or create a custom policy with only the permissions you need)
- Click "Next" and give your role a name like "EC2-S3-Access-Role"
- Click "Create role"

**Step 3: Attach Role to EC2 Instance**

- Go to EC2 service in AWS Console
- Select your EC2 instance
- Click "Actions" → "Security" → "Modify IAM role"
- Select the role you just created
- Click "Update IAM role"

**Step 4: Verify It Works**

- SSH back into your EC2 instance
- Run `aws s3 ls` without configuring any credentials
- The command should work automatically! The AWS CLI detects and uses the IAM role credentials

### Access Keys vs IAM Roles: A Comparison

**Security:**

- **Access Keys**: Can be accidentally exposed in code, logs, or screenshots. If compromised, they provide long-term access until manually rotated.
- **IAM Roles**: Credentials are temporary and automatically rotated by AWS. Never stored on the instance, so cannot be accidentally exposed.

**Convenience:**

- **Access Keys**: Require manual setup with `aws configure` and need to be rotated periodically.
- **IAM Roles**: Automatically work once attached. No configuration needed, no rotation required.

**Cost:**

- Both are free to use. No additional cost for either approach.

**Best for:**

- **Access Keys**: Quick demos, learning, temporary testing environments.
- **IAM Roles**: Production environments, any long-running applications, team projects.

**My recommendation**: If you're following along with this tutorial for the first time, access keys are fine for learning. But once you understand the workflow, practice setting up IAM roles - it's only a few extra clicks and will build good security habits from the start.

---

## In the second part of my project...

### Step 4 - Set Up an S3 Bucket

In this step, I will create an S3 bucket in the AWS Console that will serve as the storage destination for files uploaded from my EC2 instance.

**What is Amazon S3?**
Amazon Simple Storage Service (S3) is an object storage service offering industry-leading scalability, data availability, security, and performance. Unlike traditional file systems, S3 stores data as objects (files with metadata) in containers called buckets.

**Why create an S3 bucket:**

- **Storage destination**: Provides a target location for files uploaded from the EC2 instance
- **Durability**: S3 is designed for 99.999999999% (11 nines) durability, meaning your data is extremely safe
- **Scalability**: Can store unlimited amounts of data without capacity planning
- **Accessibility**: Objects can be accessed from anywhere with proper permissions
- **Cost-effective**: You only pay for what you use, with no minimum fees

**Important S3 bucket considerations:**

- Bucket names must be globally unique across all AWS accounts
- Choose a region close to your users or EC2 instances for lower latency
- Consider enabling versioning to protect against accidental deletions
- For this project, default bucket settings are sufficient

### Step 5 - Connecting to My S3 Bucket

In this step, I will use the AWS CLI from my EC2 instance to interact with the S3 bucket I just created. This demonstrates a fundamental cloud architecture pattern: compute resources (EC2) interacting with storage services (S3).

**Why this connection matters:**

- Demonstrates how VPC-based EC2 instances can securely interact with S3 storage
- Shows the practical application of the authentication methods we configured earlier
- Proves that our networking setup (VPC, IGW, route tables, security groups) is working correctly
- Illustrates a common real-world use case: application servers uploading/downloading files from cloud storage

**What happens under the hood:**
When the EC2 instance connects to S3, the traffic flows through our VPC architecture:

1. The AWS CLI on EC2 initiates an HTTPS request to S3's public endpoint
2. The request is routed through the VPC's route table to the Internet Gateway
3. The request travels over the public internet to AWS S3 service endpoints
4. S3 validates the IAM credentials (access keys or IAM role)
5. If authorised, S3 processes the request and returns data
6. The response travels back through the same path to the EC2 instance

Note: While this traffic technically goes over the public internet, it's encrypted via HTTPS and stays within the AWS network backbone for most of its journey.

---

## Connecting to My S3 Bucket

### Verifying S3 Access

The first command I ran to verify connectivity was:

```bash
aws s3 ls
```

**What this command does:**

- Lists all S3 buckets in your AWS account
- Validates that your AWS credentials are properly configured
- Confirms that the EC2 instance can reach S3's API endpoints over the network
- Tests that your IAM permissions include the `s3:ListAllMyBuckets` permission

When I ran this command after configuring my credentials, the terminal responded with a list of my buckets. This successful response indicated that:

1. AWS credentials are correctly configured
2. Network connectivity from VPC to S3 is working
3. IAM permissions are sufficient
4. The AWS CLI is functioning properly

**Example output:**

```
2026-01-15 10:23:45 my-demo-bucket
2026-01-20 14:35:12 my-project-files
```

The output shows the creation date and time followed by the bucket name for each bucket in your account.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_4334d778)

---

## Listing Bucket Contents

### Viewing Files in a Specific Bucket

Another CLI command I ran was:

```bash
aws s3 ls s3://my-demo-bucket/
```

**Command syntax breakdown:**

- `aws s3 ls` - The list command for S3 objects
- `s3://` - The S3 protocol prefix (required for bucket references)
- `my-demo-bucket/` - The specific bucket name to list (replace with your actual bucket name)
- The trailing `/` indicates you want to list the root level of the bucket

**What this command returns:**
This command lists all objects (files) and prefixes (folder-like structures) stored at the root level of the specified bucket. The output includes:

- Last modified date and time
- File size in bytes
- Object key (file name/path)

**Example output:**

```
                           PRE images/
2026-01-21 09:15:30       1024 document.txt
2026-01-21 10:22:45        512 notes.txt
```

In this output:

- `PRE images/` indicates a prefix (similar to a folder)
- The other lines show actual objects with their sizes and names

**Advanced variations:**

```bash
# List files in a specific "folder" within the bucket
aws s3 ls s3://my-demo-bucket/images/

# List files recursively (all files in all subfolders)
aws s3 ls s3://my-demo-bucket/ --recursive

# List with human-readable file sizes
aws s3 ls s3://my-demo-bucket/ --human-readable

# List and show total size summary
aws s3 ls s3://my-demo-bucket/ --summarize
```

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_4334d779)

---

## Uploading Objects to S3

### Creating a Test File

To upload a new file to my bucket, I first needed to create a test file on the EC2 instance. I ran:

```bash
sudo touch /tmp/test.txt
```

**Command breakdown:**

- `sudo` - Runs the command with superuser (administrative) privileges
- `touch` - Creates an empty file if it doesn't exist, or updates the timestamp if it does
- `/tmp/test.txt` - The file path where the file will be created

**Why use `/tmp` directory:**

- `/tmp` is a standard temporary directory in Linux systems
- It's writable by all users
- Files here can be safely deleted without affecting system operations
- It's a common location for test files and temporary data

**Optional: Adding content to the file**
If you want to add content to the file instead of leaving it empty, you can use:

```bash
echo "Hello from EC2!" > /tmp/test.txt
```

This creates the file and adds the text "Hello from EC2!" inside it.

### Copying Files to S3

The second command I ran was:

```bash
aws s3 cp /tmp/test.txt s3://my-demo-bucket/
```

**Command syntax breakdown:**

- `aws s3 cp` - The copy command for S3 (similar to `cp` in Linux)
- `/tmp/test.txt` - The source file path on the EC2 instance (local file)
- `s3://my-demo-bucket/` - The destination S3 bucket (replace with your bucket name)

**What this command does:**

1. Reads the file from the local filesystem
2. Uploads it to the specified S3 bucket
3. By default, uploads to the root level of the bucket
4. Uses multipart upload for files larger than 8MB (automatically)
5. Shows upload progress and confirms completion

**Expected output:**

```
upload: tmp/test.txt to s3://my-demo-bucket/test.txt
```

This confirms that the file was successfully uploaded to S3.

**Advanced upload options:**

```bash
# Upload to a specific "folder" in the bucket
aws s3 cp /tmp/test.txt s3://my-demo-bucket/files/test.txt

# Upload with a different name in S3
aws s3 cp /tmp/test.txt s3://my-demo-bucket/newname.txt

# Upload with metadata
aws s3 cp /tmp/test.txt s3://my-demo-bucket/ --metadata "author=josiah,project=vpc-demo"

# Upload with specific storage class (for cost optimisation)
aws s3 cp /tmp/test.txt s3://my-demo-bucket/ --storage-class STANDARD_IA

# Upload multiple files recursively
aws s3 cp /tmp/myfiles/ s3://my-demo-bucket/myfiles/ --recursive
```

### Verifying the Upload

The third command I ran was:

```bash
aws s3 ls s3://my-demo-bucket/
```

**Why verify the upload:**

- Confirms the file successfully transferred to S3
- Shows the file size to verify it matches the local file
- Provides the modification timestamp
- Validates that your IAM permissions include write access

When this command runs successfully, you'll see your newly uploaded file listed with its size and timestamp:

```
2026-02-12 15:30:45        17 test.txt
```

This validation step is important because:

- It confirms end-to-end functionality (create → upload → verify)
- It demonstrates the read-after-write consistency of S3
- It provides visual confirmation that the entire workflow is operational

**Troubleshooting: If the upload fails**
Common issues and solutions:

1. **Access Denied error**: Check that your IAM user/role has `s3:PutObject` permission
2. **Bucket not found**: Verify the bucket name is spelled correctly and exists in your account
3. **Network error**: Ensure the route table, internet gateway, and security groups are configured correctly
4. **File not found**: Verify the local file path is correct and the file exists

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_3e1e79a2)

---

## Conclusion

In this project, I successfully demonstrated how to access Amazon S3 from within a VPC environment using an EC2 instance. This architecture pattern is fundamental to cloud computing and forms the basis for countless production applications. Here are the key findings and insights from this implementation:

### Network Architecture

By setting up a VPC with an EC2 instance, I created an isolated network environment that provides security and control over AWS resources while maintaining connectivity to S3 storage. Each networking component plays a critical role:

- **VPC**: Provides the isolated network boundary and IP address space (CIDR block)
- **Subnets**: Organize resources and allow for public/private segmentation within the VPC
- **Internet Gateway**: Enables bi-directional communication between VPC resources and the internet, required to reach S3's public endpoints
- **Route Tables**: Direct network traffic to the appropriate destinations (0.0.0.0/0 → IGW for internet traffic)
- **Security Groups**: Act as stateful virtual firewalls, controlling inbound and outbound traffic at the instance level

Understanding how these components interconnect is crucial for building secure, scalable cloud architectures. The layered security approach (network isolation + security groups + IAM permissions) demonstrates AWS's defence-in-depth strategy.

### Authentication Methods

I explored two approaches for EC2-to-S3 authentication in depth:

**Access Keys (Demonstration Method):**

- Consist of an Access Key ID and Secret Access Key
- Configured manually using `aws configure`
- Stored in `~/.aws/credentials` on the instance
- Work well for learning and quick demos
- Require manual rotation and careful security management
- Risk of exposure if accidentally committed to code or shown in logs

**IAM Roles (Production Method):**

- Attached directly to the EC2 instance at launch or afterward
- Provide temporary, automatically rotating credentials
- Require zero manual configuration once attached
- Eliminate credential storage on the instance
- Cannot be accidentally exposed since they're never written to disk
- Align with AWS security best practices

The comparison between these methods highlighted why IAM roles are considered best practice for any long-running or production workloads. In fact, AWS explicitly recommends never using access keys for EC2-to-AWS-service communication when IAM roles are available.

### AWS CLI Integration

The AWS CLI proved to be a powerful and versatile tool for interacting with S3:

**Commands demonstrated:**

- `aws s3 ls` - List all buckets or objects in a bucket
- `aws s3 cp` - Copy files to/from S3
- `aws configure` - Set up authentication credentials

**Key benefits:**

- Pre-installed on Amazon Linux, enabling immediate use
- Consistent interface across all AWS services
- Scriptable for automation tasks
- Provides detailed error messages for troubleshooting
- Supports advanced features like multipart uploads automatically

The CLI's simplicity masks significant complexity—it handles request signing, SSL/TLS encryption, retry logic, and multipart uploads transparently, allowing developers to focus on application logic rather than low-level API details.

### Conclusion

This project reinforced the importance of proper network design and security best practices when building cloud infrastructure on AWS. The combination of VPC, EC2, and S3 creates a robust, scalable foundation for cloud-based applications. What initially seemed complex—networking, security groups, route tables, IAM—becomes intuitive once you understand how each piece contributes to the overall architecture.

Most importantly, this hands-on experience demonstrated that AWS's building blocks are powerful yet accessible, enabling developers to build enterprise-grade infrastructure following the same patterns used by companies at any scale.

---
