# Build a Security Monitoring System

## Introduction

### What is AWS Security Monitoring?

AWS provides several services that work together to monitor activity across your account and alert you when something noteworthy happens. In this project, the key services are CloudTrail, CloudWatch, Secrets Manager, and SNS.

- **AWS Secrets Manager** stores sensitive credentials—passwords, API keys, and other secrets—securely, so they never need to appear in code or configuration files.
- **AWS CloudTrail** records every API call made in your AWS account: who did what, when, and from where. It is the audit log for your entire environment.
- **Amazon CloudWatch** aggregates logs from CloudTrail and other sources, and lets you define metric filters, alarms, and automated responses based on patterns in those logs.
- **Amazon SNS (Simple Notification Service)** acts as the messaging layer—when an alarm triggers, SNS dispatches notifications to subscribers, such as an email address.

### How I Used These Services in This Project

In this project, I stored a secret in Secrets Manager and then built a monitoring pipeline to detect and alert on every access to that secret. The pipeline runs as follows: CloudTrail captures the access event, CloudWatch Logs ingests the CloudTrail logs and applies a metric filter to count secret-access events, a CloudWatch Alarm triggers when the count reaches one or more, and SNS sends an email notification.

### One Thing I Didn't Expect

I didn't expect the troubleshooting step to reveal such a subtle configuration mistake. Everything appeared to be wired up correctly, yet no email arrived after retrieving the secret. The culprit turned out to be a single setting in the CloudWatch Alarm: it was computing the **average** number of accesses per data point rather than the **sum**. Switching to Sum resolved it immediately—a good reminder that metric aggregation matters as much as the threshold itself.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-monitoring_reghtjy)

---

## Creating a Secret

AWS Secrets Manager protects secrets—passwords, API keys, credentials, and other sensitive information. Rather than embedding credentials directly in code or sharing them over email, Secrets Manager provides a secure, auditable store for them.

To begin the project, I created a secret called `TopSecret` containing a simple key-value pair. This secret would serve as the target for all subsequent monitoring.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-monitoring_o5p6q7r8)

---

## Setting Up CloudTrail

AWS CloudTrail records every action taken in your AWS account—who performed it, when, and from which IP address. A **trail** instructs CloudTrail which activity to capture and where to store it.

CloudTrail organises events into four categories:

- **Management events** – Administrative actions that configure AWS resources: creating an EC2 instance, modifying a security group, or accessing a secret. This is the category that captures secret retrieval and the one this project focuses on.
- **Data events** – High-volume operations performed on resources rather than to them, such as uploading objects to S3 or invoking a Lambda function.
- **Insights events** – Anomaly detection for unusual patterns in management events, such as a sudden spike in IAM user creation.
- **Network activity events** – Network-related changes, including VPC configuration updates and subnet traffic.

### Read vs Write Activity

It is also worth understanding the distinction between read and write API activity:

- **Read** – The caller views information without making any changes, for example listing S3 buckets or describing EC2 instances.
- **Write** – The caller creates, modifies, or deletes a resource—or retrieves the *value* of a secret. Retrieving a secret value is classified as a write event, which is precisely what this monitoring system is designed to catch.

---

## Verifying CloudTrail

With the trail in place, I tested it by retrieving the `TopSecret` secret twice: once through the Secrets Manager console and once via AWS CloudShell.

Navigating to **CloudTrail > Event History** confirmed that both retrieval events had been recorded. Seeing those events listed was reassuring—it meant CloudTrail was capturing the activity that the rest of the pipeline depends on.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-monitoring_s8t9u0v1)

---

## Configuring CloudWatch Metrics and Alarms

### Metric Filter

CloudWatch Logs ingests the CloudTrail log stream and allows you to define **metric filters**—patterns that scan incoming log entries and increment a numeric metric each time a match is found.

I created a metric filter targeting the `GetSecretValue` API call, with:

- **Metric value** set to `1`, so each matching log entry increments the counter by one.
- **Default value** set to `0`, so the metric reports zero during periods with no matches rather than leaving the data point blank.

### CloudWatch Alarm

A CloudWatch Alarm watches a metric and changes state when the metric crosses a defined threshold. I configured the alarm with the following settings:

- **Statistic:** Sum — counts every individual access event rather than averaging them.
- **Threshold:** Greater than or equal to 1 over a five-minute period.
- **Action:** Notify an SNS topic.

### SNS Topic

An SNS topic acts as a broadcast channel. I created a topic and added my email address as a subscriber. AWS sends a confirmation email when a new subscription is created; confirming it is required before any alarm notifications are delivered.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-monitoring_a9b0c1d2)

---

## Troubleshooting and Testing

After completing the setup, I retrieved the secret again to trigger the monitoring pipeline. No notification arrived. To diagnose the issue, I worked through the following checks:

- Confirmed the CloudTrail event had been recorded in Event History.
- Verified that the CloudWatch log group name in the trail configuration matched the log group referenced by the metric filter.
- Used the **Test Pattern** feature on the metric filter to confirm it correctly matched a sample log entry.
- Manually triggered the alarm via CloudShell to verify the SNS topic was delivering emails.
- Published a test message directly to the SNS topic to rule out any email delivery issues.

Each check passed. The root cause was the alarm's aggregation method—set to **Average** rather than **Sum**. Changing the statistic to Sum ensured that every access event, however infrequent, would reliably trigger the alarm.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-monitoring_fsdghstt)

---

## Conclusion

This project demonstrated how CloudTrail, CloudWatch, and SNS can be composed into a responsive security monitoring pipeline. Key takeaways include:

- **CloudTrail is the foundation** – Without it, there are no logs to monitor. Every API call, including secret retrieval, flows through CloudTrail first.
- **CloudWatch adds intelligence** – Metric filters and alarms transform raw logs into actionable signals, allowing you to respond to specific events rather than reviewing logs manually.
- **Metric aggregation matters** – Choosing the correct statistic (Sum vs. Average) is critical; a misconfigured alarm may never fire even when the threshold appears correct.
- **SNS decouples notification from detection** – Using SNS as the notification layer makes it straightforward to extend alerts to multiple recipients or other endpoints in the future.

---
