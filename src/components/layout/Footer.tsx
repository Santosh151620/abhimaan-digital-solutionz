import { SITE_CONFIG } from "@/constants/site";

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-900 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">

        <div>
          <h3 className="font-bold text-lg">
            Abhimaan Digital Solutionz
          </h3>

          <p className="mt-4 text-sm">
            Empowering Next-Gen Horizons
          </p>
        </div>

        <div>
          <h4 className="font-semibold">
            Services
          </h4>

          <ul className="mt-4 space-y-2 text-sm">
            <li>Website Development</li>
            <li>CRM Solutions</li>
            <li>SaaS Development</li>
            <li>Branding</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">
            Legal
          </h4>

          <ul className="mt-4 space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">
            Contact
          </h4>

          <p>{SITE_CONFIG.email}</p>
          <p>{SITE_CONFIG.phonePrimary}</p>
        </div>

      </div>

    </footer>
  );
}
