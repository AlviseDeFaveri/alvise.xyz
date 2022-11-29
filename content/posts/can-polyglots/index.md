---
Title: "CAN polyglots: A fancy way of attacking car networks"
date: 2022-11-25
RepoCard: false
math: false
highlight: false
image: img/UARTpkt-cut.png
summary: Some months ago, I wrote a Twitter thread about some CAN bus hacking shenanigans I did for my master thesis. I thought it would be interesting to share it on the blog too, so here it is.
---


{{< figure width=1000px src=img/UARTpkt-cut.png caption="This signal (UART TX) is both a sequence of UART packets and a CAN frame. It's a CUART!">}}

Some months ago, I wrote a [Twitter thread](https://twitter.com/HBitmasks/status/1446813123667759106) about some CAN bus hacking shenanigans I did for my master thesis (which got retweeted by [@angealbertini](https://twitter.com/angealbertini) - senpai noticed me! 🥺). I thought it would be interesting to share it on the blog too, so here it is.

 CAN bus is a standard protocol used inside vehicles to interconnect control units, which makes it a very interesting target for security research. A lot of very cool stuff has already been done on the subject, most famously by the [godfathers of car hacking](https://www.wired.com/2015/07/hackers-remotely-kill-jeep-highway/) (Miller & Valasek) and by the awesome [Ken Tindell](https://kentindell.github.io/), but some of the most sophisticated low-level attacks, like the [Selective DoS attack](https://maggi.cc/publication/palanca_candos_2017/palanca_candos_2017.pdf), have still some limitations, e.g. they require physical access to the CAN bus under many circumstances.

What we did, in a nutshell, was discovering a nice little trick for performing low-level attacks on the CAN bus without modifying the microcontroller: we basically bypassed the CAN controller from software, and then injected/read bits on the bus using an SPI, I2C, UART or ADC peripheral (and the list goes on) connected to the same physical pins.

The idea is really simple, but it’s also effective, and doesn’t have many of the limitations of plain [bitbanging](https://www.youtube.com/watch?v=sMmc0hSi5rs&ab_channel=AdrianCrenshaw) (or even state of the art [techniques](https://ieeexplore.ieee.org/document/9519391)). We were even able to read and write complete CAN frames using a completely different peripheral, in some specific cases, which is what you can see in the figure.

Polyglots are _everywhere_ (and they are awesome)!

I had a lot of fun doing this, and I hope you can enjoy that too by taking a look at the thread.

Have a nice read!

---

*Update*: After many months of back and forth, we were able to get this published at the ACM CCS '22 conference! This is a very cool achievement, for which I am super grateful. You can find the full paper [here](https://dl.acm.org/doi/abs/10.1145/3548606.3560618) if you’re interested.
