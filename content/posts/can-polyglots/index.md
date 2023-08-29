---
Title: "CAN Polyglots: A Fancy Way of Attacking Car Networks"
date: 2022-11-25
draft: true
RepoCard: true
math: false
highlight: false
image: img/UARTpkt-cut.png
---


<!-- {{< resizefig src=img/UARTpkt-cut.png caption="The signal at the top (UART TX) can be decoded as both a sequence of UART packets (center) and a CAN frame (bottom). It's a CUART packet!">}} -->


Some months ago, I wrote a [Twitter thread](https://twitter.com/HBitmasks/status/1446813123667759106) about a bunch of CAN bus hacking shenanigans I was doing for my master thesis (which got retweeted by the awesome  [@angealbertini](https://twitter.com/angealbertini) - senpai noticed me! 🥺).

{{< twitter 1446813123667759106 >}}


Fast-forward almost a year: this work was accepted at ACM CCS, a top-notch academic conference for system security. And we got a best paper honorable mention too - what a blast! The full paper is [here](https://dl.acm.org/doi/abs/10.1145/3548606.3560618) if you’re interested.

{{< github "necst/CANflict" >}}

The blogpost is still WIP, but you can read some of the details inside the [Twitter thread](https://twitter.com/HBitmasks/status/1446813123667759106).

<!-- ## What's CAN, anyways

 First things first: CAN is a standard protocol used inside vehicles (think cars, trucks etc.) to interconnect _control units_. These control units manage anything from the infotainment system, bluetooth and GPS to stuff like the engine, ABS, auto-parking features, you name it.

Almost a decade ago, some [crazily smart people](https://www.wired.com/2015/07/hackers-remotely-kill-jeep-highway/) showed that the CAN could be used as an attack vector to do all kinds of nasty things. From there, a lot of super cool research has been done on the topic - check the work from the awesome [Ken Tindell](https://kentindell.github.io/) if you want some examples.

The protocol is designed in a very smart way to tolerate highly noisy environment and even faults,

 However, some of the most sophisticated low-level attacks, like the [Selective DoS attack](https://maggi.cc/publication/palanca_candos_2017/palanca_candos_2017.pdf), have still some limitations, e.g. they require physical access to the CAN bus under many circumstances.

What we did, in a nutshell, was discovering a nice little trick for performing low-level attacks on the CAN bus without modifying the microcontroller: we basically bypass the CAN controller from software, and then injected bits on the bus using an SPI, I2C, UART or ADC peripheral (and the list goes on) connected to the same physical pins.

The idea is really simple, but it’s also effective, and doesn’t have many of the limitations of plain [bitbanging](https://www.youtube.com/watch?v=sMmc0hSi5rs&ab_channel=AdrianCrenshaw) (or even the current [state of the art](https://ieeexplore.ieee.org/document/9519391)). We were even able to read and write complete CAN frames using a completely different peripheral, in some specific cases, which is what you can see in the figure at the top.

TL;DR: polyglots are _everywhere_ (and they are awesome)!

I had a lot of fun doing this, and I hope you can enjoy that too by taking a look at the [Twitter thread](https://twitter.com/HBitmasks/status/1446813123667759106). -->

