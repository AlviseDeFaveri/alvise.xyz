---
Title: "Explainable AI: What the Hell is Even That?"
date: 2023-08-10
draft: true
RepoCard: true
math: false
highlight: false
image: img/ml.jpg
summary: During my last year of university I wrote a short paper on AI explanation as part of the final examination for the Phylosophical Issues in Computer Science course. Although this is definitely not my main field of expertise, I found that reading and reflecting on the problem of giving people a right for an explanation and trying to understand and eliminate the bias that we...
---

{{< resizefig max-width=600px src=img/ml.jpg.webp caption="Machine Learning Memes for Convolutional Teens">}}

A couple of years ago in university I wrote a short article on AI explanation for a course called "Phylosophical Issues in Computer Science". I didn't know anything about the topic at the time (and neither I do now to be honest) but it already seemed quite clear that the problem of explanation would become a huge one once AI research was mature enough.

The main focus of the article was to research the state of the art in a "new" field called **XAI (eXplainable AI)**, which specifically deals with the problem of understanding what an AI does and why.

There were already many ideas on how to do it, from using simpler algorithms like decision trees to approximate a neural network to produce AIs that can learn how to explain themselves. The research has evolved enormously in the meantime, but some of the core problems are still there in my opinion.

If you’re interested, you can take a look at my old article [here](https://raw.githubusercontent.com/AlviseDeFaveri/XAI-paper/master/main.pdf) to understand what I mean.

{{< github "AlviseDeFaveri/XAI-paper" >}}


Fast-forward in time: it's now 2023, ChatGPT and LLMs are huge on Twitter (maybe less so in the real world) and obviously the research on explainable AI is now hotter than ever. Also, Twitter is now X, but that's another story.

These are some interesting articles that have been written in the meantime:

- [This article](https://medium.com/dsaid-govtech/towards-a-comparable-metric-for-ai-model-interpretability-part-1-d55d4bae8a58) from 2022, written by researchers from Meta and from the Singaporean government (for some reason), talks exactly about the absence of a common metric for measuring interpretability in AI models.
They also claim a completely negative correlation between an AI model's accuracy and it's out-of-the-box explainability. Sounds like we're going to have a lot of fun with opaque, broken AI for the forseeable future!

{{< resizefig max-width=700px src=img/interpretability-vs-accuracy.webp caption="Interpretability vs Accuracy of modern AI models">}}

- [This paper](https://arxiv.org/abs/2304.03279) talks about how deception can be a reward for different kinds of LLMs by creating a benchmark of 134 choose-your-own-adventure game where the AI had to play, and then measuring which strategy it decided to adopt. Very fascinating, indeed.

{{< resizefig max-width=700px src=img/machiavelli.png caption="The Machiavelli benchmark" >}}


- [This paper](https://arxiv.org/abs/2308.02312) shows that users prefer ChatGPT's answers due to language style even when they are inaccurate or verbose. Indeed, we do have a framing bias, and it shows.

{{< twitter 1689851180657397760 >}}
