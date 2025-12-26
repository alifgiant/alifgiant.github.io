---
title: "Perbedaan (Lanjutan) dari MVC, MVP, MVVM dan MVI"
date: "2024-02-06"
tags: ["Tech"]
featured: false
description: "Artikel kali ini ingin melajutkan tulisan saya sebelumnya Perbedaan Sederhana dari MVC, MVP, MVVM dan MVIhttps://www.notion.so/712d06d102ce46f387041cb444ba87..."
readTime: "8 min"
image: "/assets/images/blog/cover-d2022170-cd56-41ac-9b04-e01025f2a9f6.jpg"
---

Artikel kali ini ingin melajutkan tulisan saya sebelumnya [Perbedaan Sederhana dari MVC, MVP, MVVM dan MVI](https://www.notion.so/712d06d102ce46f387041cb444ba87e2) . Pada artikel itu, saya memberikan gambaran dengan bahasa sehari hari agar mudah dipahami. Namun tentu saja hanya sebatas kulitnya. Pada kesempatan kali ini saya ingin menjawab beberapa pertanyaan lanjutan yang diberikan oleh teman yang memiliki pengalaman lebih jauh dalam dunia pemograman. Jika kamu belum pernah membaca artikel sebelumnya, sebaiknya lowongkan waktu membaca artikel itu sebelum melanjukan membaca.
## 1. Karena masalahnya Callback Hell, apakah MVC kembali relevan jika menggunakan ?
Callback hell hanya salah satu kelemahan yang ada. Saya memilih menunjukkan hal tersebut karena menurut saya hal itu adalah kelemahan yang paling “terlihat”. MVC sendiri merupakan pattern yang muncul paling awal, dimana pemograman masih bermindset syncronous. Paradigma seperti coroutine, events loop dan sejenisnya belum ada atau belum populer. Async-await sendiri muncul dengan lahirnya paradigma asyncronous programming (selanjutnya saya sebut async progam).
Menurut laman di [wikipedia](https://href.li/?https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAsync%2Fawait=), async progam pertama kali muncul pada tahun 2007 di bahasa F#. Diadopsi C# pada tahun 2012, lalu python dan Typescript pada tahun 2015. Jadi, masih bisa dibilang lumayan baru.
**Lalu, kembali ke pertanyaan apakah async prog bisa menghidupkan lagi MVC?**
Singkatnya, menurut saya, tidak.
Salah satu tujuan penerapan design pattern arsitektural, seperti MVC, adalah untuk memiliki kode yang menerapkan SRP (Single Responsibility Principle, dari SOLID principle). Kita melakukan SoC (Separation of Concern) kepada kode kita. Hal ini (diharapkan) dapat mempermudah kita untuk memelihara dan mengembangkan kode tersebut dikemudian hari. Salah satu kalimat jargon terkait hal ini ialah “akan lebih mudah di unit-test”.
**Tapi, sebenarnya apa yang dipisah?**
Controller, Presenter, ViewModel, dan Intent sesungguhnya adalah bagian yang berusaha memisahkan business logic. Perbedaan scope (batasan masalah) yang mana saja disebut business logic itulah yang memunculkan berbagai pattern yang ada. Sebagai contoh silahkan lihat potongan kode dibawah mengenai MVC.
```kotlin
/**
 * Money dan Coffee adalah Model
 * ShopController adalah Si OB "Controller"
 * ConsumerView adalah Si Bos "View"
 */class CustomerView {
   var coffee = EmptyCoffeeCup()

   val shopper = ShopController() // si OB
   val person = PersonController() // otak si Bos

   fun onRefillClick() {
      val money = person.getMoney(15000)
      coffee = shopper.makeCoffee(money)
   }

   fun onDrinkCoffeeClick() {
      person.consume(coffee) // coffee.volume -= 5 (minum dikit2)
   }

   val coffeEmptyCheckScheduler = Scheduler(every = 10_MINUTE) {
      if (coffee.isEmpty()){
         onRefillClick()
      }
   }

   init {
      coffeEmptyCheckScheduler.run()
   }
}
```
Kita bisa lihat ada sebuah scheduler (coffeEmptyCheckScheduler) yang dibuat dan running setiap 10 menit. Ketika waktunya tiba akan mengecek apakah kopi kosong, jika iya maka akan melakukan refill. Bagian kode yang ini, bagi sebagian orang, adalah sebuah business logic yang tidak seharusnya berada di dalam sebuah view. Pemisahan akan lebih baik ketika menggunakan MVP. Seperti contoh dibawah.
```kotlin
interface RefillProvider {
   fun refill()
}

class PersonPresenter {
   var coffee = EmptyCoffeeCup()
   val shopper = ShopController() // si OB
   val person = PersonController() // otak si Bos

   var refillProvider: RefillProvider?

   val coffeEmptyCheckScheduler = Scheduler(every = 10_MINUTE) {
      if (coffee.isEmpty()){
         refillProvider.refill() // to run animation on view
      }
   }

   fun refill() {
      val money = person.getMoney(15000)
      coffee = shopper.makeCoffee(money)
   }

   init {
      coffeEmptyCheckScheduler.run()
   }
}

class PersonView : RefillProvider {
   val personPresenter = PersonPresenter()
   var coffeRefilloading = false

   init {
      personPresenter.provider = this
   }

   fun refill() {
      onRefillClick()
   }

   fun onRefillClick() {
      coffeRefilloading = true
      personPresenter.refill()
      coffeRefilloading = false
   }
}
```
Bisa kita lihat view kini lebih bebas dari business logic. Oleh karena itu menurut saya jika masih ada yang menggunakan MVC sebaiknya segera hijrah.
Kalau kamu masih bingung bedanya MVC dan MVP kalimat sederhananya ialah “Controller tidak memiliki reference ke view sedangkan presenter memiliki reference ke view”.
## 2. Masalah MVP hanya kalau lupa unregister si presenter? Kalau gitu misal udah yakin sudah unregister aman dong?
Itulah alasan kenapa MVP masih exist di pemograman modern. Selain alasan tersebut (yakin ga akan lupa unregister presenter), masih banyak yang menggunakan MVP dikarenakan ia lebih sederhana dibandingkan MVVM dan MVI. Misalnya saja di MVP kita tidak perlu mengenal beberapa konsep baru seperti `Observable dan Observer`, `Emiter dan Subscriber`, `Reducer dan Dispatcher`. Untuk lebih jelasnya silahkan baca mengenai paradigma **Reactive Programming**.
Namun muncul lagi sebuah perdebatan bahwa view belum cukup terpisah. Bisa dilihat pada contoh sebelumnya, ada proses di view yang mengubah field `coffeRefilloading` (sebuah model atau state milik view). Bagi sebagian orang ini adalah business logic. Karena business logic seharusnya berada di presenter maka sering kali terjadi “lupa” atau “miss” mengubah state ataupun menjalankann fungsi di view ketika melakukan perubahan. Sebagai programmer yang baik jika sebuah masalah kerap terjadi, kita perlu mencari solusi untuk mencegahnya kembali terulang.
![Image](/assets/images/blog/d2022170-cd56-41ac-9b04-e01025f2a9f6-1.png)
Pada pattern yang baru, View dirancang agar otomatis react terhadap perubahan view-state dan me-reflect hasil perubahannya. Untuk sementara mari kita namakan “objek” baru yang mengendalikan semua state sebagai **NeoController**. Karena semua state dikendalikan oleh NeoController bisa kita katakan hanya ada satu sumber kebenaran (`Single Source of Truth`, SSoT), yaitu state milik NeoController.  Selain itu, karena kini state hanya dapat diubah oleh NeoController maka alur data dari view hanya ada satu arah (`Unidirectional Data Flow`, UDF). Bisa dilihat di diagram diatas, pada MVP terdapat 2 panah keluar namun di new pattern hanya 1. Kedua konsep baru yaitu "Single Source of Truth" dan "Unidirectional Data Flow" dapat ditemukan baik pada MVVM maupun MVI. NeoController kemudian dinamakan sebagai `ViewModel` pada MVVM dan `Intent-Reducer` pada MVI.
Perbedaan utama dari MVP dan MVVM ataupun MVI terletak pada kedua konsep baru ini.
## 3. Apa bedanya MVVM dan MVI? Kalau dari contoh (di artikel sebelumnya) cuma dari jumlah state?
Sebenarnya di contoh pada artikel sebelumnya saya menyederhanakan MVI sehingga terlihat sama dengan MVVM jika MVVM hanya memiliki 1 state. Ada konsep User dan Reducer yang sengaja saya hilangkan. Secara singkat perbedaan MVVM dengan MVI terletak pada seberapa ketat konsep SSoT dan UDF diterapkan dimana MVI lebih ketat. Perhatikan diagram berikut.
![Image](/assets/images/blog/d2022170-cd56-41ac-9b04-e01025f2a9f6-2.png)
Bisa dilihat MVVM bisa memiliki beberapa state, yaitu view state dan business state. View pada MVVM hanya otomatis reflect kepada view state. Hal inilah yang sempat saya sebutkan diartikel sebelumnya. Bisa saja ada sebuah `view state` yang sebenarnya `depend ke business state` tapi miss ketika business state diubah.
Pada MVI diterapkan SSoT yang lebih ketat, semua state digabung menjadi satu dan pasti di-observe oleh view. Walaupun tentu saja akan ada perubahan state yang seharusnya dan tidak perlu render view namun menyebabkan render terjadi. Tentu saja hal ini memunculkan perdebatan mengenai performa aplikasi.
Selain itu, kalau kamu memerhatikan diagram diatas, saya baru menggunakan istilah Almost-MVI. Karena selain SSoT MVI juga lebih ketat mengenai UDF. Di diagram diatas kamu bisa lihat masih adanya panah yang berputar ditempat, Action-State. Hal ini memungkinkan adanya proses yang tiba tiba mengubah state (unpredictable change). Sebagai contoh pada kasus `coffeEmptyCheckScheduler` sebelumnya. Action memiliki kemungkinan untuk mengubah tanpa adanya aksi dari view.
**Lah, kalau emang business logicnya gitu?**
Untuk “mengakali” proses yang tiba-tiba ada ini, kita harus membayangkan “sebenarnya apa sih yg berhak untuk memulai sebuah aksi?”. Jawabannya ialah User. “Tapi user kan diluar sistem”. Menariknya, ternyata kita bisa nge-mock user 😅. Seperti ketika kita melakukan mock terhadap dependecy lainnya yang kita perlu tau ialah apa output yang diharapkan dari objeck tersebut.
Lalu, apa output dari user? tentu saja, As you can guess, Intent.
![Image](/assets/images/blog/d2022170-cd56-41ac-9b04-e01025f2a9f6-3.png)
Jadi, pada MVI action tidak mengetahui juga apa kondisi terkini dari state, dan tidak bisa tiba melakukan modifikasi tanpa adanya Intent. Imaginary ~~Friend~~ User menghasilkan Intent. Action menerima data yang dia butuhkan dari Intent. Lalu, melakukan aksi dan memberikan hasilnya kepada Reducer. Reducer sendiri adalah objek yang berupa pure function yang menerima input current state, dan new data. Kurang lebih untuk kasus kopi diatas bisa kita tulis menjadi kode berikut.
```kotlin
data class State (
   val coffee: CoffeeCup = EmptyCoffeeCup()
)

sealed class Intent(val state: State) {
   class CheckCupContent(state: State) : Intent(state)
   class Refill(state: State) : Intent(state)
}

class Reducer {
   var stateObservable = Observable()

   fun refillCoffee(state: State, newCoffee: CoffeeCup) {
      val newStete = state.copyWith {
         this.coffee = newCoffe
      }
      publish(newStete)
   }

   fun publish(state) = stateObservable.publish(newStete)
}

class StateScheduler(val every: Duration, val callback: (State) -> Unit) {
   var state: State? = null

   fun update(newState: State) {
      state = newState
   }

   fun run() = Scheduler(every = every) {
      state?.let { callback(it) }
   }.run()
}

class Action {
   // our fake view x user
   // fake view, since it listen to state change
   // fake user, since it generate Intent
   val coffeEmptyCheckScheduler = StateScheduler(every = 10_MINUTE) { state ->
      val intent = Intent.CheckCupContent(state)
      handleIntent(intent)
   }

   val reducer = Reducer()

   val shopper = ShopController()
   val person = PersonController()

   fun handleIntent(intent: Intent) {
      when (intent) {
         is CheckCupContent -> {
            if (intent.state.coffee.isEmpty) {
               reducer.refillCoffee(intent.state, refill())
            }
         }
         is Refill -> {
            reducer.refillCoffee(intent.state, refill())
         }
      }
   }

   fun refill(): Coffee {
      val money = person.getMoney(15000)
      val coffee = shopper.makeCoffee(money)
      return coffee
   }

   init {
      reducer.stateObservable.observe { coffeEmptyCheckScheduler.update(it) }
      reducer.publish(State())
   }
}
```
Menjadi jauh lebih panjang? Ya, setuju. Tapi kini harapannya kodenya lebih predictable.
## Kesimpulan
Selain MVC 👀, Semua pattern ada kelebihan dan kekurangan nya. Seringkali dalam real world implementasinya disesuikan dengan kebutuhan. Jadi tidak murni MVP, ataupun tidak murni MVVM ataupun tidak murni MVI. Bahkan bisa berbeda total dari contoh diatas.
Cukup sekian, jika masih bingung, ataupun tidak sependapat boleh DM tanya tanya ataupun komen di [instagram](https://www.instagram.com/muh.alifgiant/). ataupun.. ya dimanapun lah.
Terimakasih :)
