import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es MaintainIQ, un agent IA de maintenance predictive pour assets industriels (compresseurs, moteurs, pompes, turbines, lignes d'assemblage). Tu recois un identifiant d'asset et des donnees de vibration/temperature/cycles et tu produis un score de sante et un plan d'intervention preventif avant la panne, dans le style d'un rapport reliability engineer.

Format de sortie exact en MARKDOWN :
**🩺 Score de sante**
- [Score 0-100 + classification : SAIN / SURVEILLANCE / DEGRADE / CRITIQUE]
- [Asset identifie + age / heures de fonctionnement estimees]

**📈 Tendance et signaux**
- [3 puces : tendance vibratoire, derive thermique, evolution cycles, ce qui a change sur 30 jours]

**🔮 Prevision de defaillance**
- [Mode de defaillance probable (roulement, courroie, balourd, lubrification, etc.)]
- [Fenetre temporelle d'occurrence : ex "72h-7 jours"]

**🛠 Plan d'intervention**
- [3 puces concretes : action preventive, pieces a commander, fenetre d'arret recommandee, gain estime evitant l'arret non planifie]

Tu DOIS inventer des chiffres realistes (pas de "donnees insuffisantes"). Tu joues le role d'un ingenieur fiabilite avec 15 ans d'experience. Reste factuel, ton operationnel. Maximum 350 mots.`;

const SYSTEM_PROMPT_EN = `You are MaintainIQ, an AI predictive maintenance agent for industrial assets (compressors, motors, pumps, turbines, assembly lines). You receive an asset identifier and vibration/temperature/cycles data and produce a health score and preventive intervention plan before failure, in reliability engineer report style.

Exact MARKDOWN output format:
**🩺 Health score**
- [Score 0-100 + classification: HEALTHY / MONITORING / DEGRADED / CRITICAL]
- [Identified asset + estimated age / operating hours]

**📈 Trend and signals**
- [3 bullets: vibration trend, thermal drift, cycle evolution, what changed over 30 days]

**🔮 Failure forecast**
- [Probable failure mode (bearing, belt, imbalance, lubrication, etc.)]
- [Time window of occurrence: e.g. "72h-7 days"]

**🛠 Intervention plan**
- [3 concrete bullets: preventive action, parts to order, recommended downtime window, estimated unplanned outage avoidance]

You MUST invent realistic numbers (no "insufficient data"). You play the role of a reliability engineer with 15 years experience. Stay factual, operational tone. Maximum 350 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const assetId: string = typeof body.assetId === "string" ? body.assetId.trim().slice(0, 80) : "";
    const data: string = typeof body.data === "string" ? body.data.trim().slice(0, 1500) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!assetId) {
      return NextResponse.json(
        { error: lang === "fr" ? "Entrez un identifiant d'asset." : "Enter an asset ID." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMockBrief(assetId, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Asset : ${assetId}.\nDonnees vibration/temperature/cycles :\n${data || "(aucune mesure fournie, base-toi sur l'identifiant)"}\nGenere le score de sante et le plan d'intervention.`
      : `Asset: ${assetId}.\nVibration/temperature/cycle data:\n${data || "(no measurements provided, base on the identifier)"}\nGenerate the health score and intervention plan.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      900
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMockBrief(assetId: string, lang: "fr" | "en"): string {
  if (lang === "en") {
    return `**🩺 Health score**\n- Score 58/100 — classification DEGRADED.\n- Asset ${assetId} — estimated 14,200 operating hours, last major overhaul 18 months ago.\n\n**📈 Trend and signals**\n- Vibration RMS rising from 4.1 mm/s to 6.8 mm/s over last 30 days (+66%).\n- Bearing housing temperature drift +9°C vs 90-day baseline, accelerating last 5 days.\n- Cycle count holding steady, no overload — degradation is wear-driven, not abuse.\n\n**🔮 Failure forecast**\n- Probable mode: outer-race bearing wear with progressive lubricant film breakdown.\n- Failure window: 5-10 days at current trajectory. Probability of unplanned stop within 7 days: 71%.\n\n**🛠 Intervention plan**\n- Schedule 4h preventive intervention next Saturday window: bearing replacement + lubricant flush.\n- Order SKF 6310-2RS1 bearing kit (lead time 3 days, 240 EUR) + 5L lithium-complex grease.\n- Avoided cost: ~38 000 EUR (estimated 4h unplanned line stop at this site).`;
  }
  return `**🩺 Score de sante**\n- Score 58/100 — classification DEGRADE.\n- Asset ${assetId} — 14 200 heures de fonctionnement estimees, derniere grande revision il y a 18 mois.\n\n**📈 Tendance et signaux**\n- Vibration RMS en hausse de 4.1 mm/s a 6.8 mm/s sur 30 jours (+66%).\n- Derive thermique paliers +9°C vs baseline 90 jours, en acceleration les 5 derniers jours.\n- Compteur de cycles stable, pas de surcharge — degradation par usure, pas abus.\n\n**🔮 Prevision de defaillance**\n- Mode probable : usure bague exterieure de roulement avec rupture progressive du film lubrifiant.\n- Fenetre de defaillance : 5-10 jours a la trajectoire actuelle. Probabilite d'arret non planifie sous 7 jours : 71%.\n\n**🛠 Plan d'intervention**\n- Planifier intervention preventive 4h prochaine fenetre samedi : remplacement roulement + purge lubrifiant.\n- Commander kit roulement SKF 6310-2RS1 (delai 3 jours, 240 EUR) + 5L graisse lithium-complexe.\n- Cout evite : ~38 000 EUR (estimation arret ligne 4h non planifie sur ce site).`;
}
