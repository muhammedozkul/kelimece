# Kelimece

Altı denemede beş harfli Türkçe kelimeyi bulma oyunu. Sınırsız mod: her kelime bitince yenisi gelir.

- Oynamak: `index.html` dosyasını tarayıcıda aç (ya da `python3 -m http.server` ile sun).
- Renkler: turkuaz = doğru yerde, mercan = kelimede var ama başka yerde, gri = yok.
- Ekran klavyesi (Türkçe harflerle) ve fiziksel klavye; Enter gönderir, Backspace siler.
- İstatistik, seri ve yarım kalan oyun tarayıcıda (localStorage) saklanır.

## Kelime listesi
`kelimeler/cevaplar.txt` (seçilecek yaygın kelimeler) ve `kelimeler/ek-tahminler.txt`
(yalnız tahmin olarak kabul edilenler) elle derlendi. Değiştirdikten sonra:

    python3 araclar/kelimeleri-derle.py

Bu komut 5 harfli olmayanları atlar ve `kelimeler.js` dosyasını yeniden üretir.
