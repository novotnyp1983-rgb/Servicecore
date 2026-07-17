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
