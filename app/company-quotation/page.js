"use client";

import QuotationForm from "@/components/QuotationForm";
import { generateCompanyPDF } from "@/lib/company-pdf";

export default function CompanyQuotationPage() {
  const fields = [
    {
      id: "companyname",
      label: "Company Name",
      type: "text",
      placeholder: "e.g. ABC Traders",
    },
    {
      id: "address",
      label: "Address",
      type: "text",
      placeholder: "e.g. Kathmandu, Nepal",
    },
    {
      id: "productName",
      label: "Product Name",
      type: "text",
      placeholder: "e.g. Samsung Galaxy S24",
    },
    {
      id: "productPrice",
      label: "Product Price (NPR)",
      type: "number",
      placeholder: "e.g. 150000",
      min: 1,
    },
  ];

  return (
    <QuotationForm
      title="Company Quotation"
      pdfFilename="Company_Quotation.pdf"
      fields={fields}
      generatePDF={generateCompanyPDF}
    />
  );
}
