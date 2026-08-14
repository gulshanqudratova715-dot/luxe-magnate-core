import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · LUXE MAGNATE" },
      { name: "description", content: "Privacy Policy for Luxe Magnate" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-black text-foreground pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-2xl border border-border/50">
        <h1 className="text-3xl md:text-5xl font-serif text-gold-gradient mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-invert prose-gold max-w-none space-y-6">
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <p className="text-foreground/80 leading-relaxed">
            At Luxe Magnate, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-foreground/80 leading-relaxed">
            We may collect information about you in a variety of ways. The information we may collect includes:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 space-y-2">
            <li>
              <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, 
              email address, and telephone number, that you voluntarily give to us when you register with the site.
            </li>
            <li>
              <strong>Financial Data:</strong> Financial information, such as data related to your payment method 
              (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, 
              order, return, exchange, or request information about our services. All financial information is stored by our payment processor, Stripe.
            </li>
            <li>
              <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, 
              such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
            </li>
          </ul>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">2. Use of Your Information</h2>
          <p className="text-foreground/80 leading-relaxed">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. 
            Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 space-y-2">
            <li>Create and manage your account.</li>
            <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
            <li>Improve our Site and services to better serve you.</li>
            <li>Respond to customer service requests and support needs.</li>
          </ul>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">3. Disclosure of Your Information</h2>
          <p className="text-foreground/80 leading-relaxed">
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <ul className="list-disc pl-6 text-foreground/80 space-y-2">
            <li>
              <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to 
              legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
            </li>
            <li>
              <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, 
              such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </li>
          </ul>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">4. Security of Your Information</h2>
          <p className="text-foreground/80 leading-relaxed">
            We use administrative, technical, and physical security measures to help protect your personal information. 
            While we have taken reasonable steps to secure the personal information you provide to us, please be aware that 
            despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be 
            guaranteed against any interception or other type of misuse.
          </p>

          <h2 className="text-2xl font-serif text-primary-foreground mt-8 mb-4">5. Contact Us</h2>
          <p className="text-foreground/80 leading-relaxed">
            If you have questions or comments about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@luxemagnate.com
          </p>
        </div>
      </div>
    </div>
  );
}
