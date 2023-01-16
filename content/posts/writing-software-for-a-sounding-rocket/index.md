---
Title: "Writing software for a sounding rocket"
date: "2022-01-21T00:00:00"
RepoCard: true
math: false
highlight: false
image: img/rocket.jpg
summary: "Skyward Experimental Rocketry has just released the on-board software
          of its sounding rocket - let's talk about it!"
---

{{< figure link="https://www.skywarder.eu/blog/lynx-en/" src=img/rocket.jpg.webp caption="Test launch in Roccaraso (🇮🇹). © Skyward Experimental Rocketry, 2021" >}}


This year is going to be 5 years since I first joined [Skyward Experimental Rocketry](https://skywarder.eu), a student association that designs and builds sounding rockets in Politecnico di Milano. Let me tell you, it has been a hell of a ride!

To celebrate the fact that we've just [open-sourced](https://github.com/skyward-er) the on-board software of our latest rocket, I figured it would be cool to write a high-level introduction to the magical world of sounding rockets, from a software perspective.

In this post I'm just going to scratch the surface. I hope this overview can be useful for both newbies trying to grasp the big picture of this kind of software and for anyone curious to know something more about how we do things in Skyward.

Wanna read some code instead? I'd recommend you start from the following repositories:

- [skyward-boardcore](https://github.com/skyward-er/skyward-boardcore), the common framework for all of our rockets, which includes drivers, shared components and some [documentation](https://github.com/skyward-er/skyward-boardcore/wiki) too
{{< github "skyward-er/boardcore" >}}
- Lynx's [on-board software](https://github.com/skyward-er/on-board-software), which is the actual code that runs on the rocket and is built on top of boardcore
- Our fork of the [Miosix real-time OS](https://github.com/skyward-er/miosix-kernel), which provides multi-threading capabilities, a filesystem and other basic utilities with minimal overhead


## Some context

In this post I'll be talking specifically about our latest rocket, **Lynx**, which we built to participate to our first international competition ever: [EuRoc](https://euroc.pt), a newborn competition held in Portugal between students of technical universities from all around Europe.

<!-- {{< figure src="img/team.CR2.webp" caption="Some nice moments from EuRoC 2021 🙂. © Skyward Experimental Rocketry, 2021" size="800x" width="800">}} -->

<!-- and is heavily inspired by another well known competition, the [Spaceport America Cup](https://spaceportamericacup.com/), which is held in the USA. -->

The rules of this challenge are quite complex, <!--since you have to provide a series of technical reports to the jury and the final score takes into account several different aspects,--> but the _TL;DR_ is that teams compete in categories, each characterized by:

- a **target altitude**, which can be 3km or 10km
- an **engine type**, either solid, liquid or hybrid

Lynx in particular is a relatively small rocket (2.5m x 21kg) competing in the 3km solid motor category.

## Target altitude

Let's start from the _target altitude_: the idea is that the nearer your **apogee** (the highest point of the rocket's flight) is to the target altitude, the more points you gain. For example, if two teams are competing in the 3km category, and one reaches 2900m of maximum altitude while the other one reaches 3500m, the former will get more points, regardless of which one flew the highest.

Note that, in order to target an _exact_ altitude, the rocket must be able to _control_ its speed and _predict_ the apogee in real-time. Needless to say, this can be quite challenging for a group of students, especially with a rocket that can reach a peak speed of over 1000km/h. Here's where the fun starts!

By the way, our final result in the 3000m category was 3076m AGL, so not bad at all 😉.

<!--
{{< youtube >}}
⚠️ Watch out for the audio! -->

## Launching with a solid motor

For what concerns the difference between solid, liquid and hybrid engines, the EuRoc guys made a [great post](https://www.instagram.com/p/CUhoVtkNmTi) on this topic, so I won't discuss this here: I'll just say that, for Lynx, we went for an off-the-shelf solid motor, the Aerotech M2000R (you can find all the specs on [the Lynx page](https://www.skywarder.eu/blog/lynx-en/) of our website). For future editions, we are preparing our own [hybrid motor](https://www.skywarder.eu/blog/chimaera-en/).

{{< figure src="img/skyward-euroc21-ignition.png.webp" caption="Preparation of the rocket before ignition. © Skyward Experimental Rocketry, 2021" >}}

Solid motors have the advantage that you can buy them off-the-shelf, and are simpler to deal with. The downside, however, is that **you cannot control thrust**: basically, once you kickstart the chemical reaction, you can't stop it. Also, the amount of total thrust provided will slightly vary between motors of the same exact type, since variations in the propellant and igniter can cause significant performance differences.

So, how do you even control this thing? Well, in short, you can't control the motor directly, but you can at least **slow down the rocket** if you use some external components. In our case, we designed a set of retractible **aerobrakes** that were controlled by the electronic system through servo motors. These aerobrakes can be opened or closed at different degrees to adapt to the current speed in real-time.

<!-- Another thing that has to be taken into account with solid motors is reliability: small difference in the propellant, external conditions (temperature, humidity etc.) and in the igniter can cause significant difference in the *performance* of the motor, i.e. the amount of total thrust it will provide. Hence, you have to design your control algorithms to react in real-time to the measured acceleration profile, which you don't really know until you don't start the engine. -->

## Software... What software?

Skyward develops and maintains all kinds of software: some is used for simulating the trajectory of the flight, other is used by Mission Control in the **Ground Station** during launch-day, and another part, the so-called **on-board software**, is a bunch of code written in C++ that gets executed _inside_ the rocket.

But where _exactly_ inside the rocket?

{{< figure src="img/deathstack2.jpg.webp" caption="Two components of the Death Stack, our on-board computer. © Skyward Experimental Rocketry, 2021" >}}

## The Electronic System

Our on-board computer, called the _Death Stack_, is arguably one of the most complex subsystems of the entire rocket. It is composed of four electronics boards (or *PCB*s) stacked one onto another. Its components are:

- The **Analog Board** that contains most of the sensors, including four analog pressure sensors, one digital pressure sensor, the nosecone detach pin and the launchpad detach pin (detects liftoff)
- The **RF+IMU Board** that is equipped with a GPS receiver, an RF module (Xbee 868 MHz) used to communicate with the ground station, and IMU + magnetometer to estimate the current attitude of the rocket
- The **STM Board**, which is the _brain_ of the whole system and mounts an STM32 F4 MCU coupled with an external RAM and an external _Oscillator_, which provides a high-precision clock
- The **Power Board** manages the power for all the electronics, both the high-voltage/current one (e.g. actuators) and the low-voltage logic

Also, every event and sensor datapoint, as well as routine checks of the software and hardware, are logged to an **SD Card**, which is enclosed in a _black box_ that is designed to resist any impact with the ground.

The **Actuators** electronics in our case is composed by servo-motors, used to drive the aerobrakes and the opening of the nosecone, and [Cypres cutters](https://www.cypres.aero/sparepart/pulley-part/), which are used for the deployment of the second parachute.

## Mission recap

So, what does this complex electronics have to do in the end?

Well, in first approximation, what a sounding rocket does is very simple: go up very fast, reach apogee, deploy a parachute, come down (gently). Rockets like this are typically designed to carry some kind of **payload**, such as a scientific experiment or a small cubesat, but in our case we were just carrying a dummy payload, since our goal for this mission was to validate the rocket itself.

{{< figure src="img/conops.png.webp" caption="Phases of the rocket flight. © Skyward Experimental Rocketry, 2021" >}}

With a little less approximation, we can divide the flight into the following phases:

1. **On-ground operations**: this includes everything that needs to be done before the motor is started, such as instruments calibration to minimize measurements errors during flight and pre-flight checks (weather, rocket status, team - in short, everything that is in the so-called **go/no-go checklist**).
2. **Ignition**: the rocket motor is started and, hopefully, the rocket detaches from the ground. The software needs to detect the **Lift Off** to start the control logic.
3. **Ascending phase**: the motor continues providing thrust for a few seconds, and the rocket accelerates reaching a maximum vertical speed of over 1000km/h. In this phase, we are monitoring the state of the rocket and controlling its speed through the _aerobrakes_.
4. **Apogee & Descending phases**: at the highest point of the flight we need to deploy the **parachute**, so that the rocket is able to land without crashing. In particular, we have two types of parachutes: a small _drogue_ parachute, to slow down a bit the descent phase, and a _main_ parachute, that slows down the rocket even more just right before the touchdown.

## What does the software do?

{{< figure src="img/obsw_diagram.png.webp" caption="Components of the on-board software (OBSW). © Skyward Experimental Rocketry, 2021" >}}

While an extensive description of every single software component of our OBSW is out of the scope of this post, let me at least try to give you the gist of some of the things that the on-board software has to take care of, and the classes of problems that we typically face.

**1. Sensor sampling**

To be able to detect the current state of the rocket, and make correct predictions about the apogee, we have all sorts of sensors. Each has its own communication interface, that needs its own **driver**, and must be _sampled_ at a high frequency with precise intervals, which is where our [sensor sampler](https://github.com/skyward-er/skyward-boardcore/blob/master/src/shared/sensors/SensorSampler.cpp) comes at play.

**2. Logging**

All the information collected during the flight, both from the sensors and from the software itself, needs to be saved on an SD card for post-flight analysis. However, the **latency** of SD card writing operations can be quite high if you don't do them in batch, so you need to accumulate a certain amount of information and write it all together. To avoid the whole software from blocking every time we do this, we employ a variation of the [triple-buffering](https://en.wikipedia.org/wiki/Multiple_buffering) technique.

**3. Telemetry and Telecommands**

Before and during the flight, we want to be able to check the status of the on-board electronics and send commands to the rocket from an RF interface, that must be able to send and receive data reliably over long distances. In our rocket, we employ an **868MHz** transceiver and we use the [Mavlink](https://mavlink.io/en/) protocol to exchange messages between the ground station and the rocket. We also employ a simple hand-rolled compression routine to consume less bandwidth and stuff more data into our telemetry packets.

**4. Aerobrakes control and parachutes deployment**

One of the most sophisticated things that we do on the on-board software is real-time **attitude estimation and apogee detection** using [Kalman filters](https://en.wikipedia.org/wiki/Kalman_filter). Using the data coming from the sensors, we estimate the current position, speed, acceleration and spin of the rocket, calculate how much we need actuate the aerobrakes and detect the _apogee_, which is the moment in which we must open up the nosecone and deploy the first parachute. We also need to detect the right moment to deploy the main parachute, which is around 350m AGL.

**5. Sensor Calibration and Filtering**

To control the system in a reliable way, we have to take into account that real sensors suffer from all kind of non-ideal behaviors: bias, noise, spikes, non-linearity etc., and these non-idealities can depend from all kind of factors, such as the speed, acceleration or internal temperature of the rocket, or even the system's electromagnetic noise. For this reason, we need to **characterize** our sensors during the testing phase, **calibrate** them before liftoff and **filter** the values we read from them in real-time based on the calibration we made.

{{< figure src="img/accel-euroc.png.webp" caption="An example of the raw data coming out from the on-board accelerometers. © Skyward Experimental Rocketry, 2021" size="800x" width="800" >}}

{{< figure src="img/skyward-sensors-analysis.jpg.webp" caption="Post-flight analysis of the on-board sensors recordings after one of our test flights. © Skyward Experimental Rocketry, 2021" size="800x" width="800" >}}

**6. Task scheduling**

Needless to say, these are quite a lot of tasks to do in parallel, so we have a custom multi-threaded, real-time [OS](https://miosix.org/) that performs the scheduling according to each task's priority.
Internally, we used event-based communication between threads to support synchronization and avoid [deadlocks](https://en.wikipedia.org/wiki/Deadlock), which are the most feared enemy of any concurrent system's developer.

## Design principles

Some of the things you don't directly see when reading code is the reasoning that led to a specific design choice, so I'd like to highlight some of those so-called "non-functional requirements" that guided us while designing and developing this software:

- **Safety**: unsurprisingly, dealing with rockets, explosives and flying things that go very fast is **dangerous**. Duh! For this reason, the whole system has to be designed from the ground up thinking about how to minimize risks and failures, and this includes the hardware, the software, the assembly and the launch procedures.
- **Performance**: in our software we have **hard timing requirements** to meet, for example when sampling sensors or when calculating the current state of the rocket. Not being able to guarantee a routine termination in a certain time frame can cause anything from a wrong reading of the sensor to a modification of the trajectory due to early apogee detection and consequent nosecone activation.
- **Testability**: somewhat related to safety, but also to how we develop things, we need to clearly define borders between software components and separate them, so that they can be tested a hundred times as a unit before integrating them with the whole system. This has a big impact in the long run, and has definitely influenced many of our design decisions.
- **On-boardability**: You can measure this as the time that a newbie has to spend with someone supervising him before he can actively contribute to the project. This might seem minor compared to the other things we listed, but the reality is that, as an association, we have a huge turnover, and even highly motivated members normally spend not more than 2 or 3 years as active part of the association (we all have to graduate in the end). This means that sometimes good documentation, predictable APIs, uniform naming rules, a clear development process and this kind of stuff has proven to be as important as squeezing out the most that we can from the on-board electronics.

## Y tho?

A question I generally get asked when talking about this kind of stuff is: _what's the point of building such a small rocket?_

I think my personal answer is: **to do something challenging**. I genuinely think there is a great value in being part of a group of people that voluntarily tries to do difficult stuff in a way that can miserably fail, and with no real incentives other than the challenge itself (we don't get paid nor we earn extra university credits).

It's a tough journey, but the view from the top is amazing.

{{< youtube id="0l8kpqQN11Y" title="Lynx's Flight to 3076 m at Euroc 2021" >}}
⚠️ Watch out for the audio!

A part from the personal aspect, there is obviously an **educational aspect** too, since a rocket is a complex system to design, and even just _managing_ the team that has to realize it is a challenge in itself. These are the kind of things that you don't get exposed to a lot in university and can complement your education in a very useful way.

There's also a **technological aspect** to it, since having all sorts of budget, time and people constraints forces you to be creative in devising solutions to problems that might normally require millions to be spent, and having this coupled with a low technical debt and a team of highly motivated engineers can drive innovation in all sorts of crazy ways.

## What's next?

The future for Skyward looks bright, and I'm sure we will perform even better in the next competitions.

If you want to know more about the project and the on-board software, a good place to start from is boardcore's [documentation](https://github.com/skyward-er/skyward-boardcore/wiki). Also, the _Software and Control Systems_ team is always looking for sponsors as well as motivated people that want to do something cool while in university, so if you're willing to contribute to the association, don't hesitate to [get in touch](https://www.skywarder.eu/blog/contact_us-en/) with the team.
