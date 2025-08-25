---
title: "Switching Hyper-V On and Off Using Boot Options"
summary: "A method to switch Hyper-V Services on and off by setting up multiple boot options and a script to select them, allowing other hypervisors (e.g. Virtualbox) to run with a simple reboot."
slug: "switching-hyper-v-on-and-off-using-boot-options"
type: "post"
date: 2019-09-26T09:32:15-04:00
lastmod: 2025-08-25T17:00:00-04:00
draft: false
authors: ["djsweeney"]
aliases:
    - /2019/09/switching-hyper-v-on-and-off-using-boot-options/
    - /posts/tech/switching-hyper-v-on-and-off-using-boot-options/
categories: ["Technology"]
tags: ["windows 10","hyper-v","virtualbox","virtualization","vmware","hypervisors","development","powershell","scripts"]
---

This document provides instructions for setting up your Windows 10 environment to allow easy switching between hypervisors **without** needing to install/uninstall Hyper-V support. You will still need to reboot to make the switch, but a reboot is **all** you'll need to do since we won't be adding/removing any software.

{{< toc >}}

## Update (2025-08-25)

The scripts and procedures below will generally **NOT** work reliably with Windows 11. Many built-in security features in Windows 11 utilize virtualization services independent of whether the `hypervisor` is enabled at boot time. It *IS* possible to disable all these new features, but the potential headaches **that** path creates is not something I intend to repeat.

Since this document was created six years ago, both `VirtualBox` and `VMWare` are much better at coexisting with `Hyper-V` features enabled, though there is still a performance hit.

## Overview

{{< notice warning >}}
The instructions in this document were written and tested **only** on Windows&nbsp;10&nbsp;Pro!

Hyper-V is **not** supported on Windows&nbsp;10&nbsp;Home.

Windows 10 Enterprise enables additional features that may create additional issues (see [Blue Screen of Death (BSOD) when starting any VM (No HyperV) on Windows 10 Host](https://forums.virtualbox.org/viewtopic.php?f=6&t=86476) forum topic). The method described in this document **may** work with Windows 10 Enterprise, but I don't have access to this version and therefore cannot test it.
{{< /notice >}}

### Standard method for running multiple hypervisors

Windows 10 Pro provides the Hyper-V service for running virtual machines. This is great so long as you don't also need to run alternative hypervisors (e.g. Virtualbox or VMWare) -- you cannot run alternative hypervisors when the Windows Hyper-V Service is running. If you want to be able to use both Hyper-V and Virtualbox (or VMWare) on the same machine, you can only run the alternative hypervisors after turning off the Hyper-V Service.

The standard answer to this issue you will often find on the web is that you need to add or remove the Hyper-V Service using Powershell and then reboot:

**Enable Hyper-V**

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V –All
```

**Disable Hyper-V**

```powershell
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

This works, but it is literally removing all Hyper-V support, which takes a bit of time (since Windows has to uninstall software) and takes extra time on reboot (since it has to finish the software changes as part of the reboot).

There **is** an alternative!

### A faster, more convenient way to switch between hypervisors

This document provides instructions for setting up your Windows 10 environment to allow easy switching between hypervisors **without** needing to install/uninstall Hyper-V support. You will still need to reboot to make the switch, but a reboot is **all** you'll need to do since we won't be adding/removing any software.

The method uses a boot option (configured using BCDEDIT) named 'hypervisorlaunchtype' that can be used to enable/disable the Hyper-V service **without** requiring you to completely uninstall Hyper-V -- it just tells Windows whether to use the Hyper-V service for a particular boot entry.

When 'hypervisorlaunchtype' is set to 'Auto' for a specific boot entry, then the Hyper-V service is enabled for that boot session and alternative hypervisors **cannot** run. When 'hypervisorlaunchtype' is set to 'Off' for a specific boot entry, then the Hyper-V service is disabled for that boot session and you can run Virtualbox (or any other alternative hypervisor).

As noted, you still need to reboot to select which boot session to use (Hyper-V on or off), but that's **all** you have to do -- there's no install/uninstall of software to slow down the reboot process.

Here's how to set this up...

{{< notice disclaimer disclaimer >}}
**READ THIS FIRST:**
I have tested the following procedures and script(s) on several of my computers without any problems. However, since I cannot predict every possible scenario, **you use these instructions and script(s) at your own risk** -- I assume **no** responsibility for any problems you may encounter even if you follow the instructions exactly!

**Read this document carefully** -- you are modifying settings that control your boot process!<br>**If you mess something up, you may not be able to boot at all!**
{{< /notice >}}

## Assumptions before you start

1. You have turned on Hyper-V support in `Turn Windows Features on or off`<br>(see [Install Hyper-V on Windows 10](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v))
2. You are comfortable editing your boot configuration
3. **You have a recent backup just in case this breaks something!**

{{< notice important >}}
The modifications you make using BCDEDIT may be lost/reverted after any Windows&nbsp;10 Feature&nbsp;Upgrade (e.g. upgrading from Windows&nbsp;10&nbsp;1809 to 1903). It appears that the Feature Upgrades revert the Boot Configuration to "safe" settings, which seems to remove the 'hypervisorlaunchtype' = 'Off' setting if you've set it up below.

 If Hyper-V was already turned on before the Feature Upgrade, it will remain turned on after a Feature Upgrade, so you will **not** have to re-enable it in `Turn Windows Features On or Off`. But you **will** (probably) need to repeat steps 1-6 below to set up the Boot menus to set 'hypervisorlaunchtype'.
{{< /notice >}}

## Steps to modify boot configuration

### Step 1

Open an **administrative** Powershell (or CMD) console.

If you haven't done so already, create a folder to contain your BCDEDIT export(s):

```powershell
[C:\]$ mkdir C:\BCD.Backups
```

Export the current BCD config (just to be safe):

```powershell
[C:\]$ bcdedit /export "C:\BCD.Backups\bcdedit.backup.20190628T1051.Original.bcd"
The operation completed successfully.
```

{{< notice tip >}}
Use a unique path/filename for the export file. I use a date stamp
based on the ISO&nbsp;8601 standard  -- YYYYMMDD**T**hhmm. You can use any naming convention you like, assuming the export file is unique and you can identify it later if needed.
{{< /notice >}}

### Step 2

{{< notice remember >}}
This step assumes that you have installed Hyper-V (in Windows
Features -- see [Assumptions](#assumptions)) **and** that you have
booted/rebooted after turning on Hyper-V so it is currently running.
{{< /notice >}}

Check to make sure your current environment has Hyper-V enabled:

```powershell
[C:\]$ (Get-CimInstance Win32_ComputerSystem).HypervisorPresent
```

If the result is `True` then you can continue to the next step.

If the result is `False` then you need to make sure you've enabled Hyper-V (see [Assumptions](#assumptions) for a link to enabling Hyper-V)

### Step 3

Create a new Boot Menu entry based on "{current}" (your currently booted entry):

```powershell
[C:\]$ bcdedit /copy "{current}" /d "Windows 10 - NO Hyper-V"
The entry was successfully copied to {c3ef58d3-995d-11e9-b374-b73603a34c4a}.
```

> **IMPORTANT:** The GUID returned above will be unique -- this is just an example!

**Make a note of the GUID returned, since it will not be the same as the example above!**

### Step 4

Using the GUID returned from the previous step, update the new menu entry
to disable the Hyper-V service:

```powershell
[C:\]$ bcdedit /set "{c3ef58d3-995d-11e9-b374-b73603a34c4a}" hypervisorlaunchtype off
The operation completed successfully.
```

### Step 5 (Optional, but highly recommended)

You should change the description of the original (i.e. "{current}") entry
to be more consistent with the name of the new entry:

```powershell
[C:\]$ bcdedit /set "{current}" description "Windows 10 - Hyper-V ENABLED"
The operation completed successfully
```

### Step 6

Make a new backup (export) of the Boot Menu configuration:

```powershell
[C:\]$ bcdedit /export "C:\BCD.Backups\bcdedit.backup.20190628T1056.Primary.bcd"
The operation completed successfully.
```

{{< notice remember >}}Use a unique path/filename for the export file.{{< /notice >}}

### Prolog

Ideally, you should only have two boot entries containing the 'hypervisorlaunchtype' setting -- one set to 'Off' and one set to 'Auto'.

If you use the `reboot-hyperv.ps1` script (see below), it will only look for the first entries containing 'hypervisorlaunchtype' = 'Auto' or 'Off'. Any additional entries will be ignored.

## Powershell script

Assuming you have successfully followed the instructions in this document, the following Powershell script can be used to Enable/Disable the Hyper-V service on the next reboot. You can run this from a Powershell prompt or you can create shortcuts to run the script (one shortcut to Enable and one shortcut to Disable).

{{< notice important >}}You **must** run this script as an administrator.{{< /notice >}}

**Download** [reboot-hyperv.zip](/downloads/reboot-hyperv.zip) and unzip into a folder in your path.

### Usage

```powershell
NAME
    reboot-hyperv.ps1

SYNOPSIS
    Use BCDEDIT to select menu entry that enables or disables Hyper-V

SYNTAX
    reboot-hyperv.ps1 [[-Enable]] [-Pause] [-MessageBox]

    reboot-hyperv.ps1 [[-Disable]] [-Pause] [-MessageBox]

    reboot-hyperv.ps1 [[-Clear]] [-Pause] [-MessageBox]

DESCRIPTION
    Uses the 'BCDEDIT /bootsequence' command to select the boot menu option
    that enables (or disables) Hyper-V (via 'hypervisorlaunchtype' menu option).

PARAMETERS
    -Enable [<SwitchParameter>]
        Selects the boot menu that enables Hyper-V
        (i.e. first entry with 'hypervisorlaunchtype' set to 'Auto' or 'On')

    -Disable [<SwitchParameter>]
        Selects the boot menu that disables Hyper-V
        (i.e. first entry with 'hypervisorlaunchtype' set to 'Off')

    -Clear [<SwitchParameter>]
        Clears the BootSeqence (revert to default boot)

    -Pause [<SwitchParameter>]
        Pause the output (useful when running this script from a Shortcut)

    -MessageBox [<SwitchParameter>]

```
