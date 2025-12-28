---
title: "Perjalanan saya belajar web dan mebuat personal site, untuk blog dan portfolio (Part-3)"
date: "2020-05-10"
tags: ["Tech"]
featured: false
description: "GatsbyJS, Netlify, Netlify CMS, dan Github ❤️ Beberapa bulan berjalan dengan Wordpress, tapi saya tidak merasa puas. Jiwa jiwa geek meronta untuk mempelajari..."
readTime: "3 min"
image: "/assets/images/placeholder-blog.jpg"
---

## GatsbyJS, Netlify, Netlify CMS, dan Github ❤️

Beberapa bulan berjalan dengan Wordpress, tapi saya tidak merasa puas. Jiwa jiwa *geek* meronta untuk mempelajari ilmu baru 🤣. Selain itu, alasan utama untuk memulai *blogging* juga tidak berjalan. Selain karena malas, juga karena saya tidak ingin menulis suatu hal 2 kali. Maksudnya, ketika menggunakan CMS wordpress saya perlu mencari waktu untuk *online* dan membuka halaman admin. Saya bisa saja menulis ide saya di note hp/laptop secara offline tapi ini membuat saya perlu melakukan copy paste lagi ke wordpress. Belum lagi, untuk memiliki halaman post yg benar-benar seperti saya inginkan relatif sulit untuk dilakukan (pengalaman melakukan edit template di Wordpress *is not so great*).

Kemudian saya berusaha mencari ilmu lagi di belantara *Google*. Lalu menemukan hype mengenai static site generator. Traditional server side redered web bisa dibuat menjadi static page, WOW! Saya lanjut mencari tau dan membuat beberapa pertimbangan seperti

- Familiaritas bahasa dan environtment
- Kecepatan build
- Ukuran akhir site
- Adanya support CMS dan plugins
- Terdokumentasi rapih
- Punya komunitas besar dan resouce belajar mudah ditemukan
- *Stable*

Saya akhirnya memutuskan menggunakan kombinasi [GatsbyJS](https://www.gatsbyjs.org/), [Netlify](https://netlify.com/), [Netlify CMS](https://www.netlifycms.org/), dan Github. Gatsby sebagai site generator, Netlify sebagai hosting sekaligus sebagai CMS nya dan Github sebagai tempat manyimpan semua *resources* nya . Yang mana berarti saya memiliki full akses terhadap data, tampilan, *semuanya!* dari blog saya. Ditambah, git memungkinkan saya untuk melakukan *offline write*. Ketika semuanya sudah *OK*, saya cukup melakukan *git push* lalu netlify mengurus sisanya, 1 menit kemudian web saya akan update. Authentikasi dan management user juga dihandle dengan baik oleh netlify, *Sounds cool?*. The best part is, Semua konten bisa ditulis menggunakan format [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) (.md), format yang sudah sangat nyaman saya gunakan dalam bekerja sehari hari. Ketika saya tidak berada dekat laptoplah baru halaman admin *come in handy*.

**Kelebihan**

- Free dengan limit bandwith (100GB) dan build time (300 menit)
- Setup mudah, banyak template, dan pengguna punya total control akan hampir semua konfigurasi
- Sudah include SSL, asset optimization, CDN, management user
- Setup email mungkin dilakukan, meskipun harus berbayar
- Offline writing is first class citizen, bahkan bisa nulis di *Visual Studio Code*, my number 1 favorite text editor, yg berarti secara default akan selalu terbuka dan mengundang saya untuk menulis
- Banyak banget pluginnya, ecommerce juga ada!
- Markdown support
- Super fast (walapun dari yg saya baca masih kalah jauh dari Hugo)
- Walaupun terbilang mudah, ilmu baru yang didapatkan cukup banyak (React, JSX, Site Generator, Configuration over Code concept, little bit Sass and ES6)

**Kekurangan**

- Saya tidak menemukan kemungkinan melakukan custom API call di backend (hanya yang sudah dalam bentuk plugin)
- Tampilan halaman admin, secara default, tidak sepenuhnya bisa di custom
- Query menggunakan graphQL, yang tidak terbiasa mungkin akan kesulitan pada awalnya
- Butuh lebih banyak *programming knowlege* dibandingkan wordpress

Akhir kata, mungkin saya terdengar seperti orang yang sangat pelit, karena sejak awal nyarinya yang gratisan 😔. Tapi menurut saya untuk project pribadi yang dimana traffic nya tidak begitu besar (seperti blog dan portfolio), sayang sekali jika harus bayar mahal 🤠 padahal ada solusi murah asalkan mau *BELAJAR*.

It’s not going to be easy, but it’s going to be worth it.
