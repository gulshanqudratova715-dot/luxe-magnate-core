import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "home": "Home",
      "marketplace": "Marketplace",
      "dashboard": "Dashboard",
      "cart": "Cart",
      "language": "Language",
      "hero_title": "Redefining Luxury for the Modern Magnate",
      "hero_subtitle": "Exclusive acquisitions, personalized AI concierge, and unparalleled lifestyle management.",
      "explore": "Explore Collection",
      "ai_concierge": "AI Concierge",
      "analytics": "Analytics",
      "crypto_payment": "Pay with Crypto (Web3)",
      "pay_stripe": "Pay with Credit Card",
      "wallet_connect": "Connect Wallet (SOL/ETH)"
    }
  },
  ar: {
    translation: {
      "home": "الرئيسية",
      "marketplace": "السوق",
      "dashboard": "لوحة القيادة",
      "cart": "عربة التسوق",
      "language": "اللغة",
      "hero_title": "إعادة تعريف الفخامة لأقطاب العصر الحديث",
      "hero_subtitle": "عمليات استحواذ حصرية، كونسيرج ذكاء اصطناعي مخصص، وإدارة أسلوب حياة لا مثيل لها.",
      "explore": "استكشف المجموعة",
      "ai_concierge": "الكونسيرج الذكي",
      "analytics": "التحليلات",
      "crypto_payment": "الدفع بالعملات المشفرة (Web3)",
      "pay_stripe": "الدفع بالبطاقة الائتمانية",
      "wallet_connect": "اتصل بالمحفظة (SOL/ETH)"
    }
  },
  fr: {
    translation: {
      "home": "Accueil",
      "marketplace": "Marché",
      "dashboard": "Tableau de bord",
      "cart": "Panier",
      "language": "Langue",
      "hero_title": "Redéfinir le luxe pour le magnat moderne",
      "hero_subtitle": "Acquisitions exclusives, conciergerie IA personnalisée et gestion de style de vie inégalée.",
      "explore": "Explorer la collection",
      "ai_concierge": "Concierge IA",
      "analytics": "Analytique",
      "crypto_payment": "Payer en Crypto (Web3)",
      "pay_stripe": "Payer par Carte de Crédit",
      "wallet_connect": "Connecter le Portefeuille (SOL/ETH)"
    }
  },
  es: {
    translation: {
      "home": "Inicio",
      "marketplace": "Mercado",
      "dashboard": "Panel",
      "cart": "Carrito",
      "language": "Idioma",
      "hero_title": "Redefiniendo el lujo para el magnate moderno",
      "hero_subtitle": "Adquisiciones exclusivas, conserje de IA personalizado y gestión de estilo de vida incomparable.",
      "explore": "Explorar Colección",
      "ai_concierge": "Conserje de IA",
      "analytics": "Analítica",
      "crypto_payment": "Pagar con Cripto (Web3)",
      "pay_stripe": "Pagar con Tarjeta de Crédito",
      "wallet_connect": "Conectar Billetera (SOL/ETH)"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
