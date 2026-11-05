"""kelimeler/*.txt dosyalarını doğrulayıp kelimeler.js üretir.

Kullanım:  python3 araclar/kelimeleri-derle.py
Yalnız 5 harfli, Türkçe alfabedeki kelimeler alınır; diğerleri raporlanıp atlanır.
"""
import json
import pathlib
import unicodedata

KOK = pathlib.Path(__file__).resolve().parent.parent
ALFABE = set("abcçdefgğhıijklmnoöprsştuüvyz")
SAPKALI = str.maketrans({"â": "a", "î": "i", "û": "u"})


def oku(ad):
    kelimeler, atlanan = [], []
    for satir in (KOK / "kelimeler" / ad).read_text(encoding="utf-8").splitlines():
        if satir.strip().startswith("#"):
            continue
        for k in satir.split():
            k = unicodedata.normalize("NFC", k).lower().translate(SAPKALI)
            if len(k) == 5 and set(k) <= ALFABE:
                kelimeler.append(k)
            else:
                atlanan.append(k)
    return kelimeler, atlanan


cevaplar, a1 = oku("cevaplar.txt")
ekler, a2 = oku("ek-tahminler.txt")
cevaplar = sorted(set(cevaplar))
tahminler = sorted(set(ekler) - set(cevaplar))

js = (
    "// Bu dosya araclar/kelimeleri-derle.py ile üretildi; elle düzenleme.\n"
    f"const CEVAPLAR = {json.dumps(cevaplar, ensure_ascii=False)};\n"
    f"const EK_TAHMINLER = {json.dumps(tahminler, ensure_ascii=False)};\n"
)
(KOK / "kelimeler.js").write_text(js, encoding="utf-8")
print(f"cevap: {len(cevaplar)}  ek tahmin: {len(tahminler)}  toplam kabul: {len(cevaplar) + len(tahminler)}")
if a1 or a2:
    print("atlananlar (5 harf değil / geçersiz):", " ".join(a1 + a2))
