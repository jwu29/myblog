# Launch a Kubernetes Cluster on AWS

## Introduction

### What is Amazon EKS?

Amazon Elastic Kubernetes Service (EKS) is a managed Kubernetes service that lets you run containerised applications on AWS without managing the underlying control plane yourself. AWS handles the availability, scalability, and patching of Kubernetes—you focus on deploying and running your workloads.

### How I Used EKS in This Project

In this project, I launched an EKS cluster using eksctl, a command-line tool that provisions the cluster and its supporting infrastructure via CloudFormation. I then connected to the cluster through the AWS console using an IAM access entry, and tested the cluster's self-healing behaviour by manually deleting EC2 nodes to observe how EKS responds.

---

### One Thing I Didn't Expect

I didn't expect how much infrastructure EKS provisions behind the scenes. Running a single eksctl command triggered two separate CloudFormation stacks—one for the cluster and another for the node group—each creating dozens of resources including VPCs, subnets, security groups, and IAM roles. What feels like a simple "create cluster" command is orchestrating an entire network environment automatically.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-compute-eks1_ff9bfc221)

---

## Kubernetes and Amazon EKS

Kubernetes is a container orchestration platform—it coordinates containers running across multiple servers, ensuring they stay healthy, scale with demand, and restart automatically if something crashes. It is the industry standard for managing large, container-based applications, used by enterprises and startups alike.

Amazon EKS runs Kubernetes on AWS, managing the control plane (the "brain" that schedules and monitors containers) on your behalf. You provide the worker nodes—EC2 instances that actually run your containers—and EKS connects everything together.

---

## eksctl and CloudFormation

eksctl is a command-line tool purpose-built for EKS. A single `create cluster` command defines the cluster name, region, EC2 instance type, and the number of nodes—then hands everything off to CloudFormation to provision.

CloudFormation created two stacks:

- **Cluster stack** – Provisions the EKS control plane and the networking infrastructure it requires: a VPC, public and private subnets, route tables, and security groups. EKS needs its own VPC to isolate cluster traffic and control how nodes and pods communicate.
- **Node group stack** – Provisions the EC2 instances that will run your containers. A node group is a pool of worker nodes; the cluster is the control plane that manages them. You can have multiple node groups within a single cluster—useful for separating workloads by instance type or availability zone.

I ran into two errors when using eksctl. The first was a permissions issue—my IAM user lacked the rights to create certain CloudFormation resources. The second was a region conflict, where a previously created resource in a different region caused a naming collision. Both were resolved by updating the IAM policy and specifying the correct region flag explicitly.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-compute-eks1_w3e4r5t6)

---

## The EKS Console

Once the cluster was running, accessing it through the AWS console required creating an IAM access entry. Without one, the console showed the cluster as active but displayed no workload information—because Kubernetes and AWS have separate identity systems that don't automatically trust each other.

An IAM access entry bridges the two: it maps an AWS IAM identity (a user or role) to a Kubernetes permission level, allowing the console to query the cluster on your behalf. I added my IAM user as an access entry with the `AmazonEKSClusterAdminPolicy` to gain full visibility into cluster resources.

Once configured, the EKS console displayed nodes, workloads, and events in real time.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-compute-eks1_e5f6g7h8)

---

## Testing Cluster Resilience

EKS node groups are backed by an Auto Scaling Group, which continuously monitors the number of healthy nodes and compares it against your configured desired count. When I deleted EC2 instances manually, the Auto Scaling Group detected the discrepancy and automatically launched replacement nodes—restoring the cluster to its desired state within minutes.

This is the core of Kubernetes resilience. The three node group size parameters define how it works:

- **Desired size** – The number of nodes the cluster targets under normal conditions.
- **Minimum size** – The floor: the cluster will never drop below this count, even during scale-in events.
- **Maximum size** – The ceiling: the cluster can scale up to this count during high-demand periods.

Deleting nodes doesn't bring the cluster down—it simply triggers self-healing.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-compute-eks1_q7r8s9t0)

---

## Conclusion

This project illustrated how EKS abstracts away infrastructure complexity whilst still giving you meaningful control over how your cluster scales and behaves. The key takeaways from this project are:

- **eksctl automates cluster provisioning** – A single command provisions the control plane, networking, and worker nodes via CloudFormation.
- **CloudFormation manages the underlying resources** – Two stacks are created: one for the cluster and one for the node group, each responsible for dozens of AWS resources.
- **IAM access entries bridge AWS and Kubernetes identity** – Without them, the console cannot query the cluster even if it is running.
- **EKS clusters are self-healing by design** – The Auto Scaling Group ensures nodes are automatically replaced if deleted or unhealthy.

---
