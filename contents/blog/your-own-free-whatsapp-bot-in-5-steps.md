---
title: "Your Own Free WhatsApp Bot in 5 Steps! 🤖"
date: "2025-08-19"
tags: ["Tech"]
featured: false
description: "What if I told you that you can build your very own AI assistant on WhatsApp, host it yourself, and do it all for free? That's right—no monthly subscriptions..."
readTime: "6 min"
image: "/assets/images/blog/cover-254835c2-e62f-80bb-873e-c202e4918abd.jpg"
---

What if I told you that you can build your very own AI assistant on WhatsApp, host it yourself, and do it all for free? That's right—no monthly subscriptions, no expensive cloud bills, just a few open-source tools and your own server. This guide will walk you through the entire process, using [**Coolify**](https://coolify.io/) to manage everything, [**n8n**](https://n8n.io/) to build the workflow, and a super-efficient, *unofficial* WhatsApp client called [**GOWA**](https://github.com/aldinokemal/go-whatsapp-web-multidevice).

![illustration of final result](/assets/images/blog/254835c2-e62f-80bb-873e-c202e4918abd-1.png)
<figcaption class="notion-caption">illustration of final result</figcaption>

Interested? Let's get started 😎.

# Step 1: Install Coolify and Deploy n8n 🗓️

First things first, let's get your server (VPS) ready. Coolify is the control panel that makes managing everything easy. Then, we'll use it to deploy n8n, the architect of our bot's conversation flow.

1. Connect to your VPS and install Coolify.
  ```bash
  curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
  ```
  
  You can find more detail information on this installation script in [Coolify’s official documentation](https://coolify.io/docs/). Make sure you read these doc to learn on basic UIs controls.
1. Once Coolify is up and running, log in to its dashboard.
1. In your Coolify dashboard, create a new project. Put your project name and description, then click on continue.
  ![Image](/assets/images/blog/254835c2-e62f-80e2-ae3d-f040d1ce765e-1.png)
  
  ![Image](/assets/images/blog/254835c2-e62f-80e2-ae3d-f040d1ce765e-2.png)
1. Add a new resource and choose n8n from the list. Choose one with Postgresql
  ![Image](/assets/images/blog/254835c2-e62f-8027-b815-fc2b74843656-1.png)
  
  ![Image](/assets/images/blog/254835c2-e62f-8027-b815-fc2b74843656-2.png)
1. Rename the service name as you see fit, and if you have custom domain you can also set it here on the n8n services.  `Don’t forget to remove the port from your domain setting` .
  ![Image](/assets/images/blog/254835c2-e62f-8025-8afc-d0e56fe1de69-1.png)
1. Once everything is good, click on `Deploy` button, Coolify will handles all the messy details and gets it ready to go. You can access your dashboard via the domain before and setup an admin account by following dashboard guide. `Don’t forget to claim your free unlimited workflow`
  ![Image](/assets/images/blog/254835c2-e62f-80f9-81e7-d09275a63f5f-1.png)
  
  ![Image](/assets/images/blog/254835c2-e62f-80f9-81e7-d09275a63f5f-2.png)
  
  ![Image](/assets/images/blog/254835c2-e62f-80f9-81e7-d09275a63f5f-3.png)

---

# Step 2: Set Up and Connect GOWA 💬

GOWA is a very lightweight and memory-efficient **unofficial** WhatsApp API client. It's a key part of this project, but it's important to know that because it's not from WhatsApp directly, there's always a small chance they could block your account. So play safe, don’t use your main account for this experiments.

Ok, back to the guides:

1. Back to your Coolify dashboard, add another Docker container resource for GOWA (use docker image `aldinokemal2104/go-whatsapp-web-multidevice`). Similar to previous step you can configure multiple thing before you click on deploy. Especially you need to setup correct port mapping (by default env’s `APP_PORT` port is set to `3000` so set `Configuration > General > Network > Ports Exposes` to `3000`).
  ![Image](/assets/images/blog/254835c2-e62f-80b3-9937-d6a298716b9d-1.png)
  
  You copy other env configs i listed below for your setup, make sure to replace the values as your need. Take special note on `WHATSAPP_WEBHOOK_SECRET` since we will use it later to keep things secure.
  
  ```bash
  APP_ACCOUNT_VALIDATION=false
  APP_BASIC_AUTH=user:password
  APP_DEBUG=true
  APP_OS=web-gowa
  APP_PORT=3000
  DB_URI=postgres://postgres:password@internaldomain:5432/postgres
  WHATSAPP_WEBHOOK=https://n8n.domain.com/webhook/<production-path>,https://n8n.domain.com/webhook-test/<test-path>
  WHATSAPP_WEBHOOK_SECRET=my-secret
  ```
1. Once GOWA is up, go to its web UI and connect your Whatsapp account by clicking on `Login`. You'll see a QR code. Open the WhatsApp app on your phone, go to **Linked Devices**, and scan the code. Just like that, you're connected.
  ![Image](/assets/images/blog/254835c2-e62f-80b6-b30d-ce71be52b402-1.png)
1. Continue in n8n dashboard, go to **Settings > Community Nodes,** enter **`@aldinokemal2104/n8n-nodes-gowa`**. Then tap on install. After installation complete you can find gowa nodes inside new workflows.
  ![Image](/assets/images/blog/254835c2-e62f-80cc-bd3c-f32caf3a4ed6-1.png)
  
  ![Image](/assets/images/blog/254835c2-e62f-80cc-bd3c-f32caf3a4ed6-2.png)

Another popular unofficial Whatsapp client to create automation is [WAHA](https://waha.devlike.pro/) you might want to check wether WAHA is more suitable to your needs. I use GOWA since it’s more lightweight which preferable on limited VPS configuration. If you choose to use WAHA, steps to onboard are basically the same.

---

# Step 3: Secure the Webhook & Trigger the Workflow 🔐

We need to make sure that only your GOWA instance can send messages to your n8n workflow.

1. Start a new workflow in n8n with a **Webhook** trigger node.
  ![Image](/assets/images/blog/254835c2-e62f-807d-8146-fbd0b8d306a6-1.png)
1. Copy the webhook URL n8n gives you. Then, go back to your GO-WA settings in Coolify and paste this URL as the `WHATSAPP_WEBHOOK` env. Make sure to copy both test url and prod url so you can test your configuration.
1. GOWA will send `headers['x-hub-signature-256']` on every webhook call. We can use that header to make sure our webhook is only being called by GOWA instance. You need to enable `Raw Body` option on the webhook options. Next, create new action `crypto` and use secret defined on env `WHATSAPP_WEBHOOK_SECRET`. You can use the output to match with signature header using `if` action.
  ![Image](/assets/images/blog/254835c2-e62f-808a-8723-d47c2442ba1a-1.png)
  
  ![Image](/assets/images/blog/254835c2-e62f-808a-8723-d47c2442ba1a-2.png)

---

# Step 4: Add the Brain: Connect to an LLM 🧠

Now for the fun part. We'll give our bot a brain by connecting our workflow to a large language model (LLM) that can actually hold a conversation.

1. Drag an **AI Agent** node onto the n8n canvas and link it to the `if` action.
1. You'll need an API key to talk to an LLM. We'll use OpenRouter.ai, as it gives you access to a ton of different AI models with just one key. Go to OpenRouter, sign up, and get your new API key from your dashboard.
1. In n8n, tap on the `Chat Model` on `AI Agent` node and find `OpenRouter Chat Model`. Add the credential you created. Also choose a free llm model on both `Chat Model` and `Fallback Model`. You can configure more as you feel fit such as system prompt or response temperature.
  ![Image](/assets/images/blog/254835c2-e62f-8058-86d9-dc05dd40498e-1.png)
  
  ![Image](/assets/images/blog/254835c2-e62f-8058-86d9-dc05dd40498e-2.png)

---

# Step 5: Send the Final Message! ➡️

The last step is to send the AI's reply back to the person who messaged your bot.

1. Add a **GOWA Send a text message** node after the AI Agent.
1. create a new credential for GOWA, using your GOWA’s coolify internal URL, username and password from env `APP_BASIC_AUTH` .
  ![Image](/assets/images/blog/254835c2-e62f-80b9-ad39-c8f3e50f43cd-1.png)
1. Make sure the node is using the GO-WA credential you created earlier.
  ![Image](/assets/images/blog/254835c2-e62f-80c0-af6b-c78b28551fa7-1.png)
1. Tell it to send the message from the AI Agent node's output. On `Phone or Group Id` field will be the phone number of the original sender, make sure to grabs automatically from the webhook data.
  ![Image](/assets/images/blog/254835c2-e62f-8058-9f43-cd1ae8e4dcc8-1.png)

That's all there is to it! You've just built a fully functional AI chatbot hosted on your own server. You will most likely end with this setup

![Image](/assets/images/blog/254835c2-e62f-80bb-873e-c202e4918abd-2.png)

You might not get it working directly if you’re new to n8n and coolify but that’s where the fun is, problem solving 😉. You can also reach out to me if got any question.

---

# The Hidden Gem

## A Totally Free VPS from Oracle 💎

This entire setup gives you total control over your chatbot, and all of your data stays private on your own server. The best part? You can do this all without spending a cent. Consider using a VM from **Oracle Cloud Infrastructure's "Always Free" tier**. They give you enough power to run this whole setup comfortably, making this a truly free and rewarding project.

## Free LLM Power from Cerebras 💎

You exhaust OpenRouter free model limit? No worries, you can get free token from Cerebras (I even use it as my main model now). Register using my referral link below and get free 200k token per day of Qwen3-480B (Coder) [https://cloud.cerebras.ai?referral_code=8e9kj6nv](https://cloud.cerebras.ai/?referral_code=8e9kj6nv).


