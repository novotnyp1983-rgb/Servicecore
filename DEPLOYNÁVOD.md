# Návod na zprovoznění webu a nastavení subdomény

Tento návod vás krok za krokem provede nahráním statického webu na **GitHub Pages** a jeho propojením s vaší subdoménou **`petrnovotny.stelab.cz`** přes **Cloudflare** a **Wedos**.

---

## 1. Zprovoznění kontaktního formuláře (Web3Forms)
Web je předpřipraven pro bezplatnou službu **Web3Forms**, která odesílá zprávy ze statického webu přímo na váš e-mail.
1. Přejděte na web [web3forms.com](https://web3forms.com/).
2. Zadejte e-mailovou adresu, na kterou má Petr dostávat poptávky, a odešlete.
3. Obdržíte e-mail s přístupovým klíčem (**Access Key**).
4. Otevřete soubor `index.html` a na řádku 240 nahraďte hodnotu `YOUR_ACCESS_KEY_HERE` vaším klíčem:
   ```html
   <input type="hidden" name="access_key" value="SEM_VLOZTE_VAS_ACCESS_KEY">
   ```

---

## 2. Nahrání webu na GitHub
Chcete-li hostovat web zdarma na GitHub Pages:
1. Přihlaste se ke svému účtu na [GitHubu](https://github.com/).
2. Vytvořte nový repozitář (např. s názvem `petrnovotny-web`).
   - Nastavte jej jako **Public** (veřejný).
3. Nahrajte do tohoto repozitáře všechny soubory ze složky `webovka`:
   - `index.html`
   - `style.css`
   - `script.js`
   - `CNAME`
   - složku `images/` se zpracovanými obrázky.

---

## 3. Nastavení DNS v Cloudflare / Wedos
Jelikož máte doménu `stelab.cz` vedenou u Wedosu a pravděpodobně nasměrovanou na **Cloudflare** (jak vyplývá z vašeho Cloudflare tunelu pro Home Assistant):
1. Přihlaste se do administrace **Cloudflare**.
2. Přejděte do správy zóny (DNS) pro doménu `stelab.cz`.
3. Přidejte nový DNS záznam typu **CNAME**:
   - **Type**: `CNAME`
   - **Name** (subdoména): `petrnovotny` (tím vytvoříte `petrnovotny.stelab.cz`)
   - **Target** (cíl): `UZIVATELSKE_JMENO.github.io` (kde `UZIVATELSKE_JMENO` je vaše přihlašovací jméno na GitHubu).
   - **Proxy status**: Pro začátek doporučujeme nastavit **DNS only** (šedý mráček), aby proběhlo bezproblémové ověření na straně GitHubu. Později můžete zapnout Proxy (oranžový mráček) pro vyšší bezpečnost a rychlost.
4. Uložte záznam.

---

## 4. Aktivace GitHub Pages a Custom Domain
Jakmile máte DNS záznam vytvořený a soubory nahrané:
1. Otevřete svůj repozitář na GitHubu a přejděte do záložky **Settings** (Nastavení).
2. V levém menu klikněte na **Pages**.
3. V sekci **Build and deployment**:
   - **Source**: Nastavte na `Deploy from a branch`.
   - **Branch**: Vyberte `main` (nebo `master`) a složku `/ (root)`, poté klikněte na **Save**.
4. V sekci **Custom domain**:
   - Do pole zadejte `petrnovotny.stelab.cz`. (Pokud je soubor `CNAME` správně nahraný v repozitáři, toto pole by se mělo vyplnit automaticky).
   - Klikněte na **Save**.
5. GitHub provede kontrolu DNS záznamů (to může trvat několik minut).
6. Jakmile je DNS ověřeno, zaškrtněte políčko **Enforce HTTPS**, aby byl web zabezpečený SSL certifikátem.

Web by měl být během několika minut plně funkční na adrese `https://petrnovotny.stelab.cz/`.

---

## 5. Administrace a vizuální úpravy webu (Word-like Editor)

Web obsahuje na míru naprogramované administrační rozhraní, které umožňuje Petrovi upravovat texty a kontaktní údaje přímo na stránce bez nutnosti znát HTML kód.

### A. Jak spustit administrační režim
Pro vstup do administrace stačí na konci webové adresy přidat parametr `?edit=true`:
* Česky: `https://petrnovotny.stelab.cz/?edit=true`
* Anglicky: `https://petrnovotny.stelab.cz/index_en.html?edit=true`

### B. První přihlášení – Vygenerování GitHub Tokenu (provede se pouze jednou)
Administrace běží přímo v prohlížeči a pro uložení změn potřebuje právo zápisu do vašeho GitHub repozitáře. K tomu slouží **Personal Access Token (PAT)**:
1. Přihlaste se na GitHub a přejděte na stránku: [github.com/settings/tokens](https://github.com/settings/tokens) (klikněte na **Generate new token (classic)**).
2. Do pole **Note** napište např. `web-editor-petr`.
3. Nastavte **Expiration** (Expiraci) dle libosti (doporučeno 90 dní nebo bez omezení „No expiration“).
4. V sekci oprávnění zaškrtněte políčko **`repo`** (zajistí možnost zápisu a uložení souborů do repozitáře).
5. Klikněte dole na zelené tlačítko **Generate token**.
6. **DŮLEŽITÉ:** Zobrazený kód (začíná na `ghp_...`) si zkopírujte a uložte. Zobrazí se pouze jednou!
7. Otevřete administrační odkaz z kroku A, vložte zkopírovaný token do vyskakovacího okna a klikněte na **Přihlásit se**. Token se bezpečně uloží do prohlížeče a příště se již přihlašovat nemusíte.

### C. Jak provádět změny
1. V administračním režimu se kolem všech editovatelných polí (nadpisy, texty, odrážky, čísla statistik) zobrazí jemný modrý přerušovaný okraj.
2. Stačí kliknout do ohraničené oblasti a začít psát (přesně jako ve Wordu).
   - *Poznámka:* Pokud do polí kopírujete text odjinud, automaticky se vyčistí formátování (vloží se jako prostý text), aby se nerozhodilo stylování webu.
3. Pokud upravujete telefonní číslo nebo e-mail v kontaktech, skript automaticky aktualizuje i klikací odkazy (`tel:` a `mailto:`), takže budou ihned fungovat.
4. Pokud upravíte číslo ve statistikách (např. *20 let zkušeností*), skript automaticky upraví i animaci počítadla pro běžné návštěvníky.
5. Pro uložení klikněte na zelené tlačítko **Uložit změny** na spodní liště. Během 3 sekund se změny sloučí, odešlou na GitHub a stránka se obnoví.
6. GitHub Pages změny přegenerují a za **1 až 2 minuty** se nový text zobrazí všem návštěvníkům na internetu.
7. Pokud budete chtít režim úprav opustit, klikněte na **Zahodit** nebo se odhlaste tlačítkem **Odhlásit se** (to smaže token z prohlížeče, užitečné na cizím počítači).

