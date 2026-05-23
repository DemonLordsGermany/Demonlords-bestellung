import { useState } from "react";

export default function App() {
  const [activePage, setActivePage] = useState("start");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages = [
    { id: "start", label: "Startseite" },
    { id: "about", label: "Über uns" },
    { id: "team", label: "Team" },
    { id: "events", label: "Events" },
    { id: "gallery", label: "Galerie" },
    { id: "clothing", label: "Vereinskleidung" },
    { id: "downloads", label: "Downloads" },
    { id: "contact", label: "Kontakt" },
  ];

  function openPage(pageId) {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  }

  return (
    <>
      <style>{styles}</style>
      <main className="site">
        <header className="hero">
          <div className="smoke" />
          <img src="/logo.png" alt="Demon Lords Germany Logo" className="logo left" />
          <img src="/logo.png" alt="Demon Lords Germany Logo" className="logo right" />

          <button className="mobileMenuButton" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰ Menü
          </button>

          <div className="headline">
            <h1>DEMON LORDS</h1>
            <h2>GERMANY</h2>
            <p>MAGFED PAINTBALL COMMUNITY</p>
          </div>
        </header>

        <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
          {pages.map((page) => (
            <button
              key={page.id}
              className={activePage === page.id ? "active" : ""}
              onClick={() => openPage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>

        <section className="content">
          {activePage === "start" && <StartPage openPage={openPage} />}
          {activePage === "about" && <AboutPage />}
          {activePage === "team" && <TeamPage />}
          {activePage === "events" && <EventsPage />}
          {activePage === "gallery" && <GalleryPage />}
          {activePage === "clothing" && <ClothingPage />}
          {activePage === "downloads" && <DownloadsPage />}
          {activePage === "contact" && <ContactPage />}
        </section>

        <footer>
          💀 DEMON LORDS GERMANY — BROTHERHOOD. LOYALTY. RESPECT. 💀
        </footer>
      </main>
    </>
  );
}

function StartPage({ openPage }) {
  return (
    <div className="pageGrid">
      <section className="panel heroPanel largePanel">
        <p className="eyebrow">German Magfed Paintball Team</p>
        <h3>Willkommen bei den Demon Lords Germany</h3>
        <p>
          Wir stehen für Brotherhood, Loyalität, taktisches Teamplay und eine starke Community.
          Diese Webseite wird eure zentrale Plattform für Team, Events, Galerie und Vereinskleidung.
        </p>
        <div className="buttonRow">
          <button onClick={() => openPage("clothing")}>Vereinskleidung ansehen</button>
          <button className="ghost" onClick={() => openPage("about")}>Mehr über uns</button>
        </div>
      </section>

      <section className="panel infoCard">
        <h4>🔥 Fokus</h4>
        <p>Magfed Paintball, Scenario Games, Teamwear und Community.</p>
      </section>

      <section className="panel infoCard">
        <h4>🛡️ Werte</h4>
        <p>Brotherhood, Loyalty, Respect und taktisches Zusammenspiel.</p>
      </section>

      <section className="panel infoCard">
        <h4>👕 Merch</h4>
        <p>Vereinskleidung, Hoodies, T-Shirts, Polos und Patches.</p>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="pageGrid twoColumns">
      <section className="panel largePanel">
        <h3>Über uns</h3>
        <p>
          Demon Lords Germany ist eine Paintball-Community mit Fokus auf Magfed, Scenario Games
          und taktischem Teamplay. Unser Ziel ist ein starker Zusammenhalt auf und neben dem Spielfeld.
        </p>
        <p>
          Hier kannst du später eure echte Vereinsgeschichte, Gründung, Philosophie und euren Stil eintragen.
        </p>
      </section>
      <section className="panel listPanel">
        <h4>Unsere Grundwerte</h4>
        <ul>
          <li>Brotherhood</li>
          <li>Loyalty</li>
          <li>Respect</li>
          <li>Teamplay</li>
          <li>Tactical Mindset</li>
        </ul>
      </section>
    </div>
  );
}

function TeamPage() {
  const members = ["Leader", "Officer", "Veterans", "Members", "Recruits"];
  return (
    <div className="pageGrid">
      <section className="panel largePanel fullWidth">
        <h3>Team & Mitglieder</h3>
        <p>Hier entsteht eure Mitgliederübersicht mit Rollen, Spitznamen und Teamstatus.</p>
      </section>
      {members.map((role) => (
        <section className="panel infoCard" key={role}>
          <h4>{role}</h4>
          <p>Platzhalter für Mitglieder dieser Rolle.</p>
        </section>
      ))}
    </div>
  );
}

function EventsPage() {
  return (
    <div className="pageGrid twoColumns">
      <section className="panel largePanel">
        <h3>Events</h3>
        <p>Hier könnt ihr Spieltage, Scenario Events, Trainings und Teamtreffen eintragen.</p>
      </section>
      <section className="panel listPanel">
        <h4>Nächste Events</h4>
        <ul>
          <li>Nächstes Training — Datum folgt</li>
          <li>Scenario Game — Datum folgt</li>
          <li>Teamtreffen — Datum folgt</li>
        </ul>
      </section>
    </div>
  );
}

function GalleryPage() {
  return (
    <div className="pageGrid galleryGrid">
      <section className="panel largePanel fullWidth">
        <h3>Galerie</h3>
        <p>Platzhalter für Teamfotos, Eventbilder und Paintball-Szenen.</p>
      </section>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div className="galleryItem" key={item}>Bild {item}</div>
      ))}
    </div>
  );
}

function ClothingPage() {
  return (
    <div className="pageGrid twoColumns">
      <section className="panel largePanel">
        <h3>Vereinskleidung</h3>
        <p>
          Hier wird als nächstes dein fertiges Bestellsystem integriert: Mitglieder-Login,
          Admin-Bereich, Live-Datenbank, Timer und Excel-Export.
        </p>
        <p className="warning">
          Nächster Schritt: Wir fügen dein bestehendes Firebase-Bestellsystem genau hier ein.
        </p>
      </section>
      <section className="panel listPanel">
        <h4>Artikel</h4>
        <ul>
          <li>T-Shirt — 20 €</li>
          <li>Polo-Shirt — 30 €</li>
          <li>Hoodie — 40 €</li>
        </ul>
      </section>
    </div>
  );
}

function DownloadsPage() {
  return (
    <div className="pageGrid twoColumns">
      <section className="panel largePanel">
        <h3>Downloads</h3>
        <p>Hier könnt ihr später Satzung, Mitgliedsantrag, Regeln, Logos oder Eventinfos anbieten.</p>
      </section>
      <section className="panel listPanel">
        <h4>Dateien</h4>
        <ul>
          <li>Mitgliedsantrag</li>
          <li>Vereinsregeln</li>
          <li>Eventinformationen</li>
          <li>Logo-Dateien</li>
        </ul>
      </section>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="pageGrid twoColumns">
      <section className="panel largePanel">
        <h3>Kontakt</h3>
        <p>Du willst Kontakt aufnehmen oder dem Team beitreten? Hier kommen später eure Kontaktdaten rein.</p>
      </section>
      <section className="panel listPanel">
        <h4>Kontaktmöglichkeiten</h4>
        <ul>
          <li>E-Mail: info@demonlordsgermany.de</li>
          <li>Instagram: @demonlordsgermany</li>
          <li>WhatsApp Gruppe: auf Anfrage</li>
        </ul>
      </section>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Rye&family=Oswald:wght@300;400;500;600;700&display=swap');

*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%;background:#000}
body{font-family:'Oswald',Arial,sans-serif;color:#f2f2f2;background:#000;overflow-x:hidden}

.site{min-height:100dvh;width:100vw;background:#000;display:flex;flex-direction:column;overflow:hidden}
.hero{position:relative;height:180px;min-height:180px;overflow:hidden;background:radial-gradient(circle at 50% 18%,#252525 0%,#101010 34%,#050505 62%,#000 100%);border-bottom:1px solid #240000;flex:0 0 auto}
.smoke{position:absolute;inset:0;opacity:.75;background:radial-gradient(circle at 11% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 89% 17%,rgba(190,0,0,.45),transparent 17%),radial-gradient(circle at 50% 15%,rgba(255,255,255,.13),transparent 29%),linear-gradient(90deg,rgba(120,0,0,.35),transparent 24%,transparent 76%,rgba(120,0,0,.35))}
.logo{position:absolute;top:12px;width:150px;object-fit:contain;z-index:2;filter:drop-shadow(0 0 8px rgba(255,0,0,.45)) contrast(1.06) saturate(1.04)}
.logo.left{left:28px}.logo.right{right:28px}
.headline{position:relative;z-index:3;text-align:center;padding-top:25px;margin:0 auto;max-width:900px;padding-left:185px;padding-right:185px}
.headline h1{margin:0;font-family:'Rye',Georgia,serif;font-size:64px;line-height:.95;letter-spacing:.04em;color:#b91410;text-shadow:0 2px 0 #3a0000,0 0 6px rgba(230,0,0,.18);font-weight:400;white-space:nowrap}
.headline h2{margin:4px 0 0;font-family:'Rye',Georgia,serif;font-size:38px;line-height:1;letter-spacing:.22em;color:#d8d8d8;text-shadow:0 2px 0 #000,0 0 6px rgba(255,255,255,.14);font-weight:400;white-space:nowrap}
.headline p{display:inline-block;margin:10px 0 0;padding-top:8px;min-width:330px;border-top:1px solid #8b0000;font-family:'Rye',Georgia,serif;font-size:16px;letter-spacing:.16em;color:#cfcfcf;text-shadow:0 2px 0 #000;white-space:nowrap}
.mobileMenuButton{display:none;position:absolute;right:12px;bottom:12px;z-index:10;border:1px solid #8b0000;background:#070707;color:#fff;border-radius:6px;padding:8px 12px;font-family:'Oswald',Arial,sans-serif;text-transform:uppercase}

.nav{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;border-bottom:1px solid #240000;background:#050505;flex:0 0 auto;overflow-x:auto}
.nav button{border:1px solid #333;background:#090909;color:#ddd;border-radius:6px;padding:9px 14px;font-family:'Oswald',Arial,sans-serif;font-size:14px;text-transform:uppercase;letter-spacing:.04em;cursor:pointer;white-space:nowrap}
.nav button:hover,.nav button.active{border-color:#b91410;color:#fff;background:linear-gradient(180deg,#1a0505,#080808);box-shadow:0 0 12px rgba(255,0,0,.22)}

.content{flex:1;min-height:0;overflow:auto;padding:16px;background:radial-gradient(circle at top,#120000,#000 45%)}
.pageGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.twoColumns{grid-template-columns:1.4fr .8fr}.fullWidth{grid-column:1/-1}.panel{border:1px solid rgba(150,150,150,.42);border-radius:8px;background:linear-gradient(180deg,rgba(10,10,10,.96),rgba(3,3,3,.98));box-shadow:inset 0 0 28px rgba(255,255,255,.035),0 0 18px rgba(0,0,0,.75);padding:22px}.largePanel{min-height:240px}.heroPanel{background:linear-gradient(135deg,rgba(70,0,0,.45),rgba(5,5,5,.98)),radial-gradient(circle at top right,rgba(255,0,0,.16),transparent 35%)}
.eyebrow{color:#ff2119;text-transform:uppercase;letter-spacing:.2em;font-size:13px;margin:0 0 12px}.panel h3{margin:0 0 16px;color:#ef1b16;font-size:32px;text-transform:uppercase;letter-spacing:.03em}.panel h4{margin:0 0 10px;color:#ef1b16;font-size:22px;text-transform:uppercase}.panel p{color:#ddd;font-size:18px;line-height:1.55}.panel ul{margin:0;padding-left:20px;color:#ddd;font-size:18px;line-height:1.8}.buttonRow{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.buttonRow button{border:0;border-radius:6px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;padding:12px 18px;font-family:'Oswald',Arial,sans-serif;font-size:16px;text-transform:uppercase;cursor:pointer}.buttonRow button.ghost{border:1px solid #8b0000;background:#070707}.infoCard{min-height:160px}.warning{border:1px solid #8b0000;background:rgba(120,0,0,.18);border-radius:6px;padding:12px;color:#ffb7b7!important}.galleryGrid{grid-template-columns:repeat(3,1fr)}.galleryItem{min-height:180px;border:1px solid #333;border-radius:8px;background:linear-gradient(135deg,#111,#030303);display:flex;align-items:center;justify-content:center;color:#777;font-size:22px;text-transform:uppercase}
footer{border-top:1px solid #240000;background:#050505;color:#d0d0d0;text-align:center;padding:12px;font-family:'Rye',Georgia,serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;flex:0 0 auto}

@media(max-width:1000px){.site{overflow:auto}.hero{height:auto;min-height:210px}.logo{width:125px}.headline{padding-left:140px;padding-right:140px}.headline h1{font-size:48px}.headline h2{font-size:30px}.headline p{font-size:14px}.pageGrid,.twoColumns,.galleryGrid{grid-template-columns:1fr 1fr}.largePanel{grid-column:1/-1}.nav{justify-content:flex-start}}
@media(max-width:700px){.hero{min-height:250px}.logo{width:105px}.logo.right{display:none}.headline{padding:120px 12px 20px}.headline h1{font-size:34px;white-space:normal}.headline h2{font-size:23px;letter-spacing:.12em}.headline p{min-width:0;width:100%;font-size:12px;letter-spacing:.1em;white-space:normal}.mobileMenuButton{display:block}.nav{display:none;flex-direction:column;align-items:stretch;padding:10px}.nav.open{display:flex}.nav button{width:100%;text-align:left}.content{padding:10px}.pageGrid,.twoColumns,.galleryGrid{grid-template-columns:1fr}.panel{padding:16px}.panel h3{font-size:25px}.panel p,.panel ul{font-size:16px}.galleryItem{min-height:130px}footer{font-size:9px;letter-spacing:.1em}}
`;
