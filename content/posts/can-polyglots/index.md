---
Title: "CAN polyglots: A Fancy Way of Attacking Car Networks"
date: 2022-11-25
RepoCard: false
math: false
highlight: false
image: img/UARTpkt-cut.png
summary: Some months ago, I wrote a Twitter thread about some CAN bus hacking shenanigans I did for my master thesis. I thought it would be interesting to share it on the blog too, so here it is.
---


{{< figure width=1200px lmargin=-200px src=img/UARTpkt-cut.png caption="This signal (UART TX) is both a sequence of UART packets and a CAN frame. It's a CUART!">}}

Some months ago, I wrote a [Twitter thread](https://twitter.com/HBitmasks/status/1446813123667759106) about some CAN bus hacking shenanigans I was doing for my master thesis (which got retweeted by the awsome  [@angealbertini](https://twitter.com/angealbertini) - senpai noticed me! 🥺). I thought it would be interesting to share it also here, so there you go.

 First things first: CAN is a standard protocol used to interconnect control units inside vehicles (think cars, trucks etc.). This makes it a very interesting target from a security perspective, and a lot of super cool research has been done on the subject over the past decade or so, most famously by the [godfathers of car hacking](https://www.wired.com/2015/07/hackers-remotely-kill-jeep-highway/) and by the awesome [Ken Tindell](https://kentindell.github.io/).


 There's plenty of evidence that the standard itself can be broken in many ways, especially because of how communication errors are handled. However, some of the most sophisticated low-level attacks, like the [Selective DoS attack](https://maggi.cc/publication/palanca_candos_2017/palanca_candos_2017.pdf), have still some limitations, e.g. they require physical access to the CAN bus under many circumstances.

What we did, in a nutshell, was discovering a nice little trick for performing low-level attacks on the CAN bus without modifying the microcontroller: we basically bypass the CAN controller from software, and then injected bits on the bus using an SPI, I2C, UART or ADC peripheral (and the list goes on) connected to the same physical pins.

The idea is really simple, but it’s also effective, and doesn’t have many of the limitations of plain [bitbanging](https://www.youtube.com/watch?v=sMmc0hSi5rs&ab_channel=AdrianCrenshaw) (or even the current [state of the art](https://ieeexplore.ieee.org/document/9519391)). We were even able to read and write complete CAN frames using a completely different peripheral, in some specific cases, which is what you can see in the figure at the top.

TL;DR: polyglots are _everywhere_ (and they are awesome)!

I had a lot of fun doing this, and I hope you can enjoy that too by taking a look at the [Twitter thread](https://twitter.com/HBitmasks/status/1446813123667759106).

Have a nice read!

---

*Update*: This work has been accepted at CCS '22! This is a very cool achievement, for which I am super grateful. You can find the full paper [here](https://dl.acm.org/doi/abs/10.1145/3548606.3560618) if you’re interested.
