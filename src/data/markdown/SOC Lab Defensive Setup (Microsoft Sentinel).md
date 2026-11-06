https://www.youtube.com/watch?v=DNcYC7IFWJk

1. RDP Brute Force  
2. Metasploit Persistence  
3. AzureHound  
4. Phishing/Spam via GoPhish
5. Lateral Movement
---
Here's the picture before the details: three of these five (RDP brute force, Metasploit persistence, lateral movement) are **host-based** and detectable from `SecurityEvent`, which you already have — no license needed. AzureHound needs `AuditLogs` (free tier, already enabled). GoPhish phishing is the one gap — it really wants Defender for Office 365 (`EmailEvents`), which a lab tenant usually lacks, so I'll give you a workable alternative.

---

### 1. RDP Brute Force

**Data source:** `SecurityEvent` (already flowing) — or `SigninLogs` if you have P1 and want the cloud-identity angle.

**What to collect:** Make sure your Windows target's audit policy logs logon failures. In an elevated prompt on the target:

```
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
```

This produces Event ID 4625 (failed logon) and 4624 (successful logon), with `LogonType 10` = RemoteInteractive (RDP) and `LogonType 3` = Network.

**Analytics rule KQL** (Sentinel → Analytics → Scheduled query rule):

kql

```kql
let failureThreshold = 10;
let timeWindow = 15m;
SecurityEvent
| where TimeGenerated > ago(timeWindow)
| where EventID == 4625
| where LogonType in (10, 3) 
| summarize FailedAttempts = count(),
            DistinctAccounts = dcount(TargetUserName),
            Accounts = make_set(TargetUserName, 20),
            FirstSeen = min(TimeGenerated),
            LastSeen  = max(TimeGenerated)
        by IpAddress, Computer
| where FailedAttempts >= failureThreshold
```

**Better still — detect the brute force that _succeeded_** (a burst of 4625 followed by a 4624 from the same source is far higher fidelity than failures alone):

kql

```kql
let timeWindow = 1h;
let failureThreshold = 10;
let failures = SecurityEvent
    | where TimeGenerated > ago(timeWindow)
    | where EventID == 4625 and LogonType in (10, 3)
    | summarize FailedCount = count(), FailStart = min(TimeGenerated), FailEnd = max(TimeGenerated)
             by IpAddress, TargetUserName, Computer
    | where FailedCount >= failureThreshold;
let successes = SecurityEvent
    | where TimeGenerated > ago(timeWindow)
    | where EventID == 4624 and LogonType in (10, 3)
    | project SuccessTime = TimeGenerated, IpAddress, TargetUserName, Computer, LogonId;
failures
| join kind=inner successes on IpAddress, TargetUserName, Computer
| where SuccessTime between (FailStart .. (FailEnd + 5m))
| project IpAddress, TargetUserName, Computer, FailedCount, FailStart, FailEnd, SuccessTime
```

Rule config: run every 15 min, lookup 1h (matching the window), entity-map `IpAddress` → IP and `TargetUserName` → Account so incidents are investigable.

Note: FreeRDP from Kali against a Windows host will populate `IpAddress` with your Kali VM's IP — that's your test signal. Sentinel also ships a built-in template ("Brute force attack against user credentials") you can enable as a fast path; the custom rule above is the learning version.

---

### 2. Metasploit Persistence

**Data source:** `SecurityEvent` (host) plus, ideally, Defender for Endpoint (`DeviceProcessEvents`, `DeviceRegistryEvents`) if the target is onboarded to MDE. Persistence is where **Defender XDR / MDE earns its place** — it catches this far better than raw event logs.

**Prerequisite for the SecurityEvent path:** enable command-line and script logging on the target, or you'll see that a process started but not _what_ it did:

```
auditpol /set /subcategory:"Process Creation" /success:enable
```

Then enable "Include command line in process creation events" via Group Policy (Administrative Templates → System → Audit Process Creation), which populates the `CommandLine` field in Event ID 4688. Sysmon (Event ID 1) is even richer if you have it feeding the workspace.

Metasploit's common persistence mechanisms are: a **Run key** in the registry, a **scheduled task**, a **new service**, or a **new local user**. Detections for each:

**Registry Run-key persistence (MDE — needs Defender for Endpoint):**

kql

```kql
DeviceRegistryEvents
| where TimeGenerated > ago(1h)
| where ActionType == "RegistryValueSet"
| where RegistryKey has_any (
    @"\CurrentVersion\Run",
    @"\CurrentVersion\RunOnce",
    @"\CurrentVersion\Policies\Explorer\Run")
| project TimeGenerated, DeviceName, InitiatingProcessFileName,
          RegistryKey, RegistryValueName, RegistryValueData
```

**New service creation (SecurityEvent — you have this):**

kql

```kql
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 7045   // A new service was installed
| project TimeGenerated, Computer, Account,
          ServiceName = extract(@"Service Name:\s*(.+)", 1, RenderedDescription),
          ServiceFileName = extract(@"Service File Name:\s*(.+)", 1, RenderedDescription)
```

Meterpreter's `persistence_service` and `exploit/windows/local/persistence_service` drop a service with a randomized name pointing at a payload in a temp path — the `ServiceFileName` pointing to `%TEMP%`, `AppData`, or a `.exe` with a random name is the tell.

**Scheduled task creation (SecurityEvent):**

kql

```kql
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID in (4698, 4702)   // task created / task updated
| project TimeGenerated, Computer, Account, TaskName = extract(@"Task Name:\s*(.+)", 1, RenderedDescription)
```

**New local user / added to admins (SecurityEvent):**

kql

```kql
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID in (4720, 4732, 4728)  // user created / added to local group / added to global group
| project TimeGenerated, EventID, Computer, TargetAccount = TargetUserName, Actor = SubjectUserName
```

**Suspicious command line catch-all (4688, needs command-line auditing):**

kql

```kql
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 4688
| where CommandLine has_any ("schtasks", "sc create", "New-Service", "reg add", "Add-MpPreference")
     or CommandLine has_any (@"\Temp\", @"\AppData\", "-enc", "-EncodedCommand", "IEX", "DownloadString")
| project TimeGenerated, Computer, Account, NewProcessName, CommandLine
```

Your Wazuh agent on the target will also flag most of these host-side; treat Wazuh and Sentinel as two independent eyes on the same box.

---

### 3. AzureHound

**Data source:** `AuditLogs` (free tier — already enabled). This is the one you correctly identified earlier as license-friendly.

AzureHound enumerates your Entra tenant via the Microsoft Graph and Azure Resource Manager APIs. It doesn't exploit anything — it _reads_ the directory rapidly and broadly, which is exactly its footprint. There's no single "AzureHound ran" event; you detect the **pattern of enumeration**.

Two angles:

**A — Sign-in from the AzureHound client (if you have `SigninLogs`, i.e. P1):** AzureHound authenticates and the sign-in often carries a recognizable client/app or the Azure PowerShell / Az CLI app IDs:

kql

```kql
SigninLogs
| where TimeGenerated > ago(1h)
| where AppDisplayName in ("Azure Active Directory PowerShell", "Microsoft Azure CLI", "Microsoft Graph Command Line Tools")
     or UserAgent has_any ("azurehound", "BloodHound")
| project TimeGenerated, UserPrincipalName, AppDisplayName, IPAddress, UserAgent, ResultType
```

**B — Enumeration burst in `AuditLogs` (free tier — your path):** A single principal reading a large, diverse set of directory objects in a short window:

kql

```kql
let timeWindow = 30m;
let opThreshold = 100;
AuditLogs
| where TimeGenerated > ago(timeWindow)
| where OperationName has_any ("List", "Get", "Read")   // read/enumeration ops
| extend Actor = tostring(InitiatedBy.user.userPrincipalName)
| where isnotempty(Actor)
| summarize ReadOps = count(),
            DistinctOps = dcount(OperationName),
            Ops = make_set(OperationName, 30),
            FirstSeen = min(TimeGenerated),
            LastSeen  = max(TimeGenerated)
        by Actor
| where ReadOps >= opThreshold and DistinctOps >= 10
```

Tune `opThreshold` to your tenant's baseline — a quiet lab tenant will have almost no read volume, so even 50 might be plenty. Run AzureHound once, then look at what your actual counts are and set the threshold just under that.

One honest caveat: `AuditLogs` primarily records _writes/changes_ well; broad _read_ enumeration via Graph is not always fully represented there depending on what AzureHound touches. If you have P1, the `SigninLogs` angle (A) plus **Entra ID Protection** risk detections give you a cleaner signal. In a free lab, angle B is your best available detection and is worth doing as the exercise even knowing its coverage limits.

---

### 4. Phishing / Spam via GoPhish

**This is your problem child.** Real phishing detection lives in **Defender for Office 365** via the `EmailEvents`, `EmailUrlInfo`, and `EmailAttachmentInfo` tables in Advanced Hunting. A lab/free tenant almost never has Defender for O365, and GoPhish sends mail from _your own_ infrastructure to _your own_ test mailboxes — so it typically won't traverse Exchange Online at all, meaning nothing lands in `EmailEvents`.

So be clear-eyed: **you can't meaningfully "detect GoPhish in Sentinel" the way you can the others** unless you route the mail through a mailbox that Defender for O365 protects. Three realistic options:

**Option A — If you do have Defender for O365 (E5 / trial):** send GoPhish campaigns _to_ Exchange Online mailboxes and hunt the landing:

kql

```kql
EmailEvents
| where TimeGenerated > ago(24h)
| where SenderFromDomain !endswith "yourtenant.onmicrosoft.com"   // external sender
| where DeliveryAction in ("Delivered", "DeliveredToJunk")
| join kind=inner (
    EmailUrlInfo | project NetworkMessageId, Url
) on NetworkMessageId
| project TimeGenerated, SenderFromAddress, RecipientEmailAddress, Subject, Url, DeliveryAction
```

And detect who _clicked_ (this is the real win — a user clicking the GoPhish link):

kql

```kql
UrlClickEvents
| where TimeGenerated > ago(24h)
| where ActionType == "ClickAllowed"
| project TimeGenerated, AccountUpn, Url, Workload
```

**Option B — Detect the _click/landing_ on the network side (fits your lab better):** GoPhish serves its landing page from a web server you control. Point the phishing link at a host whose web logs (or Wazuh/firewall logs) flow into Sentinel via a custom log connector, then detect victims hitting the landing URL. This turns a mail problem into a web-log problem you can actually see.

**Option C — Use the built-in Microsoft simulation instead:** **Attack Simulation Training** (Defender portal → Email & collaboration → Attack simulation training) is Microsoft's sanctioned phishing simulator and it writes directly into `EmailEvents` / `UrlClickEvents` with the results surfaced natively. If your goal is "practice detecting phishing in Microsoft's stack," this is the intended tool; GoPhish is better suited to standalone social-engineering labs than to Sentinel detection exercises.

My recommendation: use GoPhish for the social-engineering craft, but for the _Sentinel detection_ portion use Attack Simulation Training if you have the licensing, or Option B if you want to keep it self-hosted and free.

---

### 5. Lateral Movement

**Data source:** `SecurityEvent` (you have this); much richer with **MDE** (`DeviceLogonEvents`, `DeviceNetworkEvents`) or **Microsoft Defender for Identity** if you stand up a domain controller.

Lateral movement in a Windows lab usually means: **pass-the-hash / remote auth (Type 3 logons)**, **PsExec / remote service creation**, **WMI/WinRM remote execution**, or **RDP hopping between internal hosts**. Detections:

**Remote-execution service creation — the PsExec / SMBexec / Metasploit `psexec` tell (SecurityEvent):**

kql

```kql
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 7045
| where RenderedDescription has_any ("PSEXESVC", "PAExec")
     or RenderedDescription matches regex @"Service File Name:.*\\[A-Za-z0-9]{8}\.exe"
| project TimeGenerated, Computer, Account, RenderedDescription
```

**One source account authenticating to many hosts in a short window (classic spread pattern):**

kql

```kql
let timeWindow = 30m;
let hostThreshold = 3;
SecurityEvent
| where TimeGenerated > ago(timeWindow)
| where EventID == 4624 and LogonType in (3, 10)   // network + RDP
| where AccountType == "User"
| summarize DistinctHosts = dcount(Computer),
            Hosts = make_set(Computer, 20),
            Logons = count()
        by TargetUserName, IpAddress
| where DistinctHosts >= hostThreshold
```

**Explicit-credential logons — `runas` / injected creds moving laterally (Event ID 4648):**

kql

```kql
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 4648   // logon using explicit credentials
| where AccountType == "User"
| project TimeGenerated, Computer, SubjectUser = SubjectUserName,
          TargetUser = TargetUserName, TargetServer = tostring(extract(@"Target Server Name:\s*(.+)", 1, RenderedDescription))
| where TargetUser != SubjectUser
```

**WMI / WinRM remote execution (needs 4688 with command line, or MDE):**

kql

```kql
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 4688
| where NewProcessName has_any (@"\wmic.exe", @"\wsmprovhost.exe", @"\winrs.exe")
     or (NewProcessName endswith @"\powershell.exe" and CommandLine has_any ("Invoke-Command", "Enter-PSSession", "-ComputerName"))
| project TimeGenerated, Computer, Account, NewProcessName, CommandLine
```

**MDE version (if the targets are onboarded) — remote network logons landing on hosts:**

kql

```kql
DeviceLogonEvents
| where TimeGenerated > ago(30m)
| where LogonType in ("Network", "RemoteInteractive")
| where ActionType == "LogonSuccess"
| summarize DistinctDevices = dcount(DeviceName), Devices = make_set(DeviceName, 20)
        by AccountName, RemoteIP
| where DistinctDevices >= 3
```

---

### What to set up, in priority order

Since you already have `SecurityEvent` flowing, the fastest path to "everything works" is:

First, on each Windows target, turn on the three audit policies (logon success+failure, process creation, and command-line inclusion) — without these, attacks 1, 2, and 5 will show _that_ something happened but not the detail that makes detection reliable. Second, create the RDP brute-force and lateral-movement rules, since those run entirely on data you already have and give you the quickest win. Third, run the AzureHound rule against `AuditLogs` and tune the threshold to your tenant's real baseline. Fourth, decide the phishing approach — Attack Simulation Training if licensed, self-hosted web-log detection if not. And throughout, consider onboarding the Windows target to **Defender for Endpoint** (free trial available), because it materially upgrades detections 2 and 5 from "event-log inference" to "purpose-built XDR detections."