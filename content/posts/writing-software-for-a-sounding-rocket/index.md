---
Title: "Writing Code for a Sounding Rocket: a Look Under the Hood of Skyward's OBSW"
date: 2022-01-21
RepoCard: true
math: false
highlight: false
image: img/conops.png
---

<!-- {{< figure link=https://www.skywarder.eu/blog/wp-content/uploads/2021/11/DSC_1513.jpg" src=img/rocket.jpg >}} -->

So, this year is going to be 5 years since I first joined [Skyward Experimental Rocketry](https://skywarder.eu), a student association that designs and builds sounding rockets, and oh boy, it has been a hell of a ride!

I've learned a lot from this team, both from a technical and a human perspective, and I'd like to give something back. Since they've just [open-sourced](https://github.com/skyward-er) their on-board software (**OBSW**), to which I have been contributing for a couple of years, I figured I'd write something introductory about what this software does and how we developed it.

{{< github "skyward-er/skyward-boardcore" >}}

I won't be diving too much into the nitty gritty implementation details here (I might do that in a separate post in the future): what I want to provide is a high-level overview of what the software has to do and what type of problems it has to face.

If you want to get your hands dirty nevertheless, I'd recommend you start from the following repositories:

- [skyward-boardcore](https://github.com/skyward-er/skyward-boardcore), the common framework for all of our rockets, which includes drivers, shared components and some [documentation](https://github.com/skyward-er/skyward-boardcore/wiki) too
- Lynx's [on-board software](https://github.com/skyward-er/on-board-software), which is the actual code that runs on the rocket and is built on top of boardcore
- Our fork of the [Miosix real-time OS](https://github.com/skyward-er/miosix-kernel), which provides multi-threading capabilities, a filesystem API and much more

<!-- I hope this overview can be useful for both newbies trying to grasp the big picture of this kind of software and for anyone curious to know something more about how we do things in Skyward and what kind of problems do you even need to worry about when writing software for a rocket. -->

# Some context

To give some context to this post, I'll be specifically talking about our latest rocket, [Lynx](https://www.skywarder.eu/blog/lynx-en/), which we built to participate to our first international competition ever: [EuRoc](https://euroc.pt), a newborn competition held in Portugal between students of technical universities from all around Europe.

<!-- and is heavily inspired by another well known competition, the [Spaceport America Cup](https://spaceportamericacup.com/), which is held in the USA. -->

The rules of this challenge are quite complex, <!--since you have to provide a series of technical reports to the jury and the final score takes into account several different aspects,--> but the _TL;DR_ is that teams compete in categories, each characterised by:

- a **target altitude**, which can be 3km or 10km
- an **engine type**, either solid, liquid or hybrid

In our case, we were participating in the 3km COTS (commercial off-the-shelf) solid motor category, and the results were actually very good: 1st place in our category, 2nd place overall, and we were given the Best Team award too. Kudos to all the team for the great job!

But let's see what these two characteristics (altitude and engine) actually mean. A small disclaimer first: I’m a "software guy", so I'll mostly concentrate on the software-related consequences, omitting other equally important aspects of designing a rocket, such as the aerodynamics, simulation, structure assembly, logistics and many more.

## Target altitude

Let's start from the _target altitude_: the idea is that the nearer your **apogee** (the highest point of the rocket flight) is to the target altitude, the more points you gain. For example, if two teams are competing in the 3km category, and one reaches 2900m of maximum altitude while the other one reaches 3500m, the former will get more points, regardless of which one flew the highest.

This is where the fun part starts: in order to target an _exact_ altitude, the rocket must be able to control somehow its speed in real-time, and predict the apogee moment-by-moment, to decide whether it's going too fast or not.

 <!-- Needless to say, this can be quite challenging for a group of students, especially when dealing with rockets that will reach a peak speed of over 1000km/h. -->

By the way, our final apogee was 3076m, so not bad at all 😉.

<!--
{{< youtube >}}
⚠️ Watch out for the audio! -->

## Launching with a solid motor

For what concerns the specific characteristics of each engine type, the EuRoc guys made a [great post](https://www.instagram.com/p/CUhoVtkNmTi) on this topic, so I won't dig too much into the details of it.

{{< figure src="img/skyward-euroc21-ignition.png" caption="Preparation of the rocket before ignition. © Skyward Experimental Rocketry, 2021" width="100%" >}}

<!-- In the case of our rocket, we went for the solid COTS motor this year, and we are preparing our own [hybrid motor](https://www.skywarder.eu/blog/chimaera-en/) for future editions. -->

Our solid motor had the advantage that we bought it off-the-shelf (although we are planning to bring our own [hybrid motor](https://www.skywarder.eu/blog/chimaera-en/) in future editions), but one of the problems with solid motors is that **you cannot control thrust**: basically, once you kickstart the chemical reaction, you can't stop it. Also, the amount of total thrust provided will slightly vary between motors of the same exact type, since variations in the propellant and igniter can cause significant performance differences.

So, how do you even control this thing? Well, in short, you can't control the motor directly, but you can at least **slow down the rocket** if you use some external components. In our case, we designed a set of retractible **aerobrakes** that were controlled by the electronic system through servo motors.

<!-- Another thing that has to be taken into account with solid motors is reliability: small difference in the propellant, external conditions (temperature, humidity etc.) and in the igniter can cause significant difference in the *performance* of the motor, i.e. the amount of total thrust it will provide. Hence, you have to design your control algorithms to react in real-time to the measured acceleration profile, which you don't really know until you don't start the engine. -->

# The role of the on-board software

Skyward develops and maintains all kinds of software: some is used for simulating the trajectory of the flight, other is used by Mission Control in the **Ground Station** during launch-day, and another part, the so-called **on-board software**, is a bunch of C++ code that gets actually executed _inside_ the rocket.

But where _exactly_ inside the rocket?

{{< figure src="img/deathstack2.jpg" caption="Two components of the Death Stack, our on-board computer. © Skyward Experimental Rocketry, 2021" width="100%" >}}

## The Electronic System

Our on-board computer, called the _Death Stack_, is arguably one of the most complex subsystems of the entire rocket. It is composed of a bunch of electronics boards (or *PCB*s) stacked one onto another to form a composable system. Some of its components are:

- The **Microcontroller**, which is the _brain_ of the whole system. Normally, we use STM32 F4 MCUs coupled with an external RAM unit and an external _Oscillator_ to provide a high-precision clock.
- The **SD Card**, which might be enclosed in a _black box_ that is designed to resist any impact with the ground.
- The **Sensors**, from which we can measure the acceleration, pressure, internal and external temperature of the rocket, as well as the current flowing in the electronic system and many other information.
- The **Actuators** electronics, which in our case has to drive the aerobrakes, the opening of the nosecone and the deployment of the second parachute, which is done using [Cypres cutters](https://www.cypres.aero/sparepart/pulley-part/).

Other components of the Electronics System are, for example, the RF communication system and the power supply system. All of these are designed in-house.

## Mission recap

So, what does this complex electronics have to do in the end?

Well, in first approximation, what a sounding rocket does is very simple: go up very fast, reach apogee, deploy a parachute, come down (gently). Rockets like this are typically designed to carry some kind of **payload**, such as a scientific experiment or a small cubesat, but in our case we were just carrying a dummy payload, since our goal for this mission was to validate the rocket itself.

{{< figure src="img/conops.png" caption="Phases of the rocket flight. © Skyward Experimental Rocketry, 2021" width="100%" >}}

With a little less approximation, we can divide the flight into the following phases:

1. **On-ground operations**: this includes everything that needs to be done before the motor is started, such as instruments calibration to minimize measurements errors during flight and pre-flight checks (weather, rocket status, team - in short, everything that is in the so-called **go/no-go checklist**).
2. **Ignition**: the rocket motor is started and, hopefully, the rocket detaches from the ground. The software needs to detect the **Lift Off** to start the control logic.
3. **Ascending phase**: the motor continues providing thrust for a few seconds, and the rocket accelerates reaching a maximum vertical speed of over 1000km/h. In this phase, we are monitoring the state of the rocket and controlling its speed through the _aerobrakes_.
4. **Apogee & Descending phases**: at the highest point of the flight we need to deploy the **parachute**, so that the rocket is able to land without crashing. In particular, we have two types of parachutes: a small _drogue_ parachute, to slow down a bit the descent phase, and a _main_ parachute, that slows down the rocket even more just right before the touchdown.

## What does the software do?

While an extensive description of every single software component of our OBSW is out of the scope of this post, let me at least try to give you the gist of some of the things that the on-board software has to take care of, and the classes of problems that we typically face.

**1. Sensor sampling**

To be able to detect the current state of the rocket, and make correct predictions about the apogee, we have all sorts of sensors. Each has its own communication interface, that needs its own **driver**, and must be _sampled_ at a high frequency with precise intervals, which is where our [sensor sampler](https://github.com/skyward-er/skyward-boardcore/blob/master/src/shared/sensors/SensorSampler.cpp) comes at play.

**2. Logging**

All the information collected during the flight, both from the sensors and from the software itself, needs to be saved on an SD card for post-flight analysis. However, the **latency** of SD card writing operations can be quite high if you don't do them in batch, so you need to accumulate a certain amount of information and write it all together. To avoid the whole software from blocking every time we do this, we employ a variation of the [triple-buffering](https://en.wikipedia.org/wiki/Multiple_buffering) technique.

{{< figure src="img/skyward-sensors-analysis.jpg" caption="Post-flight analysis of the on-board sensors recordings after one of our test flights. © Skyward Experimental Rocketry, 2021" width="100%" >}}

**3. Telemetry and Telecommands**

Before and during the flight, we want to be able to check the status of the on-board electronics and send commands to the rocket from an RF interface, that must be able to send and receive data reliably over long distances. In our rocket, we employ an **868MHz** transceiver and we use the [Mavlink](https://mavlink.io/en/) protocol to exchange messages between the ground station and the rocket. We also employ a simple hand-rolled compression routine to consume less bandwidth and stuff more data into our telemetry packets.

**4. Aerobrakes control and parachutes deployment**

One of the most sophisticated things that we do on the on-board software is real-time **attitude estimation and apogee detection** using [Kalman filters](https://en.wikipedia.org/wiki/Kalman_filter). Using the data coming from the sensors, we estimate the current position, speed, acceleration and spin of the rocket, calculate how much we need actuate the aerobrakes and detect the _apogee_, which is the moment in which we must open up the nosecone and deploy the first parachute. We also need to detect the right moment to deploy the main parachute, which is around 350m AGL.

**5. Sensor Calibration and Filtering**

To control the system in a reliable way, we have to take into account that real sensors suffer from all kind of non-ideal behaviors: bias, noise, spikes, non-linearity etc., and these non-idealities can depend from all kind of factors, such as the speed, acceleration or internal temperature of the rocket, or even the system's electromagnetic noise. For this reason, we need to **characterize** our sensors during the testing phase, **calibrate** them before liftoff and **filter** the values we read from them in real-time based on the calibration we made.

{{< figure src="img/accel-euroc.png" caption="An example of the raw data coming out from the on-board accelerometers. © Skyward Experimental Rocketry, 2021" width="100%" >}}

**6. Task scheduling**

Needless to say, these are quite a lot of tasks to do in parallel, so we have a custom multi-threaded, real-time [OS](https://miosix.org/) that performs the scheduling according to each task's priority.
Internally, we used event-based communication between threads to support synchronization and avoid [deadlocks](https://en.wikipedia.org/wiki/Deadlock), which are the most feared enemy of any concurrent system's developer.

## Design principles

Some of the things you don't directly see when reading code is the reasoning that led to a specific design choice, so I'd like to highlight some of those so-called "non-functional requirements" that guided us while designing and developing this software:

- **Safety**: unsurprisingly, dealing with rockets, explosives and flying things that go very fast is **dangerous**. Duh! For this reason, the whole system has to be designed from the ground up thinking about how to minimize risks and failures, and this includes the hardware, the software, the assembly and the launch procedures.
- **Performance**: in our software we have **hard timing requirements** to meet, for example when sampling sensors or when calculating the current state of the rocket. Not being able to guarantee a routine termination in a certain time frame can cause anything from a wrong reading of the sensor to a modification of the trajectory due to early apogee detection and consequent nosecone activation.
- **Testability**: somewhat related to safety, but also to how we develop things, we need to clearly define borders between software components and separate them, so that they can be tested a hundred times as a unit before integrating them with the whole system. This has a big impact in the long run, and has definitely influenced many of our design decisions.
- **On-boardability**: this is a stupid term that I just invented to indicate an aspect that in my opinion has a _huge_ importance in the long-term game, which is _how difficult it is to on-board people in the project_. You can measure this as the time that a newbie has to spend with someone supervising him before he can actively contribute to the project. This might seem minor compared to the other things we listed, but the reality is that, as an association, we have a huge turnover, and even highly motivated members normally spend not more than 2 or 3 years as active part of the association (we all have to graduate in the end). This means that sometimes good documentation, predictable APIs, uniform naming rules and this kind of stuff has proven to be as important as squeezing out the most that we can from the on-board electronics.

# Why tho?

A question that I generally get asked a lot when talking about this kind of stuff is: _yeah cool, but what's the point of launching a rocket like this?_

I think my personal answer is: **to do something challenging**. I genuinely think there is a great value in being part of a group of people that voluntarily tries to do difficult stuff in a way that can miserably fail, and with no real incentives other than the challenge itself (we don't get paid nor we earn extra university credits).

It's a tough journey, but the view from the top is amazing.

{{< youtube id="0l8kpqQN11Y" title="Lynx's Flight to 3076 m at Euroc 2021" >}}
⚠️ Watch out for the audio!

A part from the personal aspect, there is obviously an **educational aspect** too, since a rocket is a complex system to design, and even just _managing_ the team that has to realize it is a challenge in itself. These are the kind of things that you don't get exposed to a lot in university and can complement your education in a very useful way.

There's also a **technological aspect** to it, since having all sorts of budget, time and people constraints forces you to be creative in devising solutions to problems that might normally require millions to be spent, and having this coupled with a low technical debt and a team of highly motivated engineers can drive innovation in all sorts of crazy ways.

# What's next?

The future for Skyward looks bright, and I'm sure we will perform even better in the next competitions.

If you want to know more about the project and the on-board software, a good place to start from is boardcore's [documentation](https://github.com/skyward-er/skyward-boardcore/wiki). Also, the _Software and Control Systems_ team is always looking for sponsors as well as motivated people that want to do something cool while in university, so if you're willing to contribute to the association, don't hesitate to [get in touch](https://www.skywarder.eu/blog/contact_us-en/) with the team.
