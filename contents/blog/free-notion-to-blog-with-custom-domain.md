---
title: "Free!!! Notion To Blog With Custom Domain"
date: "2024-02-08"
tags: ["Tech"]
featured: false
description: "Halo teman teman, Kali ini saya mau membagikan cara terbaru saya untuk membuat Blog blog.alifakbar.comhttp://blog.alifakbar.com/. Dari judulnya bisa ditebak ..."
readTime: "4 min"
image: "/assets/images/blog/cover-468e687b-af91-42f7-abc8-4ad9135db945.jpg"
---

Halo teman teman, Kali ini saya mau membagikan cara terbaru saya untuk membuat Blog ([blog.alifakbar.com](http://blog.alifakbar.com/)). Dari judulnya bisa ditebak ada 2 komponen utama yang teman teman harus siapkan.

1. Notion, sebagai tempat menulis artikel dan mengelola tampilan webnya.
1. Custom Domain, yaa.. alamat web blog mu nanti.

Selain 2 hal ini kalian juga perlu

1. Menyiapkan akun [cloudflare](https://cloudflare.com/)  dan memindahkan konfigurasi DNS domain kalian kesana.

## Pertimbangan Penting!

Sebelum lebih jauh, saya ingin memberikan beberapa alasan sebagai pertimbangan sebelum mengikuti ataupun tidak mengikuti cara yang akan saya jelaskan.

### Alasan Memilih

1. Fokus utama adalah di biaya yang dikeluarkan **harus gratis**.
1. Blog yang dibuat harus **bisa menggunakan custom domain**. Karena kita ingin bisa memiliki kendali terhadap *traffic* dan juga ingin mendorong personal branding.
1. Ada halaman editor dan **manajemen konten yang mudah** digunakan dan bisa diakses dari mana saja
1. Minimal *setup*

### Alasan Tidak Memilih

1. Mau bisa full kostumisasi tampilan halaman web
1. Tidak mau ada setup teknikal / kode sama sekali
1. Adanya fitur blogging lebih lengkap seperti komen, likes dan newslater tersedia *out of box*.
1. Ingin ada *organic traffic *yang besar dari pembaca umum
1. Mau koneksi plugin blogging lain seperti WooCommerce
1. SEO optimized web

## Cara Setup

Sudah ok sama pertimbangan diatas? Ok, sekarang kita gas.

1. Siapkan halaman home blog yang ingin dibagikan di Notion
  ![Image](/assets/images/blog/6bea85dd-7e9a-4b64-89d0-0700ade57278-1.png)



1. Klik tombol share atau bagikan di bagian atas kanan dari halaman tersebut, lalu klik publish.
  ![Image](/assets/images/blog/15d07c62-e83b-49a5-bbc5-92fea6b921a3-1.png)
1. Copy alamat web yang dihasilkan oleh Notion. Kamu juga bisa mencoba melihat halaman web dari halaman notion yang kamu publish dengan mengklik **View Site** atau **Lihat Laman**
  ![Image](/assets/images/blog/e47988c5-7ffb-4bb0-9451-52ee1749a6d4-1.png)
1. Saya asumsikan, teman teman sudah mendaftar di cloudflare dan sudah mengatur DNS domain disana. Lalu, sekarang masuk ke cloudflare dan pilih menu **Workers & Pages** dari sidebar menu.
  ![Image](/assets/images/blog/9a92786e-31fc-47a6-b7a7-f354a3c2453b-1.png)
1. Klik **Create Application** > **Create Worker**
  ![Image](/assets/images/blog/e7c58062-e13c-4aa9-8e3c-7bff66f926e1-1.png)
  
  ![Image](/assets/images/blog/e7c58062-e13c-4aa9-8e3c-7bff66f926e1-2.png)
1. Berikan nama worker sesuai yang kalian inginkan, misal **personal-blog**. Lalu klik **deploy**
  ![Image](/assets/images/blog/1f9bfb5b-9b6d-4a96-9f92-0487e1432489-1.png)
1. Setelah worker berhasil dibuat klik Edit Code.
  ![Image](/assets/images/blog/e7de39f1-b0b4-4044-9440-01ccce32504a-1.png)
1. Kamu akan dibawa ke halaman seperti sebuah VS Code. Nah dihalaman inilah inti dari metode yang akan diterapkan. Untuk sementara silahkan buka tab baru pada browser, kita akan kembali kehalaman ini pada step lain.
  ![Image](/assets/images/blog/8f19fdb6-bbbd-4a67-bf27-7dda2751245a-1.png)
1. Kita akan menggunakan kode yang dibagikan pada [Untitled](https://www.notion.so/771ef38657244c27b9389734a9cbff44). Untuk Tutorial kali ini langsung buka step 2.
  ![Image](/assets/images/blog/90e5a461-13af-48a0-ae8f-de76f5677ae8-1.png)
  
  
  
  *) Di halaman ini juga dibagikan juga cara setup yang lebih lengkap jika ingin mencoba dari 0.



1. Masukkan nama sub-domain ke kolom **Your Domain**, dan masukkan URL halaman notion yang sudah di-copy pada step 3 pada kolom **Notion URL**.
  ![Image](/assets/images/blog/1cb260b9-9840-4e28-a915-ba976662292f-1.png)
1. (Optional) kamu juga bisa membuat halaman dengan link khusus untuk menuju target halaman tertentu, misal `/about`  untuk membuka halaman notion lain. Dan bisa berkreasi lebih jauh dengan membuka `Toggle Style and Script Setting` .
1. Klik `Copy The Code` setelah selesai mengisi kolom yang diinginkan.
1. Buka kembali halaman pada step 8. Hapus code existing dan paste code yang dicopy dari halaman Fruiton. Kurang lebih hasilnya akan seperti gambar dibawah ini.
  ![Image](/assets/images/blog/bee663ed-f9c3-4d09-88e2-afc931c7c992-1.png)
1. Klik tombol `Save and deploy` dari halaman code editor. Lalu klik tombol back di kiri atas.
  `← blog`
1. Kamu akan dibawa kehalaman manajemen worker. Klik `Custom Domains` > `View` .
  ![Image](/assets/images/blog/40733c52-ccc5-4340-a40c-ded0ca38307a-1.png)
1. Kamu sekarang bisa menambahkan custom domain yang kamu mau
  ![Image](/assets/images/blog/49c2faec-02fe-4699-8d3c-c8d3db5c48ff-1.png)
  
  ![Image](/assets/images/blog/49c2faec-02fe-4699-8d3c-c8d3db5c48ff-2.png)
1. Klik `Add Custom Domain` , Cloudflare akan secara otomatis men-*generate *TLS certificate agar website mu bisa diserve via `HTTPS` .
  ![Image](/assets/images/blog/f63bd4b1-956d-4efd-bd25-cabd9500fa32-1.png)
1. Setelah sertifikat aktif, website mu juga kini Aktif. Kamu bisa mengunjungi website mu menggunakan custom domain 💚🌟
  ![Image](/assets/images/blog/bb1965b9-bb16-4ba0-90e9-1f0bd823ac10-1.png)

## Final Thought

Kamu sekarang bebas berkreasi menggunakan notion mu dengan manajemen post sesuka hati. Solusi mudah dan murah, buat kalian yang niat menulis masih datang dan muncul. Semoga membantu 🫡



p.s

Catatan lain, tombol back tidak berfungsi sesuai ekspektasi. jadi mungkin sediakan tombol back, forward sendiri dibawah tiap artikel. Sama halnya jika ingin membuat tombol like, bisa menggunakan third party lain lagi.
