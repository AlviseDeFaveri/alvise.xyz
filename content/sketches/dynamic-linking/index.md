---
draft: false
date: "2023-01-14"
title: "Dynamic Linking Infographic"
description: ""
summary: "What happens when your code calls `printf()`? And what's up with all that `.got.plt` stuff that you see when you decompile a binary? Here are some sketches I drew to help me remember this kind of stuff."
---

What happens when your code calls `printf()`? And what's up with all that `.got.plt` crap that you see when you decompile a binary? Here are some sketches I drew to help me remember this kind of stuff.

[Full Infographic](img/dynamic-linking.png).

These sketches are mainly inspired by [How the ELF ruined the Christmas](https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-di-frederico.pdf).

### Intro: Dynamic Linking

First of all, we need to understand the difference between a **statically linked** binary and a dynamically linked one:

- A statically linked binary contains all the program's code _and the library code_ already linked together in a single binary blob.
- In many cases, we don't really want to compile the whole libc inside each of our binaries. In order to be _dynamically linked_, the binary contains only the user code, together with some _relocation information_ that are used at runtime to resolve the location of library functions on the host machine.

<!-- {{< resizefig max-width=40em class=invertible src=img/dyn-linking.svg >}} -->
{{< resizefig max-width=40em class=invertible src=img/dyn-linking.svg >}}


<!-- ### The Dynamic Linker

The Dynamic Linker is the piece of code in charge of linking stuff at runtime (duh).

{{< resizefig max-width=40em class=invertible src=img/dynamic-linker.png >}} -->

### Linker-Related ELF sections

Dynamically linked binaries have a bunch of information that is used to link them together:

- Libraries (`.so`, shared-object files) keep a table of _exported_ symbols, with their names and addresses.
- Programs that want to link against those libraries expose a list of _imported_ symbols, which have a corresponding entry in the PLT (Procedure Linkage Table). The **PLT** entry is executed every time we call the library function, and this will cause the code to jump to an address specified in the **GOT** (Global Offset Table).

{{< resizefig max-width=40em class=invertible src=img/dyn-linking-sections.svg >}}
<!-- {{< resizefig max-width=40em class=invertible src=img/elf-sections.png >}} -->

### Lazy Loading

The procedure of jumping to the library function and finding the appropriate address is described below:

{{< resizefig max-width=40em class=invertible src=img/relocations.png >}}

### Bonus: Linking Flags

Some flags can be specified to avoid the "lazy" part of dynamic loading.

{{< resizefig max-width=25em class=invertible src=img/relro.png >}}
