---
title: "Zero to One, Engineering A Mobile Application (Part 1: Pre Development)"
date: "2021-08-08"
tags: ["Tech"]
featured: false
description: "\"Kak, Bagaimana cara membuat aplikasi mobile?\" \"Kak, Bagaimana cara kamu membuat aplikasi mobile?\" Untuk menjawab pertanyaan ini saya akan menulisnya menjadi..."
readTime: "5 min"
image: "/assets/images/blog/cover-188aa21c-edd6-4715-a8dd-78553f6aaadb.jpg"
---

"Kak, Bagaimana cara membuat aplikasi mobile?"

"Kak, Bagaimana cara **(kamu)** membuat aplikasi mobile?"

Untuk menjawab pertanyaan ini saya akan menulisnya menjadi beberapa bagian. Artikel kali ini merupakan bagian pertama dan akan membahas, langkah langkah awal yang saya lakukan saat diminta mengerjakan aplikasi.

Berikut adalah daftar topik yang akan saya bahas di rangkaian artikel:

1. Pre Development: Analysis, Plan, and Design (artikel kali ini)
1. Basic Git and Git Flow (coming soon)
1. Flutter State Management and Routing using GetX (coming soon)
1. Flutter Unit Testing and UI Testing (coming soon)
1. Architecting (Flutter) Mobile App using clean arch and deferred module (Coming Soon)
1. QA phase and results (coming soon)
1. App Deployment (coming soon)

> ((!!)) Saya akan membutuhkan waktu berminggu minggu bahkan mungkin berbulan bulan untuk menyelesaikan semua tulisannya. Selain itu, mungkin topik diatas tidak akan saya publish secara berurutan. Intinya sih doain aja saya rajin nulisnya 😉

## Software Development Life Cycle (SDLC)

Software Development Lifecycle adalah rangkaian langkah yang mendefinisikan status pengembangan sebuah software. SDLC seringkali dimanfaatkan untuk mempermudah kita mengelola suatu projek pengembangan aplikasi. Dengan pengelolanan yang baik, diharapkan produk yang dihasilkan memiliki kualitas yang tinggi. SDLC umumnya terdiri dari 6 fase yaitu Analysis, Planning, Design, Development, Testing dan Deployment.

![Image from: https://codecoda.com/en/blog/entry/software-development-lifecycle-management](/assets/images/blog/188aa21c-edd6-4715-a8dd-78553f6aaadb-1.png)
<figcaption class="notion-caption">Image from: https://codecoda.com/en/blog/entry/software-development-lifecycle-management</figcaption>

Jadi seperti yang bisa kamu lihat, koding atau development merupakan fase ke-empat. Jika 3 langkah sebelumnya dilakukan dengan buruk, maka besar kemungkinan kita akan menghabiskan banyak waktu dan mungkin uang pada fase development. Beberapa hal buruk yang sering ditemui seperti fitur berganti atau bertambah ditengah masa koding, refactor yang berulang kali, dll.

Terdapat banyak metodologi mengenai bagaimana SDLC diterapkan, apa input dan output setiap fase, dst. Dua contoh metodologi terkenal adalah Waterfall dan Agile. Apa yang dipilih dan bagaimana diterapkannya dapat berbeda beda disetiap perusahaan.

## Tahap 1: Requirement Analysis

Langkah paling pertama yang harus kita lakukan adalah melakukan analisis terhadap kebutuhan aplikasi. Sebaiknya tahap ini mengeluarkan sebuah dokumen yang disebut dengan Software Requirement Specification(SRS). Seringkali sebagai programmer kita memang diekspektasikan langsung mulai koding, dengan asumsi tahap ini telah dilakukan oleh orang lain, seperti oleh product owner dan product manager. Sehingga, peran programmer disini adalah memastikan kelengkapan dari SRS yang telah dibuat.

Isi konten dari SRS mungkin akan berbeda - beda di setiap tugas/projek pengembangan aplikasi. Misal, perlu dituliskan target platform aplikasi dan minimal spesifikasi perangkat. Yang penting diingat adalah, sebaiknnya SRS ini berbentuk sebuah dokumen. Sehingga dokumen tersebut bisa dirujuk sewaktu - waktu dan menjadi pembatas *scope* pekerjaan.

Saya pribadi seringkali hanya mencari 3 hal berikut didalam sebuah SRS pengembangan aplikasi mobile:

1. Mock up Design versi high-fidelity dari aplikasi yang akan dibuat.
1. Daftar fitur yang kemudian didetailkan menjadi sebuah ataupun beberapa Acceptance Criteria (AC).
1. Severity / Urgency level dari tiap fitur

Ya, benar, ketiga hal diatas bisa diwakili hanya dari sebuah file mock up yang *well designed* (lengkap dengan panah navigasi, diurutkan berdasarkan prioritas, dll). Oleh karena itu untuk pengembangan aplikasi yang belum terlalu kompleks dan dikerjakan oleh tim yg kecil dokumen SRS ini seringkali tidak dibuat. *Source of truth* yang dirujuk bersama adalah file *mock up*.

![Mockup Aplikasi Pikobar (Source)](/assets/images/blog/188aa21c-edd6-4715-a8dd-78553f6aaadb-2.png)
<figcaption class="notion-caption">Mockup Aplikasi Pikobar (Source)</figcaption>

## Tahap 2: Planning

Langkah kedua adalah perencanaan. Output dari fase ini juga bisa sangat beragam sesuai kebutuhan. Beberapa hal yang sering ditemukan antara lain dokumen terkait Risk & Conflict Management, Budget Management, Time Management, Test and Release Management, dll. Pada tahap kedua ini perlu dibahas beberapa hal terkait bisnis dan hal terkait teknikal. Oleh karena itu di fase ini terjadi kolaborasi oleh keseluruhan anggota yang ada di tim. Untuk tim kecil, disinilah terjadi diskusi antara orang product dan developer.

![Image](/assets/images/blog/188aa21c-edd6-4715-a8dd-78553f6aaadb-3.png)

Menurut saya, sebagai developer, output yang paling penting dari tahap ini ialah Task list dan Gantt Chart. Task list (daftar tugas) sangat penting dibuat dengan baik, ia perlu dibuat dengan spesifik dan telah dilengkapi AC. Task list yang baik akan sangat membantu untuk memantau status pekerjaan dan mempermudah bekerja secara tim. Gantt Chart ialah tabel yang berisi time scheduling terkait keseluruhan proses. Tabel ini menemukan ekspektasi durasi kerja dari semua stakeholder, sehingga bisa membantu **memastikan** apakah suatu task feasible atau tidak.  [https://clickup.com/blog/scrum-board/](https://t.umblr.com/redirect?z=https%3A%2F%2Fclickup.com%2Fblog%2Fscrum-board%2F&t=NDk2YjM0OGY4Mzc2Zjg3Y2Y2ZTU3MDM4NDZhODJiMDc2MzJhNjExMyxhYTEzMzU2NTM3YWVlNzk0YWQ1ODNiMWM3NWY4MGZlNThlOTE3NjIw&ts=1707209379)

![Sumber instagantt.com](/assets/images/blog/188aa21c-edd6-4715-a8dd-78553f6aaadb-4.png)
<figcaption class="notion-caption">Sumber instagantt.com</figcaption>

## Tahap 3: Design

Pada tahap ini, orang product (seperti product owner, product manager dan product designer) sudah tidak terlalu terlibat. Mungkin sekilas terlihat membingungkan, tahap **Design** tapi product **design**-er tidak terlibat. Saya ingin mengingatkan kembali tahapan yang kita bahas adalah **Software Development** lifecycle sehingga tahap design disini adalah merancang software. Tentu bisa diperdebatkan apakah mendesign tampilan merupakan bagian dari merancang software, namun saya merasa product design lebih berupa sebuah user requirement.

Output yang diharapkan pada fase ini adalah sebuah Software Design Document(SDD). Beberapa konten yang sering ditemukan pada dokumen ini:

- Data Structure
- Architecture Design
- Interface Design
- Procedure Design (seperti flowchart, activity diagram, interaction diagram, dll)

Pada dasarnya tahap design ini adalah proses pendetailan hal teknikal yang sudah dibahas di tahap sebelumnya. Misal, jika aplikasi yang ingin dibuat perlu menggunakan sebuah back end dan terhubung ke sistem Google Map maka pada tahap ini perlu diperjelas bagaimana cara kita ingin melakukannya.

![Image](/assets/images/blog/188aa21c-edd6-4715-a8dd-78553f6aaadb-5.png)

Sesungguhnya semakin detail output dari tahap ini maka akan semakin mempermudah ketika kita akan melakukan koding. Walaupun demikian, perlu diingat, tahap design ini adalah bagian dari perencanaan. Sehingga bisa saja ketika sudah melakukan implementasi diperlukan ada penyesuaian rancangan. Jika saya harus memilih output apa yang paling penting maka jawaban saya adalah Interface Design, yang **bisa berupa** sebuah API Documentation.

## Design Thinking

![Image](/assets/images/blog/188aa21c-edd6-4715-a8dd-78553f6aaadb-6.png)

Sedikit trivia tambahan, sejauh yang saya tau, product designer menerapkan lifecycle sendiri yang disebut Design Thinking Process. Saya tidak mengetahui prosesnya secara detail namun, bisa kita lihat di diagram dibawah, tahap terakhir disebut **Implement**. Menurut saya, inilah fase dimulai SDLC yang telah kita bahas diatas.

[https://www.stephaniebaseman.com/design-thinking-process](https://www.stephaniebaseman.com/design-thinking-process)

## Akhir kata

Mungkin cukup sekian dulu kita bahas fase fase **Pre-Development**. Artikel berikutnya saya akan masuk membahas fase Development dari SDLC, secara spesifik terkait development aplikasi flutter. Terimakasih, sampai berjumpa di artikel berikutnya.


