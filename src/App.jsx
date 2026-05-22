import { useState } from "react";

export default function App() {
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const prices = { tshirt: 20, polo: 30, hoodie: 40 };
  const ADMIN_PASSWORD = "DemonLords2026";

  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
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

    setOrders([
      ...orders,
      {
        ...form,
        poloSize: form.poloQty > 0 ? form.poloSize : "-",
        hoodieSize: form.hoodieQty > 0 ? form.hoodieSize : "-",
      },
    ]);

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

  function adminLogin(e) {
    e.preventDefault();

    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("Falsches Passwort");
    }
  }

  function adminLogout() {
    setIsAdmin(false);
    setAdminPassword("");
    setAdminError("");
  }

  function deleteOrder(index) {
    if (!isAdmin) return;
    setOrders(orders.filter((_, i) => i !== index));
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

    const csv = [header, ...rows]
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
                  <label>
                    Name <span>*</span>
                    <input
                      required
                      placeholder="Dein Name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </label>

                  <label>
                    Spitzname <span>*</span>
                    <input
                      placeholder="Dein Spitzname"
                      value={form.nick}
                      onChange={(e) => set("nick", e.target.value)}
                    />
                  </label>
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

                <label>
                  Hinweise optional
                  <textarea
                    placeholder="Hier kannst du optional etwas angeben..."
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                  />
                </label>

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

                <div className="adminBox">
                  {!isAdmin ? (
                    <form className="adminForm" onSubmit={adminLogin}>
                      <input
                        type="password"
                        placeholder="Admin Passwort"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                      <button type="submit">Admin Login</button>
                      {adminError && <span>{adminError}</span>}
                    </form>
                  ) : (
                    <div className="adminActive">
                      <button className="export" onClick={exportCSV}>▦ EXCEL EXPORT</button>
                      <button className="logout" onClick={adminLogout}>Logout</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th rowSpan="2">Name</th>
                      <th rowSpan="2">Spitzname</th>
                      <th colSpan="4">T-Shirt</th>
                      <th colSpan="3">Polo-Shirt</th>
                      <th colSpan="3">Hoodie</th>
                      <th rowSpan="2">Gesamt</th>
                      {isAdmin && <th rowSpan="2"></th>}
                    </tr>
                    <tr>
                      <th>Gr.</th><th>Farbe</th><th>Anz.</th><th>Preis</th>
                      <th>Gr.</th><th>Anz.</th><th>Preis</th>
                      <th>Gr.</th><th>Anz.</th><th>Preis</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 14 : 13} className="empty">Noch keine Bestellungen eingetragen.</td>
                      </tr>
                    )}

                    {orders.map((o, i) => (
                      <tr key={i}>
                        <td>{o.name}</td>
                        <td>{o.nick}</td>
                        <td>{o.tshirtSize}</td>
                        <td>{o.tshirtColor}</td>
                        <td>{o.tshirtQty}</td>
                        <td>{euro(o.tshirtQty * prices.tshirt)}</td>
                        <td>{o.poloQty > 0 ? o.poloSize : "-"}</td>
                        <td>{o.poloQty}</td>
                        <td>{euro(o.poloQty * prices.polo)}</td>
                        <td>{o.hoodieQty > 0 ? o.hoodieSize : "-"}</td>
                        <td>{o.hoodieQty}</td>
                        <td>{euro(o.hoodieQty * prices.hoodie)}</td>
                        <td className="price">{euro(calc(o))}</td>
                        {isAdmin && (
                          <td>
                            <button className="delete" onClick={() => deleteOrder(i)}>🗑</button>
                          </td>
                        )}
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
  return (
    <div className="product">
      <h4>{title} {note && <small>{note}</small>}</h4>
      {children}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function NumberInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function SizeRow({ sizes }) {
  return <div className="sizeRow">{sizes.map((size) => <span key={size}>{size}</span>)}</div>;
}

function Summary({ icon, label, qty, value }) {
  return (
    <div className="summaryLine">
      <span>{icon}</span>
      <b>{label}</b>
      <em>{qty} Stk.</em>
      <em>{value}</em>
    </div>
  );
}

function PriceLine({ icon, label, value }) {
  return (
    <div className="priceLine">
      <span>{icon}</span>
      <b>{label}</b>
      <em>{value}</em>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Rye&family=Oswald:wght@300;400;500;600;700&display=swap');

*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%;background:#000}
body{font-family:'Oswald',Arial,sans-serif;color:#f2f2f2;background:#000;overflow-x:hidden}

.page{min-height:100vh;background:#000;padding:10px}
.frame{width:min(100%,1540px);min-height:calc(100vh - 20px);margin:0 auto;border:1px solid #8f0907;border-radius:7px;background:#030303;overflow:hidden;box-shadow:0 0 38px rgba(150,0,0,.42);display:flex;flex-direction:column}

.hero{position:relative;height:170px;min-height:170px;overflow:hidden;background:radial-gradient(circle at 50% 18%,#252525 0%,#101010 34%,#050505 62%,#000 100%);border-bottom:1px solid #240000;flex:0 0 auto}
.smoke{position:absolute;inset:0;opacity:.75;background:radial-gradient(circle at 11% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 89% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 50% 15%,rgba(255,255,255,.13),transparent 29%),linear-gradient(90deg,rgba(120,0,0,.35),transparent 24%,transparent 76%,rgba(120,0,0,.35))}
.logo{position:absolute;top:10px;width:150px;object-fit:contain;z-index:2;filter:drop-shadow(0 0 8px rgba(255,0,0,.45)) contrast(1.06) saturate(1.04)}
.logoLeft{left:28px}.logoRight{right:28px}

.headline{position:relative;z-index:3;text-align:center;padding-top:23px;margin:0 auto;max-width:920px;padding-left:185px;padding-right:185px}
.headline h1{margin:0;font-family:'Rye',Georgia,serif;font-size:64px;line-height:.95;letter-spacing:.04em;color:#b91410;text-shadow:0 2px 0 #3a0000,0 0 6px rgba(230,0,0,.18);font-weight:400;white-space:nowrap}
.headline h2{margin:4px 0 0;font-family:'Rye',Georgia,serif;font-size:38px;line-height:1;letter-spacing:.22em;color:#d8d8d8;text-shadow:0 2px 0 #000,0 0 6px rgba(255,255,255,.14);font-weight:400;white-space:nowrap}
.headline p{display:inline-block;margin:10px 0 0;padding-top:8px;min-width:330px;border-top:1px solid #8b0000;font-family:'Rye',Georgia,serif;font-size:20px;letter-spacing:.2em;color:#cfcfcf;text-shadow:0 2px 0 #000;white-space:nowrap}

.content{display:grid;grid-template-columns:420px minmax(0,1fr);gap:14px;padding:0 18px 14px;flex:1;min-height:0}
.panel{border:1px solid rgba(150,150,150,.42);border-radius:8px;background:linear-gradient(180deg,rgba(10,10,10,.96),rgba(3,3,3,.98));box-shadow:inset 0 0 28px rgba(255,255,255,.035),0 0 18px rgba(0,0,0,.75)}
.formPanel{padding:15px;height:100%;overflow:auto;backdrop-filter:blur(3px)}.overviewPanel{overflow:hidden;display:flex;flex-direction:column;min-width:0;height:100%}

.redTitle{margin:0;color:#ef1b16;font-size:22px;font-weight:700;letter-spacing:.035em;text-transform:uppercase;text-shadow:0 0 8px rgba(255,0,0,.25)}
.smallText{margin:6px 0 16px 38px;color:#e2e2e2;font-size:14px;font-weight:300;letter-spacing:.02em}
form{display:flex;flex-direction:column;gap:15px}.twoCols{display:grid;grid-template-columns:1fr 1fr;gap:13px}
label{display:block;font-size:14px;font-weight:400;color:#f1f1f1;letter-spacing:.025em}label span{color:#ff2018}
input,select,textarea{width:100%;margin-top:5px;height:36px;border-radius:5px;border:1px solid #444;background:linear-gradient(180deg,#090909,#030303);color:#f3f3f3;padding:0 10px;outline:none;font-family:'Oswald',Arial,sans-serif;font-size:15px}
input:focus,select:focus,textarea:focus{border-color:#c40000;box-shadow:0 0 8px rgba(220,0,0,.45)}
textarea{height:40px;padding-top:9px;resize:none}

.product h4{margin:0 0 9px;font-size:19px;font-weight:700;text-transform:uppercase;letter-spacing:.02em;color:#e9e9e9}.product small{font-size:13px;color:#dedede;text-transform:none;font-weight:400}
.shirtGrid{display:grid;grid-template-columns:1fr 132px 58px;gap:11px;align-items:end}.twoProductCols{display:grid;grid-template-columns:1fr 66px;gap:22px}
.sizeRow{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.sizeRow span{min-width:28px;text-align:center;color:#e7e7e7;border:1px solid #343434;border-radius:4px;background:rgba(0,0,0,.6);padding:1px 5px;font-size:13px}
.submit{height:42px;border:0;border-radius:5px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;font-family:'Oswald',Arial,sans-serif;font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;box-shadow:0 0 16px rgba(255,0,0,.45)}
.submit:hover,.export:hover,.delete:hover{filter:brightness(1.15)}.privacy{margin:-5px 0 0;text-align:center;color:#aaa;font-size:12px;font-weight:300}

.overviewHead{$1}.adminBox{display:flex;align-items:flex-start;justify-content:flex-end}.adminForm{display:grid;grid-template-columns:150px auto;gap:8px;align-items:start}.adminForm input{height:40px;margin:0}.adminForm button,.logout{height:40px;border:1px solid #8b0000;background:#070707;color:#eee;border-radius:5px;padding:0 14px;font-family:'Oswald',Arial,sans-serif;font-size:14px;text-transform:uppercase;cursor:pointer}.adminForm span{grid-column:1/3;color:#ff1c15;font-size:12px;text-align:right}.adminActive{display:flex;gap:8px;align-items:center}.logout{border-color:#555;color:#bbb}.export{align-self:start;border:1px solid #8b0000;background:#070707;color:#eee;border-radius:5px;padding:10px 18px;font-family:'Oswald',Arial,sans-serif;font-size:15px;text-transform:uppercase;cursor:pointer;letter-spacing:.03em}
.tableWrap{overflow:auto;flex:1;min-height:225px;max-height:46vh}table{width:100%;min-width:0;border-collapse:collapse;font-size:13px;table-layout:auto}th,td{padding:8px 8px;border-bottom:1px solid #242424;text-align:left;white-space:nowrap}th{color:#f5f5f5;font-weight:600;letter-spacing:.02em}th[colspan]{text-align:center}tr:hover td{background:rgba(255,255,255,.035)}.price{color:#ff1610;font-weight:700}.delete{border:1px solid #b00000;color:#ff1610;background:transparent;border-radius:5px;padding:5px 7px;cursor:pointer}.empty{text-align:center;color:#aaa;padding:28px}

.bottomCards{display:grid;grid-template-columns:1.15fr .95fr;gap:14px;padding:14px;flex:0 0 auto}.card{border:1px solid #505050;border-radius:8px;background:rgba(0,0,0,.55);padding:18px 24px;box-shadow:inset 0 0 28px rgba(255,255,255,.035)}.card h3{margin:0 0 14px;text-align:center;color:#f01b15;font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.summaryLine{display:grid;grid-template-columns:38px 1fr 72px 105px;align-items:center;gap:7px;margin-bottom:7px;font-size:18px}.summaryLine span,.priceLine span{font-size:28px;filter:saturate(1.25)}.summaryLine em,.priceLine em{font-style:normal}.total{display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #555;color:#f01b15;font-size:26px;font-weight:700}.priceLine{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #333;font-size:18px}.priceLine:last-child{border-bottom:0}
footer{margin:0 18px 14px;border:1px solid #242424;border-radius:8px;background:#050505;color:#d0d0d0;text-align:center;padding:11px;font-family:'Rye',Georgia,serif;font-size:12px;letter-spacing:.2em;text-transform:uppercase;flex:0 0 auto}

@media(max-width:1200px){.frame{min-height:auto}.hero{height:auto;min-height:185px}.content{grid-template-columns:1fr}.formPanel{height:auto;overflow:visible}.overviewPanel{height:auto}.tableWrap{max-height:none;flex:none}.logo{width:140px}.headline{padding-left:155px;padding-right:155px}.headline h1{font-size:54px}.headline h2{font-size:32px}.headline p{font-size:18px}}
@media(max-width:760px){.adminBox{justify-content:flex-start}.adminForm{grid-template-columns:1fr}.adminForm span{grid-column:1;text-align:left}.adminActive{flex-direction:column;align-items:stretch}.adminActive button{width:100%}.page{padding:6px}.frame{min-height:calc(100vh - 12px)}.hero{height:auto;min-height:250px}.logo{width:108px;left:8px;top:8px}.logoRight{display:none}.headline{padding:120px 12px 18px}.headline h1{font-size:34px;letter-spacing:.035em;white-space:normal}.headline h2{font-size:23px;letter-spacing:.12em}.headline p{min-width:0;width:100%;font-size:13px;letter-spacing:.11em;white-space:normal}.content{padding:0 8px 12px}.twoCols,.shirtGrid,.twoProductCols,.bottomCards{grid-template-columns:1fr}.overviewHead{flex-direction:column}.card{padding:18px}.summaryLine{grid-template-columns:34px 1fr 70px;font-size:16px}.summaryLine em:last-child{grid-column:2/4;text-align:right}.total{font-size:23px}footer{margin:0 8px 10px;font-size:10px;letter-spacing:.1em}}
`;
