import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Calculator, Globe, Target, Infinity as InfinityIcon } from "lucide-react";
import hero from "@/assets/hero.jpg";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import { FinancialCalculator } from "@/components/financial-calculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUXE MAGNATE — Premium Marketplace & AI Automation" },
      {
        name: "description",
        content:
          "Curated luxury inventory, financial intelligence, and AI-powered enterprise automation. Invitation-only.",
      },
    ],
  }),
  component: Home,
});

const featured = [
  { img: p1, name: "Grand Cru Reserve Decanter", price: "$8,400", cat: "Rare Spirits" },
  { img: p2, name: "Obsidian Tourbillon Automatic", price: "$42,900", cat: "Horology" },
  { img: p3, name: "Sentinel AI Orchestration", price: "$18,000/mo", cat: "Automation" },
  { img: p4, name: "Noir Executive Attaché", price: "$3,650", cat: "Leather Goods" },
];

function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const hash = window.location.hash;
      if (
        search.includes("code=") ||
        search.includes("error=") ||
        search.includes("error_description=") ||
        hash.includes("code=") ||
        hash.includes("access_token=") ||
        hash.includes("error=")
      ) {
        window.location.replace(`${window.location.origin}/auth-callback${search}${hash}`);
        return;
      }
    }
    setMounted(true);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 pt-10 sm:pt-20 pb-16 sm:pb-28 grid gap-12 lg:grid-cols-2 items-center">
          <div className={`space-y-7 ${mounted ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 text-xs uppercase tracking-[0.25em] text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Est. Premium · Invitation Only
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-bold">
              Where <span className="gold-text italic">rarity</span> meets
              <br />
              <span className="gold-text">intelligence</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              LUXE MAGNATE is the private marketplace uniting hand-curated luxury goods with
              enterprise-grade AI automation — engineered for principals, operators, and collectors
              who demand more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="group gold-gradient text-primary-foreground px-7 py-3.5 rounded-md font-medium inline-flex items-center gap-2 hover-lift shadow-gold-glow"
              >
                Enter marketplace
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/booking"
                className="border border-gold/40 text-gold px-7 py-3.5 rounded-md hover-lift"
              >
                Book consultation
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gold/10 max-w-md">
              {[
                ["$2.4B+", "Transacted"],
                ["1,200+", "Members"],
                ["48hrs", "Concierge"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl gold-text">{v}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative ${mounted ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "150ms" }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-luxe animate-float">
              <img
                src={hero}
                alt="LUXE MAGNATE — curated luxury and AI automation"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 glass rounded-xl px-5 py-4 shadow-luxe hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gold-gradient">
                  <TrendingUp className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Vault index
                  </div>
                  <div className="font-display gold-text text-lg">+18.4% YoY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Provenance verified",
            body: "Every listing is authenticated and insured before it reaches you.",
          },
          {
            icon: Sparkles,
            title: "AI-orchestrated",
            body: "Automation packages that operate your business at institutional scale.",
          },
          {
            icon: TrendingUp,
            title: "Financial intelligence",
            body: "Bespoke financing, hedging, and portfolio tooling built in.",
          },
        ].map((f, i) => (
          <div
            key={f.title}
            className="glass rounded-xl p-6 hover-lift animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="grid h-11 w-11 place-items-center rounded-md gold-gradient mb-4">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display text-xl mb-2">{f.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      {/* AI COMMERCE REVOLUTION */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">
              The Future of Retail
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6">
              Zero overhead.<br />
              Infinite scale.
            </h2>
            <div className="space-y-8 mt-12">
              {[
                {
                  title: "Zero Model & Studio Costs",
                  desc: "Not a single penny spent on expensive photo studios, professional models, or physical set rentals. Our AI creates perfect contextual environments instantly.",
                  icon: Sparkles,
                },
                {
                  title: "Viral 3D AI Campaigns",
                  desc: "Forget million-dollar advertising budgets. Generate hyper-realistic, interactive 3D visualizations that naturally captivate audiences and go viral across social networks.",
                  icon: Globe,
                },
                {
                  title: "100% Perfect Fit (Virtual Try-On)",
                  desc: "Customers upload a photo, and the AI maps clothing to their exact body shape or simulates perfume sprays in 3D. Watch your return rates drop to near zero.",
                  icon: Target,
                },
                {
                  title: "Endless Variations",
                  desc: "Instantly visualize how a luxury product interacts with light, motion, and different environments with zero marginal cost.",
                  icon: InfinityIcon,
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 group">
                  <div className="flex-shrink-0 mt-1 h-12 w-12 rounded-full gold-gradient flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <item.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl mb-2 text-foreground group-hover:text-gold transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden glass border border-gold/20 shadow-2xl animate-fade-up" style={{ animationDelay: '200ms' }}>
            <img 
              src="https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1500&auto=format&fit=crop" 
              alt="AI Virtual Try On" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="glass p-8 rounded-xl max-w-sm border border-gold/30 text-center relative overflow-hidden group">
                <div className="absolute inset-0 gold-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <Target className="h-10 w-10 mx-auto text-gold mb-4" />
                <h4 className="font-display text-2xl mb-2">Virtual Try-On Active</h4>
                <p className="text-sm text-muted-foreground mb-6">Experience 100% accurate AI-driven real-time visualization.</p>
                <Link to="/marketplace" className="inline-flex h-10 items-center justify-center rounded-md gold-gradient px-8 text-sm font-medium text-primary-foreground hover-lift">
                  Experience Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM CAPABILITIES */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16 border-y border-border/50 bg-secondary/10 mt-16">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">
            White-Label Ready
          </div>
          <h2 className="font-display text-4xl sm:text-5xl">Enterprise Architecture</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Engineered for scale. A complete turn-key solution combining a premium frontend
            with a robust, production-ready backend infrastructure.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Modern Tech Stack",
              desc: "Built on React 18, Vite, and TanStack Router for blazing-fast performance and SEO optimization.",
            },
            {
              title: "Secure Authentication",
              desc: "Integrated with Supabase for secure, role-based access control and user management.",
            },
            {
              title: "Global Payments",
              desc: "Fully integrated Stripe subscriptions and checkout flows for immediate monetization.",
            },
            {
              title: "AI Integration",
              desc: "Ready-to-use AI orchestration layers for intelligent concierge and automated operations.",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="glass rounded-xl p-6 border border-gold/10 hover-lift animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="font-display text-lg mb-2 gold-text">{feature.title}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">The Collection</div>
            <h2 className="font-display text-4xl sm:text-5xl">Featured this week</h2>
          </div>
          <Link
            to="/marketplace"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-gold hover:gap-3 transition-all"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Link
              key={p.name}
              to="/marketplace"
              className="group animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-luxe hover-lift">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-[10px] uppercase tracking-widest text-gold mb-1">
                    {p.cat}
                  </div>
                  <div className="font-display text-lg leading-tight">{p.name}</div>
                  <div className="mt-2 gold-text font-medium">{p.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-center">
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">
              Financial Intelligence
            </div>
            <h2 className="font-display text-4xl sm:text-5xl mb-4">Model your acquisition.</h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Configure principal, term, and rate. Our engine projects amortization, total interest,
              and monthly cash flow in real time — the same tools our private wealth desk uses.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gold">
              <Calculator className="h-4 w-4" /> Live simulation
            </div>
          </div>
          <FinancialCalculator />
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">Membership Tiers</div>
          <h2 className="font-display text-4xl sm:text-5xl">Select your access level.</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Choose a membership tier that aligns with your operational scale and investment
            appetite.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {[
            {
              name: "Standard",
              price: "$990",
              period: "/ month",
              desc: "Essential access for discerning collectors.",
              features: [
                "Curated marketplace access",
                "5 AI Concierge queries/mo",
                "Basic financial modeling",
                "48hr response time",
              ],
              cta: "Request Access",
            },
            {
              name: "Premium",
              price: "$4,900",
              period: "/ month",
              desc: "For operators requiring intelligence at scale.",
              features: [
                "Priority marketplace access",
                "25 AI Concierge queries/mo",
                "Advanced wealth tools",
                "Dedicated concierge",
                "Private sourcing",
              ],
              cta: "Apply for Premium",
              highlight: true,
            },
            {
              name: "Elite",
              price: "$12,500",
              period: "/ month",
              desc: "Institutional grade automation and access.",
              features: [
                "Early access to rarities",
                "100 AI Concierge queries/mo",
                "Full AI automation suite",
                "24/7 dedicated partner",
                "Bespoke financing",
              ],
              cta: "Contact Partners",
            },
          ].map((tier, i) => (
            <div
              key={tier.name}
              className={`relative glass rounded-2xl p-8 animate-fade-up flex flex-col ${tier.highlight ? "border border-gold shadow-gold-glow" : "border border-border/50"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                  Most Selected
                </div>
              )}
              <h3 className="font-display text-2xl mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 h-10">{tier.desc}</p>
              <div className="mb-6">
                <span className="font-display text-4xl gold-text">{tier.price}</span>
                <span className="text-muted-foreground text-sm">{tier.period}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`w-full py-3.5 rounded-md font-medium inline-flex items-center justify-center transition-all ${tier.highlight ? "gold-gradient text-primary-foreground hover:opacity-90" : "bg-secondary/50 text-foreground hover:bg-secondary border border-border/50"}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 py-20">
        <div className="glass rounded-3xl p-10 sm:p-16 text-center shadow-luxe relative overflow-hidden">
          <div className="absolute inset-0 gold-gradient opacity-[0.04]" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-5xl mb-4">Membership is by invitation.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Request access to unlock the full marketplace, private consultations, and AI
              automation.
            </p>
            <Link
              to="/auth"
              className="gold-gradient text-primary-foreground px-8 py-4 rounded-md font-medium inline-flex items-center gap-2 hover-lift shadow-gold-glow"
            >
              Request invitation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
