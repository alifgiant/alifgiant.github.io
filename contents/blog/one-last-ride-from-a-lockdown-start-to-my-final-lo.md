---
title: "One Last Ride: From a Lockdown Start to My Final Log-out at Grab"
date: "2026-03-17"
tags: ["Rants"]
featured: false
description: "My cursor is hovering over the \"Log Out\" button, and for a moment, I just sit here listening to the silence of my room. Mandatory Last Day Picture At Office/..."
readTime: "8 min"
image: "/assets/images/blog/cover-321835c2-e62f-80fb-9e85-c14e3204a365.jpg"
---

My cursor is hovering over the "Log Out" button, and for a moment, I just sit here listening to the silence of my room.

![Mandatory Last Day Picture At Office](/assets/images/blog/321835c2-e62f-80fb-9e85-c14e3204a365-1.jpeg)
<figcaption class="notion-caption">Mandatory Last Day Picture At Office</figcaption>

It is March 2026. The silence in this home office is exactly the same as it was nearly five years ago, back in August 2021. But everything else has changed.

Back then, the world had shut down. My journey with Grab started with a courier dropping a wooden package with a cardboard box inside. There was no office tour, no team lunch, just an onboarding package, some fliers and a MacBook. I pulled out the laptop, connected to the Wi-Fi, and suddenly, my isolated room cracked wide open. For the first time in my career, I was plugged into a massive global grid. My daily reality became a grid of faces dialing in from Singapore, Malaysia, Thailand, Vietnam, China, India, even as far as the US.

## The Standard of the Giant

I was hired as a Senior Mobile Software Engineer for the Merchant App. In the beginning, my expectations were straightforward: write good code, ship cool features. But when I watched the Grab IPO ring the bell on the Nasdaq from my living room monitor, the true scale of the machine I was touching finally hit me. This wasn't a game. The code I was pushing affected the livelihoods of millions of small business owners across Southeast Asia.

Building for that kind of scale means that reliability is not an afterthought, it is the floor everyone walks on. No matter what team you are on at Grab, the daily reality of a Senior Engineer is governed by a rigorous, unforgiving rhythm. My days were shaped by internal spec reviews, tech family scrutinies, security audits, RFCs, and the heavy, humbled silence of post-mortems. It is a crucible that teaches you to justify every single line of code you write.

## The Bridge to the Core

For the first part of my journey, my world was entirely feature-driven. I moved through multiple teams within the Merchant app, solving specific problems for our users. But as I spent more time navigating the codebase, I began to see the connective tissue, or sometimes, the lack thereof, between the different domains. I found myself less interested in building a single room, and more obsessed with the plumbing and architecture of the entire building.

That curiosity led me to my final destination: the **Merchant Core Platform team**.

Joining Core didn't change the rigorous routine, but it completely flipped my mental model. In Core, you are no longer trying to solve a feature problem; you are seeking to solve *cross-team* problems. My "users" were now the other developers. I had to build the bridges between isolated services, forge the tooling that allowed feature teams to move fast, and erect the guardrails that kept them from bringing the system down.

I had to become part-diplomat and part-archaeologist, deep-diving into scattered documentation, scrolling through 2018 Slack threads to understand forgotten context, and seeking alignment across timezones. During chaotic launches, my job was to be the anchor, maintaining absolute clarity when everything else was a blur.

It was within this cross-team focus that I accomplished the work I am most proud of. Looking back, the milestones that define my time here include:

- **Introduced In-App Developer Tools:** I built a suite of tools (remote-config overrides, cache overrides, logs inspector) that now accumulates over 300 daily sessions from Grab engineers, speeding up their day-to-day work.
- **Led a massive architectural migration:** I orchestrated the move of a legacy Redux-based system into MVVM, spanning 1,400+ files and coordinating 15 engineers across 4 major tech families.
- **Initiated a direct-to-developer issue resolution workflow.** I designed a system that bypasses the long escalation chain by routing in-app user feedback directly to us. It processes 20,000 feedback submissions weekly, auto-categorizes the top 5 issues for the on-call developer, and uses an AI-assisted self-troubleshooting flow that solves up to 62% of targeted cases.
- **Identified and fixed major performance degradations:** Following a Flutter upgrade, I diagnosed and resolved critical bottlenecks. These fixes reduced user-perceived ANRs (App Not Responding) by 400%, and cut app start times by 16% on Android and 10% on iOS.
- **Drove continuous platform optimizations:** Beyond the major projects, my day-to-day involved countless under-the-hood improvements to enhance performance, shrink app size, and speed up build times for the team.

## Surviving the Storms and Chasing the Future

But the ride wasn't always a straight line up. When the pandemic boom settled, the tech industry fractured. I watched major reorgs sweep through the company. Seeing some of my most brilliant colleagues leave was a bitter pill, a reality I had faced in a previous job, but one that never loses its sting.

In the wake of those layoffs, the company’s core values, Heart, Hunger, Honour, and Humility (the 4Hs), were the only things keeping us grounded. Our leadership leaned in, using countless All-Hands meetings to define our path forward with a closeness and transparency I deeply respected. We had to maintain the *Honour* to keep the engine running for our merchants, even when our own house felt shaken.

And then, the industry tilted on its axis.

The AI wave hit, and instead of pulling back, Grab pushed us forward. I will always be grateful for the trust and investment our leadership poured into us during our AI sprints. We were handed the time, the budget, and the mandate to tinker with the unknown. I dove headfirst into building AI tools, using RAG, LangGraph, LangChain, MCP, even automation with n8n. We learned the new kids on the block, and in doing so, we shifted our entire paradigm. Software development as I knew it in 2021 was gone forever, replaced by something infinitely more dynamic.

## The Proximity Gap

Through all of this, working from home was a profound blessing. The work-life balance was superb. I was able to be incredibly close to my family, present for the everyday moments that a commute usually steals.

Looking back at the pandemic days, remote work was the great equalizer. Because we were all behind screens, a simple chat could always turn into an open discussion, there was nothing to seek beyond the thread. Absolute clarity in our documents was the baseline. But as the world healed and offices reopened, the landscape shifted beneath my feet.

I still traveled to the office every three months, and those rare days were incredible for connecting with the team. But I started to notice a creeping reality: the era of meticulous remote documentation was fading. The office was alive again, and with it came the return of the "bump talk." Crucial decisions were happening by the coffee machine. Context was being shared in the hallways.

Slowly, I felt my grip loosening. When you are fully remote in a hybrid world, you realize that projects and opportunities are often assigned based on physical proximity. The human connection is beautiful, but for the remote worker, it creates a silent barrier.

## The Hard Path Forward

That realization brings me to today.

Leaving Grab is a deeply conflicted decision. This company offers unparalleled stability. The projects are fascinating, the remote setup is comfortable, and the people are world-class.

But stability is a dangerous comfort. I realized that I had become *too* comfortable, and comfort is not the formula for growth. To force myself to level up, I have to step out of this quiet room. I am choosing a new adventure, returning to a physical office, in a completely different environment, to tackle a totally different project area. I need that friction again.

I am leaving behind a massive chapter of my life, and frankly, a lot of unfinished work. To **Willy**, the engineer inheriting my backlog: I am so genuinely sorry, and thank you.

I could not have made this journey alone. Thank you to **Budi**, my very first manager at Grab and my best friend, for opening the door. To **Greg**, who remains the absolute best manager I’ve ever had. To **Rifa**, my fellow remote partner who understood the unique isolation and **joy** of this setup. And to **Dante**, my final manager, who trusted me with the critical projects that defined my last year here.

The off-boarding emails always end with the same phrase: *Once a Grabber, always a Grabber.* Today, as I look at this screen one last time, I know it's true. I am walking away, but I am taking the hunger, the lessons, and the honour with me.

**The ride is over. Time to Log out. **📱


