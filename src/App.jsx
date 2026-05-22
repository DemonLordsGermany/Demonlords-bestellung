import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const prices = { tshirt: 20, polo: 30, hoodie: 40 };

  const DEFAULT_ADMIN_PASSWORD = "DemonLords2026";
  const DEFAULT_MEMBER_PASSWORD = "DL2026";
  const DEFAULT_DEADLINE = "2026-12-31T23:59";

  const [settings, setSettings] = useState({
    adminPassword: DEFAULT_ADMIN_PASSWORD,
    memberPassword: DEFAULT_MEMBER_PASSWORD,
    deadline: DEFAULT_DEADLINE,
  });

  const [orders, setOrders] = useState([]);
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(
    sessionStorage.getItem("dl_member_logged_in") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("dl_admin_logged_in") === "true"
  );

  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");

  const [newMemberPassword, setNewMemberPassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [deadlineInput, setDeadlineInput] = useState(DEFAULT_DEADLINE);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [now, setNow] = useState(Date.now());

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

  useEffect(() => {
    const settingsRef = doc(db, "settings", "main");

    const unsubscribe = onSnapshot(settingsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(settingsRef, {
          adminPassword: DEFAULT_ADMIN_PASSWORD,
          memberPassword: DEFAULT_MEMBER_PASSWORD,
          deadline: DEFAULT_DEADLINE,
        });
        return;
      }

      const data = snapshot.data();
      const newSettings = {
        adminPassword: data.adminPassword || DEFAULT_ADMIN_PASSWORD,
        memberPassword: data.memberPassword || DEFAULT_MEMBER_PASSWORD,
        deadline: data.deadline || DEFAULT_DEADLINE,
      };

      setSettings(newSettings);
      setDeadlineInput(newSettings.deadline);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const orderList = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      orderList.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return aTime - bTime;
      });

      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calc = (o) =>
    Number(o.tshirtQty || 0) * prices.tshirt +
    Number(o.poloQty || 0) * prices.polo +
    Number(o.hoodieQty || 0) * prices.hoodie;

  const euro = (n) => `${Number(n).toFixed(2).replace(".", ",")} €`;
  const set = (key, value) => setForm({ ...form, [key]: value });

  const totalTshirts = orders.reduce((s, o) => s + Number(o.tshirtQty || 0), 0);
  const totalPolos = orders.reduce((s, o) => s + Number(o.poloQty || 0), 0);
  const totalHoodies = orders.reduce((s, o) => s + Number(o.hoodieQty || 0), 0);
  const total = orders.reduce((s, o) => s + calc(o), 0);

  const deadlineTime = new Date(settings.deadline).getTime();
  const timeLeft = Math.max(0, deadlineTime - now);
  const orderClosed = timeLeft <= 0;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const deadlineDisplay = new Date(settings.deadline).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function login(e) {
    e.preventDefault();

    if (loginPassword === settings.adminPassword) {
      setIsMemberLoggedIn(true);
      setIsAdmin(true);
      sessionStorage.setItem("dl_member_logged_in", "true");
      sessionStorage.setItem("dl_admin_logged_in", "true");
      setLoginPassword("");
      setLoginError("");
      return;
    }

    if (loginPassword === settings.memberPassword) {
      if (orderClosed) {
        setLoginError("Die Bestellfrist ist abgelaufen. Mitglieder-Login ist gesperrt.");
        return;
      }

      setIsMemberLoggedIn(true);
      setIsAdmin(false);
      sessionStorage.setItem("dl_member_logged_in", "true");
      sessionStorage.removeItem("dl_admin_logged_in");
      setLoginPassword("");
      setLoginError("");
      return;
    }

    setLoginError("Falsches Passwort");
  }

  function logout() {
    setIsMemberLoggedIn(false);
    setIsAdmin(false);
    sessionStorage.removeItem("dl_member_logged_in");
    sessionStorage.removeItem("dl_admin_logged_in");
    setLoginPassword("");
    setAdminPasswordInput("");
    setLoginError("");
    setAdminError("");
  }

  function adminLogin(e) {
    e.preventDefault();

    if (adminPasswordInput === settings.adminPassword) {
      setIsAdmin(true);
      sessionStorage.setItem("dl_admin_logged_in", "true");
      setAdminPasswordInput("");
      setAdminError("");
    } else {
      setAdminError("Falsches Admin-Passwort");
    }
  }

  function adminLogout() {
    setIsAdmin(false);
    sessionStorage.removeItem("dl_admin_logged_in");
    setAdminPasswordInput("");
    setAdminError("");
  }

  async function saveSettings(e) {
    e.preventDefault();

    const nextSettings = {
      adminPassword:
        newAdminPassword.trim().length >= 6
          ? newAdminPassword.trim()
          : settings.adminPassword,
      memberPassword:
        newMemberPassword.trim().length >= 4
          ? newMemberPassword.trim()
          : settings.memberPassword,
      deadline: deadlineInput || settings.deadline,
    };

    await setDoc(doc(db, "settings", "main"), nextSettings);

    setNewMemberPassword("");
    setNewAdminPassword("");
    setSettingsMessage("Einstellungen wurden live gespeichert.");
    setTimeout(() => setSettingsMessage(""), 3000);
  }

  async function submit(e) {
    e.preventDefault();
    if (!isMemberLoggedIn) return;
    if (orderClosed && !isAdmin) return;
    if (!form.name.trim()) return;

    await addDoc(collection(db, "orders"), {
      ...form,
      poloSize: form.poloQty > 0 ? form.poloSize : "-",
      hoodieSize: form.hoodieQty > 0 ? form.hoodieSize : "-",
      createdAt: serverTimestamp(),
      createdAtText: new Date().toLocaleString("de-DE"),
    });

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

  async function deleteOrder(orderId) {
    if (!isAdmin) return;
    await deleteDoc(doc(db, "orders", orderId));
  }

  function exportCSV() {
    if (!isAdmin) return;

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
      "Hinweise",
      "Gesamtpreis",
      "Datum",
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
      o.note || "",
      euro(calc(o)),
      o.createdAtText || "",
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

  if (!isMemberLoggedIn) {
    return (
      <>
        <style>{styles}</style>
        <main className="page loginPage">
          <div className="loginFrame">
            <div className="loginSmoke" />
            <img src="/logo.png" alt="Demon Lords Germany Logo" className="loginLogo" />
            <h1>DEMON LORDS</h1>
            <h2>GERMANY</h2>
            <p className="loginSubline">MITGLIEDER LOGIN</p>

            <div className={orderClosed ? "deadlineBox closed" : "deadlineBox"}>
              {orderClosed ? (
                <>
                  <strong>BESTELLUNG GESCHLOSSEN</strong>
                  <span>Bestellschluss war am {deadlineDisplay}</span>
                </>
              ) : (
                <>
                  <strong>BESTELLSCHLUSS IN</strong>
                  <span>{days} Tage · {hours} Std. · {minutes} Min. · {seconds} Sek.</span>
                  <small>bis {deadlineDisplay}</small>
                </>
              )}
            </div>

            <form className="loginBox" onSubmit={login}>
              <label>
                Passwort
                <input
                  type="password"
                  placeholder="Mitglieder- oder Admin-Passwort"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </label>

              {loginError && <div className="loginError">{loginError}</div>}

              <button type="submit">Einloggen</button>
            </form>

            <p className="loginHint">
              {orderClosed
                ? "Die Bestellfrist ist abgelaufen. Admin kann sich weiterhin einloggen."
                : "Nur Vereinsmitglieder mit Passwort können eine Bestellung eintragen."}
            </p>
          </div>
        </main>
      </>
    );
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
            <button className="memberLogout" onClick={logout}>Logout</button>

            <div className={orderClosed ? "deadlineHeader closed" : "deadlineHeader"}>
              {orderClosed ? (
                <span>BESTELLUNG GESCHLOSSEN</span>
              ) : (
                <span>{days}T · {hours}H · {minutes}M · {seconds}S</span>
              )}
            </div>

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
                    <input required placeholder="Dein Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </label>

                  <label>
                    Spitzname
                    <input placeholder="Dein Spitzname" value={form.nick} onChange={(e) => set("nick", e.target.value)} />
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
                  <textarea placeholder="Hier kannst du optional etwas angeben..." value={form.note} onChange={(e) => set("note", e.target.value)} />
                </label>

                {orderClosed && !isAdmin ? (
                  <div className="closedNotice">Bestellfrist abgelaufen — neue Bestellungen sind gesperrt.</div>
                ) : (
                  <button className="submit" type="submit">➤ BESTELLUNG ABSENDEN</button>
                )}

                <p className="privacy">🔒 Deine Daten werden nur für diese Bestellung verwendet.</p>
              </form>
            </section>

            <section className={`panel overviewPanel ${isAdmin ? "adminView" : ""}`}>
              <div className="overviewHead">
                <div>
                  <h3 className="redTitle">▣ BESTELLÜBERSICHT</h3>
                  <p className="smallText">
                    {isAdmin
                      ? "Admin-Ansicht: vollständige Live-Bestellliste mit Preisen."
                      : "Mitglieder-Ansicht: sichtbar ist nur, wer sich bereits eingetragen hat."}
                  </p>
                </div>

                <div className="adminBox">
                  {!isAdmin ? (
                    <form className="adminForm" onSubmit={adminLogin}>
                      <input
                        type="password"
                        placeholder="Admin Passwort"
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                      />
                      <button type="submit">Admin Login</button>
                      {adminError && <span>{adminError}</span>}
                    </form>
                  ) : (
                    <div className="adminActive">
                      <button className="export" onClick={exportCSV}>▦ EXCEL EXPORT</button>
                      <button className="logout" onClick={adminLogout}>Admin Logout</button>
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && (
                <form className="passwordPanel" onSubmit={saveSettings}>
                  <h3>Admin Einstellungen</h3>
                  <div className="passwordGrid">
                    <label>
                      Neues Mitglieder-Passwort
                      <input
                        type="text"
                        placeholder="mind. 4 Zeichen"
                        value={newMemberPassword}
                        onChange={(e) => setNewMemberPassword(e.target.value)}
                      />
                    </label>
                    <label>
                      Neues Admin-Passwort
                      <input
                        type="text"
                        placeholder="mind. 6 Zeichen"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                      />
                    </label>
                    <label>
                      Bestellschluss
                      <input
                        type="datetime-local"
                        value={deadlineInput}
                        onChange={(e) => setDeadlineInput(e.target.value)}
                      />
                    </label>
                    <button type="submit">Speichern</button>
                  </div>
                  {settingsMessage && <p>{settingsMessage}</p>}
                </form>
              )}

              <div className="tableWrap">
                <table>
                  {isAdmin ? (
                    <thead>
                      <tr>
                        <th rowSpan="2">Name</th>
                        <th rowSpan="2">Spitzname</th>
                        <th colSpan="4">T-Shirt</th>
                        <th colSpan="3">Polo-Shirt</th>
                        <th colSpan="3">Hoodie</th>
                        <th rowSpan="2">Gesamt</th>
                        <th rowSpan="2">Datum</th>
                        <th rowSpan="2"></th>
                      </tr>
                      <tr>
                        <th>Gr.</th><th>Farbe</th><th>Anz.</th><th>Preis</th>
                        <th>Gr.</th><th>Anz.</th><th>Preis</th>
                        <th>Gr.</th><th>Anz.</th><th>Preis</th>
                      </tr>
                    </thead>
                  ) : (
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Spitzname</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                  )}

                  <tbody>
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 15 : 3} className="empty">Noch keine Bestellungen eingetragen.</td>
                      </tr>
                    )}

                    {orders.map((o) => (
                      <tr key={o.id}>
                        {isAdmin ? (
                          <>
                            <td>{o.name}</td>
                            <td>{o.nick || "-"}</td>
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
                            <td>{o.createdAtText || "-"}</td>
                            <td><button className="delete" onClick={() => deleteOrder(o.id)}>🗑</button></td>
                          </>
                        ) : (
                          <>
                            <td>{o.name}</td>
                            <td>{o.nick || "-"}</td>
                            <td className="memberStatus">Eingetragen</td>
                          </>
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
.smoke,.loginSmoke{position:absolute;inset:0;opacity:.75;background:radial-gradient(circle at 11% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 89% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 50% 15%,rgba(255,255,255,.13),transparent 29%),linear-gradient(90deg,rgba(120,0,0,.35),transparent 24%,transparent 76%,rgba(120,0,0,.35))}
.logo{position:absolute;top:10px;width:150px;object-fit:contain;z-index:2;filter:drop-shadow(0 0 8px rgba(255,0,0,.45)) contrast(1.06) saturate(1.04)}
.logoLeft{left:28px}.logoRight{right:28px}
.memberLogout{position:absolute;right:18px;bottom:14px;z-index:5;border:1px solid #555;background:#070707;color:#ddd;border-radius:5px;padding:8px 14px;font-family:'Oswald',Arial,sans-serif;text-transform:uppercase;cursor:pointer}.deadlineHeader{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:5;border:1px solid #8b0000;background:rgba(0,0,0,.75);color:#fff;border-radius:5px;padding:8px 16px;font-family:'Oswald',Arial,sans-serif;font-weight:700;letter-spacing:.08em;box-shadow:0 0 12px rgba(255,0,0,.25)}.deadlineHeader.closed{color:#ff1c15;border-color:#ff1c15}
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
.submit:hover,.export:hover,.delete:hover,.memberLogout:hover,.loginBox button:hover{filter:brightness(1.15)}.privacy{margin:-5px 0 0;text-align:center;color:#aaa;font-size:12px;font-weight:300}.closedNotice{border:1px solid #8b0000;background:rgba(120,0,0,.22);color:#ffb7b7;border-radius:5px;padding:12px;text-align:center;font-weight:700;text-transform:uppercase}
.overviewHead{display:flex;justify-content:space-between;gap:16px;padding:14px 16px;border-bottom:1px solid #272727;flex:0 0 auto}.adminBox{display:flex;align-items:flex-start;justify-content:flex-end}.adminForm{display:grid;grid-template-columns:150px auto;gap:8px;align-items:start}.adminForm input{height:40px;margin:0}.adminForm button,.logout{height:40px;border:1px solid #8b0000;background:#070707;color:#eee;border-radius:5px;padding:0 14px;font-family:'Oswald',Arial,sans-serif;font-size:14px;text-transform:uppercase;cursor:pointer}.adminForm span{grid-column:1/3;color:#ff1c15;font-size:12px;text-align:right}.adminActive{display:flex;gap:8px;align-items:center}.logout{border-color:#555;color:#bbb}
.export{align-self:start;border:1px solid #8b0000;background:#070707;color:#eee;border-radius:5px;padding:10px 18px;font-family:'Oswald',Arial,sans-serif;font-size:15px;text-transform:uppercase;cursor:pointer;letter-spacing:.03em}
.passwordPanel{border-bottom:1px solid #242424;padding:12px 16px;background:rgba(0,0,0,.35);gap:8px}.passwordPanel h3{margin:0;color:#ef1b16;font-size:18px;text-transform:uppercase}.passwordPanel p{margin:4px 0 0;color:#55ff7a}.passwordGrid{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:end}.passwordGrid button{height:36px;border:1px solid #8b0000;background:#070707;color:#eee;border-radius:5px;padding:0 14px;font-family:'Oswald',Arial,sans-serif;text-transform:uppercase;cursor:pointer}
.tableWrap{overflow:auto;flex:1;min-height:225px;max-height:46vh}table{width:100%;min-width:0;border-collapse:collapse;font-size:13px;table-layout:auto}th,td{padding:8px 8px;border-bottom:1px solid #242424;text-align:left;white-space:nowrap}th{color:#f5f5f5;font-weight:600;letter-spacing:.02em}th[colspan]{text-align:center}tr:hover td{background:rgba(255,255,255,.035)}.price{color:#ff1610;font-weight:700}.memberStatus{color:#55ff7a;font-weight:700}.delete{border:1px solid #b00000;color:#ff1610;background:transparent;border-radius:5px;padding:5px 7px;cursor:pointer}.empty{text-align:center;color:#aaa;padding:28px}
.bottomCards{display:grid;grid-template-columns:1.15fr .95fr;gap:14px;padding:14px;flex:0 0 auto}.overviewPanel:not(.adminView) .bottomCards{display:none}.card{border:1px solid #505050;border-radius:8px;background:rgba(0,0,0,.55);padding:18px 24px;box-shadow:inset 0 0 28px rgba(255,255,255,.035)}.card h3{margin:0 0 14px;text-align:center;color:#f01b15;font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.summaryLine{display:grid;grid-template-columns:38px 1fr 72px 105px;align-items:center;gap:7px;margin-bottom:7px;font-size:18px}.summaryLine span,.priceLine span{font-size:28px;filter:saturate(1.25)}.summaryLine em,.priceLine em{font-style:normal}.total{display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #555;color:#f01b15;font-size:26px;font-weight:700}.priceLine{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #333;font-size:18px}.priceLine:last-child{border-bottom:0}
footer{margin:0 18px 14px;border:1px solid #242424;border-radius:8px;background:#050505;color:#d0d0d0;text-align:center;padding:11px;font-family:'Rye',Georgia,serif;font-size:12px;letter-spacing:.2em;text-transform:uppercase;flex:0 0 auto}
.loginPage{display:flex;align-items:center;justify-content:center}.loginFrame{position:relative;width:min(95vw,560px);overflow:hidden;border:1px solid #8f0907;border-radius:10px;background:radial-gradient(circle at top,#232323,#050505 65%,#000);padding:34px;box-shadow:0 0 42px rgba(160,0,0,.48);text-align:center}.loginLogo{position:relative;z-index:2;width:170px;filter:drop-shadow(0 0 10px rgba(255,0,0,.55));margin-bottom:10px}.loginFrame h1,.loginFrame h2,.loginSubline,.loginBox,.loginHint{position:relative;z-index:2}.loginFrame h1{margin:0;font-family:'Rye',Georgia,serif;font-size:42px;color:#b91410;letter-spacing:.05em}.loginFrame h2{margin:5px 0 0;font-family:'Rye',Georgia,serif;font-size:27px;color:#ddd;letter-spacing:.2em}.loginSubline{margin:18px 0 22px;padding-top:12px;border-top:1px solid #8b0000;font-family:'Rye',Georgia,serif;letter-spacing:.18em;color:#ccc}.loginBox{display:flex;flex-direction:column;gap:14px;text-align:left}.loginBox button{height:44px;border:0;border-radius:5px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;font-family:'Oswald',Arial,sans-serif;font-size:18px;font-weight:700;text-transform:uppercase;cursor:pointer}.loginError{color:#ff1c15;text-align:center;font-weight:700}.deadlineBox{position:relative;z-index:2;margin:0 0 18px;border:1px solid #8b0000;border-radius:8px;background:rgba(0,0,0,.58);padding:14px;text-align:center;box-shadow:0 0 16px rgba(255,0,0,.18)}.deadlineBox strong{display:block;color:#ff2119;font-size:18px;letter-spacing:.08em}.deadlineBox span{display:block;margin-top:6px;font-size:22px;font-weight:700}.deadlineBox small{display:block;margin-top:4px;color:#aaa}.deadlineBox.closed{border-color:#ff1c15;background:rgba(120,0,0,.18)}.loginHint{margin:18px 0 0;color:#aaa;font-size:13px}
@media(max-width:1200px){.frame{min-height:auto}.hero{height:auto;min-height:185px}.content{grid-template-columns:1fr}.formPanel{height:auto;overflow:visible}.overviewPanel{height:auto}.tableWrap{max-height:none;flex:none}.logo{width:140px}.headline{padding-left:155px;padding-right:155px}.headline h1{font-size:54px}.headline h2{font-size:32px}.headline p{font-size:18px}.passwordGrid{grid-template-columns:1fr}}
@media(max-width:760px){.page{padding:6px}.frame{min-height:calc(100vh - 12px)}.hero{height:auto;min-height:250px}.logo{width:108px;left:8px;top:8px}.logoRight{display:none}.memberLogout{right:8px;bottom:8px;padding:7px 10px}.deadlineHeader{bottom:48px;font-size:12px}.headline{padding:120px 12px 18px}.headline h1{font-size:34px;letter-spacing:.035em;white-space:normal}.headline h2{font-size:23px;letter-spacing:.12em}.headline p{min-width:0;width:100%;font-size:13px;letter-spacing:.11em;white-space:normal}.content{padding:0 8px 12px}.twoCols,.shirtGrid,.twoProductCols,.bottomCards{grid-template-columns:1fr}.overviewHead{flex-direction:column}.adminBox{justify-content:flex-start}.adminForm{grid-template-columns:1fr}.adminForm span{grid-column:1;text-align:left}.adminActive{flex-direction:column;align-items:stretch}.adminActive button{width:100%}.card{padding:18px}.summaryLine{grid-template-columns:34px 1fr 70px;font-size:16px}.summaryLine em:last-child{grid-column:2/4;text-align:right}.total{font-size:23px}footer{margin:0 8px 10px;font-size:10px;letter-spacing:.1em}.loginFrame{padding:24px}.loginFrame h1{font-size:32px}.loginFrame h2{font-size:22px}.loginLogo{width:135px}}
`;
