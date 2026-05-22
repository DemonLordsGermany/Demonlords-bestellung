import { useState } from "react";

export default function App() {
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const prices = { tshirt: 20, polo: 30, hoodie: 40 };

  const [orders, setOrders] = useState([]);
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

  const calc = (o) =>
    Number(o.tshirtQty) * prices.tshirt +
    Number(o.poloQty) * prices.polo +
    Number(o.hoodieQty) * prices.hoodie;

  const euro = (n) => `${Number(n).toFixed(2).replace(".", ",")} €`;
  const set = (key, value) => setForm({ ...form, [key]: value });

  const totalTshirts = orders.reduce((s, o) => s + Number(o.tshirtQty), 0);
  const totalPolos = orders.reduce((s, o) => s + Number(o.poloQty), 0);
  const totalHoodies = orders.reduce((s, o) => s + Number(o.hoodieQty), 0);
  const total = orders.reduce((s, o) => s + calc(o), 0);

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setOrders([...orders, { ...form, poloSize: form.poloQty > 0 ? form.poloSize : "-" }]);
    setForm({
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
  }

  function exportCSV() {
    const header = [
      "Name",
      "Spitzname",
      "T-Shirt Groesse",
      "T-Shirt Farbe",
      "T-Shirt Anzahl",
      "Polo Groesse",
      "Polo Anzahl",
      "Hoodie Groesse",
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

    const allRows = [header, ...rows];
    const csv = allRows
      .map((row) => row.map((cell) => String(cell).replace(/;/g, ",")).join(";"))
      .join(String.fromCharCode(10));

    const blob = new Blob([String.fromCharCode(65279) + csv], {
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
      <style>{styles}</style>
      <main className="page">
        <div className="frame">
          <header className="hero">
            <div className="smoke" />
            <img src="/logo.png" alt="Demon Lords Germany Logo" className="logo logoLeft" />
            <img src="/logo.png" alt="Demon Lords Germany Logo" className="logo logoRight" />
            <div className="headline">
              <h1>DEMON LORDS</h1>
              <h2>GERMANY</h2>
              <p>VEREINS BESTELLUNG</p>
            </div>
          </header>

          <div className="content">
            <section className="panel formPanel">
              <h3 className="redTitle">▣ EINTRAGUNGSFORMULAR</h3>
              <p className="smallText">Bitte trage hier deine Bestellung ein.</p>

              <form onSubmit={submit}>
                <div className="twoCols">
                  <label>Name <span>*</span><input required placeholder="Dein Name" value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
                  <label>Spitzname <span>*</span><input placeholder="Dein Spitzname" value={form.nick} onChange={(e) => set("nick", e.target.value)} /></label>
                </div>

                <Product title="👕 T-SHIRT – 20€">
                  <div className="shirtGrid">
                    <Select label="Größe" value={form.tshirtSize} onChange={(v) => set("tshirtSize", v)} options={sizes} />
                    <Select label="Farbe" value={form.tshirtColor} onChange={(v) => set("tshirtColor", v)} options={["Olive", "Schwarz"]} />
                    <NumberInput label="Anzahl" value={form.tshirtQty} onChange={(v) => set("tshirtQty", v)} />
                  </div>
                  <SizeRow sizes={sizes} />
                </Product>

                <Product title="👕 POLO-SHIRT – 30€" note="(Nur in Schwarz)">
                  <div className="twoProductCols">
                    <Select label="Größe" value={form.poloSize} onChange={(v) => set("poloSize", v)} options={sizes} />
                    <NumberInput label="Anzahl" value={form.poloQty} onChange={(v) => set("poloQty", v)} />
                  </div>
                  <SizeRow sizes={sizes} />
                </Product>

                <Product title="🧥 HOODIE – 40€">
                  <div className="twoProductCols">
                    <Select label="Größe" value={form.hoodieSize} onChange={(v) => set("hoodieSize", v)} options={sizes} />
                    <NumberInput label="Anzahl" value={form.hoodieQty} onChange={(v) => set("hoodieQty", v)} />
                  </div>
                  <SizeRow sizes={sizes} />
                </Product>

                <label>Hinweise optional<textarea placeholder="Hier kannst du optional etwas angeben..." value={form.note} onChange={(e) => set("note", e.target.value)} /></label>
                <button className="submit" type="submit">➤ BESTELLUNG ABSENDEN</button>
                <p className="privacy">🔒 Deine Daten werden nur für diese Bestellung verwendet.</p>
              </form>
            </section>

            <section className="panel overviewPanel">
              <div className="overviewHead">
                <div>
                  <h3 className="redTitle">▣ BESTELLÜBERSICHT</h3>
                  <p className="smallText">Alle Einträge werden hier in Echtzeit angezeigt.</p>
                </div>
                <button className="export" onClick={exportCSV}>▦ EXCEL EXPORT</button>
              </div>

              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th rowSpan="2">Name</th><th rowSpan="2">Spitzname</th>
                      <th colSpan="4">T-Shirt</th><th colSpan="3">Polo-Shirt</th><th colSpan="3">Hoodie</th>
                      <th rowSpan="2">Gesamtpreis</th><th rowSpan="2"></th>
                    </tr>
                    <tr>
                      <th>Größe</th><th>Farbe</th><th>Anzahl</th><th>Preis</th>
                      <th>Größe</th><th>Anzahl</th><th>Preis</th>
                      <th>Größe</th><th>Anzahl</th><th>Preis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 && (
                      <tr><td colSpan="14" className="empty">Noch keine Bestellungen eingetragen.</td></tr>
                    )}
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

              <div className="bottomCards">
                <div className="card summary">
                  <h3>▟ GESAMTÜBERSICHT</h3>
                  <Summary icon="👕" label="T-Shirts:" qty={totalTshirts} value={euro(totalTshirts * prices.tshirt)} />
                  <Summary icon="👕" label="Polo-Shirts:" qty={totalPolos} value={euro(totalPolos * prices.polo)} />
                  <Summary icon="🧥" label="Hoodies:" qty={totalHoodies} value={euro(totalHoodies * prices.hoodie)} />
                  <div className="total"><strong>Gesamt:</strong><strong>{euro(total)}</strong></div>
                </div>

                <div className="card priceList">
                  <h3>PREISLISTE</h3>
                  <PriceLine icon="👕" label="T-Shirt" value={euro(prices.tshirt)} />
                  <PriceLine icon="👕" label="Polo-Shirt" value={euro(prices.polo)} />
                  <PriceLine icon="🧥" label="Hoodie" value={euro(prices.hoodie)} />
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
  return <div className="sizeRow">{sizes.map((s) => <span key={s}>{s}</span>)}</div>;
}
function Summary({ icon, label, qty, value }) {
  return <div className="summaryLine"><span>{icon}</span><b>{label}</b><em>{qty} Stk.</em><em>{value}</em></div>;
}
function PriceLine({ icon, label, value }) {
  return <div className="priceLine"><span>{icon}</span><b>{label}</b><em>{value}</em></div>;
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Rye&family=Oswald:wght@300;400;500;600;700&display=swap');

*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%;background:#000}
body{font-family:'Oswald',Arial,sans-serif;color:#f2f2f2;background:#000}

.page{min-height:100vh;background:#000;padding:12px}
.frame{max-width:1540px;margin:0 auto;border:1px solid #8f0907;border-radius:7px;background:#030303;overflow:hidden;box-shadow:0 0 38px rgba(150,0,0,.42)}

.hero{position:relative;min-height:220px;overflow:hidden;background:radial-gradient(circle at 50% 18%,#252525 0%,#101010 34%,#050505 62%,#000 100%);border-bottom:1px solid #240000}
.smoke{position:absolute;inset:0;opacity:.75;background:radial-gradient(circle at 11% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 89% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 50% 15%,rgba(255,255,255,.13),transparent 29%),linear-gradient(90deg,rgba(120,0,0,.35),transparent 24%,transparent 76%,rgba(120,0,0,.35))}
.logo{position:absolute;top:13px;width:205px;object-fit:contain;z-index:2;filter:drop-shadow(0 0 10px rgba(255,0,0,.55)) contrast(1.08) saturate(1.08)}
.logoLeft{left:38px}.logoRight{right:38px}

.headline{position:relative;z-index:3;text-align:center;padding-top:25px;margin:0 auto;max-width:920px}
.headline h1{margin:0;font-family:'Rye',Georgia,serif;font-size:82px;line-height:.95;letter-spacing:.055em;color:#b91410;text-shadow:0 3px 0 #3a0000,0 0 12px rgba(230,0,0,.35);font-weight:400}
.headline h2{margin:3px 0 0;font-family:'Rye',Georgia,serif;font-size:48px;line-height:1;letter-spacing:.23em;color:#d8d8d8;text-shadow:0 3px 0 #000,0 0 8px rgba(255,255,255,.18);font-weight:400}
.headline p{display:inline-block;margin:13px 0 0;padding-top:10px;min-width:340px;border-top:1px solid #8b0000;font-family:'Rye',Georgia,serif;font-size:25px;letter-spacing:.22em;color:#cfcfcf;text-shadow:0 2px 0 #000}

.content{display:grid;grid-template-columns:460px 1fr;gap:16px;padding:0 22px 16px}
.panel{border:1px solid rgba(150,150,150,.42);border-radius:8px;background:linear-gradient(180deg,rgba(13,15,16,.96),rgba(2,2,2,.98));box-shadow:inset 0 0 28px rgba(255,255,255,.035),0 0 18px rgba(0,0,0,.75)}
.formPanel{padding:17px}.overviewPanel{overflow:hidden}

.redTitle{margin:0;color:#ef1b16;font-size:23px;font-weight:700;letter-spacing:.035em;text-transform:uppercase;text-shadow:0 0 8px rgba(255,0,0,.25)}
.smallText{margin:8px 0 20px 40px;color:#e2e2e2;font-size:15px;font-weight:300;letter-spacing:.02em}
form{display:flex;flex-direction:column;gap:20px}.twoCols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
label{display:block;font-size:15px;font-weight:400;color:#f1f1f1;letter-spacing:.025em}label span{color:#ff2018}
input,select,textarea{width:100%;margin-top:7px;height:42px;border-radius:5px;border:1px solid #444;background:linear-gradient(180deg,#090909,#030303);color:#f3f3f3;padding:0 12px;outline:none;font-family:'Oswald',Arial,sans-serif;font-size:15px}
input:focus,select:focus,textarea:focus{border-color:#c40000;box-shadow:0 0 8px rgba(220,0,0,.45)}
textarea{height:44px;padding-top:11px;resize:none}

.product h4{margin:0 0 12px;font-size:21px;font-weight:700;text-transform:uppercase;letter-spacing:.02em;color:#e9e9e9}.product small{font-size:14px;color:#dedede;text-transform:none;font-weight:400}
.shirtGrid{display:grid;grid-template-columns:1fr 145px 60px;gap:13px;align-items:end}.twoProductCols{display:grid;grid-template-columns:1fr 70px;gap:26px}
.sizeRow{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.sizeRow span{min-width:31px;text-align:center;color:#e7e7e7;border:1px solid #343434;border-radius:4px;background:rgba(0,0,0,.6);padding:2px 6px;font-size:14px}
.submit{height:44px;border:0;border-radius:5px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;font-family:'Oswald',Arial,sans-serif;font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;box-shadow:0 0 16px rgba(255,0,0,.45)}
.submit:hover,.export:hover,.delete:hover{filter:brightness(1.15)}.privacy{margin:-8px 0 0;text-align:center;color:#aaa;font-size:12px;font-weight:300}

.overviewHead{display:flex;justify-content:space-between;gap:16px;padding:16px 18px;border-bottom:1px solid #272727}.export{align-self:start;border:1px solid #8b0000;background:#070707;color:#eee;border-radius:5px;padding:12px 20px;font-family:'Oswald',Arial,sans-serif;font-size:15px;text-transform:uppercase;cursor:pointer;letter-spacing:.03em}
.tableWrap{overflow-x:auto}table{width:100%;min-width:1010px;border-collapse:collapse;font-size:15px}th,td{padding:11px 13px;border-bottom:1px solid #242424;text-align:left;white-space:nowrap}th{color:#f5f5f5;font-weight:600;letter-spacing:.02em}th[colspan]{text-align:center}tr:hover td{background:rgba(255,255,255,.035)}.price{color:#ff1610;font-weight:700}.delete{border:1px solid #b00000;color:#ff1610;background:transparent;border-radius:5px;padding:7px 9px;cursor:pointer}.empty{text-align:center;color:#aaa;padding:28px}

.bottomCards{display:grid;grid-template-columns:1.15fr .95fr;gap:16px;padding:18px}.card{border:1px solid #505050;border-radius:8px;background:rgba(0,0,0,.55);padding:24px 36px;box-shadow:inset 0 0 28px rgba(255,255,255,.035)}.card h3{margin:0 0 20px;text-align:center;color:#f01b15;font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.summaryLine{display:grid;grid-template-columns:45px 1fr 90px 125px;align-items:center;gap:8px;margin-bottom:10px;font-size:20px}.summaryLine span,.priceLine span{font-size:36px;filter:saturate(1.25)}.summaryLine em,.priceLine em{font-style:normal}.total{display:flex;justify-content:space-between;margin-top:18px;padding-top:18px;border-top:1px solid #555;color:#f01b15;font-size:30px;font-weight:700}.priceLine{display:grid;grid-template-columns:55px 1fr auto;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid #333;font-size:20px}.priceLine:last-child{border-bottom:0}
footer{margin:0 22px 16px;border:1px solid #242424;border-radius:8px;background:#050505;color:#d0d0d0;text-align:center;padding:13px;font-family:'Rye',Georgia,serif;font-size:14px;letter-spacing:.22em;text-transform:uppercase}

@media(max-width:1200px){.content{grid-template-columns:1fr}.logo{width:160px}.headline h1{font-size:60px}.headline h2{font-size:36px}.headline p{font-size:20px}}
@media(max-width:760px){.page{padding:6px}.hero{min-height:260px}.logo{width:115px;left:8px}.logoRight{display:none}.headline{padding:125px 12px 20px}.headline h1{font-size:38px;letter-spacing:.045em}.headline h2{font-size:25px;letter-spacing:.13em}.headline p{min-width:0;width:100%;font-size:15px;letter-spacing:.12em}.content{padding:0 8px 12px}.twoCols,.shirtGrid,.twoProductCols,.bottomCards{grid-template-columns:1fr}.overviewHead{flex-direction:column}.card{padding:20px}.summaryLine{grid-template-columns:36px 1fr 80px;font-size:16px}.summaryLine em:last-child{grid-column:2/4;text-align:right}.total{font-size:24px}footer{margin:0 8px 10px;font-size:10px;letter-spacing:.12em}}
`;
