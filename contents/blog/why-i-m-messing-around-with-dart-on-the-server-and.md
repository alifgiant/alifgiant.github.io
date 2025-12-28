---
title: "Why I'm Messing Around with Dart on the Server (And Why You Totally Should Too!)"
date: "2025-06-20"
tags: ["Tech"]
featured: false
description: "Alright, fellow mobile developers, let's be real for a sec. Have you ever think of backend feels like a black box, a magician hat 🎩? And maybe, you've secre..."
readTime: "6 min"
image: "/assets/images/blog/cover-217835c2-e62f-80db-94f3-fd9d1393ea52.jpeg"
---

Alright, fellow mobile developers, let's be real for a sec. Have you ever think of backend feels like a black box, a magician hat 🎩? And maybe, you've secretly wished you could peek inside, or even be the magician yourself? If that sounds familiar, then you and I are probably on the same page.

For a long time, the backend was this mystical place for me. I was happy, well, *mostly* happy, living in my mobile dev **bubble**, consuming APIs, and letting someone else worry about servers, databases, and all that jazz. But then, the curiosity hit. And that's when I started my little adventure with **Dart** on the server.

Now, before you picture me building the next Instagram with a Dart backend, let's hit the brakes. Hard.

### Look, It's Not For Production (Not Yet, Anyway!) ⚠️

Let's get this out of the way right upfront: I am *not* telling you to go rewrite your million-user, mission-critical app in server-side Dart. Its ecosystem is pretty much a baby. For the big leagues, you're still better off with the seasoned pros: Node.js, Python, Go, or whatever your company's been using forever.

But here's the kicker, the actual *reason* I'm even writing this post: that "baby" status is exactly what makes it such a goldmine for mobile devs like us who want to learn backend stuff.

![Image](/assets/images/blog/217835c2-e62f-80db-94f3-fd9d1393ea52-1.png)

### Learning the Hard Way (Which is the Best Way, Kinda) 🫣

When you jump into a super-mature backend framework, it's designed to make your life easy. It handles *so much* for you, which is awesome for shipping fast. But for learning? Not always. You end up calling a bunch of functions without really getting what's happening under the hood. It's like being handed a perfectly cooked meal but having no idea how to boil water.

With Dart on the server, you often *have* to get your hands dirty. And honestly, for learning, that's exactly what you need. It forces you to actually understand the core backend concepts that usually get hidden away. Let me tell you about some of the things that surprised me (and maybe frustrated me a little, at first!):

- **Middleware:** I used to just *know* middleware existed, some magic stuff that runs before your actual code. With Dart, I found myself thinking, "Okay, how do I actually *make* this work? What's the flow here?" It wasn't just a term anymore; it was a process I had to understand and implement. This is where I really had to wrap my head around things like **parsing a JWT** (JSON Web Token) that came in a request, figuring out if it's valid, and then also learning about **path excluding** – making sure my authentication middleware didn't run on, say, my public login endpoint. Small details, big learning.
- **CORS (Oh, CORS...):** Man, **I usually never cared for CORS** because, well, I'm coding for mobile apps, right? The browser-security stuff rarely hits us. But then I started testing my Dart backend code on a simple web frontend, and suddenly, "Access-Control-Allow-Origin" errors became my new nightmare. **I would never have known that every request to a different domain needed a preflight **`OPTIONS` request first, with specific headers, and that the browser expected a certain response back. That was a whole **entire night** of head-scratching, let me tell you.
- **Database Connections & Transactions:** It's easy to just `save()` something with an ORM and call it a day. But really digging into Dart, I started to grasp that a database transaction isn't compiling all my stuff into just one SQL command. It builds around a **session, **a** connection pool**. It made me appreciate deeply ORM and understand why Supabase sdk don't have transaction, because it build on top Postg***rest***.
- **Caching with Redis:** Redis, a key-value store, sounds simple, right? But understanding how it actually works, like it's using **sockets behind the scenes** and it actually could persist data. It was a piece of a bigger, faster puzzle. In fact, that deep dive into Redis connections even led me to opening a [pull request](https://github.com/google/dart-neats/pull/293) on the `neat_cache` package, trying to improve something there. It's still chilling there, unmerged, but hey, I learned a ton!
- **Deployment (My Docker Odyssey):** Since Dart's server-side community is still kinda small, you don't have a million "one-click deploy" options. This meant diving headfirst into **Docker**. Learning how to containerize my app, pushing image to Docker registry (i actually need to host one 🤫), and figuring out how to actually get my code running securely on a server was a huge learning curve. Seriously, I spent **hours just trying to figure out server port policies** to make sure my app wouldn't be some open door on the internet.

Yeah, it's gonna take you longer to build things than if you just grabbed a super-mature framework and followed a quick tutorial. I won't argue.

### It's an Investment in *You *🧠

But that "longer" time? It's an investment, pure and simple. You're not just learning a specific framework's magic tricks; you're learning the fundamental principles of how the internet, servers, and applications actually talk to each other. This knowledge isn't tied to Dart; it's universal. It's the kind of stuff that makes you a truly knowledgeable software engineer, not just someone good at a specific mobile framework. You won't be siloed in just mobile development anymore. You'll be able to understand the whole picture.

### And Hey, It's Not a Slouch Either!

While I've hammered home that Dart's server ecosystem is young and perhaps not for the absolute biggest projects, let's not mistake "young" for "slow." Dart's raw performance? It's actually pretty solid. If you peek at benchmarks like those on [sharkbench.dev/web](https://sharkbench.dev/web), you'll see it comfortably holds its own. It might not be top of the charts, but it's far from being a snail. For most applications, especially the kind you'd start with to learn, Dart's speed won't be your bottleneck. It's perfectly capable.

![giphy](/assets/images/blog/217835c2-e62f-80db-94f3-fd9d1393ea52-2.gif)
<figcaption class="notion-caption">giphy</figcaption>

So, if you're like me – a mobile developer with a burning curiosity about what goes on beyond the app screen, and you're willing to embrace a little bit of a challenge for a huge learning payoff – then seriously, give Dart on the server a shot. It's been an eye-opener for me, and I bet it will be for you too.

What do you think? Ready to jump in and get your hands a little dirty? 🛤️
