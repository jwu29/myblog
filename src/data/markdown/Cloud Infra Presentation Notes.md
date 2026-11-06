## 1. Add and configure an ESXi host to vCentre: Create a new ESXi host with the IP address 172.20.20.55, add it to vCenter, and migrate a virtual machine from 172.20.20.51 or 172.20.20.52 to the new host.

Duplicate ESXi 2 and open on VMWare.

Login password: VMware1!
Configure static IP to be 192.168.10.14 (Management Network).

Remove Local Datastore at 192.168.10.14.
**Remove old ESXi host in order to add the duplicate ESXi host.

Open VCenter on Web Portal.
### VCSA Login
root
### VSphere Login
administrator@vsphere.local
VMware1!

Right Click on the Cluster 'SmartV-Cluster' > Add Hosts

IP: 192.168.10.14
Username: root
Password: VMware1!

Right Click on the VM > Migrate > "Change compute resource only" > choose the host.

## 2. **Create a local datastore:** Create a local datastore on an ESXi host. Hint: Add a new virtual disk on the host and create the datastore on that disk.

Navigate to ESXi Host
Left bar, click on Storage
Click "New Datastore"
Create new VMFS Store
Provide Name
Select full disk.
Click finish to create.

## 3. **Configure network access:** Connect an ESXi host to VMnet8 and access its management interface through a web browser.

VMWare > Edit network settings.

## 4. **Create and migrate virtual machines:** Create a virtual machine using the ISO file and migrate it to another host. Create a virtual machine using the OVF file and migrate it to another host. Then power on the virtual machine on the new host.

### Create VM by importing ISO file
- Creation Type: Create a new virtual machine
- Select host
- Select the shared network storage
- Change Guest OS to Linux, Version: Ubuntu Linux 64-bit
- Customise Hardware 
	- New Network : VM Network
	- Memory: 256 MB
	- Harddisk: 1 GB
	- New CD/DVD Drive: Datastore ISO File. Tick "Connected"
		=> SmartV-Shared > TinyCore-current.iso 
	- 

Load the VM to test it is working.

Migrate to another host.

### Create VM by importing OVF file
Right Click Host > Deploy OVF Template
- Upload all the files from the OVF folder in VMWare directory
- Select shared storage
- Select VM Network
- Finish

Migrate to another host.

## **5. High Availability (HA):** Simulate an ESXi host failure and verify whether its virtual machines are automatically restarted on another ESXi host.

On Cluster > Configure Tab > Services > vSphere Availability > Configure 'Proactive HA' to Automatic

Open test-vm2

ping 192.168.10.192 from computer indefinitely

Shut down ESXi 3

**Common problem: limited space. Delete VMs if necessary.
Refresh

## 6. **Create a port group:** Create and configure a new port group, connect virtual machines to it, and test network connectivity between the virtual machines.

Click on a host > Netowrks > Configure Tab > Networking > Vitrtual Services > Add networking...

Virtual Machine Port for a standard switch
Select existing standard switch > vmnet0
Name new port group 'test group', VLAN id 0.

Right click VM > Edit Settings > Network Adapter 1 > Browse...
select 'test group'.

Restart VM and use ifconfig to check the network address.

Command to reset network: sudo udhcpc -i eth0

## 7. **Clone a virtual machine.**

See before.
## 8. **Configure a resource pool:** Create a resource pool, assign CPU and memory limits or reservations, and move a virtual machine into the resource pool.

Right Click Cluster > New Resource Pool...

CPU Reservation 1024 MHz
Limit 1024 MHz

Memory 100 MB
Limit 500 MB

Drag a VM into the resource pool.

## Security Node

Change VM Network of vm to 'Security Zone'.

From inside the VM, ping 8.8.8.8 => should be successful
ping another host, 192.168.10.11 => should be unsuccessful