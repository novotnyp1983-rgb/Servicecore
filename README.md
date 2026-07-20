# Petr Novotný – Webová prezentace & Servis laminovacích strojů

Tento repozitář obsahuje statickou, vícejazyčnou webovou prezentaci pro pana Petra Novotného (OSVČ), servisního specialistu na laminovací, kašírovací a lisovací stroje. 

Web běží na vlastní subdoméně **[petrnovotny.stelab.cz](https://petrnovotny.stelab.cz/)** a je hostován zdarma prostřednictvím služby **GitHub Pages**.

---

## 🛠️ Použité technologie a integrace

Web je navržen tak, aby byl maximálně rychlý, bezpečný a nevyžadoval placený serverový hosting (backend). Využívá následující technologie:

* **Frontend:** Čisté HTML5, CSS3 (vlastní moderní design systém přizpůsobený pro tmavý režim) a Vanilla JavaScript.
* **Kontaktní formulář:** Propojen se službou **[Web3Forms](https://web3forms.com/)**, která umožňuje odesílání formulářů přímo na e-mail bez vlastního PHP backendu.
* **Analytika a nahrávky:** Integrováno měření pomocí **[Microsoft Clarity](https://clarity.microsoft.com/)** pro detailní analýzu chování uživatelů (nahrávky pohybu myší, teplotní mapy, statistiky návštěvnosti).
* **Administrační rozhraní:** Vlastní vestavěný JavaScriptový inline editor, který komunikuje přímo s **GitHub API**.

---

## ✏️ Vizuální administrace (Word-like Editor)

Web disponuje na míru vytvořeným administračním portálem. Umožňuje Petrovi měnit texty, odrážky a kontaktní údaje přímo ve vizuálním rozhraní stránky (podobně jako v textovém editoru) a změny ukládat bez nutnosti zásahu do kódu.

### Jak administrace funguje?

1. **Aktivace:** Administrace se spouští přidáním parametru `?edit=true` na konec adresy:
   * CZ verze: `https://petrnovotny.stelab.cz/?edit=true`
   * EN verze: `https://petrnovotny.stelab.cz/index_en.html?edit=true`
2. **Přihlášení:** Při prvním spuštění si administrátor vyžádá **GitHub Personal Access Token (PAT)**. Ten se bezpečně uloží do prohlížeče (`LocalStorage`) a slouží k ověření zápisu.
3. **Úpravy:** Všechna editovatelná pole (označená přes `data-edit-id`) se ohraničí a lze do nich ihned psát.
4. **Ukládání:** Po kliknutí na **„Uložit změny“** skript:
   * Stáhne aktuální soubor z GitHubu.
   * Sloučí upravené texty (včetně automatické synchronizace odkazů `tel:` a `mailto:` u kontaktů).
   * Odešle aktualizovaný soubor zpět do repozitáře jako nový commit.
5. **Nasazení:** GitHub Pages automaticky zareagují a do **1–2 minut** se změny projeví všem návštěvníkům webu.

> [!NOTE]
> Podrobný návod, jak vygenerovat bezpečný GitHub Token a jak s editorem pracovat, naleznete v souboru **[DEPLOYNÁVOD.md](DEPLOYNÁVOD.md)**.

---

## 📈 Analytika a sledování chování (Microsoft Clarity)

Pro analýzu chování návštěvníků používáme bezplatný nástroj **[Microsoft Clarity](https://clarity.microsoft.com/)**. 

* **Přehrávání relací (Session Recordings):** Můžete sledovat reálné nahrávky toho, jak návštěvníci pohybovali myší, jak rychle rolovali a kam přesně klikali.
* **Teplotní mapy (Heatmaps):** Přehledné vizuální mapy, které ukazují nejčastěji klikaná tlačítka a hloubku srolování na stránce.
* **GDPR a soukromí:** Clarity je plně v souladu s nařízeními o ochraně osobních údajů a citlivé zadávané údaje (např. do formulářů) automaticky maskuje, takže se do nahrávek nedostanou.

Přístup k těmto statistikám a videím máte po přihlášení na oficiálním webu **[Clarity Dashboard](https://clarity.microsoft.com/)** pod vaším zaregistrovaným projektem `petrnovotny.stelab.cz`.

---

## 📂 Struktura projektu

```bash
├── CNAME             # Nastavení vlastní domény petrnovotny.stelab.cz
├── index.html        # Hlavní česká verze webu
├── index_en.html     # Anglická verze webu
├── style.css         # Kompletní design systém a styly prezentace
├── script.js         # Interaktivní prvky webu (menu, počítadlo statistik, odesílání formuláře)
├── admin.js          # Logika vizuálního editoru a integrace s GitHub API (načítá se pouze v ?edit=true)
├── admin.css         # Stylování administračního rozhraní (načítá se pouze v ?edit=true)
├── DEPLOYNÁVOD.md    # Návod na zprovoznění subdomény a konfiguraci administrace
└── README.md         # Tento přehledový soubor
```
