---
title: "Unit Test Correctness vs Coverage, mana yang lebih penting?"
date: "2024-03-17"
tags: ["Tech"]
featured: false
description: "Pada suatu interview saya pernah ditanya, mana yang lebih penting correctness atau coverage pada sebuah Unit Test. Awalnya saya berpikir ini pertanyaan seder..."
readTime: "5 min"
image: "/assets/images/blog/cover-2d8baea2-a11f-42c9-9d3b-075480461be7.jpg"
---

Pada suatu *interview* saya pernah ditanya, mana yang lebih penting *correctness* atau *coverage* pada sebuah Unit Test. Awalnya saya berpikir ini pertanyaan sederhana, yaitu tidak ada yang lebih penting, keduanya sama pentingnya. Unit test sendiri berfungsi untuk memastikan sebuah fungsi benar (*correct*) sehingga tentu saja correctness itu penting. Sedangkan *coverage* atau *code coverage* berfungsi untuk mengukur sebanyak apa kode yang telah memiliki *unit test*.
Hingga, saya teringat bahwa yang sering kali dijadikan indikator sebuah kodingan merupakan kode yang baik hanyalah *code coverage*. Sekilas mungkin tidak terlihat ada yang salah, tapi menjadi menarik ketika kita memahami bahwa *code coverage* ternyata tidak menjamin *correctness* sebuah *unit test*.
Bingung? Penasaran maksudnya gimana? mari saya berikan ilustrasinya.
## Unit test perkalian sederhana
Misal kita ingin membuat sebuah fungsi sederhana yaitu perkalian 2 buah bilangan integer a dan b.
```dart
int multiply (int a, int b) {
    return a * b;
}
```
lalu kita membuat sebuah unit test seperti berikut ini
```dart
test('multiply is correct', (int a, int b) {
    // Arrange
    const a = 2;
    const b = 3;

    // Act
    final answer = multiply(a, b);

    // Assert
    expect(a, greaterThan(0));
});
```
*unit test* ini akan menghasilkan *code coverage* 100% tapi apakah *correct* ? Tentu saja tidak. Karena benar fungsi kita telah dijalankan dalam *test* tapi kita tidak melakukan test terhadap fungsinya, baik terkait *result* nya maupun *interaction*nya.
maka unit test yang benar untuk koding diatas sebaiknya seperti ini.
```dart
test('2 multiply 3 is equal to 6', (int a, int b) {
    // Arrange
    const a = 2;
    const b = 3;

    // Act
    final answer = multiply(a, b);

    // Assert
    expect(answer, 6);
});
```
Dengan unit test ini, maka kode kita akan *fully (100%) covered* dan *correct*. Tapi apakah memenuhi tujuan unit test? yaitu memastikan fungsi yang di *test* sudah benar?
Jawabannya, belum bisa dipastikan. Tapi untuk case sederhana ini, unit test diatas dinilai "cukup".
## Menambah *confidence* terhadap *correctness* dari unit test
Kenapa unit test sebelumnya belum bisa memastikan? Kerena ternyata unit test tersebut juga akan berjalan sukses jika fungsi perkalian langsung mengembalikan nilai yang diingikan oleh si unit test.
```dart
int multiply (int a, int b) {
    return 6;
}
```
Oleh karena itu sering kali kita mendapati penggunaan *tools* seperti  [faker](https://pub.dev/packages/faker_dart) untuk menambah keyakinan bahwa fungsi kita sudah benar.
```dart
test('a multiply b is equal to a * b', (int a, int b) {
    // Arrange
    const a = faker.datatype.number();
    const b = faker.datatype.number();

    // Act
    final answer = multiply(a, b);

    // Assert
    expect(answer, a * b);
});
```
Namun, cara ini sering menjadi penyebab terjadinya *flacky test* atau test yang hasilnya tidak konsisten. Kenapa demikian? silahkan teman teman coba jawab.
## Unit test perkalian kompleks
Oke sejauh ini untuk kasus sederhana kita bisa mendapatkan unit test yang *correct* dan *covered*, walaupun belum bisa memastikan fungsi benar. Tapi bagaimana dengan kasus yang lebih kompleks? Mari kita ubah fungsi perkalian diatas menjadi lebih kompleks. Kita bisa melakukannya dengan menggunakan bentuk dasar dari perkalian yaitu penjumlahan berulang. Dengan kata lain, mari buat fungsi perkalian tanpa menggunakan operator perkalian (*).
```dart
int multiply (int a, int b) {
    int sum = 0;
    for (int i = 0; i < b; i++) {
        sum += a;
    }
    return sum;
}
```
Oke, sekarang menggunakan kode ini, apakah unit test diatas sudah benar? Bisa segera terlihat, fungsi diatas akan salah ketika menerima input negatif.
```dart
test('2 multiply 3 is equal to 6', (int a, int b) {
    // Arrange
    const a = 2;
    const b = 3;

    // Act
    final answer = multiply(a, b);

    // Assert
    expect(answer, 6);
});

test('2 multiply -3 is equal to -6', (int a, int b) {
    // Arrange
    const a = 2;
    const b = -3;

    // Act
    final answer = multiply(a, b);

    // Assert
    expect(answer, -6);
});
```
Kita bisa memodifikasi isi dari fungsi perkalian, tapi kembali lagi pertanyaanya. Apakah setelah dimodifikasi, unit test sudah dapat memastikan? Sebenarnya jawabannya tidak akan pernah bisa dipastikan.
*Developer* hanya dapat terus meningkatkan keyakinan terhadap unit test tersebut, yaitu dengan memiliki *unit test* dengan berbagai kasus. Misalnya dengan input negatif, input bernilai 0, input bernilai 1 dst.
```dart
test('a and b postive integer ...',(){..});

test('a and b negative integer ...',(){..});
test('a is positive and b is negative integer ...',(){..});
test('a is negative and b is positve integer ...',(){..});

test('a and b is 0 ...',(){..});
test('a or b is 0 ...',(){..});

test('a and b is 1 ...',(){..});
test('a or b is 1 ...',(){..});

...
```
Tapi, semakin banyaknya *test case* ini tidak akan membuat *code coverage* menjadi lebih dari 100%. Lalu, jika demikian apakah *correctness* menjadi tidak penting?
## Kesimpulan
Sesungguhnya yang menjadi permasalahan ialah karena tidak adanya metrik untuk mengukur kebenaran suatu fungsi (atau saya yang belum tau, silahkan beri tau saya jika ada). Sehingga bisa jadi nilai kebenaran ini diabaikan selama proses *development*, selama sudah covered maka sudah aman.
Tapi setidaknya menurut saya, kita jangan sampai melakukan kesalahan dimana kita tidak mengecek *correctness* sama sekali (seperti tidak mengecek *result* ataupun *interaction* dari sebuah fungsi).
Memang sihh... crash/bug rate bisa jadi patokan dari correctness sebuah fungsi. Tapikan udah keburu rilis tuh bang 🥴.
