---
title: Hardening Docker Containers Workshop
description: The workshop reference on container security—what a container actually is, and how to harden the image, the build, and the way you run it.
date: 2026-09-18 00:00:00+0000
image: container-ship-unsplash.jpg
summary: "The reference handout for our Docker hardening workshop. It explains what a container actually is—ordinary processes on the host's kernel, limited by namespaces, cgroups, and capabilities—and then works through safe base images, builds that don't leak secrets, least-privilege runtime flags, and cutting an image down to what it uses."
categories:
  - Communities
  - Workshops
tags:
  - Security
  - Docker
  - Containers
  - Linux
  - Open Source
weight: 10
---

## Overview
This is the reference for the workshop and for the discussion afterward. It is written for a mixed room: if you have never run a container, read it straight through, since the terms are defined as they come up and there is a glossary at the end. If you use Docker every day, skim the definitions and go to the commands.

The goal is not to hand you a list of flags to copy. It is to explain what a container actually is—not a small virtual machine, but ordinary processes running on the host's own kernel, limited by namespaces, cgroups, and capabilities—so that each hardening step makes sense as a consequence of how the system works.

From there it works through starting from a safe base image, adding your code without leaking anything, running with the fewest privileges that still work, two things to never do (`--privileged` and mounting `/var/run/docker.sock`), and cutting an image down to what it actually uses. It closes with a checklist, a cheat sheet, and a glossary.

## View the full workshop materials
<embed src="hardening-docker-containers-workshop.pdf" type="application/pdf" width="100%" height="700" />

[Download the workshop handout (PDF)](hardening-docker-containers-workshop.pdf)
