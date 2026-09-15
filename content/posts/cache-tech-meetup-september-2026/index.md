---
title: Cache Tech Community Meetup - September 2026
description: Intro to How LLMs Work - A Tour of the GPT-2 Architecture
date: 2026-09-15 00:00:00+0000
image: image_870x_67799e80a280c.jpg
summary: "Join us on **Saturday, September 26th, 2026** for **Intro to How LLMs Work**. We'll use GPT-2 as our map and answer the questions everyone nods along to: what is a token, what is a parameter, what are dimensions, and what actually happens inside a transformer. No machine learning background required!"

categories:
    - Communities
    - Events
tags:
    - Artificial Intelligence
    - Large Language Models
    - Transformers
    - GPT-2
    - Machine Learning
    - Community Event
    - Cache Tech Community
    - Tech
weight: 10
---

### Event Details:
- **Date**: Saturday, September 26th, 2026
- **Time**: 1:30 PM – 3:30 PM (MST)
- **Location**: Bridgerland Technical College, West Building, Room 1860, 1410 N 1000 W, Logan, UT 84321

## Event Overview

Everybody uses these models now. Far fewer of us could explain what's actually happening between typing a prompt and reading the response.

This month we're fixing that. **Intro to How LLMs Work** is a ground-up walkthrough of the machinery, using **GPT-2** as our map. GPT-2 is old enough that OpenAI published the weights and the architecture, and small enough to reason about in an afternoon — but it is the same fundamental design that modern frontier models scaled up. Learn it once and the newer stuff stops looking like magic.

We'll go slowly and define terms as we hit them. If you've ever been in a conversation where someone said "it's a 70B parameter model with a 128k context window" and you smiled and nodded, this is the meetup for you.

## What We'll Cover

**Tokens: what the model actually reads.** Models don't see letters or words — they see tokens. We'll look at GPT-2's byte-pair encoding and its 50,257-token vocabulary, watch familiar words split into unfamiliar pieces, and see why this explains a surprising amount of odd model behavior.

**Parameters: the numbers that get learned.** "124 million parameters" is a real, countable thing rather than a marketing figure. We'll cover where those numbers physically live inside the network, what training does to them, and why parameter count is a useful but incomplete way to size up a model.

**Dimensions and embeddings: turning text into geometry.** Every token becomes a vector — in GPT-2's smallest model, a list of 768 numbers. We'll talk about what those 768 dimensions represent, why "meaning as direction in space" is such a productive idea, and how that vector gets refined as it moves through the model.

**The transformer block: attention plus a feed-forward layer.** This is the heart of it. We'll build up one block — attention, which lets each token look at the tokens around it, and the feed-forward layer that processes the result — then stack twelve of them with twelve attention heads apiece to get GPT-2.

**One full forward pass.** We'll trace a short prompt end to end: text in, tokens, embeddings, twelve blocks, and out the other side as a probability distribution over what comes next. We'll also see where the 1,024-token context window comes from and why context limits exist at all.

## What You'll Take Away

A working mental model you can hang everything else on. You'll be able to read a model card without glazing over, follow along when people argue about architectures, and have a much better intuition for why these systems fail in the specific ways they do.

Bring your questions, including the ones that feel too basic to ask. Those are usually the best ones, and this session is built around answering them.

## Who Should Attend?

All skill levels are welcome, and no prior machine learning experience is assumed. This is aimed at:

- **Developers** who use AI tools daily and want to understand what's under the hood
- **Students and educators** looking for a concrete introduction to modern neural networks
- **Anyone curious about AI** who's tired of hand-wavy explanations
- **Folks with some ML background** who want to firm up the details of the transformer architecture

## Connect With Us

Join our [Discord community](https://discord.gg/MVwXMay8Qj) before the event to:
- Introduce yourself to other attendees
- Ask questions ahead of time so we can work them into the session
- Get event updates as soon as they're available
- Stay connected with the community after the meetup

We look forward to seeing you for an afternoon of learning, discussion, and community building at Bridgerland Technical College!

---

Bridgerland Technical College, West Building, Room 1860, 1410 N 1000 W, Logan, UT 84321

<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1052.2634352012012!2d-111.85486010495926!3d41.7582578833811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87548761d149ad99%3A0x8097136802931f7!2s1410%20N%201000%20W%2C%20Logan%2C%20UT%2084321!5e0!3m2!1sen!2sus!4v1741883188917!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
