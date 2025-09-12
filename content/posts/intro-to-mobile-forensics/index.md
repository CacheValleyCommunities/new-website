---
title: DIY Mobile Verification Toolkit (MVT) Workshop
description: Learn how to acquire, decrypt, and analyze iOS/Android data using Amnesty’s open-source Mobile Verification Toolkit—at your own pace.
date: 2025-09-10 00:00:00+0000
image: https://images.unsplash.com/photo-1630568002650-3ee79302fda5?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
summary: "A self-paced, hands-on workshop on using the Mobile Verification Toolkit (MVT) for ethical mobile forensics. Complete it anytime. Occasional in-person sessions may be offered separately."
categories:
  - Communities
  - Workshops
tags:
  - Security
  - Mobile Forensics
  - Privacy
  - MVT
  - iOS
  - Android
  - Open Source
weight: 10
---

## Overview
This **do-it-yourself workshop** teaches you how to use **MVT (Mobile Verification Toolkit)** to collect and analyze mobile data in a way that respects consent and privacy. Work through the material **on your own schedule**—no fixed time or place. (When we run a physical session, it will be announced separately.)

> **Ethics first:** Only analyze devices and data you own or have explicit, informed consent to examine.

## What You’ll Learn
- **Acquisition basics**
  - iOS: create an encrypted backup and (optionally) work with a full filesystem image.
  - Android: understand ADB collection vs. backup limitations.
- **Decryption & preparation**
  - Decrypt iOS backups; organize evidence safely.
- **IOC-based triage with MVT**
  - Run `mvt-ios check-backup` / `check-fs` and `mvt-android check-adb` where applicable.
- **Interpreting results**
  - Read JSON outputs, understand detections vs. false positives, and document findings.

## Who Is It For?
- **Beginners** curious about practical, ethical mobile forensics  
- **Developers/analysts** interested in security triage and artifact parsing  
- **Civic-tech/NGO folks** building skills for high-risk contexts

## Prerequisites
- **Computer:** macOS or Linux recommended. Windows users should use **WSL** for best results.  
- **Tools:**  
  - Python 3, `pipx`, and `sqlite3`  
  - For iOS backups: libimobiledevice (macOS/Linux)  
  - Optional: `libusb` (helps with some USB/Android workflows)
- **Consent & storage:** You’ll handle sensitive data—use an encrypted disk and keep notes.

> **No device handy?** Use public, **legal practice datasets** (e.g., Digital Corpora, NIST CFReDS, DFRWS) to follow along with the exercises.

## Workshop Tracks

### Track A — iOS (recommended starting point)
1. Create an **encrypted iTunes/Finder backup** (or use a practice backup image).  
2. Decrypt and prepare the backup for analysis.  
3. Run **MVT** modules against the backup or a mounted filesystem.  
4. Review artifacts (e.g., Safari history/state, system logs) and summarize findings.

**Estimated time:** 90–120 minutes

### Track B — Android (triage focus)
1. Understand **backup limitations** on modern Android.  
2. If possible, use **ADB** collection for richer data; otherwise use a sample dataset.  
3. Run MVT where applicable and supplement with ALEAPP for broader artifact coverage.  
4. Write up observations and caveats.

**Estimated time:** 60–90 minutes

## View the full workshop materials
<embed src="intro-to-mobile-forensics-workshop.pdf" type="application/pdf" width="100%" height="700" />

[Download the workshop handout (PDF)](intro-to-mobile-forensics-workshop.pdf)

## Community & Help

* Post questions and share results in our community channels.
* If we schedule an **optional in-person lab**, we’ll announce it separately—this post intentionally **does not advertise a time or location**.

Happy (ethical) hunting!

```
::contentReference[oaicite:0]{index=0}
```
