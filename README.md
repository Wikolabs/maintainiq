# MaintainIQ — GMAO intelligente avec planification automatique des maintenances

> Finis les maintenances oubliées. Vos techniciens au bon endroit, au bon moment.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis)](https://redis.io)

---

## Vue d'ensemble

MaintainIQ est une GMAO (Gestion de Maintenance Assistée par Ordinateur) nouvelle génération, enrichie par IA. Elle gère les équipements, les bons de travail, les plannings techniciens, et les stocks de pièces. L'IA optimise automatiquement les tournées de maintenance préventive, prédit les besoins en pièces de rechange, et génère des diagnostics d'intervention via LLM à partir de l'historique machine.

**Domaine :** CMMS / Maintenance Management / Field Service  
**Port VM :** 3031 | **Sous-domaine :** maintainiq.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Planning, work orders, dashboard KPIs |
| Backend | FastAPI (Python 3.11), Uvicorn | API GMAO, scheduling, IA |
| Scheduling | OR-Tools (Google) | Optimisation tournées techniciens |
| Forecasting | Prophet (Facebook) | Prédiction consommation pièces |
| LLM | Groq (llama-3.1-70b) | Diagnostic et procédure intervention |
| Mobile | PWA (Next.js) | Terrain : check-lists, signature, photos |
| Base de données | PostgreSQL 16 | Assets, WO, stocks, historique |
| Cache | Redis 7 | Planning temps réel, notifications |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3031) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
ortools==9.10.4067
prophet==1.1.5
groq==0.9.0
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
redis==5.0.4
pydantic==2.7.1
pandas==2.2.2
icalendar==5.0.12
qrcode==7.4.2
```

---

## Architecture mono-repo

```
maintainiq/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx              # Dashboard KPIs maintenance
│   │   ├── work-orders/          # Gestion bons de travail
│   │   ├── assets/               # Registre équipements
│   │   ├── planning/             # Planning techniciens (Gantt)
│   │   ├── inventory/            # Stocks pièces + prédiction
│   │   └── mobile/               # PWA terrain
│   └── src/components/
│       ├── GanttPlanning.tsx     # Planning Gantt techniciens
│       ├── WorkOrderCard.tsx     # BT avec statut + historique
│       ├── AssetTimeline.tsx     # Historique maintenances asset
│       ├── InventoryAlert.tsx    # Stock critique + prédiction
│       └── DiagnosticChat.tsx    # LLM diagnostic assistant
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── work_orders.py    # CRUD BT + assignation
│   │   │   ├── assets.py         # Registre équipements
│   │   │   ├── planning.py       # Planning + optimisation
│   │   │   ├── inventory.py      # Stocks + prévisions
│   │   │   └── diagnostic.py     # LLM diagnostic
│   │   ├── services/
│   │   │   ├── scheduler.py      # OR-Tools route optimization
│   │   │   ├── parts_predictor.py# Prophet stock forecasting
│   │   │   ├── diagnostic_llm.py # Groq diagnosis generation
│   │   │   └── pm_generator.py   # Génération PM schedule
│   │   └── models/
│   │       └── work_order.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0d3349', 'primaryTextColor': '#00bcd4', 'primaryBorderColor': '#00bcd4', 'lineColor': '#374151', 'secondaryColor': '#0a2538'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3031)"]
        NEXT["Next.js 14\nGMAO Dashboard"]
        API["FastAPI"]

        subgraph AI["🧠 IA Engine"]
            ORTOOLS["OR-Tools\nTournée optimisation"]
            PROPHET["Prophet\nPrévision consommation pièces"]
            GROQ["Groq LLM\nDiagnostic + procédures"]
            PM["PM Generator\nPlanification préventive"]
        end

        PG[("PostgreSQL\nAssets + WO + Stocks")]
        REDIS[("Redis\nPlanning cache")]
    end

    TECH["Techniciens\nPWA mobile"] --> NEXT
    IOT["IoT Sensors\nHeures machine"] --> API
```

### Séquence — Génération BT et optimisation planning

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0d3349', 'primaryTextColor': '#00bcd4', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant IOT as IoT Sensor
    participant API as FastAPI
    participant PM as PM Generator
    participant ORT as OR-Tools
    participant GROQ as Groq LLM
    participant TECH as Technicien (PWA)

    IOT->>API: PUT /assets/pompe-01/hours {runtime_hours: 1000}

    Note over API: Seuil PM atteint : 1000h → Révision périodique
    API->>PM: generate_work_order(asset="pompe-01", trigger="hours_1000")
    PM-->>API: {wo_id: "WO-2847", type: "PM", priority: "MEDIUM", estimated_duration: 2h, required_parts: ["joint_mécanique×2", "huile_hydraulique_5L"]}

    API->>API: check_inventory(parts=["joint_mécanique", "huile_hydraulique_5L"])
    Note over API: joint_mécanique: 0 en stock → commande déclenchée

    API->>ORT: optimize_schedule(technicians=5, work_orders=23, skills_matrix, locations)
    Note over ORT: Minimise déplacements + respecte compétences + contraintes horaires
    ORT-->>API: {schedule: [{technician: "Martin", wo: "WO-2847", slot: "2026-05-28 08:00", travel_min: 12}...]}

    API->>GROQ: generate_diagnostic(asset="pompe-01", maintenance_history, failure_modes)
    GROQ-->>API: {procedure: "1. Couper alimentation. 2. Vidanger circuit. 3. Remplacer joint côté refoulement...", safety_notes: "EPI: gants anti-chaleur, lunettes", estimated_parts: ["joint_mécanique_60mm"]}

    API->>TECH: push_notification(wo_id="WO-2847", scheduled_at="2026-05-28 08:00", location="Pompe P1 Hall A")

    TECH->>API: GET /work-orders/WO-2847/diagnostic
    API-->>TECH: {procedure, checklist, parts_qr_codes, photos_required: ["avant_intervention", "après_intervention"]}

    TECH->>API: PUT /work-orders/WO-2847/complete {checklist_items: [...], duration_actual_min: 95, photos: [...], signature}
    API-->>TECH: {wo_closed: true, next_pm_date: "2027-05-28"}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0d3349', 'primaryTextColor': '#00bcd4', 'lineColor': '#374151'}}}%%
erDiagram
    ASSET {
        uuid id PK
        string name
        string asset_type
        string location
        string manufacturer
        string model_ref
        int runtime_hours
        string status
        timestamp installed_at
        timestamp last_pm_at
    }
    WORK_ORDER {
        uuid id PK
        uuid asset_id FK
        uuid technician_id FK
        string wo_number
        string type
        string priority
        string status
        int estimated_minutes
        int actual_minutes
        text description
        text diagnostic_llm
        timestamp scheduled_at
        timestamp completed_at
    }
    TECHNICIAN {
        uuid id PK
        string name
        string[] skills
        string zone
        boolean available
        jsonb calendar
    }
    SPARE_PART {
        uuid id PK
        string reference
        string name
        int stock_quantity
        int reorder_point
        float unit_cost
        string supplier
    }
    WO_PARTS {
        uuid wo_id FK
        uuid part_id FK
        int quantity_used
        float total_cost
    }

    ASSET ||--o{ WORK_ORDER : "triggers"
    TECHNICIAN ||--o{ WORK_ORDER : "executes"
    WORK_ORDER }o--o{ SPARE_PART : "consumes"
```

---

## PRD

### Problème
Les GMAO traditionnelles (SAP PM, Maximo) sont complexes, coûteuses, et non adaptées aux PME industrielles. Les maintenances préventives sont mal planifiées (créneaux sous-optimaux, techniciens en déplacement inutile), les stocks de pièces détachées sont gérés à l'instinct, et les diagnostics restent dans la tête des experts seniors.

### Solution
MaintainIQ simplifie la GMAO avec une UX moderne, automatise la planification des PM (OR-Tools), prédit les besoins en pièces (Prophet), et capture le savoir-faire des experts via diagnostics LLM. Le technicien n'a plus qu'une PWA mobile avec ses instructions.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Responsable Maintenance | Planifier les PM, suivre les BT, gérer les stocks |
| Technicien | Recevoir ses BT, accéder aux procédures, pointer son temps |
| Directeur Technique | KPIs MTTR/MTBF, budget maintenance, disponibilité machines |

### OKRs
- MTTR (Mean Time To Repair) : -30%
- Ruptures de stock pièces critiques : -80%
- Taux réalisation PM planifiées : > 95%

---

## User Stories

```
US-01 [Responsable] En tant que responsable maintenance,
      je veux que le système génère automatiquement les bons de travail PM
      quand une machine atteint son seuil d'heures ou de date
      afin de ne jamais oublier une maintenance préventive.

US-02 [Responsable] En tant que responsable maintenance,
      je veux voir le planning hebdomadaire de mes 5 techniciens
      optimisé pour minimiser les déplacements
      avec les bonnes compétences affectées aux bons BT
      afin d'améliorer la productivité de l'équipe.

US-03 [Technicien] En tant que technicien terrain,
      je veux avoir sur mon téléphone la procédure d'intervention
      générée automatiquement à partir de l'historique de la machine
      afin d'intervenir même sur un équipement que je ne connais pas.

US-04 [Responsable] En tant que responsable maintenance,
      je veux voir une alerte quand un stock de pièces critiques
      est prédit pour rupture dans les 30 jours
      afin de commander avant d'être bloqué.

US-05 [Directeur] En tant que directeur technique,
      je veux voir le MTBF et MTTR par machine
      et leur évolution sur 12 mois
      afin de justifier les investissements en maintenance.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Déclencheurs PM | Calendaire (J/M/A) ou compteur (heures, cycles, km) | ✅ Trigger config |
| R2 | Priorités BT | P1 Urgence (4h), P2 Haute (24h), P3 Normale (72h), P4 Planifiée | ✅ Priority badge |
| R3 | Optimisation tournée | OR-Tools VRP : min déplacement + respect compétences + dispo | ✅ Route viz |
| R4 | MTTR / MTBF | Calculés automatiquement sur historique complet | ✅ KPI cards |
| R5 | Check-list | Chaque type d'intervention = modèle de check-list | ✅ Checklist builder |
| R6 | Photos obligatoires | Avant et après intervention selon config | ✅ Photo gate |
| R7 | Signature mobile | Signature technicien PWA pour clôture BT | ✅ Signature pad |
| R8 | Stock min-max | Réapprovisionnement auto quand stock ≤ point de commande | ✅ Reorder alert |
| R9 | Expertise capture | Diagnostic LLM sur base historique pannes machine | ✅ LLM diagnostic |
| R10 | Historique complet | Toutes les interventions, coûts, pièces par asset | ✅ Asset history |

---

## Spécification API

**Base URL :** `http://maintainiq.wikolabs.com/api/v1`

### POST /work-orders/generate-pm
```json
{"asset_id": "a_xyz", "trigger_type": "hours", "trigger_value": 1000}
// Response: {"wo_id": "WO-2847", "type": "PM", "priority": "MEDIUM", "required_parts": ["joint_mécanique×2"], "estimated_minutes": 120}
```

### POST /planning/optimize
```json
{"week": "2026-W22", "technician_ids": ["t_01", "t_02", "t_03"]}
// Response: {"schedule": [{"technician": "Martin", "work_orders": ["WO-2847", "WO-2851"], "total_travel_minutes": 45, "utilization_pct": 87}]}
```

### GET /work-orders/{id}/diagnostic
```json
// Response: {"procedure_steps": [...], "safety_notes": "...", "checklist": [...], "estimated_parts": [...], "similar_past_interventions": 3}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Gantt Planning** | Calendrier semaine avec BT par technicien, drag-and-drop |
| **Work Order Card** | BT avec statut, pièces, durée estimée, diagnostic LLM |
| **Asset Timeline** | Historique chronologique toutes interventions + coûts |
| **Inventory Alert** | Liste pièces en alerte stock avec prédiction rupture |
| **MTTR/MTBF Chart** | Recharts évolution 12 mois par famille d'équipements |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: maintainiq, POSTGRES_USER: mq_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
  redis:
    image: redis:7-alpine
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://mq_user:${POSTGRES_PASSWORD}@postgres/maintainiq
      GROQ_API_KEY: "${GROQ_API_KEY}"
      REDIS_URL: redis://redis:6379
    depends_on: [postgres, redis]
    expose: ["8000"]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3031:80"]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] Registre assets + BT
- [ ] Planning manuel techniciens
- [ ] Mobile PWA (liste BT + check-list)

### Phase 2 — IA
- [ ] OR-Tools planification optimisée
- [ ] Diagnostic LLM (Groq)
- [ ] Prédiction stock (Prophet)

### Phase 3 — Connectivité
- [ ] Intégration IoT (heures machine auto)
- [ ] Intégration ERP (SAP, Odoo)
- [ ] Marketplace modules métiers (électricité, CVC, process)

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
