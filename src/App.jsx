/*
═══════════════════════════════════════════════
DEMON LORDS GERMANY — INSTALLATIONSANLEITUNG
═══════════════════════════════════════════════

1. NODE.JS INSTALLIEREN
https://nodejs.org

2. NEUEN ORDNER ERSTELLEN
z.B.

DemonLordsBestellung

3. IN DEN ORDNER GEHEN UND TERMINAL ÖFFNEN

4. FOLGENDE BEFEHLE EINGEBEN

npm create vite@latest .

Dann auswählen:
- React
- JavaScript

Danach:

npm install
npm install tailwindcss @tailwindcss/vite

5. DEINE DATEIEN

src/App.jsx
-> kompletten Inhalt durch dieses Script ersetzen

public/logo.png
-> hier dein Vereinslogo einfügen

6. PROJEKT STARTEN

npm run dev

7. AUF GITHUB HOCHLADEN
https://github.com

8. BEI VERCEL VERÖFFENTLICHEN
https://vercel.com

9. EIGENE DOMAIN VERBINDEN
In Vercel:
Settings -> Domains

10. FERTIG
Danach kannst du den Link per WhatsApp verschicken.

═══════════════════════════════════════════════
WICHTIG
═══════════════════════════════════════════════

Dein Logo MUSS heißen:
logo.png

und muss in diesem Ordner liegen:
/public/logo.png

═══════════════════════════════════════════════
*/

import { useState } from "react";

export default function App() {
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const prices = { tshirt: 20, polo: 30, hoodie: 40 };

  const [orders, setOrders] = useState([
    { name: "Max Mustermann", nick: "Mäx", tshirtSize: "L", tshirtColor: "Schwarz", tshirtQty: 2, poloSize: "L", poloQty: 1, hoodieSize: "XL", hoodieQty: 1 },
    { name: "Jan Schmidt", nick: "Janni", tshirtSize: "XL", tshirtColor: "Olive", tshirtQty: 1, poloSize: "-", poloQty: 0, hoodieSize: "L", hoodieQty: 1 },
    { name: "Tom Becker", nick: "Becker", tshirtSize: "M", tshirtColor: "Schwarz", tshirtQty: 2, poloSize: "M", poloQty: 1, hoodieSize: "M", hoodieQty: 0 },
  ]);

  const [form, setForm] = useState({
    name: "",
    nick: "",
    tshirtSize: "S",
    tshirtColor: "Olive",
    tshirtQty: 0,
    poloSize: "S",
    poloQty: 0,
    hoodieSize: "S",
    hoodieQty: 0,
    note: "",
  });

  const calc = (o) => o.tshirtQty * prices.tshirt + o.poloQty * prices.polo + o.hoodieQty * prices.hoodie;
  const euro = (n) => `${n.toFixed(2).replace(".", ",")} €`;

  const totalTshirts = orders.reduce((s, o) => s + o.tshirtQty, 0);
  const totalPolos = orders.reduce((s, o) => s + o.poloQty, 0);
  const totalHoodies = orders.reduce((s, o) => s + o.hoodieQty, 0);
  const total = orders.reduce((s, o) => s + calc(o), 0);

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setOrders([...orders, { ...form, poloSize: form.poloQty > 0 ? form.poloSize : "-" }]);
    setForm({ name: "", nick: "", tshirtSize: "S", tshirtColor: "Olive", tshirtQty: 0, poloSize: "S", poloQty: 0, hoodieSize: "S", hoodieQty: 0, note: "" });
  }

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

 function exportCSV() {
  const header = [
    "Name",
    "Spitzname",
    "T-Shirt Größe",
    "T-Shirt Farbe",
    "T-Shirt Anzahl",
    "Polo Größe",
    "Polo Anzahl",
    "Hoodie Größe",
    "Hoodie Anzahl",
    "Gesamtpreis",
  ];

  const rows = orders.map((o) => [
    o.name,
    o.nick,
    o.tshirtSize,
    o.tshirtColor,
    o.tshirtQty,
    o.poloSize,
    o.poloQty,
    o.hoodieSize,
    o.hoodieQty,
    euro(calc(o)),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.join(";"))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "demon-lords-bestellung.csv";
  a.click();
  URL.revokeObjectURL(url);
}

  return (
    <>
      <style>{css}</style>
      <main className="page">
        <div className="frame">
          <header className="hero">
            <div className="smoke" />
            <img src="/logo.png" alt="Demon Lords Germany Logo" className="logo logo-left" />
            <img src="/logo.png" alt="Demon Lords Germany Logo" className="logo logo-right" />

            <div className="title-wrap">
              <h1>DEMON LORDS</h1>
              <h2>GERMANY</h2>
              <p>VEREINS BESTELLUNG</p>
            </div>
          </header>

          <div className="layout">
            <section className="panel form-panel">
              <h3 className="section-title">▣ EINTRAGUNGSFORMULAR</h3>
              <p className="subline">Bitte trage hier deine Bestellung ein.</p>

              <form onSubmit={submit}>
                <div className="two-cols">
                  <label>Name <span>*</span><input required placeholder="Dein Name" value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
                  <label>Spitzname <span>*</span><input placeholder="Dein Spitzname" value={form.nick} onChange={(e) => update("nick", e.target.value)} /></label>
                </div>

                <Product title="👕 T-SHIRT – 20€">
                  <div className="product-grid shirt-grid">
                    <Select label="Größe" value={form.tshirtSize} onChange={(v) => update("tshirtSize", v)} options={sizes} />
                    <Select label="Farbe" value={form.tshirtColor} onChange={(v) => update("tshirtColor", v)} options={["Olive", "Schwarz"]} />
                    <NumberInput label="Anzahl" value={form.tshirtQty} onChange={(v) => update("tshirtQty", v)} />
                  </div>
                  <SizeRow sizes={sizes} />
                </Product>

                <Product title="👕 POLO-SHIRT – 30€" note="(Nur in Schwarz)">
                  <div className="product-grid two-product-cols">
                    <Select label="Größe" value={form.poloSize} onChange={(v) => update("poloSize", v)} options={sizes} />
                    <NumberInput label="Anzahl" value={form.poloQty} onChange={(v) => update("poloQty", v)} />
                  </div>
                  <SizeRow sizes={sizes} />
                </Product>

                <Product title="🧥 HOODIE – 40€">
                  <div className="product-grid two-product-cols">
                    <Select label="Größe" value={form.hoodieSize} onChange={(v) => update("hoodieSize", v)} options={sizes} />
                    <NumberInput label="Anzahl" value={form.hoodieQty} onChange={(v) => update("hoodieQty", v)} />
                  </div>
                  <SizeRow sizes={sizes} />
                </Product>

                <label>Hinweise (optional)<textarea placeholder="Hier kannst du optional etwas angeben..." value={form.note} onChange={(e) => update("note", e.target.value)} /></label>
                <button className="submit" type="submit">➤ BESTELLUNG ABSENDEN</button>
                <p className="privacy">🔒 Deine Daten werden nur für diese Bestellung verwendet.</p>
              </form>
            </section>

            <section className="panel overview-panel">
              <div className="overview-head">
                <div>
                  <h3 className="section-title">▣ BESTELLÜBERSICHT</h3>
                  <p className="subline">Alle Einträge werden hier in Echtzeit angezeigt.</p>
                </div>
                <button className="export" onClick={exportCSV}>▦ EXCEL EXPORT</button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th rowSpan="2">Name</th><th rowSpan="2">Spitzname</th><th colSpan="4">T-Shirt</th><th colSpan="3">Polo-Shirt</th><th colSpan="3">Hoodie</th><th rowSpan="2">Gesamtpreis</th><th rowSpan="2"></th></tr>
                    <tr><th>Größe</th><th>Farbe</th><th>Anzahl</th><th>Preis</th><th>Größe</th><th>Anzahl</th><th>Preis</th><th>Größe</th><th>Anzahl</th><th>Preis</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={i}>
                        <td>{o.name}</td><td>{o.nick}</td>
                        <td>{o.tshirtSize}</td><td>{o.tshirtColor}</td><td>{o.tshirtQty}</td><td>{euro(o.tshirtQty * prices.tshirt)}</td>
                        <td>{o.poloQty > 0 ? o.poloSize : "-"}</td><td>{o.poloQty}</td><td>{euro(o.poloQty * prices.polo)}</td>
                        <td>{o.hoodieQty > 0 ? o.hoodieSize : "-"}</td><td>{o.hoodieQty}</td><td>{euro(o.hoodieQty * prices.hoodie)}</td>
                        <td className="price">{euro(calc(o))}</td>
                        <td><button className="delete" onClick={() => setOrders(orders.filter((_, index) => index !== i))}>🗑</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bottom-cards">
                <div className="card summary">
                  <h3>▟ GESAMTÜBERSICHT</h3>
                  <Summary label="T-Shirts:" qty={totalTshirts} value={euro(totalTshirts * prices.tshirt)} icon="👕" />
                  <Summary label="Polo-Shirts:" qty={totalPolos} value={euro(totalPolos * prices.polo)} icon="👕" />
                  <Summary label="Hoodies:" qty={totalHoodies} value={euro(totalHoodies * prices.hoodie)} icon="🧥" />
                  <div className="total"><strong>Gesamt:</strong><strong>{euro(total)}</strong></div>
                </div>
                <div className="card price-list">
                  <h3>PREISLISTE</h3>
                  <Price label="T-Shirt" value={euro(prices.tshirt)} icon="👕" />
                  <Price label="Polo-Shirt" value={euro(prices.polo)} icon="👕" />
                  <Price label="Hoodie" value={euro(prices.hoodie)} icon="🧥" />
                </div>
              </div>
            </section>
          </div>

          <footer>💀 DEMON LORDS GERMANY — BROTHERHOOD. LOYALTY. RESPECT. 💀</footer>
        </div>
      </main>
    </>
  );
}

function Product({ title, note, children }) {
  return <div className="product"><h4>{title} {note && <small>{note}</small>}</h4>{children}</div>;
}
function Select({ label, value, onChange, options }) {
  return <label>{label}<select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>;
}
function NumberInput({ label, value, onChange }) {
  return <label>{label}<input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}
function SizeRow({ sizes }) {
  return <div className="size-row">{sizes.map((s) => <span key={s}>{s}</span>)}</div>;
}
function Summary({ icon, label, qty, value }) {
  return <div className="summary-line"><span className="sicon">{icon}</span><b>{label}</b><span>{qty} Stk.</span><span>{value}</span></div>;
}
function Price({ icon, label, value }) {
  return <div className="price-line"><span>{icon}</span><b>{label}</b><em>{value}</em></div>;
}

const css = `
* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; background: #000; }
body { font-family: Arial, Helvetica, sans-serif; color: #fff; }
.page { min-height: 100vh; background: #000; padding: 12px; }
.frame { max-width: 1540px; margin: 0 auto; border: 1px solid #8b0000; border-radius: 7px; background: #030303; overflow: hidden; box-shadow: 0 0 35px rgba(150,0,0,.45); }
.hero { position: relative; min-height: 220px; overflow: hidden; background: radial-gradient(circle at 50% 20%, #202020 0%, #090909 42%, #000 78%); border-bottom: 1px solid #220000; }
.smoke { position: absolute; inset: 0; opacity: .55; background: radial-gradient(circle at 10% 20%, rgba(190,0,0,.45), transparent 18%), radial-gradient(circle at 90% 20%, rgba(190,0,0,.45), transparent 18%), radial-gradient(circle at 50% 15%, rgba(255,255,255,.15), transparent 30%); }
.logo { position: absolute; top: 12px; width: 205px; object-fit: contain; z-index: 2; filter: drop-shadow(0 0 12px rgba(255,0,0,.45)); }
.logo-left { left: 38px; }
.logo-right { right: 38px; }
.title-wrap { position: relative; z-index: 3; text-align: center; padding-top: 28px; margin: 0 auto; max-width: 900px; }
h1 { margin: 0; font-family: Georgia, serif; font-size: 84px; line-height: .9; letter-spacing: .12em; color: #b91512; text-shadow: 0 5px 0 #260000; }
h2 { margin: 4px 0 0; font-family: Georgia, serif; font-size: 50px; letter-spacing: .32em; color: #e5e5e5; text-shadow: 0 4px 0 #000; }
.title-wrap p { display: inline-block; margin: 12px 0 0; padding-top: 12px; min-width: 340px; border-top: 1px solid #8b0000; font-family: Georgia, serif; font-size: 27px; letter-spacing: .32em; color: #d4d4d4; }
.layout { display: grid; grid-template-columns: 460px 1fr; gap: 16px; padding: 0 22px 16px; margin-top: 0; }
.panel { border: 1px solid rgba(160,160,160,.45); border-radius: 8px; background: linear-gradient(180deg, rgba(15,17,18,.95), rgba(2,2,2,.97)); box-shadow: inset 0 0 28px rgba(255,255,255,.035); }
.form-panel { padding: 17px; }
.overview-panel { overflow: hidden; }
.section-title { margin: 0; color: #e51b16; font-size: 23px; font-weight: 900; letter-spacing: .02em; }
.subline { margin: 8px 0 20px 40px; color: #e0e0e0; font-size: 15px; }
form { display: flex; flex-direction: column; gap: 20px; }
.two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
label { display: block; font-size: 14px; font-weight: 700; color: #f2f2f2; }
label span { color: #ff1c15; }
input, select, textarea { width: 100%; margin-top: 7px; height: 42px; border-radius: 5px; border: 1px solid #414141; background: rgba(4,4,4,.95); color: #f3f3f3; padding: 0 12px; outline: none; }
input:focus, select:focus, textarea:focus { border-color: #d40000; box-shadow: 0 0 8px rgba(220,0,0,.45); }
textarea { height: 44px; padding-top: 11px; resize: none; }
.product h4 { margin: 0 0 12px; font-size: 20px; font-weight: 900; text-transform: uppercase; }
.product h4 small { font-size: 14px; color: #dedede; font-weight: 700; text-transform: none; }
.product-grid { display: grid; gap: 13px; align-items: end; }
.shirt-grid { grid-template-columns: 1fr 145px 60px; }
.two-product-cols { grid-template-columns: 1fr 70px; gap: 26px; }
.size-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 7px; }
.size-row span { min-width: 31px; text-align: center; color: #e7e7e7; border: 1px solid #333; border-radius: 4px; background: rgba(0,0,0,.5); padding: 2px 6px; font-size: 14px; }
.submit { height: 44px; border: 0; border-radius: 5px; background: linear-gradient(180deg,#f02520,#be100d); color: #fff; font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: .03em; cursor: pointer; box-shadow: 0 0 16px rgba(255,0,0,.45); }
.privacy { margin: -8px 0 0; text-align: center; color: #aaa; font-size: 12px; }
.overview-head { display: flex; justify-content: space-between; gap: 16px; padding: 16px 18px; border-bottom: 1px solid #272727; }
.export { align-self: start; border: 1px solid #8b0000; background: #070707; color: #eee; border-radius: 5px; padding: 12px 20px; font-size: 14px; text-transform: uppercase; cursor: pointer; }
.table-wrap { overflow-x: auto; }
table { width: 100%; min-width: 1010px; border-collapse: collapse; font-size: 15px; }
th, td { padding: 11px 13px; border-bottom: 1px solid #242424; text-align: left; white-space: nowrap; }
th { color: #f5f5f5; font-weight: 900; }
th[colspan] { text-align: center; }
td:nth-child(3), th:nth-child(3), td:nth-child(7), th:nth-child(7), td:nth-child(10), th:nth-child(10), td:nth-child(13), th:nth-child(13) { border-left: 1px solid #242424; }
tr:hover td { background: rgba(255,255,255,.03); }
.price { color: #ff1610; font-weight: 900; }
.delete { border: 1px solid #b00000; color: #ff1610; background: transparent; border-radius: 5px; padding: 7px 9px; cursor: pointer; }
.bottom-cards { display: grid; grid-template-columns: 1.15fr .95fr; gap: 16px; padding: 18px; }
.card { border: 1px solid #505050; border-radius: 8px; background: rgba(0,0,0,.55); padding: 24px 36px; box-shadow: inset 0 0 28px rgba(255,255,255,.035); }
.card h3 { margin: 0 0 20px; text-align: center; color: #f01b15; font-size: 24px; font-weight: 900; text-transform: uppercase; }
.summary-line { display: grid; grid-template-columns: 45px 1fr 90px 125px; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 20px; }
.sicon, .price-line span { font-size: 36px; filter: hue-rotate(130deg) saturate(2); }
.total { display: flex; justify-content: space-between; margin-top: 18px; padding-top: 18px; border-top: 1px solid #555; color: #f01b15; font-size: 30px; }
.price-line { display: grid; grid-template-columns: 55px 1fr auto; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid #333; font-size: 20px; }
.price-line:last-child { border-bottom: 0; }
.price-line em { font-style: normal; }
footer { margin: 0 22px 16px; border: 1px solid #242424; border-radius: 8px; background: #050505; color: #d0d0d0; text-align: center; padding: 13px; font-family: Georgia, serif; font-size: 15px; letter-spacing: .35em; text-transform: uppercase; }
@media (max-width: 1200px) { .layout { grid-template-columns: 1fr; } .logo { width: 160px; } h1 { font-size: 60px; } h2 { font-size: 36px; } .title-wrap p { font-size: 20px; } }
@media (max-width: 760px) { .page { padding: 6px; } .hero { min-height: 260px; } .logo { width: 115px; left: 8px; } .logo-right { display: none; } .title-wrap { padding: 125px 12px 20px; } h1 { font-size: 38px; letter-spacing: .08em; } h2 { font-size: 25px; letter-spacing: .18em; } .title-wrap p { min-width: 0; width: 100%; font-size: 15px; letter-spacing: .18em; } .layout { padding: 0 8px 12px; } .two-cols, .shirt-grid, .two-product-cols, .bottom-cards { grid-template-columns: 1fr; } .overview-head { flex-direction: column; } .card { padding: 20px; } .summary-line { grid-template-columns: 36px 1fr 80px; font-size: 16px; } .summary-line span:last-child { grid-column: 2 / 4; text-align: right; } .total { font-size: 24px; } footer { margin: 0 8px 10px; font-size: 11px; letter-spacing: .18em; } }
`;
