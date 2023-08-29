---
draft: true
date: "2023-01-14"
title: "Software Security 101 Infographic"
description: ""
summary: "These sketches are a visual guide of some very basic concepts which are generally taught in Software Security 101 courses, like buffer overflows, heap exploitation and format string vulnerabilities."
---

These sketches are a visual guide of some very basic concepts which are generally taught in Software Security 101 courses, like buffer overflows, heap exploitation and format string vulnerabilities.

[Full Infographic](security-101.png).

## Intro: Security Terminology

Exploit? Bug? Attack Surface? What does that even mean?

{{< resizefig max-width=500px class=invertible src=infosec-terms.png >}}

## The Stack

{{< resizefig max-width=500px class=invertible src=stack-frames.png >}}

### Stack Smashing

// TODO: stack


### Format String Vulnerabilities

If we can inject some special characters in a format string in C, we can also magically leak _and modify_ previous data on the stack. Here's the magic formula:

{{< resizefig max-width=500px class=invertible src=format-strings.png >}}

## The Heap

// TODO: heap

### UAF

Use-after-free are a conceptually simple yet very sneaky type of bugs, that can be exploited.

{{< resizefig max-width=500px class=invertible src=use-after-free.png >}}


### Heap Overflow

Easy-peasy heap smashing for fun and profit.

 {{< resizefig max-width=500px class=invertible src=heap-overflow.png >}}

|     |     |
| --- | --- |
|  {{< resizefig max-width=300px class=invertible src=heap-metadata.png >}}     |  {{< resizefig max-width=250px class=invertible src=heap-exploitation-steps.png >}}   |




