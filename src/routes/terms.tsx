import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service · LUXE MAGNATE" },
      { name: "description", content: "Terms of Service for Luxe Magnate" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen bg-black text-foreground pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-2xl border border-border/50">
        <h1 className="text-3xl md:text-5xl font-serif text-gold-gradient mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-invert prose-gold max-w-none space-y-6">
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-foreground/80 leading-relaxed">
            By accessing and using Luxe Magnate ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">2. Description of Service</h2>
          <p className="text-foreground/80 leading-relaxed">
            Luxe Magnate provides a curated marketplace for luxury goods, AI concierge services, and financial tracking tools. 
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">3. Registration and Accounts</h2>
          <p className="text-foreground/80 leading-relaxed">
            To use certain features of the Service, you must register for an account. You agree to provide accurate, current, 
            and complete information during the registration process and to update such information to keep it accurate, current, and complete. 
            You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">4. Payment Terms</h2>
          <p className="text-foreground/80 leading-relaxed">
            All payments are processed securely via Stripe. By purchasing a subscription or an item from the marketplace, you agree to our pricing 
            and payment terms. Subscriptions are billed in advance on a recurring basis. All fees are exclusive of all taxes, levies, or duties 
            imposed by taxing authorities.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">5. User Conduct</h2>
          <p className="text-foreground/80 leading-relaxed">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 space-y-2">
            <li>Violate any local, state, national, or international law.</li>
            <li>Impersonate any person or entity or falsely state your affiliation.</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
            <li>Attempt to gain unauthorized access to the Service or other accounts.</li>
          </ul>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-foreground/80 leading-relaxed">
            The Service and its original content, features, and functionality are and will remain the exclusive property of Luxe Magnate and its licensors. 
            The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">7. Termination</h2>
          <p className="text-foreground/80 leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
            including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-foreground/80 leading-relaxed">
            In no event shall Luxe Magnate, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
            incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
            intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">9. Contact Us</h2>
          <p className="text-foreground/80 leading-relaxed">
            If you have any questions about these Terms, please contact us at support@luxemagnate.com.
          </p>
        </div>
      </div>
    </div>
  );
}
