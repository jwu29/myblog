## Introduction

![Full-System](./images/Moto-074-copy.jpg)

Hello everyone! This is Part 1 of a series of articles documenting my Private Cloud home lab, which will be divied into different parts.

1. _YOU ARE HERE!_ Hardware Equipment Setup; Proxmox Server Installation
2. Creating NextcloudPi LXC Container
3. Setting up Docker hosting Nextcloud
4. Access Control using Tailscale VPN
5. On-Premise and AWS Storage Backup

In this home lab project, I have built a private cloud hosted on a Docker LXC Container in Proxmox OS. This private cloud can only connected using a VPN, with additional access controls so that only my personal devices have access. The storage in the private cloud has multiple backups, one on a SSD flash drive mounted on a Proxmox Server, and another on the public cloud (AWS S3).

## Gathering the Equipment

First, we need to assemble all the hardware and equipment needed for our private cloud. The below table shows information for all equipment used for the home lab.

| Computers   | Operating System | Storage | RAM  | Note                                                                                             |
| ----------- | ---------------- | ------- | ---- | ------------------------------------------------------------------------------------------------ |
| Mini PC     | Windows 11       | 256GB   | 16GB | Main server to host the private cloud. To be converted to Proxmox OS.                            |
| Macbook Air | Linux Ubuntu     | 256GB   | 8GB  | My old personal laptop that I no longer use. Used as the management device for the cloud server. |

| Hardware                   | Note                                                                  |
| -------------------------- | --------------------------------------------------------------------- |
| Network Switch (Unmanaged) | Provides internet connection to all devices via Ethernet              |
| SSD Hard Drive             | On-premise backup for the private cloud                               |
| Empty USB Flash Drive      | Used as booting device for the Mini PC for installation of Proxmox OS |
| 32-inch Computer Monitor   | Used as a second monitor for the Macbook Air                          |
| iPad                       | Used as the monitor for Mini PC                                       |

## Physical Setup

![Mini PC](./images/Moto-001.jpg)

The Mini PC used as the main server is an HP EliteDesk, a compact small form factor desktop. On its front panel you can see several USB-A ports, a USB-C port, a headphone jack, and a power button — all useful for connecting peripherals during setup.

![Network Switch](./images/Moto-008.jpg)

The unmanaged network switch is a TP-Link model, positioned next to the Lenovo router. Multiple blue Ethernet cables are plugged into the switch, providing wired internet connections to the Mini PC and other devices in the lab.

![Back of Mini PC](./images/Moto-003.jpg)

The back panel of the HP EliteDesk reveals its full set of rear ports: a power connector, multiple USB-A ports, DisplayPort outputs, and an Ethernet port. A blue Ethernet cable is already plugged into the Ethernet port, connecting the server to the TP-Link network switch.

![Front of Mini PC](./images/Moto-056.jpg)

The Samsung SSD hard drive is connected directly into one of the USB ports at the bottom of the Mini PC. This SSD serves as the on-premise backup storage for the private cloud.

## Changing Boot Configuration

Before installing Proxmox, we need to configure the Mini PC to boot from a USB flash drive. The flash drive has been pre-loaded with the Proxmox VE installer using Balena Etcher on a separate computer.

![Flash USB Connection](./images/Moto-007.jpg)

The bootable USB flash drive (glowing blue) is plugged into the front USB port of the HP EliteDesk. We then power on the machine and immediately press Esc to interrupt the normal boot and access the HP Startup Menu.

![HP Setup Menu](./images/Moto-011.jpg)

Pressing Esc during startup brings up the HP Startup Menu. From here we can access System Information, System Diagnostics, Boot Menu, and BIOS Setup among other options. We need to enter BIOS Setup to modify the secure boot settings so the machine will accept our unsigned Proxmox installer.

![HP Setup Menu Options](./images/Moto-016.jpg)

Inside HP Computer Setup, navigate to the "Advanced" tab. Here you can see options including "Boot Options", "HP Sure Recover", and "Secure Boot Configuration" (highlighted). Click on Secure Boot Configuration to proceed.

![Boot Configuration](./images/Moto-017.jpg)

In the Secure Boot Configuration screen, change the Configure Legacy Support and Secure Boot setting to "Legacy Support Enable and Secure Boot Disable". This is required because the Proxmox installer is not signed for Secure Boot and will be rejected otherwise.

![Boot Changes Save](./images/Moto-018.jpg)

After making the change, we need to save the new boot configuration and restart.

![Boot Confirm Screen](./images/Moto-019.jpg)

HP requires an extra authorisation step when modifying secure boot settings. A screen appears with the message: _"A request has been made to change this system's secure boot configuration... Please type in and enter the below number for authorization."_ Here, we just simple type out the code.

![HP Startup Screen](./images/Moto-021.jpg)

The machine reboots and displays the HP logo with **"Protected by HP Sure Start"** and **"Diagnosing your PC"** — this is normal after a BIOS configuration change. The PC will continue booting into Windows shortly.

![Choose an Option screen](./images/Moto-028.jpg)

Once Windows starts, I pressed Shift and clicked Restart to reach the Windows recovery environment. On the Choose an option" screen, select "Use a device" to boot from an external device (our USB flash drive with Proxmox).

![Use a Device screen](./images/Moto-029.jpg)

The "Use a device" screen shows all available boot targets. Select USB SanDisk 3.2Gen1 (our Proxmox installer USB drive) to reboot from it.

## Proxomox Installation

![Proxmox Install Screen](./images/Moto-032.jpg)

![Proxmox Loading Screen](./images/Moto-040.jpg)

The Proxmox VE Installer loads and displays an information screen about the Virtualization Platform while it works in the background. It highlights two key features: **Container Virtualization** (only 1–3% performance overhead compared to a standalone server) and **Full Virtualization (KVM)** for running unmodified Linux or Windows virtual machines. A progress bar at the bottom tracks the current step — here it is at 2% creating partitions.

![Proxmox CLI](./images/Moto-041.jpg)

After the installation completes and the machine reboots, the Proxmox CLI screen appears. The server is now running and ready to be accessed through a web browser on the local network.

## Using iPad as monitor for Proxmox

Since the HP EliteDesk does not have a built-in display, and it would be a waste to use the large computer monitor for the CLI, I decided to use an iPad as a portable monitor for the Mini PC. The large computer monitor can then be used by the Macbook Air as a second screen for the Proxmox GUI.

![USB-C VideoCard](./images/Moto-055.jpg)

A USB-C to USB-C cable connects the iPad to the Mini PC. This allows the iPad to function as an external display using a display adapter, letting me view the Proxmox CLI output directly on the iPad screen.

![Proxmox CLI On iPad](./images/Moto-051.jpg)

The iPad successfully displays the Proxmox terminal output — showing boot messages and system information — just as it would appear on a standard monitor. This is a convenient way to interact with the server locally without needing dedicated display hardware.

## GUI Login

Once the server is up and running, the Proxmox web interface is accessible from any device on the same local network by navigating to the displayed IP and port on the GUI in a browser.

![Proxmox GUI Login](./images/Moto-042.jpg)

The Proxmox VE Login dialog appears in the browser. Here, I have entered the root credentials set during the installation stage.

![Proxmox GUI Home](./images/Moto-044.jpg)

After logging in, the Proxmox Virtual Environment dashboard loads. The left panel shows the datacenter tree with the node `jwu29` (the HP EliteDesk server). The main view shows the datacenter summary — the node is running with 6.1% disk usage, 10.2% memory usage, and 0.5% CPU usage, with an uptime of just over 2 minutes. The storage entries show `local` and `local-lvm` are available. The task log at the bottom confirms a successful initial startup.

## Conclusion

In this first part of the home lab series, we successfully transformed an HP EliteDesk Mini PC from a standard Windows 11 machine into a fully operational Proxmox VE hypervisor.

The key achievements from this setup are:

- Assembled all the necessary hardware, including the HP EliteDesk Mini PC, a TP-Link network switch, a Samsung SSD for on-premise backups, and a bootable USB flash drive loaded with the Proxmox VE installer.
- Reconfigured the HP BIOS to disable Secure Boot and enable legacy boot support, allowing the machine to boot from an unsigned installer.
- Successfully installed Proxmox VE on the Mini PC, replacing Windows 11 with a bare-metal hypervisor.
- Confirmed the Proxmox server is accessible from the local network via its private IP address, with healthy resource usage at idle.
- Repurposed an iPad as a portable monitor for the Proxmox Server, reserving the monitor for the Proxmox Server Management Console in the Macbook Air.

With the Proxmox server up and running, the foundation of the private cloud is in place. In Part 2, we will create an LXC container inside Proxmox and install NextcloudPi to begin building the actual cloud storage service. See you in the next part!

---
