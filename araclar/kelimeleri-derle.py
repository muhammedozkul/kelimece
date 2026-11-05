"""kelimeler/*.txt dosyalarını doğrulayıp kelimeler.js üretir.

Kullanım:  python3 araclar/kelimeleri-derle.py

- cevaplar.txt        : seçilecek yaygın kelimeler (elle derlendi)
- ek-tahminler.txt    : yalnız tahmin olarak kabul edilen ek kelimeler (elle derlendi)
- kaynak-zemberek.txt : Zemberek-NLP sözlüğünden 5 harfli kelimeler (Apache-2.0); derlemeye
                        doğrudan girmez, ek-tahminler.txt için elle seçim kaynağıdır
- cikarilanlar.txt    : hiçbir listede yer almayacak kelimeler (argo, özel ad vb.)

Yalnız 5 harfli, Türkçe alfabedeki kelimeler alınır; diğerleri raporlanıp atlanır.
"""
import json
import pathlib
import unicodedata

KOK = pathlib.Path(__file__).resolve().parent.parent
ALFABE = set("abcçdefgğhıijklmnoöprsştuüvyz")
SAPKALI = str.maketrans({"â": "a", "î": "i", "û": "u"})


def oku(ad, rapor=True):
    kelimeler, atlanan = [], []
    yol = KOK / "kelimeler" / ad
    for satir in yol.read_text(encoding="utf-8").splitlines():
        if satir.strip().startswith("#"):
            continue
        for k in satir.split():
            k = unicodedata.normalize("NFC", k).lower().translate(SAPKALI)
            if len(k) == 5 and set(k) <= ALFABE:
                kelimeler.append(k)
            else:
                atlanan.append(k)
    if rapor and atlanan:
        print(f"{ad}: atlananlar (5 harf değil / geçersiz):", " ".join(atlanan))
    return kelimeler


cikar = set(oku("cikarilanlar.txt"))
cevap_ham = oku("cevaplar.txt")
tekrar = len(cevap_ham) - len(set(cevap_ham))
cevaplar = sorted(set(cevap_ham) - cikar)
kabul = set(cevaplar) | set(oku("ek-tahminler.txt"))
tahminler = sorted(kabul - cikar - set(cevaplar))

js = (
    "// Bu dosya araclar/kelimeleri-derle.py ile üretildi; elle düzenleme.\n"
    "// Kabul listesinin bir bölümü Zemberek-NLP sözlüğünden (Apache-2.0) türetildi; bkz. README.\n"
    f"const CEVAPLAR = {json.dumps(cevaplar, ensure_ascii=False)};\n"
    f"const EK_TAHMINLER = {json.dumps(tahminler, ensure_ascii=False)};\n"
)
(KOK / "kelimeler.js").write_text(js, encoding="utf-8")
print(f"cevap: {len(cevaplar)}  ek tahmin: {len(tahminler)}  toplam kabul: {len(cevaplar) + len(tahminler)}"
      f"  (cevaplarda ayıklanan tekrar: {tekrar})")
