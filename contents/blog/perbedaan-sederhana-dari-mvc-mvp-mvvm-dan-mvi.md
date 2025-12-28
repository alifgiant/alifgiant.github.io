---
title: "Perbedaan Sederhana dari MVC, MVP, MVVM dan MVI"
date: "2020-11-12"
tags: ["Tech"]
featured: false
description: "Kita pasti sudah tidak asing dengan architecture design pattern yang saya sebutkan di judul MVC, MVP, MVVM dan MVI. Semuanya mengajarkan mengenai bagaimana s..."
readTime: "10 min"
image: "/assets/images/blog/cover-712d06d1-02ce-46f3-8704-1cb444ba87e2.jpg"
---

Kita pasti sudah tidak asing dengan architecture design pattern yang saya sebutkan di judul (MVC, MVP, MVVM dan MVI). Semuanya mengajarkan mengenai bagaimana sebaiknya kita memisahkan code base kita agar mencapai konsep `single responsibility` (S) dari `SOLID principle`. Tentu saja penggunaan pattern tidak hanya terbatas disitu, tapi hal tersebut adalah yang paling jelas terlihat. Karena yang semulanya semua fungsionalitas berada dalam 1 objek, kini harus dipisahkan menjadi setidaknya 3 objek lain `Model`, `View`, dan `Controller` / `Presenter` / `ViewModel` / `Intent`.

Walaupun pattern ini sangat populer dan banyak sekali artikel yang membahasnya, tapi masih banyak yang kesulitan menjelaskan perbedaan antara ke-empatnya. Oleh karena itu saya akan mencoba menjelaskan hal tersebut melalui tulisan kali ini.

## Model dan View

Kedua objek ini terdapat di semua pattern dan saya rasa sudah sangat jelas, sehingga tidak perlu saya ulangi penjelasannya. Tapi, demi kelengkapan artikel, mari saya coba jelaskan sekali lagi (alibi aja, emang mau ditulis 😜).

`Model` adalah objek yang merepresentasikan data yang akan ditampilkan oleh view. Sedangkan `View` adalah objek yang merepresentasikan apa saja interaksi yang dapat diterima/dilakukan oleh user dari/kepada sistem. View tidak melulu terkait tampilan yang dilihat di layar, untuk sistem yang lebih general, view bisa berupa daftar fungsi yang menerima input ataupun memberikan output.

Sebagai contoh, misal pada sistem pengaksesan data dari database. **POJO** (Plain Old Java Object) adalah **Model**, **Database Driver** (seperti Room, SqlHelper, ORM, dll) adalah **Controller**, dan kelas **DatabaseHelper** yang kalian buat untuk membungkus controller adalah **View**. Untuk lebih jelas silahkan lihat potongan code dibawah.

```kotlin
/*** 
 * Profile adalah Model
 * SqlHelper adalah Controller
 * DatabaseHelper adalah View
 */
class DatabaseHelper {
   val database = SqlHelper("mysql://192.168.0.10", "root", "root")

   fun openDatabase() {
      database.open()
   }

   fun closeDatabase() {
      database.close()
   }

   fun getUserProfile(id: String): Profile {
      val rawData = database.query(id)
      return parse(rawData)
   }
}
```

Sekilas akan timbul pertanyaan kenapa perlu ada DatabaseHelper? Kan bisa langsung ke SqlHelper. Peryataan yang tepat, hal itu karena kita sedang menginspeksi scope database access saja. Code diatas memungkinkan kita menggonti-ganti database tanpa perlu user dari `DatabaseHelper` mengetahuinya. Untuk scope yang lebih besar DatabaseHelper bisa dikategorikan sebagai controller, yang mana user sistem tersebut tidak perlu tau jika sewaktu waktu DatabaseHelper diganti menjadi ApiHelper.

Kalau kalian mencoba mengganti nama DatabaseHelper menjadi DatabaseView akan terdengar sangat rancu. Terlebih, karena objek DatabaseHelper hampir selalu digunakan oleh sistem yag lebih besar. Oleh karena itu pattern MVC sangat jarang, bahkan tidak pernah, digunakan untuk menggambarkan sistem selain yang memiliki tampilan.

## Perbedaan Controller, Presenter, ViewModel, dan Intent.

### Controller

Pada MVC, View merupakan "bos besar" dalam sistem, ia pemilik dari 2 objek lainnya. Ibaratkan dalam sebuah kantor seorang bos mempekerjakan seorang OB. Bos tersebut menyuruh OB untuk membuatkan kopi. Lantas ia pergi ke toko membeli kopi bubuk, lalu kembali ke kantor, membuat kopi, lalu mengantarkannya kepada si bos. Si OB, "uang" dan kopi tersebut ya "milik" si bos (walaupun tentu saja OB bisa memiliki resource dia sendiri, misal sepeda motor). Dalam code digambarkan sebagai berikut.

```kotlin
/**
 * Money dan Coffee adalah Model
 * ShopController adalah Si OB "Controller"
 * ConsumerView adalah Si Bos "View"
 */
class CustomerView {
   var coffee = EmptyCoffeeCup()
   val shopper = ShopController() // si OB
   val person = PersonController() // otak si Bos

   fun onDrinkCoffeeClick() {
      val money = person.getMoney(15000)
      coffee = shopper.makeCoffee(money)
      person.consume(coffee) // coffee.volume -= 5 (minum dikit2)
   }
}

```

Bisa dilihat dari code diatas sebuah `view` dapat memiliki banyak model dan banyak controller. Seperti layaknya seorang "bos". Permasalahan yang muncul adalah sistem yang tidak responsif. Hal ini karena MVC berfokus pada `syncronous` proses, menunggu adalah suatu hal yang wajar. Potongan code diatas akan membuat proses menunggu setiap eksekusi sampai selesai sebelum melanjutkan ke eksekusi berikutnya. Hal tersebut membuat tampilan seolah "freeze", atau tidak bergerak ketika sebuah eksekusi membutuhkan waktu yang lama. Hal ini dapat diakali dengan diperkenalkannya sistem callback dan thread. Potongan code tersebut dapat diubah menjadi seperti dibawah.

```kotlin
fun onDrinkCoffeeClick() {
   val money = person.getMoney(15000)
   shopper.makeCoffee(
      money,
      onCoffeeReady: (coffee) {
         person.consume(coffee) // coffee.volume -= 5 (minum dikit2)
      }
    )
}
```

Tapi bagaimana kalau ternyata `getMoney` juga lama? Karena person perlu ngambil uang dulu ke bank. Dan juga bagaimana kalau consume coffee juga lama? Karena dia menunggu dingin dulu? Selamat datang di Callback Hell 😈.

```kotlin
fun onDrinkCoffeeClick() {
   person.getMoney(
      15000,
      onMoneyReady: (money) {
         shopper.makeCoffee(
            money,
            onCoffeeReady: (coffee) {
               person.consume(
                  coffee,
                  onCold: () {
                     coffee.volume -= 5
                  }
               )
            }
         )
      }
   )
}
```

### Presenter

Pada MVP, View dan Presenter memiliki kedudukan yang hampir setara. Mereka bisa saling menyuruh. Hanya saja, resource "model" ialah milik presenter yang mana ia yang memutuskan akan memberikan model apa kepada View. Relasi keduanya lebih kepada **badan** terhadap **otak**. Badan mengirim impuls ke otak, otak memprosesnya lalu mengirim balik impuls kepada otot badan. Contoh code diatas kini dapat diubah menjadi seperti berikut.

```kotlin
/**
 * Money dan Coffee adalah Model
 * CustomerPresenter adalah Otak "Presenter"
 * ConsumerView adalah Badan "View"
 */
class CustomerView {
   val presenter = CustomerPresenter()
	 fun onStart() {
      presenter.start(this)
   }

   fun onDestroy() {
      presenter.stop()
   }

   fun onDrinkCoffeeClick() {
      presnter.drinkCoffee()
   }

   fun showDrinkAnimation() {
      ThreadUtils.scheduleMainThread {
         // open mouth, pick cup, etc..
      }
   }
}

class CustomerPresenter() {
   lateinit var view: CustomerView?

   var coffee = EmptyCoffeeCup()
   val wallet = Wallet.get()
   val coffeeShop = ShopRepository() // coffee seller

   fun start(view: CustomerView) {
      this.view = view
   }

   fun stop() {
      this.view = null
   }

   fun makeCoffee() {
      val money = wallet.getMoney(15000)
      coffee = coffeeShop.buy(money)
   }

   fun drinkCoffee() {
      ThreadUtils.start {
         if (coffee is EmptyCoffeeCup) {
            makeCoffee()
         }
         coffee.volume -= 5
         view?.showDrinkAnimation()
      }
   }
}
```

Bisa dilihat diatas View dan Presenter saling memiliki reference terhadap satu sama lain. Sehingga bisa saling "menyuruh" yang mana walaupun sama-sama memanfaatkan threading tapi MVP menyelamatkan dari callback hell.

Namun masalah lain dapat timbul dari MVP yaitu MemoryLeak. MemoryLeak terjadi ketika view sudah berhenti digunakan namun `presenter.stop()` lupa dipanggil atau tidak terpanggil. `Circular reference` antara View dan Presenter akan membuat `Garbage Collector` (GC) tidak dapat meng-collect memori dari kedua object tersebut karena reference count nya masih belum 0. Hal ini dapat di hindari dengan menggunakan WeakReference (mengizinkan GC untuk melakukan pemutusan reference) terhadap view di presenter. Menjadi seperti berikut.

```kotlin
class CustomerPresenter() {
   lateinit var weakView: WeakReference

   ...

   fun start(view: CustomerView) {
      this.weakView = WeakReference(view)
   }

   ...

   fun drinkCoffee() {
      ...
         weakView.get()?.showDrinkAnimation()
      ...
   }
}

```

### ViewModel

Pada MVVM, VM berusaha menggabungkan kelebihan C dan P. VM tidak memiliki reference kepada View dan View tidak perlu menunggu proses pada VM tanpa terjebak ke callback hell. VM mempergunakan `Observer Pattern` kepada `Model`, dimana View melakukan observe (pengamatan terus menerus) kepada model sehingga jika terjadi perubahan maka ia akan tau. Relasi View kepada VM bisa diibaratkan seperti **sutradara** dan **aktor**. Sutradara bisa memerintah aktor melakukan sesuatu, tapi tidak sebaliknya. Sementara aktor menjalankan peran, sutradara terus menerus memperhatikan segala macam gerak dan membuat penyesuaian terhadap penempatan kamera. Mari kini kita coba refactor code sebelumnya.

```kotlin
/**
 * Money dan Coffee adalah Model
 * CustomerViewModel adalah Aktor "ViewModel"
 * CustomerView adalah Sutradara "View"
 */
class CustomerView {
    val vm = CustomerViewModel()
    fun onStart() {
      registerModel(vm)
       vm.scene.observeOnMainThread { currentScene ->
         if (currentScene == "drinking") {
            showDrinkAnimation()
         }
      }
   }

   fun onDrinkCoffeeClick() {
          vm.drinkCoffee()
       }

   fun showDrinkAnimation() {
      // open mouth, pick cup, etc..
   }
}

class CustomerViewModel() {
   val scene = Observable()

   var coffee = EmptyCoffeeCup()
   val wallet = Wallet.get()
      val coffeeShop = ShopRepository() // coffee seller

   fun makeCoffee() {
      val money = wallet.getMoney(15000)
      coffee = coffeeShop.buy(money)
   }

   fun drinkCoffee() {
      ThreadUtils.start {
         if (coffee is EmptyCoffeeCup) {
            makeCoffee()
         }
         coffee.volume -= 5
         scene.update("drinking")
      }
   }
}
```

Bisa dilihat diatas tidak ada circular reference dan tidak ada callback hell. Akhirnya.. semuanya aman. Oh tidak secepat itu *ferguso* 🤭, "terus menurus" dalam code itu perlu di-define. Jika terus menerus itu artinya mengschedule tiap N detik atau N milidetik. Maka sistem akan tidak responsif (ketika perubahan terjadi maka update perlu menunggu schedule berikutnya) dan juga akan boros computing resource dari mesin. Karena akan banyak pengecekan yang tidak menemukan perubahan.

Oleh karena itu sebenarnya **observable** itu memegang reference kepada observernya. Dimana ketika value-nya berubah maka ia akan memberitahu kepada semua observernya, yang mana berarti ada potensi memory leak. Observable bisa menghindari Memory leak dengan menerapkan reference berupa WeakReference (lihat section sebelumnya) atau menerapkan mekanisme yang menjamin pemutusan `reference` ketika view akan di destroy, seperti yang dilakukan oleh LiveData di Android. Oleh karena itu MVVM dipopulerkan oleh kemunculan Android Architecture Component.

### Intent

Last but not least, Intent pada MVI. Konsep MVI sangat mirip dengan MVVM dimana bergantung kepada adanya Model yang di observe. Bedanya ialah pada `Intent`, sebuah `Action` yang melakukan perubahan kepada sebuah model dianggap merubah keseluruhan model. Sehingga akan mentriger semua observer atau istilah lainnya akan melakukan `full render`. Hal tersebut tentu saja akan boros computing resource tapi hal ini seringkali preferable demi mencapai kondisi single source of truth. Sehingga menjamin tidak ada perubahan yang tidak terefleksi kepada tampilan. Misalnya contoh berikut.

```kotlin
var height = 172
var weight = 78
val bmiObservable = Observable(height/weight)

bmiObservable.observe { bmi ->
   setText(bmi)
}

...

fun onUpdateHeightTextField(t: String) {
 height = t.toDouble()
}
```

Ketika user memanggil fungsi onUpdateHeightTextField maka nilai bmiObservable tidak akan mentriger observer untuk melakukan setText. Sehingga solusi untuk permasalah diatas ialah membuat semua data menjadi observable seperti berikut.

```kotlin
val height = Observable(172)
val weight = Observable(78)
val bmiObservable = Observable(height/weight)

height.observe { h ->
   bmiObservable.update(h/weight.value)
}
weight.observe { w ->
   bmiObservable.update(height.value/w)
}
...
bmiObservable.observe { bmi ->
   setText(bmi)
}
...

fun onUpdateHeightTextField(t: String) {
 height.update(t.toDouble())
}
```

Tapi solusi diatas membuat kita perlu mengganti semua data menjadi observable dan menambah banyak observer bantuan untuk sekedar mengupdate observer utama. Oleh karena itu dibuatlah solusi lebih elegan seperti berikut.

```java
/**
 * State adalah Model
 */
class State (
   val height: Double,
   val weight: Double
)

class Intent {
   val state = Observable(State())

   fun updateHeight(t: Double) {
      val newState = state.copyWith(height: t)
      state.update(newState)
   }
}

class View {
  val intent = Intent()

   fun onStart() {
     intent.state.observeOnMainThread { newState ->
        render(newState)
     }
  }

   fun render(state: State) {
     // do all view update base on state
  }

   fun onUpdateHeightTextField(t: String) {
      intent.updateHeight(t.toDouble())
   }
}
```

Perlu diperhatikan juga, baik MVP, MVVM dan MVI juga tidak membatasi jumlah P, VM maupun I nya. Walaupun sering kali hanya ada 1.

## Kesimpulan

Semua pattern memiliki kelebihan dan kekurangan masing-masing. Pemilihan pattern tergantung sesuai preferensi setiap coder, or at least preferensi perusahaan tempat *coder* bekerja 😂. Secara pribadi saya lebih menyukai MVI karena secara penulisan lebih sederhana dan menjamin tidak ada data yang tidak reflect walaupun dengan cost komputasi yang lebih besar. Namun kebetulan saya bekerja membuat aplikasi yang mana kemampuan komputasi walapun limited, semakin lama semakin bertambah cepat (Android dan iOS) sehingga beban komputasi yang tinggi tidak lagi signifikan. Walaupun dalam kondisi tertentu, saya bisa mengkombinasi penggunaan partialRender jika butuh melakukan optimasi.

Cukup sekian artikel kali ini. Semoga bermanfaat. Sampai ketemu di artikel berikutnya. Ciao~~
