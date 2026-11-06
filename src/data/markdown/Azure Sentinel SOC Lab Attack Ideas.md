### Layer 1 — Host / VM events (`SecurityEvent` + Defender) — works now, your strongest path

This is the layer you've already proven flows into your workspace. Richest source of detections without any Entra licensing.

- **RDP/SMB/SSH brute force** → failed logons pile up as event `4625`. Simulate with hydra or NetExec from Kali, or Metasploit's SMB/SSH login modules. _This is the one to start with_ — it's the `4625`→`4624` rule we discussed.
- **Successful login after a failure burst** → `4625` then `4624`. The strong "brute force succeeded" signal.
- **New local account created** → `4720`. Simulate with `net user /add` on the VM (or an Atomic).
- **Account added to local Administrators** → `4732`. Privilege escalation signal.
- **Suspicious process creation** → `4688` (needs command-line auditing enabled) or Defender. Encoded PowerShell, `certutil` downloads, LOLBins.
- **Credential dumping (LSASS access)** → best seen by Defender for Endpoint. Simulate with a Mimikatz-style Atomic on the target.
- **Persistence** — new service, scheduled task, run-key → `4697`/`4698` + Defender.
- **Log clearing (defense evasion)** → `1102`. A very high-fidelity detection; almost always malicious.

Metasploit ties in here: land a Meterpreter session on the target, then run post-exploitation/discovery modules — each generates host activity across these event IDs.

### Layer 2 — Azure control-plane (`AzureActivity`) — works now, no P1 needed

Everything you do to Azure _resources_ is logged here regardless of license. Simulate with the `az` CLI or PowerShell against your own resources.

- **NSG rule change opening a port** (e.g. allowing RDP/3389 from `Any`) → classic misconfiguration/attacker-persistence signal. There's a built-in template for this.
- **VM Run Command / Custom Script Extension abuse** → executing code on a VM through the control plane instead of logging in. High-value detection.
- **Resource deletion / mass changes** → destructive-action detection.
- **Disabling security tooling** — turning off Defender for Cloud, deleting diagnostic settings → tampering signal.

### Layer 3 — Entra audit logs (`AuditLogs`) — works now, no P1 needed

Directory _changes_ ingest on any license tier (unlike sign-in logs). This is where your AzureHound work pays off.

- **Directory enumeration (AzureHound)** → generates a burst of directory reads. Run AzureHound against your tenant, then hunt the footprint.
- **New user / app registration / service principal creation** → `AuditLogs`. Attacker-persistence in the cloud.
- **Credential added to an app or service principal** → a top real-world attack path; very worth a detection.
- **Role assignment / adding a user to a privileged role** → privilege escalation.
- **Illicit OAuth consent grant** → consent-phishing signal.

### Layer 4 — Entra sign-in (`SigninLogs`) — needs P1/P2

These are the _cloud identity_ attacks, and they're the ones blocked by your licensing wall until you add a P1/P2 trial:

- **Password spray / brute force** against Entra sign-in.
- **Impossible travel** — successful sign-ins from geographically distant locations.
- **Sign-in from anonymizer/Tor/VPN**, or from a new country.
- **MFA fatigue / repeated MFA prompts.**

All have polished built-in templates — but none will produce data without the license. If cloud-identity detection is a priority, grab the P2 trial; otherwise Layers 1–3 give you plenty.

---

### Suggested build order

1. **`4625`/`4624` brute force** (Layer 1) — you already have the pipeline; RDP-spray the VM from Kali. Wire it to the notify-only playbook, then the disable/isolate action. This gets your first full detect → incident → playbook loop working.
2. **NSG-rule-change** (Layer 2) — flip an NSG rule with `az` and watch `AzureActivity`. Add a playbook that auto-reverts it — a great, safe automated-remediation exercise.
3. **AzureHound enumeration** (Layer 3) — run it, then hunt the `AuditLogs` footprint.
4. **Add the P2 trial** and light up the sign-in detections (Layer 4) once the free layers are solid.

-------
## Attacks from Kali

### Metasploit — mostly Layer 1 (host/VM events)

Metasploit is host-and-network exploitation, so nearly everything it drives lands in `SecurityEvent` and Defender:

- **RDP/SMB/SSH brute force** → its login/auxiliary modules (`auxiliary/scanner/smb/smb_login`, `ssh_login`, etc.) generate the `4625` failed-logon bursts. This is the clean first exercise.
- **Successful login after failures** → a successful `smb_login` or a `psexec`-style module gives the `4625`→`4624` pattern.
- **Suspicious process creation** (`4688` / Defender) → any payload or post-exploitation module that spawns processes.
- **Credential dumping / LSASS access** → Meterpreter's `kiwi`/hashdump features, caught by Defender.
- **Persistence** (`4697`/`4698`) → Metasploit persistence modules that add a service or scheduled task.
- **New account / add to admins** (`4720`/`4732`) → post-exploitation commands run through a session.
- Its `db_nmap` recon also produces the **port-scan** network signal your firewall VM sees.

It can also touch **Layer 2 (`AzureActivity`)** if you use cloud-specific modules against Azure APIs, but that's a niche use — think of Metasploit as your Layer 1 engine.

### BloodHound — Layer 3 (Entra audit logs), and Layer 1 only via its collector

BloodHound itself doesn't _attack_ anything — it maps privilege relationships. The detectable signal comes from its **collectors** running:

- **AzureHound → Layer 3 (`AuditLogs`)** → its directory enumeration is the "directory enumeration" item on the list: a burst of directory reads against your Entra tenant, visible in audit logs on any license tier. This is the main BloodHound-related detection, and the one that fits your no-P1 setup.
- **SharpHound → Layer 1-ish** → if you build the AD domain, SharpHound's collection generates heavy LDAP query activity against the domain controller. That's detectable, but via **domain controller / LDAP telemetry** (Defender for Identity is the usual tool) rather than the plain `SecurityEvent` items on my list.

What BloodHound is _really_ for in your lab is the step **before and after** the attack, not the attack itself: it shows you which privilege-escalation and lateral-movement paths exist, so you know which of the Layer 1–3 detections are worth having — and after a Metasploit compromise, you can re-run it to see whether the foothold opened new paths.

### The rest of the matrix — neither tool

To be clear about what _isn't_ Metasploit or BloodHound:

- **Layer 4 sign-in attacks** (password spray, impossible travel) → these are cloud-identity attacks you'd drive with sign-in-focused tools or the simulation tooling, not Metasploit/BloodHound. (Still gated behind P1 anyway.)
- **Layer 2 `AzureActivity`** items (NSG rule change, Run Command abuse, resource deletion) → you'd simulate these with the **`az` CLI / PowerShell**, not these two tools.
- **Illicit OAuth consent, credential-on-app** (Layer 3) → separate identity-attack tooling, not BloodHound.
