# Kelimece

Altı denemede beş harfli Türkçe kelimeyi bulma oyunu. Sınırsız mod: her kelime bitince yenisi gelir.

- Oynamak: `index.html` dosyasını tarayıcıda aç (ya da `python3 -m http.server` ile sun).
- Renkler: turkuaz = doğru yerde, mercan = kelimede var ama başka yerde, gri = yok.
- Ekran klavyesi (Türkçe harflerle) ve fiziksel klavye; Enter gönderir, Backspace siler.
- İstatistik, seri ve yarım kalan oyun tarayıcıda (localStorage) saklanır.

## Kelime listesi
Toplam 5661 kabul edilen tahmin, bunların 1519'u cevap olarak seçilebilir.

- `kelimeler/cevaplar.txt`: seçilecek yaygın, yalın kelimeler (elle derlendi).
- `kelimeler/ek-tahminler.txt`: yalnız tahmin olarak kabul edilen ek kelimeler (elle derlendi).
- `kelimeler/kaynak-zemberek.txt`: [Zemberek-NLP](https://github.com/ahmetaa/zemberek-nlp) sözlüğünden
  (`master-dictionary.dict`, `non-tdk.dict`) türetildi. Lisans: Apache License 2.0, telif Ahmet A. Akın ve
  Mehmet D. Akın; lisans metni `kelimeler/ZEMBEREK-LISANS.txt`. Değişiklik: yalnız 5 harfli girdiler alındı,
  özel ad, kısaltma, ünlem ve noktalama atıldı; 8 harfli -mak/-mek fiillerinin kökü (bekle, çalış) eklendi.
- `kelimeler/cikarilanlar.txt`: hiçbir listeye girmeyecek kelimeler (argo, küfür, aşağılayıcı, özel ad, marka).

Değiştirdikten sonra:

    python3 araclar/kelimeleri-derle.py

Bu komut 5 harfli olmayanları atlar, tekrarları ve çıkarılanları ayıklar, `kelimeler.js` dosyasını yeniden üretir.
