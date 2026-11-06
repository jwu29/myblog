

IT Junior System Administrator, Lucid Multi Cloud · 14 October 2026

## How to use this doc

Rehearse these answers out loud; don't memorise them word for word. Interviewers can tell when an answer is recited.

- **[Brackets]** mark details that are guessed or blank. Replace each one with what actually happened, because follow-up questions expose invented details quickly.
- Each answer should take 60–90 seconds spoken. Use STAR: Situation, Task, Action, Result. Spend most of the time on Action.
- Say "I", not "we". End every story with a result, quantified where possible.
- If short on time, prioritise in this order: the two make-or-break answers, then stories 1, 2, 3 and 8, then the MSP scenarios.

## The two make-or-break answers

These are the questions most likely to decide the interview. Answer both calmly and without apologising.

### "The role asks for 3–5 years of support experience. You have about one. Why should we consider you?"

> "That's fair, and I won't pretend I have five years on a helpdesk. What I do have is a year running IT for a small organisation more or less end to end. That includes helpdesk tickets in Jira, but also Google Workspace and Microsoft 365 administration, DNS and the company website, SIEM monitoring, Salesforce, Xero and Stripe. In a small company there's no Level 3 to escalate to, so I've had to work problems through myself.
>
> Before that, I supported a 20-person team's Python and AWS workflows during my internship. Outside work, I've deliberately built the experience I don't yet have in years. I've set up an Active Directory domain with Group Policy, DHCP and VLANs in VMware, a Proxmox private cloud with firewall segmentation and automated backups, and security monitoring in AWS. I've backed that with CCNA, AWS Solutions Architect, Security+ and BTL1.
>
> So I have fewer years, but the ground I've covered maps closely to your stack. In an MSP where you're across many clients, how quickly someone learns matters as much as tenure, and I think my record shows that."

Why it works: it acknowledges the gap in one sentence, then spends the rest on evidence. It ends on fit with their environment, not on the weakness.

### "Your background is very security-focused. Why a sysadmin role, and will you leave for a security job?"

> "Security is clearly a big interest of mine. But the best security people I've worked with understand the systems they're defending, because most incidents come down to how something was built or configured. I want that foundation properly, running real virtualisation, Active Directory, networking and cloud for real clients, not just in labs.
>
> A managed services team gives me exposure to many environments at once, which I couldn't get anywhere else this early. Security is also part of this role. The ad mentions safeguarding information and making authentication robust, and that's where I can contribute from day one.
>
> Over the next few years, I see myself growing into a systems engineer with a strong security focus. That's the same path toward sysadmin and engineer that you describe for this role."

Why it works: it reframes security as a reason to want this job, not a reason to leave it. It also avoids promising to stay forever, which sounds hollow.

**[Josiah should adjust the career-goal sentence so it is honestly what he wants.]**

## Ten STAR story drafts (Situation, Task, Action, Result)

One story can answer several questions, so these ten cover most behavioural prompts.

### 1. A difficult technical problem (CloudWatch alarm)

> "I built a monitoring pipeline in AWS to alert me whenever anyone retrieved credentials from Secrets Manager. CloudTrail fed CloudWatch Logs, a metric filter drove an alarm, and SNS sent the email. Everything looked right, but the alarm never fired. For a security alert that's the worst kind of failure, because no alert looks exactly like nothing happening.
>
> Rather than changing settings at random, I tested each layer separately. I confirmed the events were reaching CloudWatch Logs and tested the filter pattern against real events. I forced the alarm into its alarm state manually and published directly to the SNS topic to check the email arrived. Every piece worked on its own, so the problem had to be in how the alarm evaluated the metric. And that was the problem - I set it to Average instead of Sum, which suppressed alerts even though the threshold was correct.
>
> After the fix I retested end to end and alerts arrived reliably. The lesson was to test the alert path itself, and to isolate layer by layer instead of guessing."

### 2. Helping a frustrated or non-technical user

> "At my current role, a speaker (outside of the company) couldn't connect to Zoom about 15 mins before a workshop, and they were stressed. My first priority was getting them through the session, not finding the root cause. I allowed them to join through web browser, and they started on time.
>
> Afterwards I found the actual cause, which is corrected cache on their Zoom app, fixed it by guiding them to reinstall Zoom, and explained what happened in plain language. I logged it in Jira so anyone could resolve it quickly next time. I learned that when someone is under time pressure, the solution should come first, before the fix follows."

### 3. Prioritising several issues at once

> "I prioritise by business impact: how many people are affected, whether work is stopped or just slowed, and whether there's a deadline. For example, one morning our Google Workspace was down (due to expired business domain), while two of my colleagues had individual issues with using Zoom. The outage came first because it affected everyone. But I quickly messaged the other two so they knew I'd seen their tickets and roughly when I'd get to them.
>
> People waiting are much less frustrated when they know they haven't been forgotten. In an SLA environment I'd use the same logic, with severity and the SLA clock setting the order. If I couldn't meet an SLA, I'd flag it early rather than let it lapse quietly."

### 4. Working in a team (CCC internship)

> "During my data engineering internship I was in a 20-person team running pipelines on AWS: S3, Airflow on MWAA, and EMR. Alongside my own work processing about six million rows of UK government data, I often helped colleagues when their Python or AWS workflows broke.
>
> One example was building DAGs to support data ingestion workflow in Apache Airflow. I read through their source code and added onto it, conduct unit and integration test and let my supervisor review it as a pull request. In a team, building upon someone else's code is often more effective than creating from scratch."

### 5. Explaining technical work to a non-technical audience

> "At BSides Hong Kong I co-presented a digital forensics workshop. The audience ranged from beginners to professionals, so I couldn't assume everyone knew the tools. Instead of walking through tool outputs, I framed the investigation as a story: how the attacker got in, how they stayed, and what they took. I brought in technical evidence only to answer each question.
>
> I do the same at work. When explaining an issue to legal staff, I start with what it means for them and what they need to do, and add technical detail only if they ask."

### 6. Learning something quickly

> "When I joined my current role, I was responsible for systems I'd never used, including Salesforce, Xero and Stripe. With Stripe, for example, I needed the online payment setup working within a month. I read the vendor documentation first, tested safely before changing anything live, and wrote down documentation so the next person using it wouldn't have to learn from scratch.
>
> I also completed Security+, CCNA, AWS Solutions Architect Associate and BTL1 in about a year while working and studying. That's how I'd approach the newer parts of your stack, like vCloud Director and PowerShell."

### 7. Attention to detail or giving feedback (Issen validation)

> "For the BSides workshop, I helped validate a forensic triage tool still in development, called Issen. I ran the same evidence through FTK Imager, Registry Viewer, Timeline Explorer and Volatility, and compared the results with Issen's output.
>
> I found discrepancies on registries and imagers such as missing artefacts / timestamp differences. Since it was someone else's work, I reported each one with evidence: what the reference tool showed, what Issen showed, and how to reproduce it. That made the feedback easy to act on. At an MSP the same habit applies to verifying changes and backups against something trusted."

### 8. A mistake (must be real)

>“While testing a setup at work, I created an instance in Azure and forgot to delete it when I’d finished. It ran for about two weeks and cost around $40 USD before I noticed it on the Billing Report. It wasn’t a huge amount, but it was money spent on nothing, and in a business that’s exactly the kind of waste that erodes trust.
> 
> As soon as I noticed, I deleted the VM. I also checked for the resources that stay behind after a VM is deleted, like the managed disk, network interface and public IP, because those keep billing too. I told my manager what had happened and how much it had cost.
> 
> Afterwards I changed how I work in the cloud. I now put every project in its own resource group, so I can delete everything in one step when I’m done. I set auto-shutdown on test VMs and tag resources with an owner and purpose. Most importantly, I set up a budget with cost alerts, so I’d get an email if spending went past a threshold. I haven’t had a forgotten resource since.”

Own the mistake in the first sentence, then spend most of the answer on the fix and the prevention. A work mistake is stronger than a home lab one.

### 9. Showing initiative (home lab)

> "Earlier this year I built a private cloud at home because I wanted hands-on infrastructure experience beyond coursework. I run Proxmox as the hypervisor, with an OPNsense firewall segmenting the network. Remote access goes through Tailscale with ACLs that block lateral movement between hosts. I automated backups to local and remote storage with bash and cron, and deployed Wazuh with custom detection rules that email me alerts.
>
> No one asked me to do it, but it taught me how virtualisation, networking and security fit together. That's close to what your Managed Services team does for clients, at a larger scale."

### 10. Documentation

> "I document anything that someone else, or I in six months, might need to repeat. At work, I always write precise instructions for how to use applications e.g. Zoom and SalesForce. In my home lab I keep a backup and recovery runbook: how backups run, where they're stored, and the steps to restore. I've also written up projects on my blog.
>
> I always write as if someone else could follow it without asking me, so I write with that in mind."

## MSP scenarios and troubleshooting framework

For any "what would you do" question, walk through the same six steps out loud. The structure matters more than naming every command.

1. **Clarify impact**: who is affected, how badly, and since when.
2. **Isolate**: one user or everyone, one site or all, what changed recently.
3. **Investigate**: logs, monitoring, and checking layer by layer.
4. **Resolve or escalate**: fix it, or escalate with clear notes once past the agreed time.
5. **Verify**: confirm with the user that it works.
6. **Document**: ticket notes, root cause, and any knowledge-base update.

### "Three clients report urgent incidents at once. What do you do first?"

> "I'd triage by severity and business impact: a full outage beats a degraded service, and many users beat one. I'd check each client's SLA and priority. I'd quickly acknowledge all three so nobody feels ignored, and tell my lead straight away if I can't cover them within SLA. I'd rather ask for help early than miss an SLA silently."

### "A client is angry about an unresolved outage. How do you respond?"

> "First, I'd listen and acknowledge the impact on their business without getting defensive. Then I'd tell them exactly what we know, what we're doing next, and when they'll hear from me again, and I'd keep that promise even if there's no news. Regular, honest updates usually calm things down more than anything technical."

### "You've spent 30 minutes on a production incident with no progress. What next?"

> "I'd escalate, without seeing it as a failure. I'd hand over a clear summary: the symptoms, what I've checked and ruled out, and any changes I've made. That saves the next engineer from repeating my work. I'd stay involved to learn how it was solved, and keep the client updated throughout."

### "A client asks for a change you think is insecure. What do you do?"

> "I wouldn't just refuse or just comply. I'd find out what they're actually trying to achieve, explain the risk in business terms, and offer a safer way to reach the same goal. For example, **[instead of opening RDP to the internet, give access through a VPN]**. If they still want it, I'd escalate to my lead, follow our change process, and make sure the decision and the risk acceptance are documented."

## Technical troubleshooting scenarios

Each answer follows the same framework: clarify, isolate, investigate, resolve or escalate, verify, document. He doesn't need every command. Interviewers mostly want to hear a logical order and good habits: asking what changed, checking scope, and keeping the client updated.

### "A Windows Server is running slowly. How do you troubleshoot?"

> "First I'd clarify the scope. Is it slow for everyone or one user, for every application or one, and since when? I'd also ask whether anything changed recently, like patches or a new deployment.
>
> Then I'd check resources. Task Manager and Resource Monitor show CPU, memory, disk queue and network, and which process is responsible. I'd check Event Viewer for disk or service errors, and free space on the system drive. I'd also look for something scheduled at the wrong time, like an antivirus scan, updates or a backup running during business hours.
>
> If it's a VM, I'd check from the host side in vCenter too: CPU ready time, memory ballooning and datastore latency. A guest can look slow simply because the host is overcommitted. Once it's fixed, I'd confirm with users and record the root cause in the ticket."

### "A VMware VM is powered on but unreachable. What do you check?"

> "I'd work outward from the VM. First, I'd open the console in vCenter to see whether the OS is actually up, or stuck at boot or a blue screen. If it's up, I'd check from inside: IP configuration, whether it can ping its gateway, whether the service is listening, and the guest firewall.
>
> Next, the virtual layer: is the virtual NIC actually connected, and is it on the right port group and VLAN? Then the host and physical network: are the host's uplinks up, and is that VLAN trunked to the host? I'd also ask what changed. A recent vMotion to a host missing that VLAN, a snapshot revert or an IP conflict are common causes.
>
> A quick way to narrow it down is to check whether other VMs on the same port group are reachable. If they are, the problem is specific to this VM."

### "A user can't log in to their domain account. How do you investigate?"

> "I'd start with the exact error message and the scope: one user or many, one machine or several. Logging in with a different account on the same machine quickly tells me whether it's the user or the machine.
>
> If it's the user, I'd check in Active Directory Users and Computers whether the account is locked out, disabled or has an expired password. If it keeps locking out, Event ID 4740 on the domain controller shows which computer caused the lockout. Often it's an old password saved on a phone or a mapped drive.
>
> If it's the machine, I'd check that it can reach a domain controller and that its DNS points to the domain controller, not a public resolver. I'd check the clock, because a time difference of more than five minutes breaks Kerberos. I'd also check the machine's trust relationship with the domain, which can be repaired or fixed by rejoining it."

### "A client can't access the internet. How do you isolate the problem?"

> "First, scope: one device, one site, or everyone. Then I'd work from the bottom up. Is the device connected? Does `ipconfig` show a valid address, or a 169.254 address, which means it didn't get one from DHCP? Can it ping the gateway? Can it ping an external IP like 8.8.8.8? Can it resolve a name with `nslookup`?
>
> Each step tells me where the break is. If it can't reach the gateway, it's the local network: the switch, VLAN or cabling. If it reaches external IPs but not names, it's DNS. If the gateway works but nothing beyond it, I'd look at the firewall, router and WAN link, and check for an outage with the ISP. I'd also check proxy settings on the device."

### "How would you tell a DNS problem from a DHCP problem?"

> "They show different symptoms. With a DHCP problem, the device has no IP, a 169.254 address, or the wrong subnet or gateway. I'd check whether the DHCP server is up and whether the scope has run out of addresses. If the client is on a different VLAN, I'd check the DHCP relay, the `ip helper-address` on the router interface.
>
> With a DNS problem, the device has a valid IP and can ping an address like 8.8.8.8, but names don't resolve. `nslookup` shows which DNS server is answering. In a domain, clients should point at the internal DNS servers, otherwise Active Directory lookups fail.
>
> The quickest test is to ping an IP address, then a name. If the IP works and the name doesn't, it's DNS."

### "How would you troubleshoot a Linux server with a full disk?"

> "`df -h` shows which filesystem is full. I'd also run `df -i`, because a disk can run out of inodes while it still has free space. Then `du -xh --max-depth=1` from the full mount shows what's using the space. Often it's logs under /var/log.
>
> For safe cleanup, I'd compress or rotate old logs, shrink the systemd journal with `journalctl --vacuum-size`, and clear the package cache. One trap is deleting a log file that a process still has open: the space isn't freed until the process releases it. `lsof +L1` finds those files, and I'd restart the service or truncate the file instead of deleting it.
>
> Afterwards, I'd fix the cause, for example with proper logrotate settings, and add a monitoring alert at around 80% full so it doesn't become an outage again."

### "A cloud-hosted application suddenly becomes unavailable. What do you do?"

> "I'd confirm the scope and the symptom: all users or some, and whether it's a timeout, a server error or a name that won't resolve. I'd check the provider's status page, AWS Health or Azure Status, to rule out a regional outage. Then I'd check our monitoring: instance health checks, load balancer target health, and any recent deployments, configuration changes, DNS changes or expired certificates. I'd also check security groups.
>
> If a recent change caused it, I'd roll it back first and investigate afterwards, because restoring service comes first. I'd notify the client early and tell them when the next update will come. Once it's resolved, I'd write up the root cause."

### "Tell me about a time you automated a repetitive task."

> "In my home lab, I didn't want backups to depend on me remembering them. I wrote bash scripts scheduled with cron that back up **[my VMs and container data]** to local storage and incrementally to remote storage, with retention rules that prune old copies automatically. I check that it works by **[doing test restores / reviewing the job logs]**, because a backup you haven't restored isn't really a backup.
>
> Most of my scripting is in Bash and Python. I'm newer to PowerShell, but the logic carries over, and **[I've started with a script that…]**."

## Motivation and fit

### "Why LMC2?"

> "Three reasons. First, the technical breadth: VMware private cloud, Microsoft 365, Azure and AWS in one team, which matches what I've been building skills in. Second, managed services means many clients, so I'd see many environments and problems quickly. Third, the growth path the role describes, like migrations, DevOps automation and solution design. I also have particular interest cloud infrastructure and security, hence making me interested to be part of the private/hybrid cloud offerings from LMC2. **"

### "Why move from IT support to system administration?"

> "In my current role, the most satisfying part isn't closing tickets. It's fixing the underlying system so the ticket doesn't come back, like configuring DNS, setting up Microsoft 365 properly, or adding monitoring. Sysadmin work is building and maintaining those systems, which is also what I spend my own time on in my home lab."

### "Why an MSP rather than internal IT?"

> "Internal IT at a small organisation is what I do now. I know that environment well, but I'm reaching the limit of what one environment can teach me. At an MSP I'd work across many environments and learn from a team of experienced engineers. I also like the discipline that comes with it: SLAs, documentation and change control."

### "Where do you see yourself in two years?"

> "Handling Level 2 and 3 escalations confidently on my own, with stronger PowerShell and a VMware certification basics. and contributing to migration or automation projects. Longer term, a systems engineer role with a strong security focus."

## Before the interview

- [ ] Fill in every **[bracketed]** detail with what really happened
- [ ] Choose a real mistake story for question 8
- [ ] Check the answers he gave to the SEEK employer questions (years as M365, network and systems administrator) so his interview answers match
- [ ] Prepare a one-sentence answer on right to work and his visa pathway after graduating
- [ ] Confirm the time, format (video or in person) and interviewer's name
- [ ] Look at LMC2's website and LinkedIn for one specific thing to mention
- [ ] Optional: write a short PowerShell script (e.g. list AD users or check disk space) so he can say he has started
- [ ] Rehearse the two make-or-break answers and stories 1, 2, 3 and 8 out loud, then sleep

### Questions to ask them

- What does a typical week look like for a junior on the Managed Services Team?
- How is on-call or after-hours work handled?
- How do juniors move into project work like migrations and automation?
- What separates a junior who does really well in the first six months?
