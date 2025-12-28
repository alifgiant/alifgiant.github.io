---
title: "Gratis! Auto Backup Supabase dengan Github Action dan Cloudflare R2"
date: "2024-07-28"
tags: ["Tech"]
featured: false
description: "Image/assets/images/blog/12c9e962-c621-4b29-b775-d381954e94bd-1.png TLDR; Saya asumsikan kalian yang membuka artikel ini sudah memahami Supabase dan GithubAc..."
readTime: "5 min"
image: "/assets/images/blog/cover-12c9e962-c621-4b29-b775-d381954e94bd.jpg"
---

![Image](/assets/images/blog/12c9e962-c621-4b29-b775-d381954e94bd-1.png)

TLDR; Saya asumsikan kalian yang membuka artikel ini sudah memahami Supabase dan GithubAction. Ingin melakukan *backup* mengikuti [artikel dari supabase](https://supabase.com/docs/guides/cli/github-action/backups) namun memilih untuk menyimpan *backup* di Cloudflare dan tidak di dalam *commit* projectnya.
[Supabase Auto backup Doc](https://supabase.com/docs/guides/cli/github-action/backups)

Jadi langsung saja, berikut code di workflow confignya.
```yaml
name: Production DB Backup

on:
  schedule:
    - cron: "0 0 * * 1" # Every Monday at midnight
  workflow_dispatch: # Allows manual triggering

jobs:
  backup_prd_db:
    runs-on: ubuntu-latest
    env:
      supabase_db_url: ${{ secrets.SUPABASE_DB_URL }} # For example: postgresql://postgres:[YOUR-PASSWORD]@db.<ref>.supabase.co:5432/postgres
    steps:
      - uses: supabase/setup-cli@v1
        with:
          version: 1.178.2
      - name: Create backup dir
        run: mkdir backup
      - name: Backup roles
        run: supabase db dump --db-url "$supabase_db_url" -f backup/roles.sql --role-only
      - name: Backup schema
        run: supabase db dump --db-url "$supabase_db_url" -f backup/schema.sql
      - name: Backup data
        run: supabase db dump --db-url "$supabase_db_url" -f backup/data.sql --data-only --use-copy
      - name: Get current date and time for target dir
        id: datetime
        run: echo "datetime=$(date +'%Y-%m-%d_%H:%M:%S')" >> $GITHUB_OUTPUT
      - name: Upload backup dir to R2
        uses: ryand56/r2-upload-action@v1.2.2
        with:
          r2-account-id: ${{ secrets.R2_ACCOUNT_ID }}
          r2-access-key-id: ${{ secrets.R2_ACCESS_KEY_ID }}
          r2-secret-access-key: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          r2-bucket: ${{ secrets.R2_BUCKET }}
          source-dir: backup
          destination-dir: ${{ steps.datetime.outputs.datetime }}

```
<figcaption class="notion-caption">Github Workflow code</figcaption>

Udah, cukup *copy-paste config* diatas, atur *secret-*nya dan selesai. Sampai jumpa di artikel lainnya 🫡. 
Nah, buat yang ingin membaca lebih jauh terkait cerita dibaliknya, mari kita mulai.
# Sedikit Cerita
Saya membuat sebuah aplikasi manajemen dan POS untuk Apotek. Untuk sekarang masih digunakan sendiri dan dikembangkan seorang diri. Oleh karena, itu saya masih termasuk kaum mendang mending, dimana pengen semuanya gratis.
![Aplikasi Apotek Kula](/assets/images/blog/12c9e962-c621-4b29-b775-d381954e94bd-2.png)
<figcaption class="notion-caption">Aplikasi Apotek Kula</figcaption>

## Kenapa Supabase
Saya seorang mobile engineer, programmer, coder atau apalah istilahnya untuk seorang yang bekerja membuat aplikasi mobile. Saya ahli dalam membuat aplikasi disisi muka (FE) atau disisi user, namun saya tidak ahli untuk aplikasi di belakang layar (BE). Oleh karena itu saya perlu menggunakan layanan DBaaS (Database As A Service).
Biasanya saya selalu memilih Firebase Firestore karena mudah untuk digunakan. Namun berdasarkan pengalaman, Firestore memiliki banyak keterbatasan, utamanya dalam membuat aplikasi yang memiliki relasi data yang kompleks. Sehingga pada aplikasi Apotek ini saya mencoba eksplorasi alternatif lain seperti [AppWrite](appwrite.io), [PocketBase](https://pocketbase.io/) dan [Supabase](https://supabase.com/).
Pada akhirnya saya memilih Supabase karena adanya *tier *gratis dan database menggunakan PostgreSQL. Sehingga kita dimungkinkan membuat query yang kompleks. Apalagi jaman sekarang dimana LLM bot sudah sangat canggih, membuat query sangatlah mudah.
## Kenapa perlu *Backup*
Biar ga seperti PDN #eh. Canda gais.
Kenapa perlu *Backup*? Karena saya sudah merasakan kehilangan data secara bodoh 😂. Saya beranggapan bahwa ketika membuat aplikasi kecil, dan secara sendirian. Sangat tidak mungkin datanya hilang. Sehingga saya tidak perlu *backup*.
Rupanya saya naif 😭. Saya mengalami kehilangan data yang cukup fatal. Data obat, data transaksi, data pasien, hilang. Setelah saya coba analisis, rupanya hal tersebut disebabkan oleh kecerobahan saya ketika melakukan migrasi data. Saya tidak melakukan *alter* pada *sequence*, padahal saya mengandalkan *upsert* untuk melakukan *insert* data. Simpelnya, data baru menimpa data lama. Saya kehilangan banyak data berharga dan membuat operasional Apotek terganggu.
Dengan kondisi tidak adanya *backup*, maka saya hanya bisa ~~menangis~~ bersabar. Pelajaran yang bisa saya ambil adalah, walaupun projek kecil, dikerjakan sendiri, begitu aplikasinya digunakan secara *production* selalu lakukan *backup* berkala.
## Kenapa Cloudflare
Berhubung saya adalah kaum mendang mending (baca: kere), opsi menggunakan *Add-on* *auto backup* dari Supabase tidak mungkin dipilih. 
[Supabase Backup Add-on Doc](https://supabase.com/docs/guides/platform/backups)

Untungnya Supabase juga memberikan opsi untuk melakukan *backup* mandiri. Bahkan sudah ada *sample-code* untuk melakukannya. Memanfaatkan Github Action, *backup* disimpan kedalam *repository* secara langsung, berupa sebuah *commit*. Sebuah opsi yang sangat bagus. Terlebih karena total data yang saya miliki baru mencapai ~45MB, masih cukup kecil untuk disimpan dalam git.
Namun saya kurang menyukai hal ini. Karena beberapa hal: 
1. Maksimal ukuran *file* dalam *repository* github adalah 100MB,
1. Bisa lebih besar, jika menggunakan LFS. Namun ukuran maksimal *repository* ialah 1GB. Ditambah, *bandwidth* juga dibatasi 1GB. Mungkin cukup untuk kebutuhan sekarang, namun tidak scalable. Akan merepotkan di kemudian hari.
1. Data ter-ekspose ke siapapun yang memiliki akses pada *repository*. Masalah *privacy* baru satu hal, bagaimana kalau secara tidak sengaja terhapus oleh dev lain? Sekarang memang masih sendiri, tapi tidak menutup kemungkinan nanti menambah orang. Hal ini hanya akan merepotkan nantinya.
Sehingga saya mecoba mencari alternatif. Pada akhirnya saya memutuskan menggunakan Cloudlfare R2. Dimana memiliki *tier* gratis yang **sangat baik**, sudah *support* protokol S3, dan mudah disetup.
[Halaman penawaran Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
![Pricing dari Cloudflare R2](/assets/images/blog/12c9e962-c621-4b29-b775-d381954e94bd-3.png)
<figcaption class="notion-caption">Pricing dari Cloudflare R2</figcaption>

| Platform | Storage | Bandwidth | Class A Ops | Class B Ops |
| --- | --- | --- | --- | --- |
| Cloudflare | 10GB | Unlimited | 1,000,000 | 10,000,000 |
| AWS | 5GB | 100GB | 2,000 | 20,000 |
| Google Cloud | 5GB | 100GB | 5,000 | 50,000 |

# Outro
Saya membuat cron schedule, untuk melakukan *backup* setiap senin malam menggunakan Github Action. Untuk mempermudah perhitungan, anggaplah saya punya 50MB data yang disimpan setiap minggunya, maka dalam 1 bulan saya akan memakai ~200MB. Maka untuk 1GB, saya akan capai dalam 5 bulan. 
Dari perhitungan ini, terlihat bahwa jika saya menggunakan git, maka dalam kurang dari 5 bulan, saya harus mengerjakan *backup* ini lagi. Sedangkan jika menggunakan Cloudflare, saya bisa menunggu 50 bulan (~4 tahun) untuk mencapai 10GB. Dalam hitungan optimis pun, dimana data saya membengkak lebih cepat, setidaknya 1 tahun pasti masih tercapai. Bahkan mungkin saya akan menemui *limit* terkait Github Action terlebih dahulu sebelum perlu mengubah *setup backup* *storage* ini.
| Tier | Runtime | Runner Storage (SSD) |
| --- | --- | --- |
| Github Free | 2,000 min/month | 14GB |

Berikut adalah hasil akhir dari *setup* saya. Yang tentunya semuanya GRATIS! GE-RA-TIS!!
![Github Action Steps](/assets/images/blog/12c9e962-c621-4b29-b775-d381954e94bd-4.png)
<figcaption class="notion-caption">Github Action Steps</figcaption>

![Cloudflare R2 bucket](/assets/images/blog/12c9e962-c621-4b29-b775-d381954e94bd-5.png)
<figcaption class="notion-caption">Cloudflare R2 bucket</figcaption>

Cukup sekian dan terimakasih, *keep hustling*! 💪🏻

## Coda
Jika ada pertanyaan silahkan DM saya di Instagram [@muh.alifgiant](https://www.instagram.com/muh.alifgiant/)

