---
Title: "Explainable AI: What the Hell is Even That?"
date: 2022-08-10
draft: false
private: false
RepoCard: true
math: false
highlight: false
image: img/ml.jpg
---

{{< resizefig max-width=600px src=img/ml.jpg.webp caption="Machine Learning Memes for Convolutional Teens">}}

Some time ago I wrote a (non-technical) [short
essay](https://raw.githubusercontent.com/AlviseDeFaveri/XAI-paper/master/main.pdf)
on AI explanation for a uni course. I didn't know anything about the topic at
the time (and things haven't changed much since then) but it already seemed quite clear
that the problem of explanation would become a huge one as AI research advanced.

<!-- The main focus of the article was to research the state of the art in a "new" field called **XAI (eXplainable AI)**, which specifically deals with the problem of understanding why an AI took a certain decision. -->

There were already many ideas on how to do it, from using simpler algorithms
like decision trees to approximate a neural network to producing AIs that can
learn how to explain themselves.

However, some of the limitations were also already clear.
For example: how do you measure the quality of an explanation? Is it about how
_faithful_ they are (but then, the most faithful explanation is the code itself)
or how _convincing_ they are? If this is the case, isn't that a clear
 _incentive to lie_? This is basically what my essay is about.

Clearly, the reasoning is very abstract and only scratches the surface, but I think the
core of the question is still interesting and worthy to investigate.

---

Fast-forward in time: it's now 2023, ChatGPT and LLMs are huge on Twitter (maybe
less so in the real world) and obviously the research on explainable AI is now
hotter than ever. Also, Twitter is now X, but that's another story.

Here's a (very random and outdated) collection of interesting articles about the
topic:

- [This article](https://medium.com/dsaid-govtech/towards-a-comparable-metric-for-ai-model-interpretability-part-1-d55d4bae8a58) from 2022, written by researchers from Meta and from the Singaporean government (for some reason), talks exactly about the absence of a common metric for measuring interpretability in AI models.
They also claim a completely negative correlation between an AI model's accuracy and it's out-of-the-box explainability. Sounds like we're going to have a lot of fun with opaque, broken AI for the forseeable future!

{{< resizefig max-width=700px src=img/interpretability-vs-accuracy.webp caption="Interpretability vs Accuracy of modern AI models">}}

- [This paper](https://arxiv.org/abs/2304.03279) talks about how deception can be a reward for different kinds of LLMs by creating a benchmark of 134 choose-your-own-adventure game where the AI had to play, and then measuring which strategy it decided to adopt. Very fascinating, indeed.

{{< resizefig max-width=700px src=img/machiavelli.png caption="The Machiavelli benchmark" >}}


- [This paper](https://arxiv.org/abs/2308.02312) shows that users prefer ChatGPT's answers due to language style even when they are inaccurate or verbose. Indeed, we do have a framing bias, and it shows.

{{< twitter 1689851180657397760 >}}
