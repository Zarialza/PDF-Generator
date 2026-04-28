import Link from "next/link";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="landing">
      <h1>Quotation Generator</h1>
      <p className="subtitle">Sinja Commerce Pvt. Ltd.</p>

      <div className="card-grid">
        <Link href="/emi-quotation" className="card-link" id="emi-card">
          <div className="card">
            <div className="card-icon emi">📄</div>
            <h2>EMI Quotation</h2>
            <p>Generate bank-oriented EMI financing quotations for customers.</p>
            <span className="arrow">→</span>
          </div>
        </Link>
        <Link href="/company-quotation" className="card-link" id="company-card">
          <div className="card">
            <div className="card-icon company">🏢</div>
            <h2>Company Quotation</h2>
            <p>Generate direct quotations for company-to-company transactions.</p>
            <span className="arrow">→</span>
          </div>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
