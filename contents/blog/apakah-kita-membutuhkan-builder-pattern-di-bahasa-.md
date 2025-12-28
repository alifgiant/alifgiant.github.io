---
title: "Apakah kita membutuhkan Builder Pattern di bahasa Kotlin?"
date: "2020-10-31"
tags: ["Tech"]
featured: false
description: "Mungkin beberapa dari pembaca tidak mengenal pattern ini, tapi pasti pernah menemukannya dalam codebase kalian. Builder pattern dapat diidentifikasi dengan m..."
readTime: "3 min"
image: "/assets/images/blog/cover-2fb45981-dc5d-4686-82b6-e174a1c071c8.jpg"
---

Mungkin beberapa dari pembaca tidak mengenal pattern ini, tapi pasti pernah menemukannya dalam codebase kalian. Builder pattern dapat diidentifikasi dengan mudah ketika menemukan code seperti dibawah ini.
val human = CreatureBuilder()                 .addArm(2)                 .addLeg(2)                 .addBody()                 .addHead()                 .build()
atau juga
val groupLayout = LayoutBuilder() val component1 = Component() val component2 = Component()  groupLayout.addComponent(component1) groupLayout.addComponent(component2)  val layout = groupLayout.create()
Apakah kita masih membutuhkannya? Jawaban singkatnya, menurut saya, ialah “Tidak”. Jawaban ini mungkin debatable, tapi mari saya coba jelaskan terlebih dahulu.
Dalam bahasa pemograman, kita mengenal istilah fungsi constructor untuk sebuah class. Fungsi tersebut bisa memiliki berbagai parameter, yang kemudian melakukan assignment terhadap properti yang dimiliki class tersebut. Namun, jika sebuah class memiliki sangat banyak properti, besar kemungkinan fungsi constructor ini menjadi sangat panjang, padahal belum tentu kita butuh untuk mengubah semua nilai properti yang dimiliki. Misalnya sebuah kelas manusia seperti dibawah.
class Human {      int armCount;      int legCount;      int eyeCount;      int liverCount;       int age;      double height;      double weight;       Human(         int armCount,         int legCount,         int eyeCount,         int liverCount,         int age,         double height,         double weight      ) {      } }
Untuk hampir semua manusia, kemungkinan kita hanya perlu mengubah age, height, dan weight. Namun, kita tetap harus memberikan semua nilai yg diminta constructor. Ketika ingin menginisiasi hanya dengan parameter tertentu, kita perlu membuat overload-nya. Itu berarti ada 128 (2^7) kombinasi constructor yang dibutuhkan, belum lagi jika class human bukan milik kita. Sehingga menambah fungsi sebanyak itu sangat tidak mungkin. Akhirnya, munculah Builder pattern ini, kita cukup membuat satu fungsi tambahan untuk semua properti yang dibutuhkan. Berarti, hanya 7 fungsi tambahan.
class HumanBuilder {      int armCount = 0;      int legCount = 0;      int eyeCount = 0;      int liverCount = 0;       int age = 0;      double height = 0;      double weight = 0;       HumanBuilder addArm(int count);      HumanBuilder addLeg(int count);      HumanBuilder addEye(int count);      HumanBuilder addLiver(int count);      HumanBuilder addAge(int count);      HumanBuilder addHeight(int count);      HumanBuilder addWeight(int count);       Human build() {         return new Human(            armCount,             legCount,            eyeCount,            liverCount,            age,            height,            weight         );      } }
Pattern ini membantu kita untuk membuat object dan hanya mengatur properti yang kita inginkan. Lalu membiarkan sisanya bernilai default.
Tapi dengan adanya konsep named parameter dan default value parameter. Semua kesulitan ini menjadi hilang. Dalam bahasa Kotlin, kita cukup menulis..
class Human (      val armCount: Int = 0,       val legCount: Int = 0,      val eyeCount: Int = 0,      val liverCount: Int = 0,      val age: Int = 0,      val height: Double = 0,      val weight: Double = 0 )  // usage fun main() {    val a = Human()    val b = Human(age = 10)    val c = Human(armCount = 2, height = 100) }
Kita cukup mendefinisikan 1 constructor dan kita memiliki semua macam konfigurasi yang kita inginkan, sangat mudah. Hal inilah mengapa wajar bayak programmer "baru", melupakan pattern 1 ini. Karena mareka sudah terbiasa dengan kemudahan. Bukan karena mereka malas, sehingga tidak belajar. Hanya saja perkembangan teknologi memang sudah tidak membutuhkannya.
Tapi bagaimana dengan pattern Director - Builder. Dimana terdapat sebuah common builder yang kemudian di-direct step buildnya oleh director? Jawaban singkatnya, kita bisa beralih ke pattern lain, seperti factory pattern.
Cukup sekian.. ciao~~
