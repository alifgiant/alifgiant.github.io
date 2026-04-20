---
title: "Comparative Study on Flutter State Management"
date: "2021-08-02"
tags: ["Tech","Flutter"]
featured: false
description: "Background I am going to build a new flutter app. The app is aimed to be quite big. I'm going to need a state management tools. So, I think it’s a good idea ..."
readTime: "13 min"
image: "/assets/images/blog/cover-1039c2f2-09d1-4c78-8f5a-8a03e46fb708.webp"
---

## Background

I am going to build a new flutter app. The app is aimed to be quite big. I'm going to need a state management tools. So, I think it’s a good idea to spent some time considering the options. First of all, i do have a preference on flutter’s state management. Itu could affect my final verdict. But, I want to make a data based decision on it. So, let’s start..

## Current State of the Art

Flutter official [website](https://flutter.dev/docs/development/data-and-backend/state-mgmt/options) has a listing of all current available state management options. As on 1 Aug 2021, the following list are those that listed on the website.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-1.webp)

I marked GetIt since it’s actually not a state management by it’s own. It’s a dependency injection library, but the community behind it develop a set of tools to make it a state management (get_it_mixin (45,130,81%) and get_it_hooks (6,100,33%)). There’s also two additional lib that not mentioned on the official page (Stacked and flutter_hooks). Those two are relatively new compared to others (since pretty much everything about flutter is new) but has high popularity.

**What is Pub Point**

Pub point is a curation point given by flutter package manager (pub.dev). Basically this point indicate how far a given library adhere to dart/flutter best practices.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-2.webp)

Provider Package Meta Scores

## Selection Criteria

I concluded several criteria that need to be fulfilled by a good state management library.

1. Well Known (Popular)
1. There's should be a lot of people using it.
1. Mature
1. Has rich ecosystem, which mean, resources about the library should be easily available. Resources are, but not limited to, documentation, best practices and common issue/problem solutions.
1. Rigid
1. Allow for engineers to write consistent code, so an engineer can come and easily maintain other's codebase.
1. Easy to Use
1. Easy in inter-component communication. In a complex app, a component tend to need to talk to other component. So it's very useful if the state manager give an easy way to do it.
1. Easy to test. A component that implement the state management need to have a good separation of concern.
1. Easy to learn. Has leaner learning curve.
1. Well Maintained:
1. High test coverage rate and actively developed.

## First Filter: Popularity

This first filter can give us a quick glance over the easiness of usage and the availability of resources. Since both are our criteria in choosing, the first filter is a no brainer to use. Furthermore when it’s not popular, there’s a high chance that new engineers need more time to learn it.

Luckily, we have a definitive data to rank our list. [Pub.dev](http://pub.dev/) give us popularity score and number of likes. So, let’s drop those that has less than 90% popularity and has less than 100 likes.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-3.webp)

As you can see, we drop 6 package from the list. We also drop setState and InheritedWidget from the list, since it’s the default implementation of state management in flutter. It’s very simple but easily increase complexity in building a bigger app. Most of the other packages try to fix the problem and build on top of it.

Now we have 9 left to go.

## Second Filter: Maturity

The second filter is a bit hard to implement. After all, parameter to define “maturity” is kinda vague. But let’s make our own threshold of matureness to use as filter.

1. Pub point should be higher than 100
1. Version number should be on major version at least “1.0.0”
1. Github’s Closed Issue should be more than 100
1. Stackoverflow questions should be more than 100
1. Total resource (Github + Stackoverflow) should be more than 500

The current list doesn’t have 2 parameter defined above, so we need to find it out.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-4.webp)

So let’s see which state management fulfill our threshold.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-5.webp)

As you can see, “flutter_redux” is dropped. It’s not satisfied the criteria of “major version”. Not on major version can be inferred as, the creator of the package marked it is as **not stable**. There could be potentially breaking API changes in near future or an implementation change. When it happens we got no option but to refactor our code base, which lead to unnecessary work load.

But, it’s actually seems unfair. Since flutter_redux is only a set of tool on top [redux](https://pub.dev/packages/redux) . The base package is actually satisfy our threshold so far. It’s on v5.0.0, has pub point ≥ 100, has likes ≥ 100 and has popularity ≥ 90%.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-6.webp)

So, if we use the base package it should be safe. But, let’s go a little deeper. The base package is a Dart package, so it means this lib can be used outside flutter (which is a plus). Redux package also claims it’s a rich ecosystem, in which it has several child packages:

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-7.webp)

As i inspect each of those packages, i found none of them are stables. In fact, none of them are even popular. Which i can assume it’s pretty hard to find “best practices” around it. Redux might be super popular on Javascript community. We could easily find help about redux for web development issue, but i don’t think it stays true for flutter’s issue (you can see the total resource count, it barely pass 500, it’s 517).

Redux package promises big things, but as a saying goes **“a chain is as strong as its weakest link”**. It’s hard for me to let this package claim “maturity”.

> Fun fact: On JS community, specifically React community, redux is also losing popularity due to easier or simpler API from React.Context or Mobx.

But, Just in case, let’s keep Redux in mind, let’s say it’s a seed selection. Since we might go away with only using the base package. Also, it’s might be significantly excel on another filter. So, currently we have 4+1 options left.

## Third Filter: Rigid

Our code should be very consistent across all code base. Again, this is very vague. What is the parameters to say a code is consistent, and how consistent we want it to be. Honestly, i can’t find a measurable metric for it. The consistency of a code is all based on a person valuation. In my opinion every and each public available solutions should be custom tailored to our needs. So to make a codebase consistent we should define our own conventions and stick on it during code reviews.

So, sadly on this filter none of the options are dropped. It stays 4+1 options.

## Fourth Filter: Easy to Use

We had already define, when is a state management can be called as **easy to use** in the previous section. Those criteria are:

1. Each components can talk to each other easily.
1. Each components should be easy to test. It can be achieved when it separates business logic from views. Also separate big business logic to smaller ones.
1. We spent little time in learning it.

Since the fourth filter is span across multiple complex criteria, I think to objectively measure it, we need to use a ranking system. A winner on a criteria will get 2 point, second place will get 1, and the rest get 0 point. So, Let’s start visiting those criteria one by one.

Inter Component Communication

Let’s say we have component tree like the following diagram,

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-8.webp)

In basic composition pattern, when component A needs something from component D it needs to follow a chain of command through E→G→F→D

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-9.webp)

This approach is easily get very complex when we scale up the system, like a tree with 10 layers deep. So, to solve this problem, state management’s tools introduce a separate class that hold an object which exposed to all components.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-10.webp)

Basically, all state management listed above allows this to happen. The differences located on how big is the “root state” allowed and how to reduce unnecessary “render”.

Provider and BLoC is very similar, their pattern best practices only allow state to be stored as high as they needed. In example, on previous graph, states that used by A and B is stored in E but states that used by A and D is stored in root (G). This ensure the render only happen on those component that needed it. But, the problem arise when D suddenly need state that stored in E. We will need a refactor to move it to G.

Redux and Mobx is very similar, it allows all state to be stored in a single state Store that located at root. Each state in store is implemented as an observable and only listened by component that needs it. By doing it that way, it can reduce the unnecessary render occurred. But, this approach easily bloated the root state since it stores everything. You can implement a sub store, like a store located in E to be used by A and B, but then they will lose their advantages over Provider and BLoC. So, sub store is basically discouraged, you can see both redux and mobx has no implementation for MultiStore component like MultiProvider in provider and MultiBlocProvider in BLoC.

A bloated root state is bad due to, not only the file become very big very fast but also the store hogs a lot of memory even when the state is not actively used. Also, as far as i read, i can’t find any solution to remove states that being unused in either Redux and Mobx. It’s something that won’t happen in Provider, since when a branch is disposes it will remove all state included. So, basically choosing either Provider or Redux is down to personal preferences. Wether you prefer simplicity in Redux or a bit more complex but has better memory allocation in Provider.

Meanwhile, Getx has different implementation altogether. It tries to combine provider style and redux style. It has a singleton object to store all active states, but that singleton is managed by a dependency injector. That dependency injector will create and store a state when it’s needed and remove it when it’s not needed anymore. Theres a writer comment in flutter_redux readme, it says

> Singletons can be problematic for testing, and Flutter doesn’t have a great Dependency Injection library (such as Dagger2) just yet, so I’d prefer to avoid those.   …   Therefore, redux & redux_flutter was born for more complex stories like this one.

I can infer, if there is a great dependency injection, the creator of flutter redux won’t create it. So, for the first criteria in **easiness of usage**, i think, **won by Getx** (+2 point)**.**

> There is a state management that also build on top dependency injection GetIt. But, it got removed in the first round due to very low popularity. Personally, i think it got potential.

Business logic separation

Just like in the previous criteria, all state management also has their own level of separation. They differ in their way in defining unidirectional data flow. You can try to map each of them based on similarity to a more common design pattern like MVVM or MVI.

Provider, Mobx and Getx are similar to MVVM. BLoC and Redux are similar to MVI.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-11.webp)

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-12.webp)

In this criteria, i think **there’s no winner** since it boils down to preference again.



Easy to learn

Finally, the easiest criteria in **easiness of usage**, easy to learn. I think there’s only one parameter for it. To be easy to learn, it have to introduced least new things. Both, MVVM and MVI is already pretty common but the latter is a bit new. MVI’s style packages like redux and bloc, introduce new concepts like an action and reducer. Even though Mobx also has actions but it already simplified by using code generator so it looks like any other view model.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-13.webp)

So, for this criteria, i think **the winner are those with MVVM’s style** (+2 Point), Provider, Mobx and Getx. Actually, google themself also promote Provider (Google I/O 2019) over BLoC (Google I/O 2018) because of the simplicity, you can watch the show [here](https://www.youtube.com/watch?v=d_m5csmrf7I).

The fourth filter result

We have inspect all criteria in the fourth filter. The result are as the following:

- Getx won twice (4 point),
- Provider and Mobx won once (2 point) and
- BLoC and Redux never won (0 point).

I guess it’s very clear that we will drop BLoC and Redux. But, i think we need to add one more important criteria.

**Which has bigger ecosystem**

Big ecosystem means that a given package has many default tools baked or integrated in. A big ecosystem can help us to reduce the time needed to mix and match tools. We don’t need to reinvent the wheel and focused on delivering products. So, let’s see which one of them has the biggest ecosystem. The answer is Getx, but also unsurprisingly Redux. Getx shipped with Dependency Injection, Automated Logging, Http Client, Route Management, and more. The same thing with Redux, as mentioned before, Redux has multiple sub packages, even though none of it is popular. The second place goes to provider and BLoC since it gives us more option in implementation compared to one on the last place. Finally, on the last place Mobx, it offers only state management and gives no additional tools.

So, these are the final verdict

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-14.webp)

Suddenly, Redux has comeback to the race.

## Fifth Filter: Well maintained

No matter how good a package currently is, we can’t use something that got no further maintenance. We need a well maintained package. So, as always let’s define the criteria of **well maintained**.

1. Code Coverage
1. Last time a commit merged to master
1. Open Pull Request count

Just like previous filter, we will implement ranking system. A winner on a criteria will get 2 point, second place will get 1, and the rest get 0 point.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-15.webp)

So, with above data, here are the verdicts

- Getx 4 point (2+2+0)
- BLoC 4 point (1+1+2)
- MobX 0 point (0+0+0)
- Provider 1 point (0+0+1)
- Redux 0 point (0+0+0)

Lets add with the previous filter point,

- Getx 10 point (4+6)
- BLoC 5 point (4+1)
- MobX 2 point (0+2)
- Provider 4 point (1+3)
- Redux 2 point (0+2)

By now we can see that the winner state management, that allowed to claim the best possible right now, is **Getx.** But, it’s a bit concerning when I look at the code coverage, it’s the lowest by far from the others. It makes me wonder, what happen to Getx. So i tried to see the result more closely.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-16.webp)

After seeing the image above, i can see that the problem is the get_connect module has 0 coverage also several other modules has low coverage. But, let’s pick the coverage of the core modules like, get_core (100%), get_instance(77%), get_state_manager(51%,33%). The coverage get over 50%, not too bad.

![Image](/assets/images/blog/1039c2f2-09d1-4c78-8f5a-8a03e46fb708-17.webp)

Basically, this result means we need to cancel a winner status from Getx. It’s the win on big ecosystem criteria. So, lets subtract 2 point from the end result (10-2). It got 8 points left, it still won the race. We can safely say it has more pros than cons.

## Conclusions

The final result, current best state management is **Getx** 🎉🎉🎉. Sure, it is not perfect and could be beaten by other state management in the future, but currently it’s the best.

So, my decision is "**I should use GetX**"
