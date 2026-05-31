"use client";
import { useState } from "react";

const PRODUCT = "MaintainIQ";

const PAL = {
  bg: "#FFFBEB",
  bg2: "#FDF6D8",
  surface: "rgba(0,0,0,0.035)",
  surfaceHover: "rgba(0,0,0,0.06)",
  border: "rgba(0,0,0,0.10)",
  txt1: "#1F1408",
  txt2: "#5A4520",
  txt3: "#9A8855",
  accent: "#92400E",
  accentSoft: "rgba(146,64,14,0.10)",
  accentBorder: "rgba(146,64,14,0.30)",
  accentGlow: "rgba(146,64,14,0.15)",
  navBg: "rgba(255,251,235,0.85)",
};

const SAMPLE_FR = `vibration_rms_mm_s_7d: [4.1, 4.4, 4.8, 5.2, 5.6, 6.2, 6.8]
bearing_temp_c_7d: [62, 63, 64, 65, 67, 69, 71]
operating_hours_total: 14200
cycles_30d: 18420
last_overhaul_months: 18`;

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [assetId, setAssetId] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState("");
  const [usedModel, setUsedModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " — score de sante asset et plan de maintenance preventive",
    desc: "Entrez un identifiant d'asset (compresseur, moteur, pompe...) et collez ses dernieres mesures de vibration/temperature. L'agent IA produit un score de sante et un plan d'intervention avant la panne. Aucun service externe contacte — c'est un POC qui montre la logique de production.",
    inputLabel: "Asset et donnees", assetLabel: "Identifiant asset", assetPh: "ex: PUMP-A12, MOTOR-LINE3-B",
    dataLabel: "Telemetrie (optionnel)", loadSample: "Charger un exemple",
    generate: "Calculer le score de sante", generating: "Calcul en cours...",
    briefTitle: "Rapport de maintenance", emptyHint: "Le rapport s'affiche ici une fois genere.",
    createWo: "Creer ordre de travail SAP", scheduleSlot: "Reserver creneau GMAO",
    woMock: "Ordre de travail WO-2026-0817 cree dans SAP PM (mode demo, pas de connexion ERP reelle)",
    slotMock: "Creneau reserve samedi 06h00-10h00 dans GMAO Maximo (mode demo, pas de calendrier reel)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC — aucune connexion reelle a SAP PM, IBM Maximo, capteur Modbus. L'IA estime un score credible pour la demonstration.",
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " — asset health score and preventive maintenance plan",
    desc: "Enter an asset ID (compressor, motor, pump...) and paste its latest vibration/temperature measurements. The AI agent produces a health score and pre-failure intervention plan. No external service contacted — this is a POC showing the production logic.",
    inputLabel: "Asset and data", assetLabel: "Asset ID", assetPh: "e.g. PUMP-A12, MOTOR-LINE3-B",
    dataLabel: "Telemetry (optional)", loadSample: "Load sample",
    generate: "Compute health score", generating: "Computing...",
    briefTitle: "Maintenance report", emptyHint: "The report will appear here once generated.",
    createWo: "Create SAP work order", scheduleSlot: "Reserve CMMS slot",
    woMock: "Work order WO-2026-0817 created in SAP PM (demo mode, no real ERP connection)",
    slotMock: "Slot reserved Saturday 6am-10am in Maximo CMMS (demo mode, no real calendar)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC — no real connection to SAP PM, IBM Maximo, Modbus sensors. The AI estimates a credible score for demonstration.",
  };

  async function generate() {
    setError(""); setBrief(""); setUsedModel(""); setStaticMode(false);
    if (!assetId.trim()) {
      setError(lang === "fr" ? "Entrez un identifiant d'asset." : "Enter an asset ID.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, data, lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setBrief(j.mockBrief || "");
        setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setBrief(j.brief || "");
        setUsedModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: #FFFFFF; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; }
        .wk-textarea { width: 100%; padding: 12px 14px; border-radius: 10px; background: #FFFFFF; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: 'SF Mono', Menlo, monospace; font-size: 12px; min-height: 160px; resize: vertical; transition: border-color .2s; }
        .wk-textarea:focus { outline: none; border-color: ${PAL.accent}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #FFFFFF; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: #FFFFFF; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-link { background: transparent; color: ${PAL.accent}; border: none; padding: 0; font-size: 12px; cursor: pointer; font-family: inherit; text-decoration: underline; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← {t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: "#FFFFFF" }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} · <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 24 }}>
          <section style={{ background: "#FFFFFF", border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 14px" }}>{t.inputLabel}</h2>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: PAL.txt3, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>{t.assetLabel}</label>
              <input className="wk-input" value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder={t.assetPh} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ color: PAL.txt3, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{t.dataLabel}</label>
                <button className="wk-link" onClick={() => setData(SAMPLE_FR)}>{t.loadSample}</button>
              </div>
              <textarea className="wk-textarea" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center", marginTop: 14 }}>
              {loading ? `⏳ ${t.generating}` : `✨ ${t.generate}`}
            </button>
            {error && <div style={{ marginTop: 12, color: "#B91C1C", fontSize: 13, padding: "8px 12px", background: "rgba(185,28,28,0.06)", border: "1px solid rgba(185,28,28,0.25)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: brief ? "#16A34A" : PAL.txt3 }} />
                {t.briefTitle}
              </h2>
              {usedModel && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {usedModel}</span>}
            </div>

            {!brief ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>
                {t.emptyHint}
              </div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} />
            )}

            {brief && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.woMock)}>📋 {t.createWo}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.slotMock)}>📅 {t.scheduleSlot}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}
