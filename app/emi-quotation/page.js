"use client";

import QuotationForm from "@/components/QuotationForm";
import { generateEmiPDF } from "@/lib/emi-pdf";
import { logGeneration } from "@/lib/logger";

export default function EmiQuotationPage() {
  const fields = [
    {
      id: "customerName",
      label: "Customer Name",
      type: "text",
      placeholder: "e.g. Ram Bahadur",
    },
    {
      id: "bank",
      label: "Preferred Bank",
      type: "text",
      placeholder: "e.g. NIC Asia",
    },
    {
      id: "productName",
      label: "Product Name",
      type: "text",
      placeholder: "e.g. iPhone 15 Pro Max",
      fullWidth: true,
    },
    {
      id: "productPrice",
      label: "Product Price (NPR)",
      type: "number",
      placeholder: "e.g. 250000",
      min: 1,
    },
    {
      id: "downpayment",
      label: "Downpayment (NPR)",
      type: "number",
      placeholder: "e.g. 50000",
      min: 0,
    },
    {
      id: "tenure",
      label: "EMI Tenure (months)",
      type: "number",
      placeholder: "e.g. 12",
      min: 1,
      max: 60,
    },
  ];

  const validate = (data) => {
    if (data.downpayment >= data.productPrice) {
      return "Downpayment must be less than the product price.";
    }
    return null;
  };

  const handleGeneratePDF = (data) => {
    logGeneration({
      type: "EMI",
      recipient: data.customerName,
      amount: data.productPrice,
    });
    return generateEmiPDF(data);
  };

  return (
    <QuotationForm
      title="EMI Quotation"
      pdfFilename="EMI_Quotation.pdf"
      fields={fields}
      validate={validate}
      generatePDF={handleGeneratePDF}
    />
  );
}
