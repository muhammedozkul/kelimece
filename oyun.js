// Kelimece — 5 harfli Türkçe kelime tahmin oyunu (sınırsız mod)
"use strict";

const UZUNLUK = 5;
const HAK = 6;
const ALFABE = "abcçdefgğhıijklmnoöprsştuüvyz";
const KABUL = new Set([...CEVAPLAR, ...EK_TAHMINLER]);
const ONCELIK = { yok: 1, yakin: 2, dogru: 3 };
const TEBRIK = ["Dâhice!", "Müthiş!", "Çok iyi!", "Güzel!", "Fena değil!", "Kıl payı!"];
const KLAVYE = [
  ["e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
  ["gir", "z", "c", "v", "b", "n", "m", "ö", "ç", "sil"],
];

const buyuk = (s) => s.toLocaleUpperCase("tr-TR");
const $ = (id) => document.getElementById(id);

// ---------- Kalıcı kayıt (gizli pencerede kayıt olmazsa oyun yine çalışır) ----------
function oku(anahtar, varsayilan) {
  try {
    const v = localStorage.getItem("kelimece." + anahtar);
    return v ? JSON.parse(v) : varsayilan;
  } catch { return varsayilan; }
}
function yaz(anahtar, deger) {
  try { localStorage.setItem("kelimece." + anahtar, JSON.stringify(deger)); } catch { /* yoksay */ }
}

let istat = oku("istat", { oyun: 0, kazanma: 0, seri: 0, enIyi: 0, dagilim: [0, 0, 0, 0, 0, 0] });

// ---------- Oyun durumu ----------
let cevap = "";
let tahminler = [];   // gönderilmiş tahminler
let yazilan = "";     // şu an yazılan satır
let bitti = false;
let kilit = false;    // açılma animasyonu sırasında giriş kapalı

function yeniCevapSec() {
  const son = oku("son", []);
  const yasak = new Set(son);
  let adaylar = CEVAPLAR.filter((k) => !yasak.has(k));
  if (adaylar.length === 0) adaylar = CEVAPLAR;
  const secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
  son.push(secilen);
  yaz("son", son.slice(-Math.min(300, Math.floor(CEVAPLAR.length / 2))));
  return secilen;
}

// İki geçişli değerlendirme: önce doğru yerdekiler, sonra kalan harf sayısına göre "yakın".
function degerlendir(tahmin, hedef) {
  const t = [...tahmin], h = [...hedef];
  const sonuc = Array(UZUNLUK).fill("yok");
  const kalan = {};
  for (let i = 0; i < UZUNLUK; i++) {
    if (t[i] === h[i]) sonuc[i] = "dogru";
    else kalan[h[i]] = (kalan[h[i]] || 0) + 1;
  }
  for (let i = 0; i < UZUNLUK; i++) {
    if (sonuc[i] !== "dogru" && kalan[t[i]] > 0) {
      sonuc[i] = "yakin";
      kalan[t[i]]--;
    }
  }
  return sonuc;
}

// ---------- Çizim ----------
const tahta = $("tahta");
const klavye = $("klavye");
const tuslar = {};

function tahtaKur() {
  tahta.innerHTML = "";
  for (let r = 0; r < HAK; r++) {
    const satir = document.createElement("div");
    satir.className = "satir";
    for (let c = 0; c < UZUNLUK; c++) {
      const kare = document.createElement("div");
      kare.className = "kare";
      satir.appendChild(kare);
    }
    tahta.appendChild(satir);
  }
}

function klavyeKur() {
  for (const sira of KLAVYE) {
    const satir = document.createElement("div");
    satir.className = "tus-satir";
    for (const h of sira) {
      const tus = document.createElement("button");
      tus.className = "tus";
      tus.type = "button";
      if (h === "gir") { tus.textContent = "GİR"; tus.classList.add("genis"); tus.setAttribute("aria-label", "Tahmini gönder"); }
      else if (h === "sil") { tus.textContent = "⌫"; tus.classList.add("genis"); tus.setAttribute("aria-label", "Harf sil"); }
      else { tus.textContent = buyuk(h); tuslar[h] = tus; }
      tus.dataset.harf = h;
      satir.appendChild(tus);
    }
    klavye.appendChild(satir);
  }
  klavye.addEventListener("click", (e) => {
    const tus = e.target.closest(".tus");
    if (!tus) return;
    tus.blur();
    girdi(tus.dataset.harf);
  });
}

function satirEl(r) { return tahta.children[r]; }

function yazilaniGoster() {
  const satir = satirEl(tahminler.length);
  if (!satir) return;
  for (let c = 0; c < UZUNLUK; c++) {
    const kare = satir.children[c];
    const harf = yazilan[c] || "";
    kare.textContent = harf ? buyuk(harf) : "";
    kare.classList.toggle("dolu", !!harf);
  }
}

function tusRenkle(harf, durum) {
  const tus = tuslar[harf];
  if (!tus) return;
  const simdiki = tus.dataset.durum;
  if (!simdiki || ONCELIK[durum] > ONCELIK[simdiki]) {
    tus.classList.remove("dogru", "yakin", "yok");
    tus.classList.add(durum);
    tus.dataset.durum = durum;
  }
}

function satirBoya(r, kelime, animasyonlu, bitince) {
  const sonuc = degerlendir(kelime, cevap);
  const satir = satirEl(r);
  const harfler = [...kelime];
  harfler.forEach((h, c) => {
    const kare = satir.children[c];
    kare.textContent = buyuk(h);
    kare.classList.add("dolu");
    if (!animasyonlu) { kare.classList.add(sonuc[c]); tusRenkle(h, sonuc[c]); return; }
    setTimeout(() => {
      kare.classList.add("don");
      setTimeout(() => kare.classList.add(sonuc[c]), 250);
    }, c * 280);
  });
  if (animasyonlu) {
    setTimeout(() => {
      harfler.forEach((h, c) => tusRenkle(h, sonuc[c]));
      bitince && bitince(sonuc);
    }, (UZUNLUK - 1) * 280 + 520);
  }
  return sonuc;
}

// ---------- Bildirim ----------
function bildir(metin, sure = 1400) {
  const kutu = document.createElement("div");
  kutu.className = "bildirim";
  kutu.textContent = metin;
  $("bildirimler").prepend(kutu);
  setTimeout(() => { kutu.classList.add("git"); setTimeout(() => kutu.remove(), 320); }, sure);
}

function salla() {
  const satir = satirEl(tahminler.length);
  satir.classList.remove("salla");
  void satir.offsetWidth;
  satir.classList.add("salla");
}

// ---------- Giriş ----------
function girdi(h) {
  if (perdeAcik()) return;
  if (bitti) { if (h === "gir") yeniOyun(); return; }
  if (kilit) return;
  if (h === "sil") { yazilan = yazilan.slice(0, -1); yazilaniGoster(); return; }
  if (h === "gir") { gonder(); return; }
  if (ALFABE.includes(h) && [...yazilan].length < UZUNLUK) { yazilan += h; yazilaniGoster(); }
}

function gonder() {
  if ([...yazilan].length < UZUNLUK) { salla(); bildir("5 harf gerekli"); return; }
  if (!KABUL.has(yazilan)) { salla(); bildir("Bu kelime sözlükte yok"); return; }
  const kelime = yazilan;
  const r = tahminler.length;
  tahminler.push(kelime);
  yazilan = "";
  kilit = true;
  const kazandi = kelime === cevap;
  const kaybetti = !kazandi && tahminler.length === HAK;
  if (kazandi || kaybetti) {
    bitti = true;
    istatGuncelle(kazandi, tahminler.length); // animasyondan önce: yenilenirse kayıp olmasın
  }
  durumKaydet();
  satirBoya(r, kelime, true, () => {
    kilit = false;
    if (kazandi) {
      [...satirEl(r).children].forEach((k, c) => setTimeout(() => k.classList.add("zipla"), c * 90));
      bildir(TEBRIK[r], 1600);
      setTimeout(() => istatAc(true), 1700);
    } else if (kaybetti) {
      bildir(buyuk(cevap), 2200);
      setTimeout(() => istatAc(true), 1900);
    }
  });
}

// Fiziksel klavye: Türkçe klavyede harfler doğrudan gelir; büyük I → ı, İ → i.
function tusCevir(e) {
  if (e.key === "Enter") return "gir";
  if (e.key === "Backspace" || e.key === "Delete") return "sil";
  if (e.key.length !== 1) return null;
  if (e.key === "I") return "ı";
  if (e.key === "İ") return "i";
  const h = e.key.toLocaleLowerCase("tr-TR");
  return ALFABE.includes(h) ? h : null;
}

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "Escape") { perdeleriKapat(); return; }
  if (e.key === "Enter" && !$("istatPerde").hidden && bitti) { e.preventDefault(); yeniOyun(); return; }
  const h = tusCevir(e);
  if (!h) return;
  e.preventDefault();
  girdi(h);
});

// ---------- İstatistik ----------
function istatGuncelle(kazandi, deneme) {
  istat.oyun++;
  if (kazandi) {
    istat.kazanma++;
    istat.seri++;
    istat.enIyi = Math.max(istat.enIyi, istat.seri);
    istat.dagilim[deneme - 1]++;
  } else {
    istat.seri = 0;
  }
  yaz("istat", istat);
  seriYaz();
}

function seriYaz() {
  $("seriSerit").innerHTML = istat.seri > 0
    ? `🔥 Seri: <b>${istat.seri}</b> · En iyi: ${istat.enIyi}`
    : (istat.oyun > 0 ? `En iyi seri: ${istat.enIyi}` : "Sınırsız mod · istediğin kadar oyna");
}

function istatAc(sonucla) {
  $("sOyun").textContent = istat.oyun;
  $("sYuzde").textContent = istat.oyun ? Math.round((100 * istat.kazanma) / istat.oyun) : 0;
  $("sSeri").textContent = istat.seri;
  $("sEnIyi").textContent = istat.enIyi;

  const kazandi = bitti && tahminler[tahminler.length - 1] === cevap;
  const enCok = Math.max(1, ...istat.dagilim);
  const dagilim = $("dagilim");
  dagilim.innerHTML = "";
  istat.dagilim.forEach((sayi, i) => {
    const satir = document.createElement("div");
    satir.className = "cubuk-satir";
    const son = kazandi && tahminler.length === i + 1;
    satir.innerHTML = `<span>${i + 1}</span><div class="cubuk${son ? " son" : ""}" style="width:${Math.max(7, (100 * sayi) / enCok)}%">${sayi}</div>`;
    dagilim.appendChild(satir);
  });

  const sonucGoster = sonucla && bitti;
  $("sonucKutu").hidden = !sonucGoster;
  $("sonucDugmeler").hidden = !bitti;
  if (sonucGoster) {
    $("sonucMesaj").textContent = kazandi ? `${TEBRIK[tahminler.length - 1]} ${tahminler.length}/6` : "Bu sefer olmadı";
    const kelimeKutu = $("sonucKelime");
    kelimeKutu.innerHTML = "";
    for (const h of cevap) {
      const k = document.createElement("span");
      k.className = "kare " + (kazandi ? "dogru" : "yakin");
      k.textContent = buyuk(h);
      kelimeKutu.appendChild(k);
    }
  }
  $("istatPerde").hidden = false;
}

function paylasMetni() {
  const kazandi = tahminler[tahminler.length - 1] === cevap;
  const satirlar = tahminler.map((t) =>
    degerlendir(t, cevap).map((d) => ({ dogru: "🟩", yakin: "🟧", yok: "⬛" })[d]).join("")
  );
  return `Kelimece ${kazandi ? tahminler.length : "X"}/6 · seri ${istat.seri}\n${satirlar.join("\n")}`;
}

$("paylasDugme").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(paylasMetni()); bildir("Panoya kopyalandı"); }
  catch { bildir("Kopyalanamadı"); }
});
$("yeniDugme").addEventListener("click", () => yeniOyun());

// ---------- Pencereler ----------
function perdeAcik() { return !$("istatPerde").hidden || !$("yardimPerde").hidden; }
function perdeleriKapat() { $("istatPerde").hidden = true; $("yardimPerde").hidden = true; }
document.querySelectorAll(".perde").forEach((p) => {
  p.addEventListener("click", (e) => {
    if (e.target === p || e.target.closest("[data-kapat]")) p.hidden = true;
  });
});
$("yardimDugme").addEventListener("click", (e) => { e.currentTarget.blur(); $("yardimPerde").hidden = false; });
$("istatDugme").addEventListener("click", (e) => { e.currentTarget.blur(); istatAc(true); });

// Tema: sistem → koyu → açık döngüsü
function temaUygula(t) {
  if (t) document.documentElement.dataset.tema = t;
  else delete document.documentElement.dataset.tema;
}
temaUygula(oku("tema", null));
$("temaDugme").addEventListener("click", (e) => {
  e.currentTarget.blur();
  const koyuMu = document.documentElement.dataset.tema
    ? document.documentElement.dataset.tema === "koyu"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const yeni = koyuMu ? "acik" : "koyu";
  temaUygula(yeni);
  yaz("tema", yeni);
});

// ---------- Boyutlandırma: tahta her zaman pencereye sığar ----------
function boyutla() {
  const tusY = Math.max(38, Math.min(56, Math.round(window.innerHeight * 0.072)));
  document.documentElement.style.setProperty("--tus-y", tusY + "px");
  const alan = $("alan");
  const w = alan.clientWidth - 8, h = alan.clientHeight - 12;
  const kare = Math.floor(Math.max(26, Math.min(64, (w - 4 * 6) / 5, (h - 5 * 6) / 6)));
  document.documentElement.style.setProperty("--kare", kare + "px");
}
window.addEventListener("resize", boyutla);

// ---------- Oyun akışı ----------
function durumKaydet() { yaz("durum", { cevap, tahminler, bitti }); }

function yeniOyun() {
  perdeleriKapat();
  cevap = yeniCevapSec();
  tahminler = [];
  yazilan = "";
  bitti = false;
  kilit = false;
  tahtaKur();
  for (const t of Object.values(tuslar)) { t.classList.remove("dogru", "yakin", "yok"); delete t.dataset.durum; }
  durumKaydet();
}

function baslat() {
  klavyeKur();
  boyutla();
  seriYaz();
  const kayit = oku("durum", null);
  if (kayit && !kayit.bitti && CEVAPLAR.includes(kayit.cevap) && Array.isArray(kayit.tahminler)) {
    cevap = kayit.cevap;
    tahminler = kayit.tahminler.filter((t) => KABUL.has(t)).slice(0, HAK - 1);
    tahtaKur();
    tahminler.forEach((t, r) => satirBoya(r, t, false));
  } else {
    yeniOyun();
  }
  if (!oku("yardimGoruldu", false)) { $("yardimPerde").hidden = false; yaz("yardimGoruldu", true); }
}

baslat();
