---
title: "Flutter x VS Code Server = \"Mobile\" Developer (PART-2)"
date: "2020-06-17"
tags: []
featured: false
description: "Tutorial Setup VS Code Server Di post sebelumnya part-1, saya menceritakan kenapa tutorial ini sangat menarik. Kebebasan yang ditawarkan konfigurasi ini sang..."
readTime: "5 min"
image: "/assets/images/placeholder-blog.jpg"
---

## Tutorial Setup VS Code Server
Di post sebelumnya (part-1), saya menceritakan kenapa tutorial ini sangat menarik. Kebebasan yang ditawarkan konfigurasi ini sangat menggiurkan.
## Prerequisite
Sebelum kita mulai, ada beberapa hal yang perlu disiapkan yaitu:
1. Akun Google Cloud Platform dan terpasang billing
1. Domain pribadi, tutorial dibawah domain dibeli di [https://domain.google](http://domain.google/)
Saya memilih Google cloud platform (GCP) karena kemudahan integrasi kepada sistem google yang lain, termasuk ke DNS nya, adanya opsi pembayaran menggunakan rupiah, dan tersedianya data center di Indonesia. Data center ini merupakan hal yang sangat penting, karena dapat menekan kecepatan akses ke server google. Jika sebelumnya yang terdekat adalah ke singapura dan rata rata ping bernilai ratusan ms, ke jakarta kini hanya membutuhkan puluhan ms.
Tutorial kali ini akan terbagi menjadi 3 step yaitu:
1. Setup Virtual Machine (VM)
1. Setup Domain DNS
1. Instalasi Flutter
## Setup Virtual Machine
Di GCP produk VM disebut [compute engine](https://console.cloud.google.com/compute/instances). Kita akan mengikuti petunjuk yang sama dengan official guide dari [code-server](https://github.com/cdr/code-server/blob/master/doc/guide.md). Hanya saja, saya akan lebih mendetailkan dan memberi langkah tambahan sebagai tips. Mari kita mulai..
**VM Creation**
1. Masuk ke menu [compute engine](https://console.cloud.google.com/compute/instances), lalu klik "create instance".
1. Beri nama instance dan label sesuai kemauan mu.
1. Pilih Region "asia-southeast2(Jakarta" dan pilih salah satu zona yang tersedia.
1. Pilih seri mesin "E2" dangan tipe mesin "e2-highcpu-2(2 vCPU, 2 GB Memory)".
1. Klik "change" di menu Boot Disk, pilih os Debian GNU / Linux 10 (buster). Lalu pilih tipe dan ukuran disk yang diinginkan. Pada guide resmi, mereka merekomendasikan 32 GB SSD. Namun, **saya merekomendasikan 20 GB standard persistant disk**, karena selain lebih murah, saya rasa segitu sudah cukup dan tidak ada penurunan kecepatan disk yang signifikan terasa (jika memang terbiasa menggunakan HDD di laptop).
1. Centang allow http traffic dan allow https traffic di menu firewall.
1. Klik "Management, security, disks, networking, sole tenancy" untuk mebuka menu advance.
1. Pada Kolom Automation masukkan Startup Script berikut, hal ini akan membantu kita untuk menjalankan code-server secara otomatis setiap menyalakan VM kita. Karena VM ini akan selalu kita mati nyalakan untuk menghemat biaya.
systemctl --user restart code-server
1. Klik "create" dan tunggu vm ready dan klik tombol "ssh" untuk membuka window ssh terminal.
**VM Setup**
VM yang baru dibuat benar benar kosong, ada beberapa hal yang perlu kita install dana atur..
1. Lakukan apt update untuk memastikan mendapat version terbaru dari program yang akan diinstall
$ sudo apt-get update
1. Install htop, untuk melihat penggunaan resource dalam sistem.
$ sudo apt-get install htop
1. Install wget, untuk membantu mendownload file.
$ sudo apt-get install wget
1. Install unzip, untuk melakukan ekstraksi terhadap file yang di *compress*.
$ sudo apt-get install unzip
1. Install git, untuk ... *well git's things*
$ sudo apt-get install git
1. Enable alias untuk command "ll". Untuk mempermudah melihat isi directory
$ sudo nano .bashrc alias ll='ls -lAF' $ sudo source .bashrc
1. Setup swap file sebesar 1 GB. Apa itu swap file? google aja..
$ sudo fallocate -l 1G /swapfile $ sudo dd if=/dev/zero of=/swapfile bs=1024 count=1048576 $ sudo chmod 600 /swapfile $ sudo mkswap /swapfile $ sudo swapon /swapfile $ sudo nano /etc/fstab # copy paste line berikut ke baris terakhir /swapfile swap swap defaults 0 0 $ sudo nano mount -a
1. Pastikan swap telah muncul sebesar 1GB dengan menjalankan htop
$ htop
**Code Server Installation**
1. Download dan jalankan script instalasi [code-server](https://github.com/cdr/code-server)
$ curl -fsSL https://code-server.dev/install.sh | sh $ systemctl --user restart code-server
1. Ganti password admin dari code-server
$ sudo nano ~/.config/code-server/config.yaml $ systemctl --user restart code-server
1. Install caddy server dan setup menjadi reverse proxy, caddy akan secara otomatis menggunakan certificate yang dibuat di [let's encrypt](https://letsencrypt.org/). Jika terdapat certificate, akses domain kalian menggunakan https, jika tidak gunakan http.
$ echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" \     | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list $ sudo apt update $ sudo apt install caddy $ sudo nano /etc/caddy/Caddyfile
# hapus semua tulisan yang sudah ada dan ganti menjadi # ganti tulisan _mydomain.com_ menjadi nama domain anda # subdomain vscode berfungsi untuk mengakses code-server # subdomain flutter untuk mengakses hasil run dari flutter vscode.mydomain.com {     reverse_proxy 127.0.0.1:8080 } flutter.mydomain.com {     reverse_proxy localhost:3600 }
## Setup Domain DNS
Sepertinya bagian yang ini kalian sudah sangat paham. Karena jika kalian punya domain pasti sudah terbiasa mengatur DNS. Yap betul, kalian perlu:
1. Melihat *External IP* dari VM yang kalian buat di console compute engine.
1. Copy alamat IP tersebut
1. Ke halaman pengaturan DNS dari domain kalian
1. Buat sebuah A Record dengan host vscode dan flutter menuju alamat IP yang sudah di copy.
hostnamerecord typeTime To Live (TTL)Data   vscodeA5mcopas ip disini flutterA5mcopas ip disini
1. Walaupun muncul tulisan kamu diminta menunggu 48 jam, jika kalian menggunakan DNS google, cukup menunggu sekitar 5-10 menit saja.
Sampai sejauh ini, kalian sudah dapat menggunakan VS Code di browser dengan membuka [vscode.mydomain.com](http://vscode.mydomain.com/) di browser kalian. Jika belum muncul silahkan coba tunggu beberapa menit lalu coba refresh. Bisa jadi juga, halaman putih tapi sebenarnya hanya loading untuk memunculkan halaman vscode, cukup tunggu beberapa detik. Hal ini bisa kalian cek dengan memastikan apakah *favicon* sudah muncul.
## Instalasi Flutter
Ini bagian penutup dan paling mudah, seperti nya tidak perlu tutorial kan.. 🤓? Iya, iya.., saya buatin tutorialnya di next post yaa..
