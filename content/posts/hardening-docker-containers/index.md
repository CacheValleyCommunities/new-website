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

The goal is not to hand you a list of flags to copy. It is to explain what a container actually is, so that each hardening step makes sense as a consequence of how the system works rather than as a rule you have to trust.

## What It Covers

**What a Container Actually Is.** Not a small virtual machine—just one or more normal processes running on the host's own kernel, with the kernel limiting what they can see (namespaces), how much they can use (cgroups), and what they are allowed to do (capabilities). The handout also covers images, layers, and the Docker daemon, since the build sections depend on them.

**1. Start from a Safe Image.** Small bases and what distroless removes, pinning both the tag and the `sha256` digest, and scanning with `docker scout` or Trivy before you trust an image.

**2. Add Your Code Without Leaking Anything.** Why `COPY . .` ships your `.git` directory and `.env` file, what a `.dockerignore` is for, why deleting a secret in a later layer does not remove it, and a multi-stage build that runs as a non-root user. Build-time secrets go through BuildKit's `--mount=type=secret`, never `ARG` or `ENV`.

**3. Run with the Fewest Privileges That Still Work.** `--user`, `--cap-drop ALL`, `--security-opt=no-new-privileges`, `--read-only` with a `tmpfs`, and memory, CPU, and PID limits—with the Docker Compose equivalents.

**4. Two Things to Never Do.** `--privileged`, and mounting `/var/run/docker.sock`. Both effectively hand out root on the host.

**5. Cut the Image Down to What It Uses.** Profiling an app with SlimToolkit to rebuild a minimal image and generate a seccomp profile, plus the dynamic-analysis caveat: a code path you did not exercise can be stripped out and then fail later.

The handout closes with a checklist, a cheat sheet, a glossary of every term it uses, and pointers to further reading.

## Checklist for Your Own Images
- Small base, tag and digest pinned, scanned before use
- A `.dockerignore` file present, no `COPY . .`, a multi-stage build, and a non-root user
- Run with `--cap-drop ALL`, `--security-opt=no-new-privileges`, `--read-only` plus `--tmpfs`, and memory, CPU, and PID limits
- No `--privileged`, and no mounted `docker.sock`
- Image reduced with slim (SlimToolkit) or a distroless base, with a seccomp profile applied

## View the full workshop materials
<embed src="hardening-docker-containers-workshop.pdf" type="application/pdf" width="100%" height="700" />

[Download the workshop handout (PDF)](hardening-docker-containers-workshop.pdf)
