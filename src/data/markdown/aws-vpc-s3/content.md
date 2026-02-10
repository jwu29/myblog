# Introduction

## What is Amazon VPC?

Amazon VPC is a virtual private cloud service that allows you to launch AWS resources in a logically isolated virtual network and it is useful because it provides security, network control, and isolation for your AWS resources.

## How I used Amazon VPC in this project

In today's project, I used Amazon VPC to create an isolated network environment for my EC2 instance to securely access S3 storage.

## One thing I didn't expect in this project was...

One thing I didn't expect in this project was how straightforward it was to connect EC2 to S3 once the access keys were properly configured

This project took me approximately 1-2 hours to complete from setup to validation.

---

## In the first part of my project...

### Step 1 - Architecture set up

In this step, I will setup VPC and EC2 instance because they provide the foundational network and compute infrastructure needed to access and interact with S3.

### Step 2 - Connect to my EC2 instance

In this step, I will directly connect to the EC2 through the public internet because it's the quickest way to access the instance and configure AWS CLI credentials.

### Step 3 - Set up access keys

In this step, I will give EC2 instance acess to AWS environment because it needs proper authentication credentials to interact with AWS services like S3.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_3e1e79a2)

---

## Architecture set up

I started my project by launching a new VPC.

I also set up a bucket

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_4334d777)

---

## Running CLI commands

AWS CLI is the Command Line for the instance. I have access to AWS CLI because it comes pre-installed on Amazon Linux EC2 instances.

The first command I ran was `aws s3 ls`. This command is used to list all S3 buckets in the instance.

The second command I ran was `aws configure`. This command is used to fill in my AWS credentials.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_e7fa8776)

---

## Access keys

### Credentials

To set up my EC2 instance to interact with my AWS environment, I configured my secret access key into the console

Access keys are credentials to log into AWS for communication with AWS resources.

Secret access keys are credentials used for logging into AWS console.

### Best practice

Although I'm using access keys in this project, a best practice alternative is to create an IAM role and attaching the role to the EC2 instance.

---

## In the second part of my project...

### Step 4 - Set up an S3 bucket

In this step, I will create a S3 bucket on AWS because it will serve as the storage destination for files uploaded from my EC2 instance.

### Step 5 - Connecting to my S3 bucket

In this step, I will connect to S3 bucket from the CLI because it demonstrates how VPC-based EC2 instances can securely interact with S3 storage.

---

## Connecting to my S3 bucket

The first command I ran was `aws s3 ls`. This command is used to list all S3 buckets in the instance.

When I ran the command `aws s3 ls` again, the terminal responded with our bucket. This indicated the connection is successful.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_4334d778)

---

## Connecting to my S3 bucket

Another CLI command I ran was `aws s3 ls s3://` which returned the list of all files in my s3 bucket.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_4334d779)

---

## Uploading objects to S3

To upload a new file to my bucket, I first ran sudo touch /tmp/test.txt

The second command I ran was `aws s3 cp`. This command creates a new file in the s3 buckets

The third command I ran was `aws s3 ls s3://`, which validated that my text file is now uploaded into the s3 bucket.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-networks-s3_3e1e79a2)

---

## Conclusion

In this project, I successfully demonstrated how to access Amazon S3 from within a VPC environment using an EC2 instance. The key findings from this implementation include:

**Network Architecture**: By setting up a VPC with an EC2 instance, I created an isolated network environment that provides security and control over AWS resources while maintaining connectivity to S3 storage.

**Authentication Methods**: I explored two approaches for EC2-to-S3 authentication. While I used access keys in this project for demonstration purposes, I learned that the best practice is to use IAM roles attached to EC2 instances, which provides better security and eliminates the need to manage credentials manually.

**AWS CLI Integration**: The AWS CLI proved to be a powerful tool for interacting with S3, allowing me to list buckets, upload files, and verify connections directly from the EC2 instance. The fact that it comes pre-installed on Amazon Linux instances made the setup process straightforward.

**Practical Application**: This architecture pattern is commonly used in production environments where applications running on EC2 need to store and retrieve data from S3 securely. The VPC provides network isolation while S3 offers scalable, durable storage.

Overall, this project reinforced the importance of proper network design and security best practices when building cloud infrastructure on AWS. The combination of VPC, EC2, and S3 creates a robust foundation for many cloud-based applications.

---
