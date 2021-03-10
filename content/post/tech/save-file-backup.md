---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Quick File Snapshots (Save File Backup Script)"
subtitle: ""
summary: "A Powershell script for saving backup snapshots of individual files into a subdirectory."
authors: ["djsweeney"]
slug: "quick-file-snapshots-save-file-backup-script"
tags: ["backup","snapshot","workflow","development","powershell","scripts"]
categories: ["Technology"]
date: 2020-02-27T12:44:36-05:00
lastmod: 2020-02-27T12:44:36-05:00
featured: false
draft: false
type: post
aliases: 
    - /posts/tech/save-file-backup/
    - /save-file-backup/

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

{{< toc >}}

## Introduction

When working on projects I'm often making revisions to documents that might require reverting to a previous version. As part of my workflow, before opening a file to make changes, I run a simple script to save a copy of the file (with the file's date/time appended to the filename) into a `_BAK` subfolder in the file's working folder. If I need to revert to the previous version, I can now just overwrite the working file with the backup copy and remove the timestamp from the filename. I can run this backup script from the command line or using the&nbsp;`Send to` context menu in Windows.

**Why not just use `git`?** I do use `git` for plain-text projects like development work. Using `git` with branching makes working on text-based files simple, and comparing changes and reverting to earlier versions is pretty simple (once you learn how to use `git`). I configure the `.gitignore` file to ignore the `_BAK` folders and primarily use `git` rather than the backup script, though I occasionally use the backup script for some files.

**I primarily use this backup script for non-text files and projects that aren't being tracked with `git`.**  For binary files (like Photoshop, Word, InDesign, etc) `git` is too cumbersome and not well-suited to quickly saving and restoring versions (at least compared to a quick copy/paste from the `_BAK` folder).

{{< notice disclaimer >}}
I have been using the scripts below for several years, working on various MS&nbsp;Office and Adobe files and projects. The scripts have worked very well for my workflow. All they do is copy the selected file into a new folder -- they make **no** changes to the original file!

However, your mileage may vary. I make no warranty or guarantee of any kind regarding the safety, usefulness and/or usability of these scripts in your environment. You use them **as-is** and **at your own risk.**
{{< /notice >}}

## Download an Installer

You can download an installer that will install the script files and set up the `Send to` menu for you. The installer will create a folder for the script files and add the folder to your system `PATH` so you can run the script from the command line. If you uninstall the scripts using the standard windows uninstall function, the uninstall will remove the script files and remove the folder from the system `PATH` automatically.

**Download:**  [ZMTC-SaveFileBackup_Installer](/downloads/ZMTC-SaveFileBackup-20.02.1_Installer.exe)

{{< notice note >}}
The installer is **not** signed, so Windows might warn you that this is an untrusted file or something similar. The installer was created using Inno Setup and should be safe to run.
{{< /notice >}}

The remaining sections below list the scripts and the instructions for manually setting up the `Send to` context menu.

## The Scripts

### Create a folder for the scripts

<!-- Create a temporary folder somewhere (e.g. inside your `Downloads` folder). -->

You will need to save the following two scripts into a folder on your drive. You can save them into an existing folder or create a new one. If you want to be able to use the script from the command line, you will need to make sure you save the files to a folder that is in your&nbsp;`PATH` environment variable.

### The "Save-File-Backup.ps1" Script

Copy the following `Powershell` code into a new file named&nbsp;`Save-File-Backup.ps1` and save the file into your folder.

```powershell
<#
.SYNOPSIS
Save backup copy of a file to a subdirectory
.DESCRIPTION
Makes a backup copy of the filename to a subdirectory named '_BAK'
The script uses the last modified date of the file and appends the
date to the backup file.
.PARAMETER Files 
The comma-separated list of file(s) to back up
.PARAMETER SnapShot 
Use the current date instead of the last modified date
.PARAMETER Pause
Pause the output (useful when running this script from SendTo)
Pause time based on number of files backed up -- 3 seconds per file
.PARAMETER Quiet 
Run quietly (no output to the screen)
.NOTES
Copyright 2020 ZMT Creative LLC
This Script is licensed under a
  Creative Commons Attribution-ShareAlike 4.0 International License. 
  To view a copy of this license, 
  visit http://creativecommons.org/licenses/by-sa/4.0/ or send a letter 
  to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
#>
param (
    [Parameter(Mandatory=$true,Position=1)]
    [String[]]$Files,
	[Alias("today","c","now","snap","currentdate")]
    [Switch]$SnapShot=$false,
	[Alias("p")]
    [Switch]$Pause=$false,
	[Alias("q")]
    [Switch]$Quiet=$false
)

function Pause-Host {
    param(
        $Delay = 1
    )
    $counter = 0;
    While(!$host.UI.RawUI.KeyAvailable -and ($counter++ -lt $Delay)) {
        [Threading.Thread]::Sleep(1000)
    }
}

function Backup-File ($Filename) {
    if (-not (Test-Path "$Filename")) {
        Throw "File not found: $Filename"
    }

    $thisFile = Get-ChildItem "$Filename"
    $origFilename = $thisFile.FullName
    $origFilePath = $thisFile.Directory
    $thisFileDate = $thisFile.LastWriteTime
    if ($SnapShot) {
        $FileISODate = Get-Date -Format "\S\N\A\P-yyyyMMddTHHmmss"
    }
    else {
        $FileISODate = $thisFileDate.toString("yyyyMMddTHHmmss")
    }

    if (-not (Test-Path "$($origFilePath)\$($BAKDIR)")) {
        New-Item "$($origFilePath)\$($BAKDIR)" -Type Directory
    }    

    $newFilename = "$($origFilePath)\$($BAKDIR)\$($thisFile.BaseName)-[$($FileISODate)]$($thisFile.Extension)"

    if (Test-Path -LiteralPath "$newFilename") {
        $NewFileExists = $true
    }
    else {
        $NewFileExists = $false
    }

    # If debug is set, output variables instead of running copy
    if ($DebugPreference -eq "Continue") { 
        Write-Debug "---------------"
        Write-Debug "   Original File: $origFilename"
        Write-Debug "    New Filename: $newFilename"
        Write-Debug " Already Exists?: $NewFileExists"
        Return
    }

    if (-not $NewFileExists) {
        Copy-Item "$origFilename" -Destination "$newFilename"
        if (-not $Quiet) {
            if (Test-Path -LiteralPath "$NewFilename") {
                Write-Host " BACKUP: $newFilename" -ForegroundColor "DarkGreen"
            } 
            else {
                Write-Host " FAILED: $origFilename NOT BACKED UP" -ForegroundColor "Red"
            }
        }
    }
    else {
        If (-not $Quiet) { Write-Warning "$Filename EXISTS in _BAK folder" }
    }
}

$BAKDIR="_BAK"

if ($DebugPreference -eq "Inquire") { 
    $DebugPreference="Continue"
    Write-Debug "PARAM:Files: $Filename"
    Write-Debug "PARAM:SnapShot: $SnapShot"
    Write-Debug "PARAM:Quiet: $Quiet"
}

$MyDelay = 3

foreach ($File in $Files) { 
    Backup-File($File)
    $MyDelay++
}

if ($Pause) { Pause-Host($MyDelay) }

```

### The "Save-File-Backup.cmd" Wrapper Script

As noted in the batch script below, this wrapper is needed for handling multiple files on the command line, especially when using the&nbsp;`Send to` context menu in Windows. The&nbsp;`Send to` menu sends multiple selected files to the script using standard CMD syntax (each file separated by a space), but&nbsp;`Powershell` wants comma-separated lists, so this wrapper attempts to convert the file list into the comma-separated format before calling the&nbsp;`Powershell` script to do the actual file&nbsp;copy.

Copy the following batch code into a new file named `Save-File-Backup.cmd` and save the file into your folder.

```
@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION
REM 
REM Wrapper script for Save-File-Backup Powershell script
REM IMPORTANT: This wrapper is needed for handling multiple files on the
REM            command line when using SendTo. SendTo sends multiple files
REM            using standard CMD syntax [each file separated by a space],
REM            but PowerShell wants Comma-Separated lists, so this wrapper
REM            converts to the comma-separated format and calls the
REM            Powershell script to do the actual Save-File-Backup.
REM 
REM Copyright 2020 ZMT Creative LLC
REM 
REM This work is licensed under the 
REM   Creative Commons Attribution-ShareAlike 4.0 International License. 
REM   To view a copy of this license, 
REM   visit http://creativecommons.org/licenses/by-sa/4.0/ or send a letter 
REM   to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
REM


SET PSScript=%~dpn0.ps1
IF '%1'=='-help' GOTO :SHOWHELP
IF '%1'=='--help' GOTO :SHOWHELP
IF '%1'=='-h' GOTO :SHOWHELP
IF '%1'=='-?' GOTO :SHOWHELP
SET args='%~1'
:MORE
shift
IF '%1'=='' GOTO :DONE
SET args=!args!,'%~1'
GOTO :MORE

:SHOWHELP
%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -Command "& get-help -Name '%PSScript%' -detailed"
EXIT /B 0

:DONE
%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -Command "& '%PSScript%' -Pause -Files !args!"
EXIT /B 0
```

## Add Shortcut to the "Send to" Context Menu

Now that you have created the two scripts, you will need to create a shortcut for the&nbsp;`Save-File-Backup.cmd` wrapper script and add the shortcut to the `Send to` menu.

### Create a Shortcut for the Wrapper Script

Create a shortcut for the&nbsp;`Save-File-Backup.cmd` wrapper script. In Windows File Explorer, locate the folder with the scripts. Right-click on the&nbsp;`Save-File-Backup.cmd` file and select&nbsp;`Create shortcut` from the menu. This will create a new file, likely named&nbsp;`Save-File-Backup.cmd - Shortcut` (or something similar). Rename this shortcut file to&nbsp;`_Save File Backup` (no extension and with an underscore as the first character).

{{< notice note >}}
The underscore at the beginning of the filename is optional, but will sort the file to the top of any context menu or other file listing. 
{{< /notice >}}

{{< notice info >}}
The shortcut can be named anything you want -- it just points to the `Save-File-Backup.cmd` wrapper script. However, if you rename the `Powershell` script or the wrapper script at a later date, you will need to recreate this shortcut.
{{< /notice >}}

### Copy the Shortcut to your "Send to" Folder

Right-click on the shortcut file (in this example, the `_Save File Backup` file you just created) and select `Copy`.

Press {{< kbd >}}&#x229E; Win{{< /kbd >}} + {{< kbd >}}R{{< /kbd >}} to open the `Run` dialog box, type `shell:sendto` and press the&nbsp;{{< kbd >}}Ok{{< /kbd >}}&nbsp;button. This will open your `Send to` folder in Windows File Explorer.

Right-click on the `Send to` window and select `Paste` from the menu to complete the copy. If all went well, the `_Save File Backup` should now appear under the `Send to` context menu when you right-click on any file.
