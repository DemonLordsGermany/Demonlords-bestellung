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

export default function DemonLordsBestellung() {
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const prices = { tshirt: 20, polo: 30, hoodie: 40 };

  const [orders, setOrders] = useState([
    { name: "Max Mustermann", nick: "Mäx", tshirtSize: "L", tshirtColor: "Schwarz", tshirtQty: 2, poloSize: "L", poloQty: 1, hoodieSize: "XL", hoodieQty: 1 },
    { name: "Jan Schmidt", nick: "Janni", tshirtSize: "XL", tshirtColor: "Olive", tshirtQty: 1, poloSize: "-", poloQty: 0, hoodieSize: "L", hoodieQty: 1 },
    { name: "Tom Becker", nick: "Becker", tshirtSize: "M", tshirtColor: "Schwarz", tshirtQty: 2, poloSize: "M", poloQty: 1, hoodieSize: "M", hoodieQty: 0 },
    { name: "Alex Weber", nick: "Lex", tshirtSize: "XXL", tshirtColor: "Olive", tshirtQty: 1, poloSize: "XL", poloQty: 1, hoodieSize: "XXL", hoodieQty: 1 },
    { name: "Chris Wagner", nick: "Waggy", tshirtSize: "L", tshirtColor: "Schwarz", tshirtQty: 1, poloSize: "-", poloQty: 0, hoodieSize: "L", hoodieQty: 1 },
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

  const submit = (e) => {
    e.preventDefault();
    setOrders([...orders, { ...form, poloSize: form.poloQty > 0 ? form.poloSize : "-" }]);
    setForm({ name: "", nick: "", tshirtSize: "S", tshirtColor: "Olive", tshirtQty: 0, poloSize: "S", poloQty: 0, hoodieSize: "S", hoodieQty: 0, note: "" });
  };

  const removeOrder = (index) => setOrders(orders.filter((_, i) => i !== index));

  const inputClass = "h-11 w-full rounded-[5px] border border-zinc-700 bg-[#070707]/90 px-3 text-zinc-100 outline-none transition focus:border-red-600 focus:shadow-[0_0_8px_rgba(220,0,0,.45)]";
  const panelClass = "rounded-[8px] border border-zinc-700/80 bg-[linear-gradient(180deg,rgba(15,17,18,.94),rgba(2,2,2,.96))] shadow-[inset_0_0_28px_rgba(255,255,255,.035)]";

  return (
    <main className="min-h-screen bg-black p-2 text-white md:p-4">
      <div className="mx-auto max-w-[1540px] overflow-hidden rounded-[6px] border border-red-800 bg-[#030303] shadow-[0_0_35px_rgba(120,0,0,.45)]">
        <header className="relative min-h-[220px] overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#202020_0%,#090909_42%,#000_78%)] md:min-h-[228px]">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_10%_20%,rgba(190,0,0,.45),transparent_18%),radial-gradient(circle_at_90%_20%,rgba(190,0,0,.45),transparent_18%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-red-800" />

          <img src="/logo.png" alt="Demon Lords Germany Logo" className="absolute left-5 top-4 w-[170px] object-contain md:left-10 md:w-[205px]" />
          <img src="/logo.png" alt="Demon Lords Germany Logo" className="absolute right-5 top-4 hidden w-[205px] object-contain md:block" />

          <div className="relative z-10 mx-auto max-w-[850px] px-4 pt-7 text-center md:px-56">
            <h1 className="font-serif text-[48px] font-black uppercase leading-none tracking-[.12em] text-[#b91512] drop-shadow-[0_5px_0_#260000] md:text-[84px]">
              Demon Lords
            </h1>
            <h2 className="mt-1 font-serif text-[34px] font-black uppercase leading-none tracking-[.32em] text-zinc-200 drop-shadow-[0_4px_0_#000] md:text-[50px]">
              Germany
            </h2>
            <div className="mx-auto mt-3 h-px w-[300px] bg-red-800" />
            <p className="mt-4 font-serif text-[20px] uppercase tracking-[.32em] text-zinc-300 md:text-[27px]">
              Vereins Bestellung
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 px-3 pb-3 md:px-6 md:pb-6 xl:grid-cols-[460px_1fr]">
          <section className={`${panelClass} p-4 md:p-5`}>
            <div className="mb-5">
              <h3 className="flex items-center gap-2 text-[23px] font-black uppercase text-red-600">▣ Eintragungsformular</h3>
              <p className="mt-1 pl-10 text-[15px] text-zinc-200">Bitte trage hier deine Bestellung ein.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <label className="text-[14px] font-semibold">Name <span className="text-red-600">*</span>
                  <input required className={`${inputClass} mt-2`} placeholder="Dein Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="text-[14px] font-semibold">Spitzname <span className="text-red-600">*</span>
                  <input className={`${inputClass} mt-2`} placeholder="Dein Spitzname" value={form.nick} onChange={(e) => setForm({ ...form, nick: e.target.value })} />
                </label>
              </div>

              <ProductBlock title="T-Shirt – 20€" icon="👕">
                <div className="grid grid-cols-[1fr_145px_60px] gap-3 max-sm:grid-cols-1">
                  <Field label="Größe"><select className={inputClass} value={form.tshirtSize} onChange={(e) => setForm({ ...form, tshirtSize: e.target.value })}>{sizes.map(s => <option key={s}>{s}</option>)}</select></Field>
                  <Field label="Farbe"><select className={inputClass} value={form.tshirtColor} onChange={(e) => setForm({ ...form, tshirtColor: e.target.value })}><option>Olive</option><option>Schwarz</option></select></Field>
                  <Field label="Anzahl"><input type="number" min="0" className={inputClass} value={form.tshirtQty} onChange={(e) => setForm({ ...form, tshirtQty: Number(e.target.value) })} /></Field>
                </div>
                <SizeRow sizes={sizes} />
              </ProductBlock>

              <ProductBlock title="Polo-Shirt – 30€" note="(Nur in Schwarz)" icon="👕">
                <div className="grid grid-cols-[1fr_70px] gap-7 max-sm:grid-cols-1">
                  <Field label="Größe"><select className={inputClass} value={form.poloSize} onChange={(e) => setForm({ ...form, poloSize: e.target.value })}>{sizes.map(s => <option key={s}>{s}</option>)}</select></Field>
                  <Field label="Anzahl"><input type="number" min="0" className={inputClass} value={form.poloQty} onChange={(e) => setForm({ ...form, poloQty: Number(e.target.value) })} /></Field>
                </div>
                <SizeRow sizes={sizes} />
              </ProductBlock>

              <ProductBlock title="Hoodie – 40€" icon="🧥">
                <div className="grid grid-cols-[1fr_70px] gap-7 max-sm:grid-cols-1">
                  <Field label="Größe"><select className={inputClass} value={form.hoodieSize} onChange={(e) => setForm({ ...form, hoodieSize: e.target.value })}>{sizes.map(s => <option key={s}>{s}</option>)}</select></Field>
                  <Field label="Anzahl"><input type="number" min="0" className={inputClass} value={form.hoodieQty} onChange={(e) => setForm({ ...form, hoodieQty: Number(e.target.value) })} /></Field>
                </div>
                <SizeRow sizes={sizes} />
              </ProductBlock>

              <label className="block text-[14px] font-semibold">Hinweise (optional)
                <textarea rows="3" className={`${inputClass} mt-2 h-[45px] resize-none py-3`} placeholder="Hier kannst du optional etwas angeben..." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </label>

              <button className="h-11 w-full rounded-[5px] bg-[linear-gradient(180deg,#f02520,#be100d)] text-[18px] font-black uppercase tracking-wide shadow-[0_0_16px_rgba(255,0,0,.45)] hover:brightness-110">➤ Bestellung absenden</button>
              <p className="text-center text-xs text-zinc-400">🔒 Deine Daten werden nur für diese Bestellung verwendet.</p>
            </form>
          </section>

          <section className={`${panelClass} overflow-hidden`}>
            <div className="flex flex-col gap-3 border-b border-zinc-800 px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5">
              <div>
                <h3 className="flex items-center gap-2 text-[23px] font-black uppercase text-red-600">▣ Bestellübersicht</h3>
                <p className="mt-1 pl-10 text-[15px] text-zinc-200">Alle Einträge werden hier in Echtzeit angezeigt.</p>
              </div>
              <button className="rounded-[5px] border border-red-800 px-5 py-3 text-sm uppercase text-zinc-200 hover:bg-red-950/30">▦ Excel Export</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1010px] border-collapse text-[15px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-4 py-3" rowSpan="2">Name</th>
                    <th className="px-4 py-3" rowSpan="2">Spitzname</th>
                    <th className="border-l border-zinc-800 px-3 py-2 text-center" colSpan="4">T-Shirt</th>
                    <th className="border-l border-zinc-800 px-3 py-2 text-center" colSpan="3">Polo-Shirt</th>
                    <th className="border-l border-zinc-800 px-3 py-2 text-center" colSpan="3">Hoodie</th>
                    <th className="border-l border-zinc-800 px-4 py-3" rowSpan="2">Gesamtpreis</th>
                    <th rowSpan="2"></th>
                  </tr>
                  <tr className="border-b border-zinc-800 text-zinc-300">
                    <th className="px-3 py-2">Größe</th><th className="px-3 py-2">Farbe</th><th className="px-3 py-2">Anzahl</th><th className="px-3 py-2">Preis</th>
                    <th className="border-l border-zinc-800 px-3 py-2">Größe</th><th className="px-3 py-2">Anzahl</th><th className="px-3 py-2">Preis</th>
                    <th className="border-l border-zinc-800 px-3 py-2">Größe</th><th className="px-3 py-2">Anzahl</th><th className="px-3 py-2">Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={i} className="border-b border-zinc-800/90 hover:bg-white/[.03]">
                      <td className="px-4 py-3">{o.name}</td><td className="px-4 py-3">{o.nick}</td>
                      <td className="border-l border-zinc-800 px-3 py-3">{o.tshirtSize}</td><td className="px-3 py-3">{o.tshirtColor}</td><td className="px-3 py-3">{o.tshirtQty}</td><td className="px-3 py-3">{euro(o.tshirtQty * prices.tshirt)}</td>
                      <td className="border-l border-zinc-800 px-3 py-3">{o.poloQty > 0 ? o.poloSize : "-"}</td><td className="px-3 py-3">{o.poloQty}</td><td className="px-3 py-3">{euro(o.poloQty * prices.polo)}</td>
                      <td className="border-l border-zinc-800 px-3 py-3">{o.hoodieQty > 0 ? o.hoodieSize : "-"}</td><td className="px-3 py-3">{o.hoodieQty}</td><td className="px-3 py-3">{euro(o.hoodieQty * prices.hoodie)}</td>
                      <td className="border-l border-zinc-800 px-4 py-3 font-black text-red-600">{euro(calc(o))}</td>
                      <td className="px-3 py-2"><button onClick={() => removeOrder(i)} className="rounded-[5px] border border-red-700 px-2 py-2 text-red-600">🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 md:p-5 lg:grid-cols-[1.15fr_.95fr]">
              <div className="rounded-[8px] border border-zinc-700 bg-black/55 p-6 shadow-[inset_0_0_28px_rgba(255,255,255,.035)]">
                <h3 className="mb-6 text-center text-[24px] font-black uppercase text-red-600">▟ Gesamtübersicht</h3>
                <SummaryLine icon="👕" label="T-Shirts:" qty={totalTshirts} value={euro(totalTshirts * prices.tshirt)} />
                <SummaryLine icon="👕" label="Polo-Shirts:" qty={totalPolos} value={euro(totalPolos * prices.polo)} />
                <SummaryLine icon="🧥" label="Hoodies:" qty={totalHoodies} value={euro(totalHoodies * prices.hoodie)} />
                <div className="mt-5 flex items-center justify-between border-t border-zinc-600 pt-5 text-[24px] font-black text-red-600 md:text-[30px]"><span>Gesamt:</span><span>{euro(total)}</span></div>
              </div>

              <div className="rounded-[8px] border border-zinc-700 bg-black/55 p-6 shadow-[inset_0_0_28px_rgba(255,255,255,.035)]">
                <h3 className="mb-6 text-center text-[24px] font-black uppercase text-red-600">Preisliste</h3>
                <PriceLine icon="👕" label="T-Shirt" value={euro(prices.tshirt)} />
                <PriceLine icon="👕" label="Polo-Shirt" value={euro(prices.polo)} />
                <PriceLine icon="🧥" label="Hoodie" value={euro(prices.hoodie)} last />
              </div>
            </div>
          </section>
        </div>

        <footer className="mx-3 mb-3 rounded-[8px] border border-zinc-800 bg-[#050505] py-3 text-center font-serif text-xs uppercase tracking-[.35em] text-zinc-300 md:mx-6 md:mb-4 md:text-base">
          💀 Demon Lords Germany — Brotherhood. Loyalty. Respect. 💀
        </footer>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return <label className="text-[14px] font-semibold">{label}<div className="mt-2">{children}</div></label>;
}

function SizeRow({ sizes }) {
  return <div className="mt-2 flex flex-wrap gap-[6px] text-[14px] text-zinc-200">{sizes.map((s) => <span key={s} className="min-w-8 rounded-[4px] border border-zinc-700 bg-black/40 px-2 py-[2px] text-center">{s}</span>)}</div>;
}

function ProductBlock({ title, note, icon, children }) {
  return <div><h3 className="mb-3 flex items-center gap-2 text-[20px] font-black uppercase"><span className="text-red-600">{icon}</span>{title} {note && <span className="text-sm normal-case text-zinc-300">{note}</span>}</h3>{children}</div>;
}

function SummaryLine({ icon, label, qty, value }) {
  return <div className="mb-3 grid grid-cols-[44px_1fr_90px_120px] items-center gap-3 text-[20px] max-sm:grid-cols-[34px_1fr_70px] max-sm:text-base"><span className="text-3xl text-red-600">{icon}</span><span className="font-bold">{label}</span><span>{qty} Stk.</span><span className="max-sm:col-start-2 max-sm:text-right">{value}</span></div>;
}

function PriceLine({ icon, label, value, last }) {
  return <div className={`flex items-center justify-between py-4 text-[20px] ${last ? "" : "border-b border-zinc-700"}`}><span className="flex items-center gap-4 font-bold"><span className="text-4xl text-red-600">{icon}</span>{label}</span><span>{value}</span></div>;
}
