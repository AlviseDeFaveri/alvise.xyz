---
Title: "Pythonic C++, Or: How I Learned To Stop Worrying And Love LLVM's STLExtras"
date: 2024-01-01
draft: true
RepoCard: false
math: false
highlight: true
private: true
---

**I love C++**. And by "love", I mean I hate it. And by "hate", I mean I love it.
I'm sure that anyone who has been exposed enough to C++
can relate to the schizofrenia. If you're like this, I have a message for you:
you _can_ be happy, you _can_ heal, life will be better.

Anyways, among the C++ codebases that I had to deal with in my life, one of
my favourites has to be LLVM.

Sure, there's many things to dislike about LLVM, like: are you using the [new PassManager]()
or the old one? Did you add all the boilerplate? How do you handle Apple-specific
SWIFT/ObjectiveC crap? Why are you running `InstCombine` just once? You fool! Are you
trying to build on your laptop without gold and with parallel jobs? What a pleb!
Good luck with that...

But, like any toxic love, after some time away from it I start thinking
"what about the _good_ moments?".

## The Easy: Ranged For Loops

In the beginning was begin and end iterators, and they sucked big time.
Then,
