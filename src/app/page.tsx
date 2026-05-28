export default function MaintainIQ() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-orange-50/95 backdrop-blur border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#9a3412" }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "var(--font-display)", color: "#431407" }}>MaintainIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#9a3412" }}>
            <a href="#signaux" className="hover:opacity-70 transition-opacity">Signaux capteurs</a>
            <a href="#machines" className="hover:opacity-70 transition-opacity">Machines</a>
            <a href="#roi" className="hover:opacity-70 transition-opacity">ROI</a>
          </div>
          <a href="#cta" className="text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors" style={{ background: "#9a3412" }}>
            Démarrer la démo
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border" style={{ background: "#ffedd5", borderColor: "#fed7aa", color: "#9a3412" }}>
            ⚙️ Maintenance prédictive industrielle — IA temps réel
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "var(--font-display)", color: "#431407" }}>
            Zéro panne imprévue.<br />
            <span style={{ color: "#9a3412" }}>72h d&apos;avance garanties.</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: "#7c2d12" }}>
            MaintainIQ analyse en continu vibrations, température et courant de vos machines. L&apos;IA prédit les défaillances avant qu&apos;elles coûtent — et planifie la maintenance automatiquement.
          </p>

          {/* Dashboard mockup */}
          <div className="bg-white rounded-3xl shadow-xl border p-6 max-w-3xl mx-auto mb-12" style={{ borderColor: "#fed7aa", boxShadow: "0 20px 60px rgba(154,52,18,0.12)" }}>
            <div className="flex items-center justify-between mb-5">
              <span className="font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>MaintainIQ — Santé machines</span>
              <span className="text-xs bg-green-50 border border-green-200 text-green-600 px-2.5 py-1 rounded-full font-semibold">● Surveillance active</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Compresseur A-12", score: 28, status: "Critique", statusColor: "bg-red-100 text-red-700", barColor: "#ef4444", alert: "⚠ Défaillance prévue dans 18h", alertColor: "text-red-600" },
                { name: "Turbine B-07", score: 52, status: "Modéré", statusColor: "bg-amber-100 text-amber-700", barColor: "#f97316", alert: "→ Maintenance recommandée J+3", alertColor: "text-amber-600" },
                { name: "Moteur C-03", score: 81, status: "Sain", statusColor: "bg-green-100 text-green-700", barColor: "#10b981", alert: "✓ Prochain contrôle dans 14j", alertColor: "text-green-600" },
                { name: "Pompe D-19", score: 67, status: "Attention", statusColor: "bg-yellow-100 text-yellow-700", barColor: "#eab308", alert: "→ Roulement à surveiller", alertColor: "text-yellow-600" },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: "#fafafa", border: "1px solid #f3f4f6" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "#ffedd5", color: "#9a3412" }}>{m.score}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.statusColor}`}>{m.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.score}%`, background: m.barColor }} />
                    </div>
                  </div>
                  <div className={`text-xs font-semibold hidden md:block ${m.alertColor}`}>{m.alert}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              {[
                { v: "4", l: "machines surveillées" },
                { v: "1", l: "alerte critique" },
                { v: "€0", l: "panne ce mois-ci" },
              ].map((k) => (
                <div key={k.l}>
                  <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#9a3412" }}>{k.v}</div>
                  <div className="text-xs text-gray-500">{k.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#cta" className="text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg" style={{ background: "#9a3412" }}>
              Démarrer la maintenance prédictive →
            </a>
            <a href="#signaux" className="bg-white border-2 px-8 py-4 rounded-xl font-bold text-lg transition-all" style={{ color: "#9a3412", borderColor: "#fed7aa" }}>
              Voir les capteurs
            </a>
          </div>
        </div>
      </section>

      {/* SIGNAUX CAPTEURS */}
      <section id="signaux" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-display)", color: "#431407" }}>
            Ce que MaintainIQ surveille
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: "#9a3412" }}>4 flux de capteurs analysés en continu — installation en 2 heures.</p>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { icon: "📳", title: "Vibrations", desc: "Détection de déséquilibre, roulement défectueux, cavitation. Précision 0.001 g.", color: "#fff7ed", border: "#fed7aa" },
              { icon: "🌡️", title: "Température", desc: "Surchauffe moteur, paliers, réducteurs. Alertes en temps réel.", color: "#fef2f2", border: "#fecaca" },
              { icon: "⚡", title: "Courant électrique", desc: "Signature moteur, anomalie alimentation, surconsommation.", color: "#eff6ff", border: "#bfdbfe" },
              { icon: "🔊", title: "Ultrasons", desc: "Fuites pneumatiques, cavitation pompes, arcs électriques.", color: "#f0fdf4", border: "#bbf7d0" },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl p-5 border" style={{ background: s.color, borderColor: s.border }}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#431407" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7c2d12" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MACHINES / FLOW */}
      <section id="machines" className="py-20" style={{ background: "#431407" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            De la donnée brute à l&apos;ordre de travail
          </h2>
          <p className="text-orange-300 text-lg mb-12">En moins de 30 secondes après la détection d&apos;anomalie.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Capteurs IoT", desc: "Données brutes toutes les 10ms" },
              { step: "02", title: "Analyse IA", desc: "Détection d'anomalie et scoring de risque" },
              { step: "03", title: "Prédiction", desc: "Fenêtre de défaillance estimée à ±6h" },
              { step: "04", title: "Ordre de travail", desc: "Planification auto, stock pièces, technicien notifié" },
            ].map((s, i) => (
              <div key={s.step} className="relative rounded-2xl p-5 text-left" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#fb923c" }}>{s.step}</div>
                <div className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>{s.title}</div>
                <div className="text-sm text-orange-200">{s.desc}</div>
                {i < 3 && <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-orange-400 text-lg z-10">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section id="roi" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: "var(--font-display)", color: "#431407" }}>
            L&apos;impact financier est immédiat
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { value: "72h", label: "avant la panne — délai moyen de prédiction" },
              { value: "−40%", label: "de coûts de maintenance en 6 mois" },
              { value: "3×", label: "de ROI dès le premier trimestre" },
            ].map((s) => (
              <div key={s.label} className="text-center p-8 rounded-2xl border" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                <div className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#9a3412" }}>{s.value}</div>
                <div className="text-sm" style={{ color: "#7c2d12" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20" style={{ background: "linear-gradient(135deg, #9a3412 0%, #c2410c 100%)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Vos machines sous surveillance dès aujourd&apos;hui
          </h2>
          <p className="text-orange-100 text-xl mb-10">Installation capteurs en 2h. Premiers scores de santé sous 24h.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button" target="_blank" rel="noopener noreferrer" className="inline-block bg-white hover:bg-orange-50 px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-xl" style={{ color: "#9a3412" }}>
              📅 Réserver un créneau →
            </button>
            <a href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20MaintainIQ%20avec%20Wikolabs." target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-xl" style={{ background: "#25d366", borderColor: "#25d366", color: "#fff" }}>
              💬 WhatsApp →
            </a>
          </div>
          <p className="text-orange-200 text-sm mt-5">14 jours gratuits · Sans carte bancaire · Support installation inclus</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#431407", color: "#fb923c" }} className="py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-white text-xl" style={{ fontFamily: "var(--font-display)" }}>MaintainIQ</span>
          <p className="text-sm">© 2025 MaintainIQ — Un produit <a href="https://wikolabs.com" className="text-orange-300 hover:text-orange-100">Wikolabs</a></p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="mailto:team@wikolabs.com" className="hover:text-orange-100 transition-colors">team@wikolabs.com</a>
            <span>·</span>
            <a href="tel:+261386626100" className="hover:text-orange-100 transition-colors">+261 38 66 261 00</a>
            <span>·</span>
            <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" className="hover:text-orange-100 transition-colors">Prendre RDV</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
