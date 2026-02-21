# Encrypt Data with AWS KMS

## Introduction

### What is AWS KMS?

AWS Key Management Service (KMS) is a managed service that creates and controls the encryption keys used to protect your data. Think of it as a secure vault—you don't store the data itself in KMS, but you store the keys that lock and unlock your data across AWS services such as DynamoDB, S3, and RDS.

KMS supports both symmetric and asymmetric encryption. Symmetric encryption uses a single key to both encrypt and decrypt data, making it faster and more efficient for large datasets—which is why it's the right choice for encrypting a DynamoDB table.

### How I Used KMS in This Project

In this project, I created a customer managed key (CMK) in KMS and used it to encrypt a DynamoDB table. I then tested access controls by logging in as a restricted IAM user to confirm that encryption correctly prevents unauthorised data access—even when that user has full DynamoDB permissions.

---

### One Thing I Didn't Expect

I didn't expect how transparently DynamoDB handles encryption. Even with the table fully encrypted, authorised users see data exactly as normal—there's no extra decryption step. Encryption and decryption happen automatically in the background, provided the user has permission to use the KMS key. This "transparent data encryption" is powerful precisely because it's invisible to legitimate users, whilst being a hard wall for everyone else.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-kms_a2b3c4d5)

---

## Encryption and KMS

Encryption converts data into ciphertext using an algorithm and a key. The key tells the algorithm exactly how to scramble plaintext—swapping values, shuffling order, or breaking patterns—so that only someone with the correct key can reverse the process.

AWS KMS manages this centrally. Every time a key is used for encryption or decryption, KMS logs the event. This audit trail helps organisations meet compliance requirements such as PCI DSS and HIPAA, where demonstrating control over data access is mandatory.

There are three encryption options when setting up a DynamoDB table:

- **Owned by Amazon DynamoDB** – AWS fully manages the key with no visibility or control for you. Suitable for basic use cases where compliance isn't a concern.
- **AWS managed key** – KMS manages the key on your behalf. You can view usage logs, but cannot modify the key.
- **Customer managed key (CMK)** – You create and manage the key in KMS, giving you full control over rotation, access policies, and audit logs. This is the most secure option and the one used in this project.

---

## Encrypting a DynamoDB Table

After creating a symmetric CMK in KMS, I attached it to a new DynamoDB table during setup by selecting the "Stored in your account, owned and managed by you" option.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-kms_w0x1y2z3)

Once the table was encrypted, I added sample items to verify the encryption was functioning correctly. Authorised users—those with permission to use the KMS key—could read and write items without any friction. DynamoDB's transparent data encryption handles the cryptographic operations automatically, so the experience for legitimate users is identical to using an unencrypted table.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-kms_q8r9s0t1)

---

## Testing Access Controls

### Denying Access

To verify that encryption was working as intended, I created a new IAM user (`nextwork-kms-user`) with `AmazonDynamoDBFullAccess`—but no permission to use the KMS key.

When this user attempted to view the table items, DynamoDB returned an access denied error. Even with full DynamoDB permissions, the encrypted table was unreadable without access to the underlying KMS key. This illustrates a key distinction: standard IAM policies control access to a _resource_, but KMS encryption protects the _data within_ that resource. Both layers are needed for comprehensive security.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-kms_c0d1e2f3)

### Granting Access

To grant the test user access, I added them as a key user in the KMS key policy. Key users are permitted to perform the following actions:

- **Encrypt** – Encrypt data using the key.
- **Decrypt** – Decrypt data encrypted with the key.
- **ReEncrypt\*** – Transfer data from one key to another.
- **GenerateDataKey\*** – Create ephemeral data keys for encrypting large datasets efficiently.
- **DescribeKey** – Retrieve key metadata such as its name and usage policies.

After updating the key policy, the test user could immediately read the DynamoDB table items, confirming that the policy change had taken effect.

![Image](http://learn.nextwork.org/motivated_indigo_zealous_griffin/uploads/aws-security-kms_feffb2fb8)

---

## Conclusion

This project illustrated how AWS KMS adds a critical layer of data-level security that sits beneath standard IAM access controls. Key takeaways include:

- **Encryption protects data, not just access** – IAM policies control who can reach a resource; KMS controls who can read the data inside it.
- **Customer managed keys offer the most control** – CMKs provide full audit logs, rotation policies, and granular key usage permissions.
- **Transparent encryption is seamless for authorised users** – DynamoDB handles encryption and decryption automatically, with no change to the experience for those with the correct permissions.
- **KMS logs every key usage** – This audit trail is essential for security compliance and incident response.

---
