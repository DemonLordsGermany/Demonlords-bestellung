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
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    { id: "admin", label: "Admin" },
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
          {activePage === "admin" && <AdminCMS />}
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
    <div className="pageGrid startPageClassic">
      <section className="panel heroPanel largePanel classicHero">
        <p className="eyebrow">German Magfed Paintball Community</p>
        <h3>Willkommen bei den Demon Lords Germany</h3>
        <p>
          Wir stehen für Brotherhood, Loyalität, taktisches Teamplay und eine starke Community.
          Diese Webseite ist eure zentrale Plattform für Team, Events, Galerie, Downloads und Vereinskleidung.
        </p>
        <div className="buttonRow">
          <button onClick={() => openPage("clothing")}>Vereinskleidung ansehen</button>
          <button className="ghost" onClick={() => openPage("about")}>Mehr über uns</button>
        </div>
      </section>

      <section className="panel infoCard classicInfo">
        <h4>🔥 Fokus</h4>
        <p>Magfed Paintball, Scenario Games, Teamwear und Community.</p>
      </section>

      <section className="panel infoCard classicInfo">
        <h4>🛡️ Werte</h4>
        <p>Brotherhood, Loyalty, Respect und taktisches Zusammenspiel.</p>
      </section>

      <section className="panel infoCard classicInfo">
        <h4>👕 Merch</h4>
        <p>Vereinskleidung, Hoodies, T-Shirts, Polos und Patches.</p>
      </section>

      <section className="panel classicWide fullWidth">
        <div>
          <h4>Aktuelle Bereiche</h4>
          <p>
            Nutze die Navigation, um zu Team, Events, Galerie, Downloads, Kontakt oder zur Vereinskleidung zu wechseln.
          </p>
        </div>
        <div className="classicQuickGrid">
          <button onClick={() => openPage("team")}>Team</button>
          <button onClick={() => openPage("events")}>Events</button>
          <button onClick={() => openPage("gallery")}>Galerie</button>
          <button onClick={() => openPage("downloads")}>Downloads</button>
        </div>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="aboutPage">
      <section className="panel aboutHero fullWidth">
        <div className="aboutOverlay" />
        <div className="aboutContent">
          <p className="eyebrow">Brotherhood • Loyalty • Respect</p>
          <h3>Wer sind die Demon Lords Germany?</h3>
          <p>
            Demon Lords Germany ist eine taktische Magfed-Paintball-Community mit Fokus auf
            Teamplay, Zusammenhalt und professionelles Auftreten. Unser Ziel ist nicht nur ein
            starkes Team auf dem Spielfeld, sondern eine echte Brotherhood außerhalb des Spiels.
          </p>
        </div>
      </section>

      <section className="panel aboutStory">
        <h4>Unsere Philosophie</h4>
        <p>
          Wir stehen für Loyalität, Respekt und taktisches Gameplay. Jeder Spieler repräsentiert
          das Team — sowohl auf Events als auch innerhalb der Community. Disziplin, Auftreten und
          Zusammenhalt gehören für uns genauso dazu wie Action und Adrenalin.
        </p>
        <p>
          Demon Lords Germany verbindet modernes Tactical-Design mit einer aktiven Paintball-
          Community und einem einheitlichen Teamauftritt.
        </p>
      </section>

      <section className="panel valueCard">
        <h4>🛡 Brotherhood</h4>
        <p>
          Wir agieren als Team und unterstützen uns gegenseitig auf und neben dem Spielfeld.
        </p>
      </section>

      <section className="panel valueCard">
        <h4>⚔ Tactical Mindset</h4>
        <p>
          Struktur, Kommunikation und taktisches Zusammenspiel stehen im Mittelpunkt.
        </p>
      </section>

      <section className="panel valueCard">
        <h4>🔥 Community</h4>
        <p>
          Gemeinsame Events, Trainings und Teamwear schaffen eine starke Identität.
        </p>
      </section>

      <section className="panel missionPanel">
        <div>
          <h4>Unsere Mission</h4>
          <p>
            Aufbau einer starken deutschen Magfed-Community mit professionellem Auftreten,
            hochwertiger Vereinskleidung und einer modernen Plattform für Mitglieder.
          </p>
        </div>
        <div className="missionStats">
          <div>
            <strong>Magfed</strong>
            <span>Scenario & Tactical Gameplay</span>
          </div>
          <div>
            <strong>Community</strong>
            <span>Brotherhood & Zusammenhalt</span>
          </div>
          <div>
            <strong>Teamwear</strong>
            <span>Einheitlicher Auftritt</span>
          </div>
        </div>
      </section>

      <section className="panel aboutQuote fullWidth">
        <blockquote>
          “Brotherhood is not a word. It is the way we fight, move and stand together.”
        </blockquote>
      </section>
    </div>
  );
}

function TeamPage() {
  const commandRanks = [
    {
      title: "Leader",
      short: "LD",
      subtitle: "Command & Direction",
      description:
        "Verantwortet die Ausrichtung, finale Entscheidungen und das Auftreten von Demon Lords Germany nach außen.",
      members: ["Leader Name"],
    },
    {
      title: "Co-Leader",
      short: "CO",
      subtitle: "Second Command",
      description:
        "Unterstützt die Führung, koordiniert interne Abläufe und übernimmt Verantwortung bei Teamentscheidungen.",
      members: ["Co-Leader Name"],
    },
    {
      title: "Secretary",
      short: "SEC",
      subtitle: "Organisation & Verwaltung",
      description:
        "Verantwortlich für Listen, Dokumente, Kommunikation und organisatorische Themen innerhalb des Teams.",
      members: ["Secretary Name"],
    },
  ];

  const fieldRanks = [
    {
      title: "First Sergeant",
      short: "1SG",
      subtitle: "Struktur & Briefing",
      description:
        "Sorgt für Struktur, Spielvorbereitung, Briefings und taktische Abstimmung im Team.",
      members: ["First Sergeant Name"],
    },
    {
      title: "Officer",
      short: "OFC",
      subtitle: "Teamführung im Feld",
      description:
        "Officer unterstützen Gruppen, helfen neuen Mitgliedern und halten Kommunikation im Spiel klar.",
      members: ["Officer 1", "Officer 2"],
    },
    {
      title: "Members",
      short: "MBR",
      subtitle: "Brotherhood & Teamkern",
      description:
        "Members bilden den aktiven Kern von Demon Lords Germany und stehen für Loyalität, Respekt und Teamplay.",
      members: ["Member 1", "Member 2", "Member 3"],
    },
  ];

  const allRanks = [...commandRanks, ...fieldRanks];

  return (
    <div className="teamPagePro">
      <section className="panel teamCommandHero fullWidth">
        <div className="teamHeroShade" />
        <div className="teamHeroInner">
          <p className="eyebrow">Demon Lords Germany Structure</p>
          <h3>Team & Command Structure</h3>
          <p>
            Klare Rollen. Klare Verantwortung. Ein Team. Unsere Rangstruktur sorgt für Organisation,
            Disziplin und ein professionelles Auftreten — auf Events, im Feld und innerhalb der Community.
          </p>
        </div>
      </section>

      <section className="panel chainPanel fullWidth">
        <div>
          <h4>Chain of Command</h4>
          <p>Vom Leader bis zum Member — jeder Rang hat seine Aufgabe innerhalb der Brotherhood.</p>
        </div>
        <div className="chainLine">
          {allRanks.map((rank, index) => (
            <div className="chainStep" key={rank.title}>
              <span>{index + 1}</span>
              <strong>{rank.title}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="teamSectionTitle fullWidth">
        <span>Command Staff</span>
      </section>

      {commandRanks.map((rank) => (
        <RankCardPro rank={rank} key={rank.title} featured />
      ))}

      <section className="teamSectionTitle fullWidth">
        <span>Field Unit</span>
      </section>

      {fieldRanks.map((rank) => (
        <RankCardPro rank={rank} key={rank.title} />
      ))}
    </div>
  );
}

function RankCardPro({ rank, featured = false }) {
  return (
    <section className={`panel rankCardPro ${featured ? "featured" : ""}`}>
      <div className="rankTop">
        <div className="rankShort">{rank.short}</div>
        <div>
          <div className="rankTitle">{rank.title}</div>
          <div className="rankSubtitle">{rank.subtitle}</div>
        </div>
      </div>

      <p>{rank.description}</p>

      <div className="rankDivider" />

      <div className="memberListPro">
        {rank.members.map((member) => (
          <div className="memberCardPro" key={member}>
            <div className="memberAvatarPro">
              <img src="/logo.png" alt="Demon Lords Logo" />
            </div>
            <div className="memberInfoPro">
              <strong>{member}</strong>
              <span>{rank.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventsPage() {
  const events = [
    {
      title: "Nächstes Training",
      type: "Training",
      date: "Datum folgt",
      time: "Uhrzeit folgt",
      location: "Spielfeld folgt",
      status: "Planung",
      description:
        "Regelmäßiges Teamtraining mit Fokus auf Kommunikation, Bewegung und taktische Abläufe.",
    },
    {
      title: "Scenario Game",
      type: "Event",
      date: "Datum folgt",
      time: "Uhrzeit folgt",
      location: "Location folgt",
      status: "Offen",
      description:
        "Geplantes Scenario-Event für Teamplay, Rollenverteilung und gemeinsamen Auftritt.",
    },
    {
      title: "Teamtreffen",
      type: "Community",
      date: "Datum folgt",
      time: "Uhrzeit folgt",
      location: "Treffpunkt folgt",
      status: "Intern",
      description:
        "Besprechung, Planung und Austausch innerhalb der Brotherhood.",
    },
  ];

  return (
    <div className="eventsPage">
      <section className="panel eventsHero fullWidth">
        <div className="eventsHeroInner">
          <p className="eyebrow">Operations • Trainings • Scenario Games</p>
          <h3>Events & Einsätze</h3>
          <p>
            Hier findet ihr kommende Spieltage, Trainings, Teamtreffen und Scenario-Events der
            Demon Lords Germany. Der Bereich dient später als zentrale Event-Übersicht für alle Mitglieder.
          </p>
        </div>
      </section>

      <section className="panel nextEvent fullWidth">
        <div className="nextEventBadge">Nächstes Event</div>
        <div className="nextEventContent">
          <div>
            <h4>Nächstes offizielles Team-Event</h4>
            <p>
              Sobald ein neuer Termin feststeht, wird er hier prominent angezeigt — inklusive Datum,
              Treffpunkt, Status und weiteren Informationen.
            </p>
          </div>
          <div className="eventCountdownPlaceholder">
            <strong>COMING SOON</strong>
            <span>Eventdaten folgen</span>
          </div>
        </div>
      </section>

      <section className="eventsSectionTitle fullWidth">
        <span>Kommende Termine</span>
      </section>

      {events.map((event) => (
        <section className="panel eventCard" key={event.title}>
          <div className="eventTop">
            <span className="eventType">{event.type}</span>
            <span className={`eventStatus ${event.status.toLowerCase()}`}>{event.status}</span>
          </div>
          <h4>{event.title}</h4>
          <p>{event.description}</p>

          <div className="eventDetails">
            <div>
              <strong>Datum</strong>
              <span>{event.date}</span>
            </div>
            <div>
              <strong>Uhrzeit</strong>
              <span>{event.time}</span>
            </div>
            <div>
              <strong>Ort</strong>
              <span>{event.location}</span>
            </div>
          </div>
        </section>
      ))}

      <section className="panel eventInfoBox fullWidth">
        <h4>Event-Funktionen, die wir als nächstes einbauen können</h4>
        <div className="eventFeatureGrid">
          <div>✅ Teilnahme bestätigen</div>
          <div>✅ Treffpunkt anzeigen</div>
          <div>✅ Event-Countdown</div>
          <div>✅ WhatsApp-Link</div>
          <div>✅ Packliste</div>
          <div>✅ Admin Event-Verwaltung</div>
        </div>
      </section>
    </div>
  );
}

function GalleryPage() {
  const gallerySections = [
    {
      title: "Team Shots",
      label: "Brotherhood",
      description: "Gruppenbilder, Teamaufnahmen und gemeinsame Momente.",
    },
    {
      title: "Scenario Games",
      label: "Operations",
      description: "Bilder von großen Events, Missionen und Spieltagen.",
    },
    {
      title: "Tactical Gear",
      label: "Loadout",
      description: "Marker, Ausrüstung, Patches und Teamwear im Einsatz.",
    },
    {
      title: "Woodland",
      label: "Field",
      description: "Wald- und Outdoor-Szenen mit taktischem Gameplay.",
    },
    {
      title: "Urban",
      label: "CQB",
      description: "Urbane Spielfelder, Deckung, Bewegung und Teamkommunikation.",
    },
    {
      title: "Behind the Scenes",
      label: "Community",
      description: "Vorbereitung, Pausen, Teamtreffen und Brotherhood-Momente.",
    },
  ];

  return (
    <div className="galleryPagePro">
      <section className="panel galleryHeroPro fullWidth">
        <div className="galleryHeroInner">
          <p className="eyebrow">Images • Events • Brotherhood</p>
          <h3>Galerie</h3>
          <p>
            Hier entsteht die visuelle Chronik von Demon Lords Germany — Events, Teamfotos,
            Loadouts, Spieltage und starke Momente aus der Community.
          </p>
        </div>
      </section>

      <section className="galleryIntro fullWidth">
        <span>Aktuelle Kategorien</span>
      </section>

      {gallerySections.map((item, index) => (
        <section className="galleryCardPro" key={item.title}>
          <div className="galleryImagePlaceholder">
            <img src="/logo.png" alt="Demon Lords Germany Logo" />
            <div className="galleryNumber">0{index + 1}</div>
          </div>
          <div className="galleryCardContent">
            <span>{item.label}</span>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        </section>
      ))}

      <section className="panel galleryUploadHint fullWidth">
        <h4>Nächster Ausbau</h4>
        <p>
          Als nächstes können wir eine echte Bildergalerie mit Upload-Funktion, Fullscreen-Ansicht,
          Event-Alben und Admin-Verwaltung einbauen.
        </p>
        <div className="galleryFeatureList">
          <div>✅ Fullscreen Lightbox</div>
          <div>✅ Event-Alben</div>
          <div>✅ Admin Upload</div>
          <div>✅ Teamfotos</div>
          <div>✅ Video-Bereich</div>
          <div>✅ Instagram-Anbindung</div>
        </div>
      </section>
    </div>
  );
}

function ClothingPage() {
  return <OrderSystem />;
}

function OrderSystem() {
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const prices = { tshirt: 20, polo: 30, hoodie: 40 };
  const DEFAULT_ADMIN_PASSWORD = "DemonLords2026";
  const DEFAULT_MEMBER_PASSWORD = "DL2026";
  const DEFAULT_DEADLINE = "2026-12-31T23:59";

  const [settings, setSettings] = useState({ adminPassword: DEFAULT_ADMIN_PASSWORD, memberPassword: DEFAULT_MEMBER_PASSWORD, deadline: DEFAULT_DEADLINE });
  const [orders, setOrders] = useState([]);
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [newMemberPassword, setNewMemberPassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [deadlineInput, setDeadlineInput] = useState(DEFAULT_DEADLINE);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [now, setNow] = useState(Date.now());
  const [form, setForm] = useState({ name: "", nick: "", tshirtSize: "S", tshirtColor: "Olive", tshirtQty: 0, poloSize: "S", poloQty: 0, hoodieSize: "S", hoodieQty: 0, note: "" });

  useEffect(() => {
    const settingsRef = doc(db, "settings", "main");
    const unsubscribe = onSnapshot(settingsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(settingsRef, { adminPassword: DEFAULT_ADMIN_PASSWORD, memberPassword: DEFAULT_MEMBER_PASSWORD, deadline: DEFAULT_DEADLINE });
        return;
      }
      const data = snapshot.data();
      const next = { adminPassword: data.adminPassword || DEFAULT_ADMIN_PASSWORD, memberPassword: data.memberPassword || DEFAULT_MEMBER_PASSWORD, deadline: data.deadline || DEFAULT_DEADLINE };
      setSettings(next);
      setDeadlineInput(next.deadline);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
      list.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setOrders(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calc = (order) => Number(order.tshirtQty || 0) * prices.tshirt + Number(order.poloQty || 0) * prices.polo + Number(order.hoodieQty || 0) * prices.hoodie;
  const euro = (value) => `${Number(value).toFixed(2).replace(".", ",")} €`;
  const setFormValue = (key, value) => setForm({ ...form, [key]: value });
  const totalTshirts = orders.reduce((sum, order) => sum + Number(order.tshirtQty || 0), 0);
  const totalPolos = orders.reduce((sum, order) => sum + Number(order.poloQty || 0), 0);
  const totalHoodies = orders.reduce((sum, order) => sum + Number(order.hoodieQty || 0), 0);
  const total = orders.reduce((sum, order) => sum + calc(order), 0);
  const currentOrderTotal = calc(form);
  const deadlineTime = new Date(settings.deadline).getTime();
  const timeLeft = Math.max(0, deadlineTime - now);
  const orderClosed = timeLeft <= 0;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const deadlineDisplay = new Date(settings.deadline).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  function login(e) {
    e.preventDefault();
    if (loginPassword === settings.adminPassword) {
      setIsMemberLoggedIn(true); setIsAdmin(true); setLoginPassword(""); setLoginError(""); return;
    }
    if (loginPassword === settings.memberPassword) {
      if (orderClosed) { setLoginError("Die Bestellfrist ist abgelaufen. Mitglieder-Login ist gesperrt."); return; }
      setIsMemberLoggedIn(true); setIsAdmin(false); setLoginPassword(""); setLoginError(""); return;
    }
    setLoginError("Falsches Passwort");
  }

  function logout() { setIsMemberLoggedIn(false); setIsAdmin(false); setLoginPassword(""); setAdminPasswordInput(""); setLoginError(""); setAdminError(""); }

  function adminLogin(e) {
    e.preventDefault();
    if (adminPasswordInput === settings.adminPassword) { setIsAdmin(true); setAdminPasswordInput(""); setAdminError(""); } else { setAdminError("Falsches Admin-Passwort"); }
  }

  async function saveSettings(e) {
    e.preventDefault();
    const nextSettings = { adminPassword: newAdminPassword.trim().length >= 6 ? newAdminPassword.trim() : settings.adminPassword, memberPassword: newMemberPassword.trim().length >= 4 ? newMemberPassword.trim() : settings.memberPassword, deadline: deadlineInput || settings.deadline };
    await setDoc(doc(db, "settings", "main"), nextSettings);
    setNewMemberPassword(""); setNewAdminPassword(""); setSettingsMessage("Einstellungen wurden live gespeichert."); setTimeout(() => setSettingsMessage(""), 3000);
  }

  async function submit(e) {
    e.preventDefault();
    if (!isMemberLoggedIn || (orderClosed && !isAdmin) || !form.name.trim()) return;
    await addDoc(collection(db, "orders"), { ...form, poloSize: form.poloQty > 0 ? form.poloSize : "-", hoodieSize: form.hoodieQty > 0 ? form.hoodieSize : "-", createdAt: serverTimestamp(), createdAtText: new Date().toLocaleString("de-DE") });
    setForm({ name: "", nick: "", tshirtSize: "S", tshirtColor: "Olive", tshirtQty: 0, poloSize: "S", poloQty: 0, hoodieSize: "S", hoodieQty: 0, note: "" });
  }

  async function deleteOrder(orderId) { if (!isAdmin) return; await deleteDoc(doc(db, "orders", orderId)); }

  function exportCSV() {
    if (!isAdmin) return;
    const header = ["Name", "Spitzname", "T-Shirt Größe", "T-Shirt Farbe", "T-Shirt Anzahl", "Polo Größe", "Polo Anzahl", "Hoodie Größe", "Hoodie Anzahl", "Hinweise", "Gesamtpreis", "Datum"];
    const rows = orders.map((order) => [order.name, order.nick, order.tshirtSize, order.tshirtColor, order.tshirtQty, order.poloSize, order.poloQty, order.hoodieSize, order.hoodieQty, order.note || "", euro(calc(order)), order.createdAtText || ""]);
    const csv = [header, ...rows].map((row) => row.map((cell) => String(cell).replace(/;/g, ",")).join(";")).join(String.fromCharCode(10));
    const blob = new Blob([String.fromCharCode(65279) + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "demon-lords-bestellung.csv"; link.click(); URL.revokeObjectURL(url);
  }

  if (!isMemberLoggedIn) {
    return (
      <div className="orderLoginPanel">
        <img src="/logo.png" alt="Demon Lords Germany Logo" />
        <h3>Vereinskleidung Login</h3>
        <div className={orderClosed ? "orderDeadline closed" : "orderDeadline"}>
          {orderClosed ? <><strong>Bestellung geschlossen</strong><span>Bestellschluss war am {deadlineDisplay}</span></> : <><strong>Bestellschluss in</strong><span>{days} Tage · {hours} Std. · {minutes} Min. · {seconds} Sek.</span><small>bis {deadlineDisplay}</small></>}
        </div>
        <form onSubmit={login} className="orderLoginForm">
          <label>Passwort<input type="password" placeholder="Mitglieder- oder Admin-Passwort" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /></label>
          {loginError && <p className="orderError">{loginError}</p>}
          <button type="submit">Einloggen</button>
        </form>
      </div>
    );
  }

  return (
    <div className="orderSystem">
      <div className="orderTopBar"><div className={orderClosed ? "orderDeadline small closed" : "orderDeadline small"}>{orderClosed ? <span>Bestellung geschlossen</span> : <span>{days}T · {hours}H · {minutes}M · {seconds}S</span>}</div><button onClick={logout}>Logout</button></div>
      <div className="orderLayout">
        <section className="panel orderFormPanel">
          <h3>▣ Eintragungsformular</h3><p>Bitte trage hier deine Bestellung ein.</p>
          <form onSubmit={submit}>
            <div className="orderTwoCols"><label>Name <span>*</span><input required placeholder="Dein Name" value={form.name} onChange={(e) => setFormValue("name", e.target.value)} /></label><label>Spitzname<input placeholder="Dein Spitzname" value={form.nick} onChange={(e) => setFormValue("nick", e.target.value)} /></label></div>
            <ClothingProduct title="👕 T-Shirt – 20€"><div className="orderShirtGrid"><OrderSelect label="Größe" value={form.tshirtSize} onChange={(v) => setFormValue("tshirtSize", v)} options={sizes} /><OrderSelect label="Farbe" value={form.tshirtColor} onChange={(v) => setFormValue("tshirtColor", v)} options={["Olive", "Schwarz"]} /><OrderNumber label="Anzahl" value={form.tshirtQty} onChange={(v) => setFormValue("tshirtQty", v)} /></div><OrderSizeRow sizes={sizes} /></ClothingProduct>
            <ClothingProduct title="👕 Polo-Shirt – 30€" note="(Nur in Schwarz)"><div className="orderTwoProductCols"><OrderSelect label="Größe" value={form.poloSize} onChange={(v) => setFormValue("poloSize", v)} options={sizes} /><OrderNumber label="Anzahl" value={form.poloQty} onChange={(v) => setFormValue("poloQty", v)} /></div><OrderSizeRow sizes={sizes} /></ClothingProduct>
            <ClothingProduct title="🧥 Hoodie – 40€"><div className="orderTwoProductCols"><OrderSelect label="Größe" value={form.hoodieSize} onChange={(v) => setFormValue("hoodieSize", v)} options={sizes} /><OrderNumber label="Anzahl" value={form.hoodieQty} onChange={(v) => setFormValue("hoodieQty", v)} /></div><OrderSizeRow sizes={sizes} /></ClothingProduct>
            <label>Hinweise optional<textarea placeholder="Hier kannst du optional etwas angeben..." value={form.note} onChange={(e) => setFormValue("note", e.target.value)} /></label>
            <div className="memberTotalBox"><span>Deine aktuelle Bestellsumme:</span><strong>{euro(currentOrderTotal)}</strong></div>
            {orderClosed && !isAdmin ? <div className="closedNotice">Bestellfrist abgelaufen — neue Bestellungen sind gesperrt.</div> : <button className="orderSubmit" type="submit">➤ Bestellung absenden</button>}
          </form>
        </section>
        <section className={`panel orderOverviewPanel ${isAdmin ? "adminView" : ""}`}>
          <div className="orderOverviewHead"><div><h3>▣ Bestellübersicht</h3><p>{isAdmin ? "Admin-Ansicht: vollständige Live-Bestellliste mit Preisen." : "Mitglieder-Ansicht: sichtbar ist nur, wer sich bereits eingetragen hat."}</p></div>{!isAdmin ? <form className="adminForm" onSubmit={adminLogin}><input type="password" placeholder="Admin Passwort" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} /><button type="submit">Admin Login</button>{adminError && <span>{adminError}</span>}</form> : <div className="adminActive"><button onClick={exportCSV}>▦ Excel Export</button><button onClick={() => setIsAdmin(false)}>Admin Logout</button></div>}</div>
          {isAdmin && <form className="passwordPanel" onSubmit={saveSettings}><h3>Admin Einstellungen</h3><div className="passwordGrid"><label>Neues Mitglieder-Passwort<input type="text" placeholder="mind. 4 Zeichen" value={newMemberPassword} onChange={(e) => setNewMemberPassword(e.target.value)} /></label><label>Neues Admin-Passwort<input type="text" placeholder="mind. 6 Zeichen" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} /></label><label>Bestellschluss<input type="datetime-local" value={deadlineInput} onChange={(e) => setDeadlineInput(e.target.value)} /></label><button type="submit">Speichern</button></div>{settingsMessage && <p>{settingsMessage}</p>}</form>}
          <div className="orderTableWrap"><table>{isAdmin ? <thead><tr><th rowSpan="2">Name</th><th rowSpan="2">Spitzname</th><th colSpan="4">T-Shirt</th><th colSpan="3">Polo-Shirt</th><th colSpan="3">Hoodie</th><th rowSpan="2">Hinweise</th><th rowSpan="2">Gesamt</th><th rowSpan="2">Datum</th><th rowSpan="2"></th></tr><tr><th>Gr.</th><th>Farbe</th><th>Anz.</th><th>Preis</th><th>Gr.</th><th>Anz.</th><th>Preis</th><th>Gr.</th><th>Anz.</th><th>Preis</th></tr></thead> : <thead><tr><th>Name</th><th>Spitzname</th><th>Status</th></tr></thead>}<tbody>{orders.length === 0 && <tr><td colSpan={isAdmin ? 16 : 3} className="empty">Noch keine Bestellungen eingetragen.</td></tr>}{orders.map((order) => <tr key={order.id}>{isAdmin ? <><td>{order.name}</td><td>{order.nick || "-"}</td><td>{order.tshirtSize}</td><td>{order.tshirtColor}</td><td>{order.tshirtQty}</td><td>{euro(order.tshirtQty * prices.tshirt)}</td><td>{order.poloQty > 0 ? order.poloSize : "-"}</td><td>{order.poloQty}</td><td>{euro(order.poloQty * prices.polo)}</td><td>{order.hoodieQty > 0 ? order.hoodieSize : "-"}</td><td>{order.hoodieQty}</td><td>{euro(order.hoodieQty * prices.hoodie)}</td><td className="noteCell">{order.note || "-"}</td><td className="price">{euro(calc(order))}</td><td>{order.createdAtText || "-"}</td><td><button className="delete" onClick={() => deleteOrder(order.id)}>🗑</button></td></> : <><td>{order.name}</td><td>{order.nick || "-"}</td><td className="memberStatus">Eingetragen</td></>}</tr>)}</tbody></table></div>
          {isAdmin && <div className="orderBottomCards"><div className="orderCard"><h3>▟ Gesamtübersicht</h3><OrderSummary icon="👕" label="T-Shirts:" qty={totalTshirts} value={euro(totalTshirts * prices.tshirt)} /><OrderSummary icon="👕" label="Polo-Shirts:" qty={totalPolos} value={euro(totalPolos * prices.polo)} /><OrderSummary icon="🧥" label="Hoodies:" qty={totalHoodies} value={euro(totalHoodies * prices.hoodie)} /><div className="orderTotal"><strong>Gesamt:</strong><strong>{euro(total)}</strong></div></div><div className="orderCard"><h3>Preisliste</h3><OrderPrice icon="👕" label="T-Shirt" value={euro(prices.tshirt)} /><OrderPrice icon="👕" label="Polo-Shirt" value={euro(prices.polo)} /><OrderPrice icon="🧥" label="Hoodie" value={euro(prices.hoodie)} /></div></div>}
        </section>
      </div>
    </div>
  );
}

function ClothingProduct({ title, note, children }) { return <div className="clothingProduct"><h4>{title} {note && <small>{note}</small>}</h4>{children}</div>; }
function OrderSelect({ label, value, onChange, options }) { return <label>{label}<select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function OrderNumber({ label, value, onChange }) { return <label>{label}<input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>; }
function OrderSizeRow({ sizes }) { return <div className="orderSizeRow">{sizes.map((size) => <span key={size}>{size}</span>)}</div>; }
function OrderSummary({ icon, label, qty, value }) { return <div className="orderSummary"><span>{icon}</span><b>{label}</b><em>{qty} Stk.</em><em>{value}</em></div>; }
function OrderPrice({ icon, label, value }) { return <div className="orderPrice"><span>{icon}</span><b>{label}</b><em>{value}</em></div>; }

function DownloadsPage() {
  const downloads = [
    {
      title: "Vereinsregeln",
      icon: "🛡",
      description:
        "Regeln, Verhalten, Teamstruktur und Grundsätze der Demon Lords Germany.",
      status: "Intern",
    },
    {
      title: "Eventinfos",
      icon: "📅",
      description:
        "Wichtige Informationen zu kommenden Spieltagen, Treffpunkten und Abläufen.",
      status: "Aktiv",
    },
    {
      title: "Packlisten",
      icon: "🎒",
      description:
        "Checklisten für Ausrüstung, Kleidung, Verpflegung und Event-Vorbereitung.",
      status: "Vorbereitung",
    },
  ];

  return (
    <div className="downloadsPagePro">
      <section className="panel downloadsHero fullWidth">
        <div className="downloadsHeroInner">
          <p className="eyebrow">Rules • Information • Preparation</p>
          <h3>Downloads & Informationen</h3>
          <p>
            Hier findet ihr wichtige Dokumente, Regeln und Informationen rund um Demon Lords Germany,
            kommende Events und die Vorbereitung auf Spieltage.
          </p>
        </div>
      </section>

      <section className="downloadsTitle fullWidth">
        <span>Verfügbare Bereiche</span>
      </section>

      {downloads.map((item) => (
        <section className="downloadCard" key={item.title}>
          <div className="downloadTop">
            <div className="downloadIcon">{item.icon}</div>
            <span className={`downloadStatus ${item.status.toLowerCase()}`}>
              {item.status}
            </span>
          </div>

          <h4>{item.title}</h4>
          <p>{item.description}</p>

          <div className="downloadActions">
            <button>Öffnen</button>
            <button className="ghost">Download</button>
          </div>
        </section>
      ))}

      <section className="panel downloadsInfoBox fullWidth">
        <h4>Später mögliche Erweiterungen</h4>
        <div className="downloadsFeatureGrid">
          <div>✅ PDF Uploads</div>
          <div>✅ Interne Dokumente</div>
          <div>✅ Event-Dateien</div>
          <div>✅ Passwortgeschützte Downloads</div>
          <div>✅ Packlisten zum Ausdrucken</div>
          <div>✅ Admin-Dateiverwaltung</div>
        </div>
      </section>
    </div>
  );
}

function ContactPage() {
  const socials = [
    {
      title: "Facebook",
      icon: "f",
      description:
        "Folge uns auf Facebook für Team-Updates, Events, Bilder und Community-News.",
      action: "Facebook öffnen",
    },
    {
      title: "Instagram",
      icon: "◎",
      description:
        "Auf Instagram findest du Bilder, Reels, Spieltage, Teamwear und Eindrücke vom Feld.",
      action: "Instagram öffnen",
    },
  ];

  return (
    <div className="contactPagePro">
      <section className="panel contactHero fullWidth">
        <div className="contactHeroInner">
          <p className="eyebrow">Contact • Community • Brotherhood</p>
          <h3>Kontakt & Community</h3>
          <p>
            Du möchtest Kontakt aufnehmen, mehr über Demon Lords Germany erfahren oder Teil der
            Brotherhood werden? Hier findest du unsere Community-Kanäle und Kontaktmöglichkeiten.
          </p>
        </div>
      </section>

      <section className="panel joinPanel fullWidth">
        <div>
          <span className="joinBadge">Join the Brotherhood</span>
          <h4>Werde Teil der Demon Lords Germany</h4>
          <p>
            Wir suchen Leute mit Teamgeist, Respekt und Interesse an Magfed Paintball. Wichtig ist
            nicht nur dein Equipment, sondern deine Einstellung zum Team.
          </p>
        </div>
        <div className="joinRequirements">
          <div>✅ Teamfähigkeit</div>
          <div>✅ Respektvolles Verhalten</div>
          <div>✅ Interesse an Magfed / Scenario</div>
          <div>✅ Zuverlässigkeit bei Events</div>
        </div>
      </section>

      <section className="contactSectionTitle fullWidth">
        <span>Social Media</span>
      </section>

      {socials.map((social) => (
        <section className="socialCard" key={social.title}>
          <div className="socialIcon">{social.icon}</div>
          <h4>{social.title}</h4>
          <p>{social.description}</p>
          <button>{social.action}</button>
        </section>
      ))}

      <section className="panel contactInfoCard">
        <h4>Kontakt</h4>
        <p>
          Für Fragen zu Mitgliedschaft, Events oder Vereinskleidung kannst du uns über unsere
          Social-Media-Kanäle erreichen.
        </p>
        <div className="contactLine">
          <strong>Status</strong>
          <span>Community aktiv</span>
        </div>
        <div className="contactLine">
          <strong>Bereich</strong>
          <span>Deutschland</span>
        </div>
      </section>

      <section className="panel contactFinal fullWidth">
        <h4>Brotherhood. Loyalty. Respect.</h4>
        <p>
          Demon Lords Germany steht für Zusammenhalt, taktisches Teamplay und eine starke Community.
          Wenn du dazu passt, bist du willkommen.
        </p>
      </section>
    </div>
  );
}

function AdminCMS() {
  const DEFAULT_ADMIN_PASSWORD = "DemonLords2026";
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [message, setMessage] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState("start");

  const defaultCms = {
    startTitle: "Willkommen bei den Demon Lords Germany",
    startText:
      "Wir stehen für Brotherhood, Loyalität, taktisches Teamplay und eine starke Community.",
    startButtonPrimary: "Vereinskleidung ansehen",
    startButtonSecondary: "Mehr über uns",

    aboutTitle: "Wer sind die Demon Lords Germany?",
    aboutText:
      "Demon Lords Germany ist eine taktische Magfed-Paintball-Community mit Fokus auf Teamplay, Zusammenhalt und professionelles Auftreten.",
    aboutMission:
      "Aufbau einer starken deutschen Magfed-Community mit professionellem Auftreten, hochwertiger Vereinskleidung und moderner Plattform für Mitglieder.",

    teamTitle: "Team & Command Structure",
    teamText:
      "Klare Rollen. Klare Verantwortung. Ein Team. Unsere Rangstruktur sorgt für Organisation, Disziplin und professionelles Auftreten.",

    eventsTitle: "Events & Einsätze",
    eventsText:
      "Hier findet ihr kommende Spieltage, Trainings, Teamtreffen und Scenario-Events der Demon Lords Germany.",
    nextEventTitle: "Nächstes offizielles Team-Event",
    nextEventText: "Sobald ein neuer Termin feststeht, wird er hier prominent angezeigt.",

    galleryTitle: "Galerie",
    galleryText:
      "Hier entsteht die visuelle Chronik von Demon Lords Germany — Events, Teamfotos, Loadouts, Spieltage und starke Momente.",

    downloadsTitle: "Downloads & Informationen",
    downloadsText:
      "Hier findet ihr wichtige Dokumente, Regeln und Informationen rund um Demon Lords Germany, kommende Events und die Vorbereitung auf Spieltage.",

    contactTitle: "Kontakt & Community",
    contactText:
      "Du möchtest Kontakt aufnehmen, mehr über Demon Lords Germany erfahren oder Teil der Brotherhood werden?",
    facebook: "",
    instagram: "",

    heroImage: "",
    aboutImage: "",
    teamImage: "",
    eventImage: "",
    galleryImage: "",
    contactImage: "",
  };

  const [cms, setCms] = useState(defaultCms);

  const adminTabs = [
    { id: "start", label: "Startseite" },
    { id: "about", label: "Über uns" },
    { id: "team", label: "Team" },
    { id: "events", label: "Events" },
    { id: "gallery", label: "Galerie" },
    { id: "downloads", label: "Downloads" },
    { id: "contact", label: "Kontakt" },
    { id: "images", label: "Bilder" },
  ];

  useEffect(() => {
    const cmsRef = doc(db, "cms", "content");
    const unsubscribe = onSnapshot(cmsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(cmsRef, defaultCms);
        return;
      }
      setCms({ ...defaultCms, ...snapshot.data() });
    });
    return () => unsubscribe();
  }, []);

  function login(e) {
    e.preventDefault();
    if (password === DEFAULT_ADMIN_PASSWORD) {
      setLoggedIn(true);
      setPassword("");
      setError("");
    } else {
      setError("Falsches Admin-Passwort");
    }
  }

  async function saveCms(e) {
    e.preventDefault();
    setSaving(true);
    await setDoc(doc(db, "cms", "content"), cms);
    setSaving(false);
    setMessage("Änderungen wurden gespeichert.");
    setTimeout(() => setMessage(""), 3000);
  }

  function updateCms(key, value) {
    setCms({ ...cms, [key]: value });
  }

  async function uploadImage(key, file) {
    if (!file) return;
    try {
      setUploading(key);
      const filePath = `cms/${key}-${Date.now()}-${file.name}`;
      const imageRef = ref(storage, filePath);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setCms((current) => ({ ...current, [key]: url }));
      await setDoc(doc(db, "cms", "content"), { ...cms, [key]: url });
      setMessage("Bild wurde hochgeladen.");
      setTimeout(() => setMessage(""), 3000);
    } catch (uploadError) {
      setMessage("Bild konnte nicht hochgeladen werden. Prüfe Firebase Storage.");
    } finally {
      setUploading("");
    }
  }

  if (!loggedIn) {
    return (
      <div className="adminPage">
        <section className="panel adminLoginPanel">
          <img src="/logo.png" alt="Demon Lords Germany Logo" />
          <h3>Admin Sandbox</h3>
          <p>Bearbeite Texte, Links und Bilder deiner kompletten Webseite direkt im Browser.</p>
          <form onSubmit={login}>
            <label>
              Admin Passwort
              <input
                type="password"
                placeholder="Admin Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && <span className="adminError">{error}</span>}
            <button type="submit">Admin Login</button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="adminPage">
      <section className="panel adminHero fullWidth">
        <p className="eyebrow">Demon Lords CMS</p>
        <h3>Admin Sandbox</h3>
        <p>
          Bearbeite alle Hauptbereiche deiner Webseite zentral. Texte, Links und Bilder werden in Firebase gespeichert.
        </p>
      </section>

      <section className="adminTabs fullWidth">
        {adminTabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeAdminTab === tab.id ? "active" : ""}
            onClick={() => setActiveAdminTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <form className="adminEditor fullWidth" onSubmit={saveCms}>
        {activeAdminTab === "start" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Startseite bearbeiten</h4>
            <AdminTextInput label="Überschrift" value={cms.startTitle} onChange={(value) => updateCms("startTitle", value)} />
            <AdminTextArea label="Text" value={cms.startText} onChange={(value) => updateCms("startText", value)} />
            <AdminTextInput label="Button 1" value={cms.startButtonPrimary} onChange={(value) => updateCms("startButtonPrimary", value)} />
            <AdminTextInput label="Button 2" value={cms.startButtonSecondary} onChange={(value) => updateCms("startButtonSecondary", value)} />
          </section>
        )}

        {activeAdminTab === "about" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Über uns bearbeiten</h4>
            <AdminTextInput label="Überschrift" value={cms.aboutTitle} onChange={(value) => updateCms("aboutTitle", value)} />
            <AdminTextArea label="Beschreibung" value={cms.aboutText} onChange={(value) => updateCms("aboutText", value)} />
            <AdminTextArea label="Mission" value={cms.aboutMission} onChange={(value) => updateCms("aboutMission", value)} />
          </section>
        )}

        {activeAdminTab === "team" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Team bearbeiten</h4>
            <AdminTextInput label="Team Überschrift" value={cms.teamTitle} onChange={(value) => updateCms("teamTitle", value)} />
            <AdminTextArea label="Team Beschreibung" value={cms.teamText} onChange={(value) => updateCms("teamText", value)} />
            <p className="adminHint">Als nächstes bauen wir hier Mitgliederverwaltung mit Rollen, Namen und Bildern ein.</p>
          </section>
        )}

        {activeAdminTab === "events" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Events bearbeiten</h4>
            <AdminTextInput label="Event Überschrift" value={cms.eventsTitle} onChange={(value) => updateCms("eventsTitle", value)} />
            <AdminTextArea label="Event Beschreibung" value={cms.eventsText} onChange={(value) => updateCms("eventsText", value)} />
            <AdminTextInput label="Nächstes Event Titel" value={cms.nextEventTitle} onChange={(value) => updateCms("nextEventTitle", value)} />
            <AdminTextArea label="Nächstes Event Text" value={cms.nextEventText} onChange={(value) => updateCms("nextEventText", value)} />
            <p className="adminHint">Als nächstes bauen wir hier echte Eventkarten mit Datum, Ort und Status ein.</p>
          </section>
        )}

        {activeAdminTab === "gallery" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Galerie bearbeiten</h4>
            <AdminTextInput label="Galerie Überschrift" value={cms.galleryTitle} onChange={(value) => updateCms("galleryTitle", value)} />
            <AdminTextArea label="Galerie Beschreibung" value={cms.galleryText} onChange={(value) => updateCms("galleryText", value)} />
            <p className="adminHint">Als nächstes bauen wir hier echte Galerie-Alben und mehrere Bild-Uploads ein.</p>
          </section>
        )}

        {activeAdminTab === "downloads" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Downloads bearbeiten</h4>
            <AdminTextInput label="Downloads Überschrift" value={cms.downloadsTitle} onChange={(value) => updateCms("downloadsTitle", value)} />
            <AdminTextArea label="Downloads Beschreibung" value={cms.downloadsText} onChange={(value) => updateCms("downloadsText", value)} />
            <p className="adminHint">Als nächstes bauen wir PDF-Uploads für Vereinsregeln, Eventinfos und Packlisten ein.</p>
          </section>
        )}

        {activeAdminTab === "contact" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Kontakt bearbeiten</h4>
            <AdminTextInput label="Kontakt Überschrift" value={cms.contactTitle} onChange={(value) => updateCms("contactTitle", value)} />
            <AdminTextArea label="Kontakt Beschreibung" value={cms.contactText} onChange={(value) => updateCms("contactText", value)} />
            <AdminTextInput label="Facebook Link" value={cms.facebook} onChange={(value) => updateCms("facebook", value)} />
            <AdminTextInput label="Instagram Link" value={cms.instagram} onChange={(value) => updateCms("instagram", value)} />
          </section>
        )}

        {activeAdminTab === "images" && (
          <section className="panel adminEditCard fullWidth">
            <h4>Bilder hochladen</h4>
            <div className="imageUploadGrid">
              <ImageUpload label="Startseite Bild" field="heroImage" value={cms.heroImage} uploading={uploading} onUpload={uploadImage} />
              <ImageUpload label="Über uns Bild" field="aboutImage" value={cms.aboutImage} uploading={uploading} onUpload={uploadImage} />
              <ImageUpload label="Team Bild" field="teamImage" value={cms.teamImage} uploading={uploading} onUpload={uploadImage} />
              <ImageUpload label="Event Bild" field="eventImage" value={cms.eventImage} uploading={uploading} onUpload={uploadImage} />
              <ImageUpload label="Galerie Bild" field="galleryImage" value={cms.galleryImage} uploading={uploading} onUpload={uploadImage} />
              <ImageUpload label="Kontakt Bild" field="contactImage" value={cms.contactImage} uploading={uploading} onUpload={uploadImage} />
            </div>
          </section>
        )}

        <section className="panel adminEditCard adminActions fullWidth">
          <h4>Speichern</h4>
          <p>Alle Änderungen werden zentral in Firebase gespeichert.</p>
          <button type="submit">{saving ? "Speichert..." : "Änderungen speichern"}</button>
          {message && <span>{message}</span>}
        </section>
      </form>
    </div>
  );
}

function AdminTextInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function AdminTextArea({ label, value, onChange }) {
  return (
    <label>
      {label}
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ImageUpload({ label, field, value, uploading, onUpload }) {
  return (
    <div className="imageUploadCard">
      <strong>{label}</strong>
      {value ? <img src={value} alt={label} /> : <div className="imageEmpty">Kein Bild</div>}
      <input type="file" accept="image/*" onChange={(e) => onUpload(field, e.target.files?.[0])} />
      {uploading === field && <span>Upload läuft...</span>}
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
.eyebrow{color:#ff2119;text-transform:uppercase;letter-spacing:.2em;font-size:13px;margin:0 0 12px}.panel h3{margin:0 0 16px;color:#ef1b16;font-size:32px;text-transform:uppercase;letter-spacing:.03em}.panel h4{margin:0 0 10px;color:#ef1b16;font-size:22px;text-transform:uppercase}.panel p{color:#ddd;font-size:18px;line-height:1.55}.panel ul{margin:0;padding-left:20px;color:#ddd;font-size:18px;line-height:1.8}.buttonRow{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.buttonRow button{border:0;border-radius:6px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;padding:12px 18px;font-family:'Oswald',Arial,sans-serif;font-size:16px;text-transform:uppercase;cursor:pointer}.buttonRow button.ghost{border:1px solid #8b0000;background:#070707}.infoCard{min-height:160px}.warning{border:1px solid #8b0000;background:rgba(120,0,0,.18);border-radius:6px;padding:12px;color:#ffb7b7!important}.galleryGrid{grid-template-columns:repeat(3,1fr)}.eventsPage{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.eventsHero{min-height:310px;background:linear-gradient(135deg,rgba(70,0,0,.55),rgba(4,4,4,.98)),radial-gradient(circle at top right,rgba(255,0,0,.22),transparent 34%);display:flex;align-items:center;justify-content:center;text-align:center}.eventsHeroInner{max-width:950px}.eventsHero h3{font-size:48px}.eventsHero p{font-size:20px;line-height:1.7}.nextEvent{position:relative;overflow:hidden;background:linear-gradient(135deg,rgba(80,0,0,.35),rgba(0,0,0,.96))}.nextEventBadge{display:inline-block;border:1px solid #8b0000;background:#070707;color:#ff2119;border-radius:6px;padding:8px 12px;text-transform:uppercase;font-weight:700;letter-spacing:.1em;margin-bottom:14px}.nextEventContent{display:grid;grid-template-columns:1.2fr .6fr;gap:18px;align-items:center}.nextEventContent h4{font-size:28px}.eventCountdownPlaceholder{border:1px solid #8b0000;border-radius:8px;background:rgba(0,0,0,.55);padding:20px;text-align:center;box-shadow:0 0 18px rgba(255,0,0,.15)}.eventCountdownPlaceholder strong{display:block;color:#ff2119;font-size:28px}.eventCountdownPlaceholder span{color:#aaa}.eventsSectionTitle{grid-column:1/-1;border-left:4px solid #b91410;background:linear-gradient(90deg,rgba(100,0,0,.28),rgba(0,0,0,0));padding:10px 14px;text-transform:uppercase;letter-spacing:.18em;color:#ff2119;font-weight:700}.eventCard{min-height:300px;position:relative;overflow:hidden}.eventCard::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at top right,rgba(255,0,0,.12),transparent 40%);pointer-events:none}.eventTop{position:relative;display:flex;justify-content:space-between;gap:10px;margin-bottom:16px}.eventType,.eventStatus{border:1px solid #333;border-radius:6px;padding:6px 10px;text-transform:uppercase;font-size:12px;letter-spacing:.08em;background:#050505}.eventType{color:#ddd}.eventStatus{color:#ff2119;border-color:#8b0000}.eventStatus.intern{color:#aaa;border-color:#555}.eventStatus.planung{color:#ffd05c;border-color:#705200}.eventCard h4{position:relative;font-size:26px}.eventCard p{position:relative;font-size:16px;line-height:1.55}.eventDetails{position:relative;display:grid;grid-template-columns:1fr;gap:10px;margin-top:18px}.eventDetails div{border:1px solid #333;border-radius:6px;background:rgba(0,0,0,.5);padding:10px}.eventDetails strong{display:block;color:#ef1b16;text-transform:uppercase;font-size:12px;letter-spacing:.08em}.eventDetails span{color:#ddd}.eventInfoBox h4{font-size:24px}.eventFeatureGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.eventFeatureGrid div{border:1px solid #333;border-radius:8px;background:rgba(0,0,0,.55);padding:14px;color:#ddd}.teamPagePro{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.teamCommandHero{position:relative;min-height:330px;overflow:hidden;background:linear-gradient(135deg,rgba(75,0,0,.55),rgba(2,2,2,.98)),radial-gradient(circle at top right,rgba(255,0,0,.22),transparent 34%)}.teamHeroShade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.75),rgba(0,0,0,.25),rgba(0,0,0,.75)),radial-gradient(circle at center,rgba(255,255,255,.055),transparent 50%)}.teamHeroInner{position:relative;z-index:2;max-width:980px;margin:0 auto;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}.teamHeroInner h3{font-size:50px;letter-spacing:.02em;text-align:center;margin-bottom:18px}.teamHeroInner p{max-width:900px;font-size:20px;line-height:1.7;text-align:center;margin:0 auto}.chainPanel{display:grid;grid-template-columns:.65fr 1.35fr;gap:20px;align-items:center;padding:20px 22px}.chainPanel h4{font-size:24px}.chainPanel p{font-size:16px;margin:0}.chainLine{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.chainStep{position:relative;border:1px solid #343434;border-radius:8px;background:linear-gradient(180deg,rgba(18,18,18,.95),rgba(3,3,3,.95));padding:12px 8px;text-align:center;overflow:hidden}.chainStep::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at top,rgba(255,0,0,.16),transparent 55%);pointer-events:none}.chainStep span{position:relative;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#8b0000;color:#fff;font-weight:700;margin-bottom:8px}.chainStep strong{position:relative;display:block;color:#eee;text-transform:uppercase;font-size:12px;letter-spacing:.05em}.teamSectionTitle{grid-column:1/-1;border-left:4px solid #b91410;background:linear-gradient(90deg,rgba(100,0,0,.28),rgba(0,0,0,0));padding:10px 14px;text-transform:uppercase;letter-spacing:.18em;color:#ddd;font-weight:700}.teamSectionTitle span{color:#ff2119}.rankCardPro{position:relative;min-height:345px;overflow:hidden;padding:18px;background:linear-gradient(180deg,rgba(13,13,13,.98),rgba(3,3,3,.98))}.rankCardPro::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at top right,rgba(255,0,0,.12),transparent 38%);pointer-events:none}.rankCardPro.featured{border-color:rgba(185,20,16,.8);box-shadow:inset 0 0 30px rgba(255,255,255,.03),0 0 22px rgba(185,20,16,.12)}.rankTop{position:relative;display:flex;gap:14px;align-items:center;margin-bottom:16px}.rankShort{width:58px;height:58px;border:1px solid #8b0000;border-radius:10px;background:linear-gradient(180deg,#2a0505,#060606);display:flex;align-items:center;justify-content:center;color:#ff2119;font-weight:700;font-size:18px;letter-spacing:.05em;box-shadow:0 0 14px rgba(255,0,0,.18)}.rankTitle{font-size:25px;color:#fff;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.rankSubtitle{color:#aaa;text-transform:uppercase;font-size:12px;letter-spacing:.12em}.rankCardPro p{position:relative;color:#ddd;font-size:16px;line-height:1.55;margin:0}.rankDivider{position:relative;height:1px;background:linear-gradient(90deg,#8b0000,transparent);margin:18px 0}.memberListPro{position:relative;display:grid;grid-template-columns:1fr;gap:10px}.memberCardPro{display:flex;align-items:center;gap:12px;border:1px solid #333;border-radius:8px;background:rgba(0,0,0,.58);padding:10px;transition:.2s}.memberCardPro:hover{border-color:#8b0000;transform:translateY(-1px)}.memberAvatarPro{width:56px;height:56px;border:1px solid #8b0000;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#050505;overflow:hidden;flex:0 0 auto}.memberAvatarPro img{width:45px;height:45px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(255,0,0,.35))}.memberInfoPro strong{display:block;color:#fff;font-size:17px}.memberInfoPro span{display:block;color:#aaa;text-transform:uppercase;font-size:12px;letter-spacing:.06em}.aboutPage{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.aboutHero{position:relative;min-height:340px;overflow:hidden;background:linear-gradient(135deg,rgba(70,0,0,.55),rgba(5,5,5,.96)),radial-gradient(circle at top right,rgba(255,0,0,.2),transparent 35%)}.aboutOverlay{position:absolute;inset:0;background:radial-gradient(circle at center,rgba(255,255,255,.05),transparent 45%),linear-gradient(90deg,rgba(0,0,0,.65),rgba(0,0,0,.15),rgba(0,0,0,.65))}.aboutContent{position:relative;z-index:2;max-width:900px}.aboutContent h3{font-size:48px;margin-bottom:18px}.aboutContent p{max-width:850px;font-size:20px;line-height:1.7}.aboutStory{grid-column:span 2;min-height:260px}.valueCard{min-height:260px}.missionPanel{grid-column:1/-1;display:grid;grid-template-columns:1.2fr .9fr;gap:20px;align-items:stretch}.missionStats{display:grid;grid-template-columns:1fr;gap:12px}.missionStats div{border:1px solid #3a3a3a;border-radius:8px;padding:18px;background:rgba(0,0,0,.45)}.missionStats strong{display:block;color:#ef1b16;font-size:22px;text-transform:uppercase;margin-bottom:6px}.missionStats span{color:#ddd}.aboutQuote{display:flex;align-items:center;justify-content:center;min-height:140px;background:linear-gradient(135deg,rgba(90,0,0,.3),rgba(0,0,0,.9))}.aboutQuote blockquote{margin:0;color:#ddd;font-size:28px;text-align:center;font-family:'Rye',Georgia,serif;line-height:1.6;max-width:1000px}.galleryItem{min-height:180px;border:1px solid #333;border-radius:8px;background:linear-gradient(135deg,#111,#030303);display:flex;align-items:center;justify-content:center;color:#777;font-size:22px;text-transform:uppercase}.galleryPagePro{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.galleryHeroPro{min-height:320px;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(70,0,0,.55),rgba(4,4,4,.98)),radial-gradient(circle at top right,rgba(255,0,0,.22),transparent 34%)}.galleryHeroInner{max-width:920px}.galleryHeroPro h3{font-size:50px}.galleryHeroPro p{font-size:20px;line-height:1.7}.galleryIntro{grid-column:1/-1;border-left:4px solid #b91410;background:linear-gradient(90deg,rgba(100,0,0,.28),rgba(0,0,0,0));padding:10px 14px;text-transform:uppercase;letter-spacing:.18em;color:#ff2119;font-weight:700}.galleryCardPro{min-height:360px;border:1px solid rgba(150,150,150,.42);border-radius:8px;background:linear-gradient(180deg,rgba(10,10,10,.96),rgba(3,3,3,.98));overflow:hidden;box-shadow:inset 0 0 28px rgba(255,255,255,.035),0 0 18px rgba(0,0,0,.75);transition:.25s}.galleryCardPro:hover{transform:translateY(-3px);border-color:#8b0000;box-shadow:0 0 24px rgba(185,20,16,.18)}.galleryImagePlaceholder{position:relative;height:210px;background:radial-gradient(circle at center,rgba(255,0,0,.18),transparent 42%),linear-gradient(135deg,#151515,#030303);display:flex;align-items:center;justify-content:center;border-bottom:1px solid #222;overflow:hidden}.galleryImagePlaceholder::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.04),transparent 45%,rgba(120,0,0,.18));pointer-events:none}.galleryImagePlaceholder img{width:120px;height:120px;object-fit:contain;filter:drop-shadow(0 0 14px rgba(255,0,0,.45));opacity:.9}.galleryNumber{position:absolute;right:14px;bottom:10px;color:#ff2119;font-size:34px;font-weight:700;opacity:.75}.galleryCardContent{padding:18px}.galleryCardContent span{display:inline-block;color:#ff2119;text-transform:uppercase;letter-spacing:.14em;font-size:12px;margin-bottom:8px}.galleryCardContent h4{font-size:25px;margin-bottom:8px}.galleryCardContent p{font-size:16px;line-height:1.55;color:#ddd;margin:0}.galleryUploadHint h4{font-size:26px}.galleryUploadHint p{font-size:17px}.galleryFeatureList{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.galleryFeatureList div{border:1px solid #333;border-radius:8px;background:rgba(0,0,0,.55);padding:14px;color:#ddd}.downloadsPagePro{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.downloadsHero{min-height:300px;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(70,0,0,.55),rgba(4,4,4,.98)),radial-gradient(circle at top right,rgba(255,0,0,.22),transparent 34%)}.downloadsHeroInner{max-width:920px}.downloadsHero h3{font-size:48px}.downloadsHero p{font-size:20px;line-height:1.7}.downloadsTitle{grid-column:1/-1;border-left:4px solid #b91410;background:linear-gradient(90deg,rgba(100,0,0,.28),rgba(0,0,0,0));padding:10px 14px;text-transform:uppercase;letter-spacing:.18em;color:#ff2119;font-weight:700}.downloadCard{min-height:320px;border:1px solid rgba(150,150,150,.42);border-radius:8px;background:linear-gradient(180deg,rgba(10,10,10,.96),rgba(3,3,3,.98));padding:20px;position:relative;overflow:hidden;box-shadow:inset 0 0 28px rgba(255,255,255,.035),0 0 18px rgba(0,0,0,.75);transition:.25s}.downloadCard:hover{transform:translateY(-3px);border-color:#8b0000;box-shadow:0 0 24px rgba(185,20,16,.18)}.downloadCard::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at top right,rgba(255,0,0,.12),transparent 40%);pointer-events:none}.downloadTop{position:relative;display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.downloadIcon{width:62px;height:62px;border:1px solid #8b0000;border-radius:10px;background:linear-gradient(180deg,#2a0505,#060606);display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 0 14px rgba(255,0,0,.18)}.downloadStatus{border:1px solid #333;border-radius:6px;padding:6px 10px;text-transform:uppercase;font-size:12px;letter-spacing:.08em;background:#050505;color:#ff2119}.downloadStatus.intern{color:#aaa;border-color:#555}.downloadStatus.vorbereitung{color:#ffd05c;border-color:#705200}.downloadCard h4{position:relative;font-size:28px}.downloadCard p{position:relative;font-size:16px;line-height:1.6;color:#ddd}.downloadActions{position:relative;display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.downloadActions button{border:0;border-radius:6px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;padding:10px 16px;font-family:'Oswald',Arial,sans-serif;font-weight:700;text-transform:uppercase;cursor:pointer}.downloadActions button.ghost{border:1px solid #8b0000;background:#070707}.downloadsInfoBox h4{font-size:26px}.downloadsFeatureGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.downloadsFeatureGrid div{border:1px solid #333;border-radius:8px;background:rgba(0,0,0,.55);padding:14px;color:#ddd}.contactPagePro{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.contactHero{min-height:310px;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(70,0,0,.55),rgba(4,4,4,.98)),radial-gradient(circle at top right,rgba(255,0,0,.22),transparent 34%)}.contactHeroInner{max-width:930px}.contactHero h3{font-size:48px}.contactHero p{font-size:20px;line-height:1.7}.joinPanel{display:grid;grid-template-columns:1.1fr .9fr;gap:20px;align-items:center;background:linear-gradient(135deg,rgba(90,0,0,.3),rgba(0,0,0,.95))}.joinBadge{display:inline-block;border:1px solid #8b0000;background:#070707;color:#ff2119;border-radius:6px;padding:7px 12px;text-transform:uppercase;font-weight:700;letter-spacing:.1em;margin-bottom:12px}.joinPanel h4{font-size:30px}.joinPanel p{font-size:17px;line-height:1.6}.joinRequirements{display:grid;grid-template-columns:1fr;gap:10px}.joinRequirements div{border:1px solid #333;border-radius:8px;background:rgba(0,0,0,.55);padding:14px;color:#ddd}.contactSectionTitle{grid-column:1/-1;border-left:4px solid #b91410;background:linear-gradient(90deg,rgba(100,0,0,.28),rgba(0,0,0,0));padding:10px 14px;text-transform:uppercase;letter-spacing:.18em;color:#ff2119;font-weight:700}.socialCard{min-height:300px;border:1px solid rgba(150,150,150,.42);border-radius:8px;background:linear-gradient(180deg,rgba(10,10,10,.96),rgba(3,3,3,.98));padding:24px;position:relative;overflow:hidden;box-shadow:inset 0 0 28px rgba(255,255,255,.035),0 0 18px rgba(0,0,0,.75);transition:.25s}.socialCard:hover{transform:translateY(-3px);border-color:#8b0000;box-shadow:0 0 24px rgba(185,20,16,.18)}.socialCard::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at top right,rgba(255,0,0,.12),transparent 40%);pointer-events:none}.socialIcon{position:relative;width:68px;height:68px;border:1px solid #8b0000;border-radius:12px;background:linear-gradient(180deg,#2a0505,#060606);display:flex;align-items:center;justify-content:center;color:#ff2119;font-size:34px;font-weight:700;margin-bottom:18px;box-shadow:0 0 14px rgba(255,0,0,.18)}.socialCard h4{position:relative;font-size:30px}.socialCard p{position:relative;font-size:17px;line-height:1.6;color:#ddd}.socialCard button{position:relative;border:0;border-radius:6px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;padding:10px 16px;font-family:'Oswald',Arial,sans-serif;font-weight:700;text-transform:uppercase;cursor:pointer;margin-top:14px}.contactInfoCard{min-height:300px}.contactInfoCard h4{font-size:30px}.contactInfoCard p{font-size:17px}.contactLine{border:1px solid #333;border-radius:8px;background:rgba(0,0,0,.55);padding:12px;margin-top:10px}.contactLine strong{display:block;color:#ef1b16;text-transform:uppercase;font-size:12px;letter-spacing:.08em}.contactLine span{color:#ddd}.contactFinal{text-align:center;background:linear-gradient(135deg,rgba(90,0,0,.3),rgba(0,0,0,.95))}.contactFinal h4{font-size:32px}.contactFinal p{font-size:18px;max-width:900px;margin:0 auto}
.orderSystem{height:100%;display:flex;flex-direction:column;gap:12px}.orderTopBar{display:flex;justify-content:space-between;align-items:center;gap:12px}.orderTopBar button,.orderSubmit,.adminForm button,.adminActive button,.passwordGrid button,.orderLoginForm button{border:0;border-radius:6px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;padding:10px 14px;font-family:'Oswald',Arial,sans-serif;font-weight:700;text-transform:uppercase;cursor:pointer}.orderDeadline{border:1px solid #8b0000;background:rgba(0,0,0,.62);border-radius:8px;padding:12px;text-align:center;box-shadow:0 0 16px rgba(255,0,0,.18)}.orderDeadline strong{display:block;color:#ff2119;text-transform:uppercase;letter-spacing:.08em}.orderDeadline span{display:block;margin-top:5px;font-weight:700}.orderDeadline small{display:block;color:#aaa;margin-top:3px}.orderDeadline.small{padding:8px 14px}.orderDeadline.closed{border-color:#ff1c15;background:rgba(120,0,0,.18)}.orderLayout{display:grid;grid-template-columns:minmax(350px,420px) minmax(0,1fr);gap:14px;min-height:0;flex:1}.orderFormPanel,.orderOverviewPanel{min-height:0;overflow:auto}.orderFormPanel h3,.orderOverviewPanel h3{margin:0;color:#ef1b16;text-transform:uppercase}.orderFormPanel p,.orderOverviewPanel p{font-size:15px;margin:6px 0 14px;color:#ddd}.orderFormPanel form{display:flex;flex-direction:column;gap:14px}.orderTwoCols{display:grid;grid-template-columns:1fr 1fr;gap:12px}.orderShirtGrid{display:grid;grid-template-columns:1fr 132px 58px;gap:10px}.orderTwoProductCols{display:grid;grid-template-columns:1fr 70px;gap:18px}.orderFormPanel label,.orderLoginForm label,.passwordPanel label{display:block;color:#f1f1f1;font-size:14px}.orderFormPanel input,.orderFormPanel select,.orderFormPanel textarea,.orderLoginForm input,.adminForm input,.passwordPanel input{width:100%;margin-top:5px;height:36px;border-radius:5px;border:1px solid #444;background:#050505;color:#fff;padding:0 10px;font-family:'Oswald',Arial,sans-serif}.orderFormPanel textarea{height:44px;padding-top:8px}.clothingProduct h4{margin:0 0 8px;font-size:18px;text-transform:uppercase}.clothingProduct small{color:#ccc;font-size:13px}.orderSizeRow{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.orderSizeRow span{min-width:28px;text-align:center;border:1px solid #333;border-radius:4px;padding:2px 5px;background:#050505;font-size:12px}.memberTotalBox{border:1px solid #8b0000;background:rgba(120,0,0,.18);border-radius:6px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:12px}.memberTotalBox strong{color:#ff2119;font-size:22px}.closedNotice{border:1px solid #8b0000;background:rgba(120,0,0,.22);color:#ffb7b7;border-radius:5px;padding:12px;text-align:center;font-weight:700;text-transform:uppercase}.orderOverviewPanel{display:flex;flex-direction:column}.orderOverviewHead{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #242424;padding-bottom:12px}.adminForm{display:grid;grid-template-columns:150px auto;gap:8px;align-items:start}.adminForm span,.orderError{color:#ff1c15;font-size:13px}.adminActive{display:flex;gap:8px}.passwordPanel{border-bottom:1px solid #242424;padding:12px 0}.passwordGrid{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:end}.passwordPanel p{color:#55ff7a}.orderTableWrap{overflow:auto;flex:1;min-height:200px}.orderTableWrap table{width:100%;border-collapse:collapse;font-size:13px}.orderTableWrap th,.orderTableWrap td{padding:8px;border-bottom:1px solid #242424;text-align:left;white-space:nowrap}.orderTableWrap th[colspan]{text-align:center}.price{color:#ff1610;font-weight:700}.noteCell{max-width:220px;white-space:normal;color:#ddd}.memberStatus{color:#55ff7a;font-weight:700}.delete{border:1px solid #b00000;color:#ff1610;background:transparent;border-radius:5px;padding:5px 7px;cursor:pointer}.empty{text-align:center;color:#aaa;padding:24px}.orderBottomCards{display:grid;grid-template-columns:1.15fr .95fr;gap:12px;padding-top:12px}.orderCard{border:1px solid #505050;border-radius:8px;background:rgba(0,0,0,.55);padding:16px}.orderCard h3{margin:0 0 12px;color:#f01b15;text-align:center}.orderSummary{display:grid;grid-template-columns:34px 1fr 70px 100px;gap:6px;align-items:center;margin-bottom:6px}.orderSummary em,.orderPrice em{font-style:normal}.orderTotal{display:flex;justify-content:space-between;border-top:1px solid #555;padding-top:10px;margin-top:10px;color:#f01b15;font-size:22px}.orderPrice{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #333}.orderLoginPanel{max-width:560px;margin:20px auto;border:1px solid #8b0000;border-radius:10px;background:radial-gradient(circle at top,#232323,#050505 65%,#000);padding:28px;text-align:center;box-shadow:0 0 42px rgba(160,0,0,.48)}.orderLoginPanel img{width:150px}.orderLoginPanel h3{color:#ef1b16;text-transform:uppercase}.orderLoginForm{display:flex;flex-direction:column;gap:14px;text-align:left}

.adminPage{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.adminLoginPanel{grid-column:1/-1;max-width:560px;margin:30px auto;text-align:center}.adminLoginPanel img{width:150px;filter:drop-shadow(0 0 12px rgba(255,0,0,.4));margin-bottom:10px}.adminLoginPanel h3,.adminHero h3{color:#ef1b16;text-transform:uppercase}.adminLoginPanel form{display:flex;flex-direction:column;gap:14px;text-align:left;margin-top:18px}.adminLoginPanel input,.adminEditCard input,.adminEditCard textarea{width:100%;margin-top:6px;border:1px solid #444;background:#050505;color:#fff;border-radius:5px;padding:10px;font-family:'Oswald',Arial,sans-serif}.adminEditCard textarea{min-height:110px;resize:vertical}.adminLoginPanel button,.adminActions button{border:0;border-radius:6px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;padding:12px 16px;font-family:'Oswald',Arial,sans-serif;font-weight:700;text-transform:uppercase;cursor:pointer}.adminError{color:#ff1c15;text-align:center}.adminHero{grid-column:1/-1;background:linear-gradient(135deg,rgba(70,0,0,.45),rgba(5,5,5,.98))}.adminHero p{font-size:18px;max-width:900px}.adminTabs{grid-column:1/-1;display:flex;gap:8px;flex-wrap:wrap}.adminTabs button{border:1px solid #333;background:#090909;color:#ddd;border-radius:6px;padding:9px 14px;font-family:'Oswald',Arial,sans-serif;text-transform:uppercase;cursor:pointer}.adminTabs button.active{border-color:#b91410;color:#fff;background:linear-gradient(180deg,#1a0505,#080808);box-shadow:0 0 12px rgba(255,0,0,.22)}.adminEditor{grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.adminEditor .fullWidth{grid-column:1/-1}.adminHint{border:1px solid #8b0000;background:rgba(120,0,0,.18);border-radius:6px;padding:10px;color:#ffb7b7!important}.imageUploadGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.imageUploadCard{border:1px solid #333;border-radius:8px;background:rgba(0,0,0,.55);padding:12px}.imageUploadCard strong{display:block;color:#ff2119;text-transform:uppercase;margin-bottom:8px}.imageUploadCard img,.imageEmpty{width:100%;height:150px;border:1px solid #333;border-radius:6px;object-fit:cover;background:#050505;display:flex;align-items:center;justify-content:center;color:#777;margin-bottom:10px}.imageUploadCard input{padding:8px;height:auto}.imageUploadCard span{display:block;color:#55ff7a;margin-top:6px}.adminEditCard h4{font-size:24px}.adminEditCard label{display:block;margin-top:12px;color:#ddd}.adminActions span{display:block;margin-top:12px;color:#55ff7a}.adminActions p{font-size:16px}@media(max-width:900px){.adminPage,.adminEditor{grid-template-columns:1fr}.imageUploadGrid{grid-template-columns:1fr}.adminTabs{flex-direction:column}.adminTabs button{width:100%;text-align:left}}

footer{border-top:1px solid #240000;background:#050505;color:#d0d0d0;text-align:center;padding:12px;font-family:'Rye',Georgia,serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;flex:0 0 auto}

@media(max-width:1000px){.site{overflow:auto}.hero{height:auto;min-height:210px}.logo{width:125px}.headline{padding-left:140px;padding-right:140px}.headline h1{font-size:48px}.headline h2{font-size:30px}.headline p{font-size:14px}.pageGrid,.twoColumns,.galleryGrid{grid-template-columns:1fr 1fr}.largePanel{grid-column:1/-1}.nav{justify-content:flex-start}}
@media(max-width:1000px){.contactPagePro{grid-template-columns:1fr 1fr}.contactHero,.joinPanel,.contactSectionTitle,.contactFinal{grid-column:1/-1}.joinPanel{grid-template-columns:1fr}.contactHero h3{font-size:38px}.contactHero p{font-size:18px}.downloadsPagePro{grid-template-columns:1fr 1fr}.downloadsHero,.downloadsTitle,.downloadsInfoBox{grid-column:1/-1}.downloadsFeatureGrid{grid-template-columns:1fr 1fr}.downloadsHero h3{font-size:38px}.downloadsHero p{font-size:18px}.galleryPagePro{grid-template-columns:1fr 1fr}.galleryHeroPro,.galleryIntro,.galleryUploadHint{grid-column:1/-1}.galleryFeatureList{grid-template-columns:1fr 1fr}.galleryHeroPro h3{font-size:38px}.galleryHeroPro p{font-size:18px}.eventsPage{grid-template-columns:1fr 1fr}.eventsHero,.nextEvent,.eventsSectionTitle,.eventInfoBox{grid-column:1/-1}.nextEventContent{grid-template-columns:1fr}.eventFeatureGrid{grid-template-columns:1fr 1fr}.eventsHero h3{font-size:38px}.eventsHero p{font-size:18px}.teamPagePro{grid-template-columns:1fr 1fr}.teamCommandHero,.chainPanel{grid-column:1/-1}.chainPanel{grid-template-columns:1fr}.chainLine{grid-template-columns:repeat(3,1fr)}.teamHeroInner h3{font-size:38px}.teamHeroInner p{font-size:18px}.aboutPage{grid-template-columns:1fr 1fr}.aboutHero,.missionPanel,.aboutQuote,.aboutStory{grid-column:1/-1}.missionPanel{grid-template-columns:1fr}.aboutContent h3{font-size:38px}.aboutContent p{font-size:18px}}

@media(max-width:700px){.hero{min-height:250px}.logo{width:105px}.logo.right{display:none}.headline{padding:120px 12px 20px}.headline h1{font-size:34px;white-space:normal}.headline h2{font-size:23px;letter-spacing:.12em}.headline p{min-width:0;width:100%;font-size:12px;letter-spacing:.1em;white-space:normal}.mobileMenuButton{display:block}.nav{display:none;flex-direction:column;align-items:stretch;padding:10px}.nav.open{display:flex}.nav button{width:100%;text-align:left}.content{padding:10px}.pageGrid,.twoColumns,.galleryGrid{grid-template-columns:1fr}.panel{padding:16px}.panel h3{font-size:25px}.panel p,.panel ul{font-size:16px}.galleryItem{min-height:130px}.startPageClassic{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1500px;margin:0 auto}.classicHero{grid-column:span 2;background:linear-gradient(135deg,rgba(70,0,0,.45),rgba(5,5,5,.98)),radial-gradient(circle at top right,rgba(255,0,0,.16),transparent 35%);min-height:310px}.classicHero h3{font-size:42px;max-width:850px}.classicHero p{font-size:19px;line-height:1.65;max-width:850px}.classicInfo{min-height:190px}.classicInfo h4{font-size:23px}.classicInfo p{font-size:17px}.classicWide{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:center;background:linear-gradient(135deg,rgba(90,0,0,.26),rgba(0,0,0,.96))}.classicWide h4{font-size:28px}.classicWide p{font-size:17px}.classicQuickGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.classicQuickGrid button,.buttonRow button{border:0;border-radius:6px;background:linear-gradient(180deg,#fa2a23,#b70d09);color:#fff;padding:12px 18px;font-family:'Oswald',Arial,sans-serif;font-size:16px;text-transform:uppercase;cursor:pointer}.buttonRow button.ghost{border:1px solid #8b0000;background:#070707}.classicQuickGrid button{border:1px solid #8b0000;background:#070707}.classicQuickGrid button:hover,.buttonRow button:hover{filter:brightness(1.15)}@media(max-width:1000px){.startPageClassic{grid-template-columns:1fr 1fr}.classicHero,.classicWide{grid-column:1/-1}.classicHero h3{font-size:34px}.classicHero p{font-size:17px}}@media(max-width:700px){.startPageClassic{grid-template-columns:1fr}.classicHero,.classicInfo,.classicWide{grid-column:1/-1}.classicWide{grid-template-columns:1fr}.classicQuickGrid{grid-template-columns:1fr}.classicHero h3{font-size:28px}.classicHero p,.classicInfo p,.classicWide p{font-size:16px}.buttonRow{flex-direction:column}.buttonRow button{width:100%}}footer{font-size:9px;letter-spacing:.1em}.contactPagePro{grid-template-columns:1fr}.contactHero,.joinPanel,.socialCard,.contactInfoCard,.contactFinal{grid-column:1/-1}.contactHero h3{font-size:30px}.contactHero p{font-size:16px}.joinPanel h4,.socialCard h4,.contactInfoCard h4,.contactFinal h4{font-size:24px}.downloadsPagePro{grid-template-columns:1fr}.downloadsHero,.downloadsTitle,.downloadCard,.downloadsInfoBox{grid-column:1/-1}.downloadsHero h3{font-size:30px}.downloadsHero p{font-size:16px}.downloadsFeatureGrid{grid-template-columns:1fr}.galleryPagePro{grid-template-columns:1fr}.galleryHeroPro,.galleryIntro,.galleryCardPro,.galleryUploadHint{grid-column:1/-1}.galleryHeroPro h3{font-size:30px}.galleryHeroPro p{font-size:16px}.galleryFeatureList{grid-template-columns:1fr}.galleryImagePlaceholder{height:170px}.eventsPage{grid-template-columns:1fr}.eventsHero,.nextEvent,.eventCard,.eventInfoBox{grid-column:1/-1}.eventsHero h3{font-size:30px}.eventsHero p{font-size:16px}.eventFeatureGrid{grid-template-columns:1fr}.nextEventContent h4{font-size:24px}.eventCountdownPlaceholder strong{font-size:22px}.teamPagePro{grid-template-columns:1fr}.teamCommandHero,.chainPanel,.rankCardPro{grid-column:1/-1}.chainLine{grid-template-columns:1fr 1fr}.teamHeroInner h3{font-size:30px}.teamHeroInner p{font-size:16px}.rankCardPro{min-height:auto}.rankTitle{font-size:22px}.rankShort{width:52px;height:52px}.memberCardPro{align-items:center}.aboutPage{grid-template-columns:1fr}.aboutContent h3{font-size:30px}.aboutContent p{font-size:16px}.aboutStory,.valueCard,.missionPanel,.aboutQuote{grid-column:1/-1}.aboutQuote blockquote{font-size:20px;padding:0 10px}}
`;
