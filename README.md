**English** · [Türkçe](README.tr.md)

# Kelimece

A game where you find a five-letter Turkish word in six guesses. Unlimited mode: when one word is done, a new one comes.

- To play: open `index.html` in a browser (or serve it with `python3 -m http.server`).
- Colors: turquoise = right letter in the right spot, coral = in the word but in another spot, gray = not in the word.
- On-screen keyboard (with Turkish letters) and physical keyboard; Enter submits, Backspace deletes.
- Stats, streaks and an unfinished game are saved in the browser (localStorage).

## Word list
2,950 accepted guesses in total; 1,546 of them can be chosen as answers, 1,404 are accepted only as guesses.

- `kelimeler/cevaplar.txt`: common, plain words that can be chosen as answers (hand-curated).
- `kelimeler/ek-tahminler.txt`: words accepted only as guesses: hand-curated words, verb roots hand-picked from Zemberek
  (bekle, çalış) and known words, and common suffixed forms generated with vowel harmony (gözüm, yolda, evler).
- `kelimeler/kaynak-zemberek.txt`: five-letter words extracted from the [Zemberek-NLP](https://github.com/ahmetaa/zemberek-nlp)
  dictionary (`master-dictionary.dict`, `non-tdk.dict`). License: Apache License 2.0, copyright
  Ahmet A. Akın and Mehmet D. Akın; license text in `kelimeler/ZEMBEREK-LISANS.txt`. Changes: only five-letter entries
  were kept; proper nouns, abbreviations, interjections and punctuation were removed; roots of eight-letter -mak/-mek verbs were added.
  This file is not compiled directly; it is the source for picking entries for `ek-tahminler.txt`.
- `kelimeler/cikarilanlar.txt`: words that never go into any list (slang, profanity, slurs, proper nouns, brands).

After making changes:

    python3 araclar/kelimeleri-derle.py

This command skips words that aren't five letters, removes duplicates and excluded words, and regenerates `kelimeler.js`.
