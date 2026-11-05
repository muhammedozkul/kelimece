# Kelimece

Altı denemede beş harfli Türkçe kelimeyi bulma oyunu. Sınırsız mod: her kelime bitince yenisi gelir.

- Oynamak: `index.html` dosyasını tarayıcıda aç (ya da `python3 -m http.server` ile sun).
- Renkler: turkuaz = doğru yerde, mercan = kelimede var ama başka yerde, gri = yok.
- Ekran klavyesi (Türkçe harflerle) ve fiziksel klavye; Enter gönderir, Backspace siler.
- İstatistik, seri ve yarım kalan oyun tarayıcıda (localStorage) saklanır.

## Kelime listesi
Toplam 2950 kabul edilen tahmin; bunların 1546'sı cevap olarak seçilebilir, 1404'ü yalnız tahmin olarak kabul edilir.

- `kelimeler/cevaplar.txt`: seçilecek yaygın, yalın kelimeler (elle derlendi).
- `kelimeler/ek-tahminler.txt`: yalnız tahmin olarak kabul edilenler: elle derlenen kelimeler, Zemberek'ten elle
  seçilen fiil kökleri (bekle, çalış) ve bilinen kelimeler, ünlü uyumuyla üretilen sık ekli biçimler (gözüm, yolda, evler).
- `kelimeler/kaynak-zemberek.txt`: [Zemberek-NLP](https://github.com/ahmetaa/zemberek-nlp) sözlüğünden
  (`master-dictionary.dict`, `non-tdk.dict`) çıkarılan 5 harfli kelimeler. Lisans: Apache License 2.0, telif
  Ahmet A. Akın ve Mehmet D. Akın; lisans metni `kelimeler/ZEMBEREK-LISANS.txt`. Değişiklik: yalnız 5 harfli girdiler
  alındı; özel ad, kısaltma, ünlem ve noktalama atıldı; 8 harfli -mak/-mek fiillerinin kökü eklendi. Bu dosya derlemeye
  doğrudan girmez; `ek-tahminler.txt` için seçim kaynağıdır.
- `kelimeler/cikarilanlar.txt`: hiçbir listeye girmeyecek kelimeler (argo, küfür, aşağılayıcı, özel ad, marka).

Değiştirdikten sonra:

    python3 araclar/kelimeleri-derle.py

Bu komut 5 harfli olmayanları atlar, tekrarları ve çıkarılanları ayıklar, `kelimeler.js` dosyasını yeniden üretir.
