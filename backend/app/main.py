"""MaintainIQ demo backend — production-ready POC.

In production: this service would ingest historical sensor data, run RUL
(remaining useful life) regression models, and emit work orders to a CMMS.
For the demo: it only invokes the LLM and returns the brief.
"""
from datetime import datetime, timezone
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="MaintainIQ Demo Backend",
    description="POC backend — Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es MaintainIQ, un agent IA de maintenance predictive pour assets industriels (compresseurs, moteurs, pompes, turbines, lignes d'assemblage). Tu recois un identifiant d'asset et des donnees de vibration/temperature/cycles et tu produis un score de sante et un plan d'intervention preventif avant la panne, dans le style d'un rapport reliability engineer.

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

Tu DOIS inventer des chiffres realistes (pas de "donnees insuffisantes"). Tu joues le role d'un ingenieur fiabilite avec 15 ans d'experience. Reste factuel, ton operationnel. Maximum 350 mots."""

SYSTEM_PROMPT_EN = """You are MaintainIQ, an AI predictive maintenance agent for industrial assets (compressors, motors, pumps, turbines, assembly lines). You receive an asset identifier and vibration/temperature/cycles data and produce a health score and preventive intervention plan before failure, in reliability engineer report style.

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

You MUST invent realistic numbers (no "insufficient data"). You play the role of a reliability engineer with 15 years experience. Stay factual, operational tone. Maximum 350 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    asset_id: str = Field(..., min_length=1, max_length=80)
    telemetry: Optional[str] = Field(default="", max_length=1500)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "maintainiq-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    asset_id = req.asset_id.strip()
    data = (req.telemetry or "").strip()
    if not asset_id:
        raise HTTPException(status_code=400, detail="missing_asset_id")

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = (
        f"Asset : {asset_id}.\nDonnees vibration/temperature/cycles :\n{data or '(aucune mesure fournie, base-toi sur l identifiant)'}\nGenere le score de sante et le plan d'intervention."
        if req.lang == "fr"
        else f"Asset: {asset_id}.\nVibration/temperature/cycle data:\n{data or '(no measurements provided, base on the identifier)'}\nGenerate the health score and intervention plan."
    )

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(asset_id, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception:
        return GenerateResponse(
            brief=_build_mock_brief(asset_id, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief (used when no LLM key configured)
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(asset_id: str, lang: str) -> str:
    if lang == "en":
        return (
            f"**🩺 Health score**\n"
            f"- Score 58/100 — classification DEGRADED.\n"
            f"- Asset {asset_id} — estimated 14,200 operating hours, last major overhaul 18 months ago.\n\n"
            f"**📈 Trend and signals**\n"
            f"- Vibration RMS rising from 4.1 mm/s to 6.8 mm/s over last 30 days (+66%).\n"
            f"- Bearing housing temperature drift +9°C vs 90-day baseline, accelerating last 5 days.\n"
            f"- Cycle count holding steady, no overload — degradation is wear-driven, not abuse.\n\n"
            f"**🔮 Failure forecast**\n"
            f"- Probable mode: outer-race bearing wear with progressive lubricant film breakdown.\n"
            f"- Failure window: 5-10 days at current trajectory. Probability of unplanned stop within 7 days: 71%.\n\n"
            f"**🛠 Intervention plan**\n"
            f"- Schedule 4h preventive intervention next Saturday window: bearing replacement + lubricant flush.\n"
            f"- Order SKF 6310-2RS1 bearing kit (lead time 3 days, 240 EUR) + 5L lithium-complex grease.\n"
            f"- Avoided cost: ~38 000 EUR (estimated 4h unplanned line stop at this site)."
        )
    return (
        f"**🩺 Score de sante**\n"
        f"- Score 58/100 — classification DEGRADE.\n"
        f"- Asset {asset_id} — 14 200 heures de fonctionnement estimees, derniere grande revision il y a 18 mois.\n\n"
        f"**📈 Tendance et signaux**\n"
        f"- Vibration RMS en hausse de 4.1 mm/s a 6.8 mm/s sur 30 jours (+66%).\n"
        f"- Derive thermique paliers +9°C vs baseline 90 jours, en acceleration les 5 derniers jours.\n"
        f"- Compteur de cycles stable, pas de surcharge — degradation par usure, pas abus.\n\n"
        f"**🔮 Prevision de defaillance**\n"
        f"- Mode probable : usure bague exterieure de roulement avec rupture progressive du film lubrifiant.\n"
        f"- Fenetre de defaillance : 5-10 jours a la trajectoire actuelle. Probabilite d'arret non planifie sous 7 jours : 71%.\n\n"
        f"**🛠 Plan d'intervention**\n"
        f"- Planifier intervention preventive 4h prochaine fenetre samedi : remplacement roulement + purge lubrifiant.\n"
        f"- Commander kit roulement SKF 6310-2RS1 (delai 3 jours, 240 EUR) + 5L graisse lithium-complexe.\n"
        f"- Cout evite : ~38 000 EUR (estimation arret ligne 4h non planifie sur ce site)."
    )
