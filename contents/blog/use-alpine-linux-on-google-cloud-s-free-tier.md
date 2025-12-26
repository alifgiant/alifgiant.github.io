---
title: "Use Alpine Linux on Google Cloud’s Free Tier"
date: "2025-01-23"
tags: ["Tech"]
featured: false
description: "Introduction Google Cloud’s Free Tier gives you a real, fully customizable virtual machine VM. The catch? Its ruthlessly limited: just 1 vCPU, 1 GB of RAM. T..."
readTime: "7 min"
image: "/assets/images/blog/cover-184835c2-e62f-80f3-a623-e3188ae893b7.png"
---

# **Introduction**
**Google Cloud**’s Free Tier gives you a real, fully customizable virtual machine (VM). The catch? Its ruthlessly limited: just 1 vCPU, 1 GB of RAM. That’s where **Alpine Linux **shines, it has tiny memory and disk footprint, smaller than most Linux distros. Alpine lets you turn this modest VM into a viable spec for hosting apps, tools, or experiments. Let’s turn those constraints into opportunities.
# **Google Cloud’s Free Tier**
Google Cloud is one of most prominent cloud platform out there. They offer an always free product in addition to free trial offering. It is very interesting since it mean we virtually could run a full Linux machine with zero cost, *forever*.
Here is some notable spec that you should remember
- **Machine Spec : **`e2-micro` (1 vCPU, 1 GB RAM)
- **Region : **
  - Oregon: `us-west1`
  - Iowa: `us-central1`
  - South Carolina: `us-east1`
  - **Disk Storage : **`30 GB`** **standard persistent disk
- **Bandwidth** : `~30Gbps`
- **Egress (Outbound) Volume:**
  - **Premium tier : **`1 GB` per month, to all region destinations (excluding China and Australia) 
  - **Standard tier : **`200 GB`** **per month
  - **Ingress (inbound) Volume : **No limit
- **Cloud Storage** : `5 GB`
> ⚠️ This numbers might be changed by google, i recommend you to double check on their side
  [https://cloud.google.com/free?hl=en](https://cloud.google.com/free?hl=en)
  # **Alpine Linux**
Alpine is one of lightest linux distribution, which require ~130MB storage when installed to disk. It also spend only about ~100MB memory on idle which fall nicely on the constrained spec above.  On the other hand other distros (like Ubuntu) eat 300-500MB RAM at idle and require 2-4GB disk space, leaving little room for us. 
This minimalist footprint is because it simply lack of many bundled package. Which mostly you could install manually from its own package manager called `apk`.
[https://alpinelinux.org/cloud/](https://alpinelinux.org/cloud/)
# How to install
Normally it’s quite easy to setup a new VM. You could just click [Create Instance](https://console.cloud.google.com/compute/instancesAdd) and follow through the guided steps and select options as you like. But the catch is, Alpine is not one of officially supported image. You need to use `Custom image` to allow Alpine to be installed.
So here are the steps to make sure you can run it correctly on GCP. I recommend you to use cloud shell to run any command i share below instead of doing it on your local terminal. This will help you with 2 things:
1. No need to install and prepare `gcloud` 
1. Fast connection for upload/download
1. Access from anywhere, as long as you have browser
> 💡 You could open cloud shell on top right of you Google Cloud dashboard. 
OK, now lets get started.
## **Prerequisite**
- Sign up for [Google Cloud’s Free Tier](https://cloud.google.com/free) (requires credit card, but free tier stays $0 if you don’t exceed limits above).
- Enable **Compute Engine API** (required for VM creation).
- Knowledge of basic commands to operate shell
## Step by step
### **1. Create Google Storage Bucket**
First thing you have to do is create a cloud storage bucket. This is where you will store a pre-built image of Alpine Linux Cloud to be use as VM custom image. One thing to especially noted of is that this bucket should be located in same region as your targeted region to deploy your VM. For example `us-west1 (Oregon)` . I recommend you to create a folder (i.e `alpine-image`) to store this image, so in future you could store another image that you like in same place.
    ![Image](/assets/images/blog/186835c2-e62f-802f-84cd-c97caff0f8b7-1.png)
      ![Image](/assets/images/blog/186835c2-e62f-806a-b2b3-dd9992ebb85b-1.png)
    
    ### **2. Create Alpine’s Cloud Image**
After you’re done creating the bucket now you can download the prebuilt cloud image and create VM image out of it. Now open your cloud shell and download alpine with following command.
```bash
wget https://dl-cdn.alpinelinux.org/alpine/v3.21/releases/cloud/gcp_alpine-3.21.2-x86_64-uefi-tiny-r0.raw.tar.gz
```
If the URL above do not work, you might want to check on their [official page](https://alpinelinux.org/cloud/), and copy the download URL there. You need to select :
1. Cloud provider : Google Cloud
1. Release : 3.21.2
1. Arch : x86_64
1. Firmware : UEFI
1. Bootstrap : Tiny Cloud
1. Machine : Virtual
![You can get the url by hovering on download button or click copy url on it](/assets/images/blog/184835c2-e62f-80f3-a623-e3188ae893b7-1.png)
After download complete, copy the downloaded file to the bucket you created before
```bash
gcloud storage cp gcp_alpine-3.21.2-x86_64-uefi-tiny-r0.raw.tar.gz gs://[your bucket]/[your image folder]
```
Then you can create a VM image from the downloaded file
```bash
gcloud compute images create gcp-alpine-3212-x8664-uefi-tiny
   --project=[your project id]
   --description="gcp_alpine-3.21.2-x86_64-uefi-tiny-r0"
   --family=alpine-linux
   --source-uri=https://storage.googleapis.com/[your bucket]/[your image folder]/gcp_alpine-3.21.2-x86_64-uefi-tiny-r0.raw.tar.gz
   --storage-location=us-west1
   --architecture=X86_64
   --guest-os-features=GVNIC,VIRTIO_SCSI_MULTIQUEUE,UEFI_COMPATIBLE
```
Command above will let VM to run using `UEFI` and using `GVNIC`. Also a reminder that the storage location is `us-west1`, same as where you want to deploy your VM. If everything correct so far, you will see following result in your [vm images](https://console.cloud.google.com/compute/images) dashboard.

![Image](/assets/images/blog/184835c2-e62f-80f3-a623-e3188ae893b7-2.png)
### **3. Create and Launch VM**
Last but not least, you now can [Create Instance](https://console.cloud.google.com/compute/instancesAdd) based on the Alpine prebuilt image. To do that, you have to select custom images when configuring boot disk. If you have use different region on previous steps you wont see the image here. So make sure you are using same region on all steps including on the VM creation region. You also have to change your boot disk type to `Standard Persistent Disk`, by default you will be selecting `Balanced Persistent Disk` which not included in the free tier.
![Select custom image and your newly created VM image.](/assets/images/blog/184835c2-e62f-80f3-a623-e3188ae893b7-3.png)
After preparing boot disk, move onto `Security` section on the creation process. In this phase there is a very important thing to do, which is **adding a manually generated SSH key**. This to ensure you can connect to the VM after creation via SSH. Miss on this step will result on your VM unreachable, because by default your machine will not allowing password login.
![Image](/assets/images/blog/184835c2-e62f-80f3-a623-e3188ae893b7-4.png)
To create an SSH Key, can run command below. Notice that you have to add `alpine` in the comment param. This have to be done since Google Cloud will use the comment field to determine what user it belongs to.
```bash
ssh-keygen -t ed25519 -C "alpine" -f ~/.ssh/alpine-gcp
```
If the SSH generation command works correctly you should see something like this
```bash
> cat ~/.ssh/alpine-gcp.pub
ssh-ed25519 AAAAC3NZAc1Lzdi1nte5aaaaiosu2eyCQfB/uBziBP...... alpine
```

After SSH key added, I recommend you to recheck all configuration once again, then click on `create`
> ⚠️ You can't add ssh key from VM edit page after VM creation because at that point TinyCloud already finish init. When TinyCloud finish init, it will mark as complete and won't run again.
  You will need to attach your disk to another VM to update the config or just repeat the creation process and make sure you add it on the creation config.
  if you want to add another ssh key after VM reset you can run
  `tiny-cloud --bootstrap incomplete`
  ### **4. Access**
This is the moment of truth. If all working correctly, after you click create just wait a bit (a couple second) to make sure init is complete, then you could access your VM via SSH
```bash
ssh -i ~/.ssh/alpine-gcp alpine@[your VM public IP]
```
To see your machine resource usage, you could run bundled app `top` . But, if you like it to be more human readable, like me, you could also run `htop` . You will need to install it because it’s not bundled.
```bash
doas apk update
doas apk add htop
```
![Using htop](/assets/images/blog/184835c2-e62f-80f3-a623-e3188ae893b7-5.png)
> 💡 Alpine do not have `sudo` bundled, it uses `doas` as replacement
# Closing
Google Cloud’s free-tier VM isn’t “generous,” but Alpine Linux turns it into a viable playground for developers who value control. Unlike restrictive PaaS free tiers, you own the OS—so you can:
- 🛠️ **Experiment**: Test Kubernetes, IoT backends, or CI/CD pipelines.
- 📉 **Optimize**: Learn to build lean, efficient systems.
- 💡 **Scale Later**: Upgrade to a paid VM without rearchitecting.
**Pro Tips**:
- Schedule backups with `rsync` to another cloud storage bucket.
- To stay within free limits: Avoid heavy bandwidth or compute tasks.
---
