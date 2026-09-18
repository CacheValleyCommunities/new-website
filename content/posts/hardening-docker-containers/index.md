---
title: Hardening Docker Containers Workshop
description: Learn what a container actually is, then harden one end to end—safe base images, clean builds, least-privilege runtime flags, and image slimming.
date: 2026-09-18 00:00:00+0000
image: container-ship-unsplash.jpg
summary: "A self-paced, hands-on workshop on container security. Learn why a container is not a virtual machine, then work through pinning and scanning base images, building without leaking secrets, running with least privilege, and slimming images down to what they actually use."
categories:
  - Communities
  - Workshops
tags:
  - Security
  - Docker
  - Containers
  - DevOps
  - Linux
  - Open Source
weight: 10
---

## Overview
This **do-it-yourself workshop** walks through hardening a containerized application from the base image all the way to the flags you pass at `docker run`. Work through the material **on your own schedule**—no fixed time or place. (When we run a physical session, it will be announced separately.)

The handout is written for a mixed room. If you have never started a container, read it straight through; every term is defined as it comes up, and there is a glossary at the end. If you use Docker daily, skim the definitions and go to the commands.

> **The goal is not a list of flags to copy.** Each hardening step is explained as a consequence of how containers actually work, so you can reason about the cases the handout does not cover.

## The Idea Everything Else Follows From
A container is **not** a small virtual machine. A virtual machine boots its own kernel on emulated hardware. A container is just one or more ordinary processes running on the **host's own kernel**, with the kernel limiting what those processes can see and use. There is no second kernel and no hardware emulation.

That limiting is done with three kernel features, and the whole workshop refers back to them:

- **Namespaces** control what a process can *see*—its own process numbering, filesystem view, network interfaces, and more.
- **Control groups (cgroups)** control how much a process can *use*—memory, CPU time, process IDs, I/O throughput.
- **Capabilities** control what a privileged process is *allowed to do*—Linux split root's powers into about forty separate permissions that can be dropped or added individually.

Because the kernel is shared with the host and with every other container on the machine, a process that escapes its namespaces or is simply handed too much privilege is acting on the same kernel your host runs on. Hence the job: narrow what a container can see, use, and do.

## What You'll Learn
- **Start from a safe image**
  - Choose a small base, understand what slim and distroless actually remove, pin both the tag and the `sha256` digest, and scan with `docker scout` or `trivy` before you trust it.
- **Add your code without leaking anything**
  - Why `COPY . .` ships your `.git` history and `.env` file, why a `.dockerignore` is the most forgotten control in Docker, and why deleting a secret in a later layer does not remove it.
  - Multi-stage builds, a non-root `USER`, and BuildKit's `--mount=type=secret` for build-time credentials.
- **Run with the fewest privileges that still work**
  - `--user`, `--cap-drop=ALL`, `no-new-privileges`, `--read-only` with a `tmpfs`, and memory, CPU, and PID limits—plus the Docker Compose equivalents.
- **Two things to never do**
  - `--privileged`, and mounting `/var/run/docker.sock`. Both effectively hand out root on the host.
- **Cut the image down to what it uses**
  - Profile a running app with SlimToolkit, rebuild a minimal image, generate a seccomp profile—and understand the dynamic-analysis failure mode that can strip code paths you did not exercise.

## Who Is It For?
- **Beginners** who have run `docker run` and want to know what actually happened
- **Developers** shipping containers who want a defensible default configuration
- **Ops and platform folks** reviewing Dockerfiles, Compose files, or CI pipelines

## Prerequisites
- **Computer:** macOS, Linux, or Windows with **WSL**. Docker Desktop or Docker Engine installed.
- **Tools:**
  - `docker` (with BuildKit, which is the default in current versions)
  - A scanner: `docker scout` ships with Docker Desktop; otherwise install **Trivy**
  - Optional: **SlimToolkit** (`slim`) for the image-slimming section, and `syft` or `cosign` if you want to explore SBOMs and signing
- **A throwaway machine:** section 4 demonstrates a container breakout. Run it on a VM you do not care about, never on a workstation or server that matters.

The handout starts with a short list of slow pulls to kick off before you begin:

```bash
docker version && docker run --rm hello-world
docker pull python:3.12-slim
```

> **No app of your own?** The workshop includes a sample: a small Flask service that returns `{"status":"ok"}`, with a single dependency. Everything can be followed with just that.

## Workshop Tracks

### Track A — Harden the image (recommended starting point)
1. Compare `python:3.12` against `python:3.12-slim`, then **pin a digest** and scan both.
2. Add a `.dockerignore`, replace `COPY . .` with explicit copies, and order instructions so dependency installs stay cached.
3. Convert the Dockerfile to a **multi-stage build** that ships only a finished virtual environment, running as `USER 10001`.
4. Confirm it worked: `docker run --rm myapp:2.0 id` should no longer report `uid=0`.

**Estimated time:** 60–90 minutes

### Track B — Harden the runtime and shrink the image
1. Apply the least-privilege `docker run` line: drop all capabilities, set `no-new-privileges`, mount the filesystem read-only with a `tmpfs` for `/tmp`, and cap memory, CPU, and PIDs.
2. Translate the same controls into Docker Compose keys for a service you already run.
3. On a throwaway VM, see why a mounted `docker.sock` is equivalent to handing out the root password—then look at Kaniko, rootless BuildKit, and Sysbox as the correct answers for building images inside CI.
4. Profile the app with `slim build --http-probe`, run the slimmed image, apply the generated **seccomp** profile, and re-scan to see the vulnerability count drop.

**Estimated time:** 60–90 minutes

## The Short Version
If you take nothing else away, the handout's checklist is:

- Small base, tag **and** digest pinned, scanned before use
- A `.dockerignore` present, no `COPY . .`, a multi-stage build, and a non-root user
- Run with `--cap-drop=ALL`, `no-new-privileges`, `--read-only` plus `--tmpfs`, and memory, CPU, and PID limits
- No `--privileged`, and no mounted `docker.sock`
- Image reduced with SlimToolkit or a distroless base, with a seccomp profile applied

## View the full workshop materials
<embed src="hardening-docker-containers-workshop.pdf" type="application/pdf" width="100%" height="700" />

[Download the workshop handout (PDF)](hardening-docker-containers-workshop.pdf)

The handout also includes a one-page cheat sheet, a glossary of every term it uses, and pointers to the CIS Docker Benchmark, Docker Bench for Security, and the OWASP Docker Security Cheat Sheet for going deeper.

## Community & Help

* Post questions and share results in our community channels.
* If we schedule an **optional in-person lab**, we'll announce it separately—this post intentionally **does not advertise a time or location**.
