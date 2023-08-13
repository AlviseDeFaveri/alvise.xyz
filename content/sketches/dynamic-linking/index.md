---
draft: false
date: "2023-01-14"
title: "Notes on Dynamic Linking"
description: ""
---

What happens when your code calls `printf()`? And what's up with all that`.got.plt` nonsense you see when decompiling a binary? Here are some sketches to visualize it.

[Full Infographic](dynamic-linking.png).
<!--These sketches are mainly inspired by [How the ELF ruined the Christmas](https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-di-frederico.pdf). -->

### Intro: Static vs Dynamic Linking

First of all, we need to understand the difference between a **statically linked** binary and a dynamically linked one:

- A statically linked binary contains all the program's code _and the library code_ already linked together in a single binary blob.
- In many cases, we don't really want to compile the whole libc with each of our binary. In order to be _dynamically linked_, the binary contains only the user code, together with some _relocation information_ that are used at runtime to resolve the location of library functions.

{{< resizefig max-width=600px class=invertible src=linking.png >}}

### The Dynamic Linker: Overview

The Dynamic Linker is the piece of code in charge of linking stuff at runtime (duh).

{{< resizefig max-width=600px class=invertible src=dynamic-linker.png >}}

### Linker-Related ELF sections

Dynamically linked binaries have a bunch of information that is used to link them together:
- Libraries (`.so`, shared-object files) keep a table of _exported_ symbols, with their names and addresses.
- Programs that want to link against those libraries expose a list of _exported_ symbols, which have a corresponding entry in the PLT (Procedure Linkage Table). The **PLT** entry is executed every time we call the library function, and this will cause the code to jump to an address specified in the **GOT** (Global Offset Table), more or less.


{{< resizefig max-width=600px class=invertible src=elf-sections.png >}}

### Dynamic Linking: Relocations

The procedure of jumping to the library function and finding the appropriate address is described below:

{{< resizefig max-width=600px class=invertible src=relocations.png >}}

### Bonus: Linking Flags

Some flags can be specified to avoid the "lazy" part of dynamic loading.

{{< resizefig max-width=400px class=invertible src=relro.png >}}
