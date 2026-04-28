"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

/**
 * Reusable quotation form component.
 *
 * @param {Object} props
 * @param {string}   props.title       - Page heading (e.g. "EMI Quotation")
 * @param {string}   props.pdfFilename - Download filename (e.g. "EMI_Quotation.pdf")
 * @param {Array}    props.fields      - Array of field config objects { id, label, type, placeholder, required, fullWidth, min, max }
 * @param {Function} props.validate    - Optional (formData) => errorString | null
 * @param {Function} props.generatePDF - Async (formData) => jsPDF instance
 */
export default function QuotationForm({
  title,
  pdfFilename,
  fields,
  validate,
  generatePDF,
}) {
  const [loading, setLoading] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const iframeRef = useRef(null);
  const currentPDF = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {};
    const form = e.target;
    fields.forEach((field) => {
      const value = form.elements[field.id]?.value;
      if (field.type === "number") {
        formData[field.id] = parseFloat(value);
      } else {
        formData[field.id] = value;
      }
    });

    // Optional validation
    if (validate) {
      const error = validate(formData);
      if (error) {
        alert(error);
        return;
      }
    }

    setLoading(true);

    try {
      const pdf = await generatePDF(formData);
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      if (iframeRef.current) {
        iframeRef.current.src = url;
      }

      currentPDF.current = pdf;
      setHasPdf(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate quotation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (currentPDF.current) {
      currentPDF.current.save(pdfFilename);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current?.src) {
      window.open(iframeRef.current.src, "_blank")?.print();
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1>{title}</h1>
        <Link href="/" className="back-link" id="back-home">
          ← Back
        </Link>
      </header>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`form-group${field.fullWidth ? " full-width" : ""}`}
              >
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  required={field.required !== false}
                  min={field.min}
                  max={field.max}
                />
              </div>
            ))}
          </div>

          <div className="btn-row">
            <button
              type="submit"
              id="submitbtn"
              className={`btn btn-primary${loading ? " loading" : ""}`}
              disabled={loading}
            >
              <span className="spinner"></span>
              <span className="btn-label">Generate Quotation</span>
            </button>
            <button
              type="button"
              id="downloadBtn"
              className="btn btn-secondary"
              disabled={!hasPdf}
              onClick={handleDownload}
            >
              ↓ Download PDF
            </button>
            <button
              type="button"
              id="printBtn"
              className="btn btn-secondary"
              disabled={!hasPdf}
              onClick={handlePrint}
            >
              🖨 Print
            </button>
          </div>
        </form>
      </div>

      <div className="preview-section">
        <div className="preview-header">
          <span>Preview</span>
        </div>
        <div className={`preview-body${hasPdf ? " has-pdf" : ""}`} id="previewBody">
          <div className="preview-empty">
            <div className="empty-icon">📋</div>
            <p>
              Fill the form and click <strong>Generate Quotation</strong> to
              preview.
            </p>
          </div>
          <iframe ref={iframeRef} id="pdfPreview" title="PDF Preview"></iframe>
        </div>
      </div>

      <Footer />
    </div>
  );
}
