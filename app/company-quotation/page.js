"use client";

import { useState } from "react";
import QuotationForm from "@/components/QuotationForm";
import { generateCompanyPDF } from "@/lib/company-pdf";
import { logGeneration } from "@/lib/logger";

export default function CompanyQuotationPage() {
  const [productCount, setProductCount] = useState(1);

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
  ];

  const handleAddProduct = () => {
    if (productCount < 5) {
      setProductCount(productCount + 1);
    }
  };

  const productFields = [];
  for (let i = 0; i < productCount; i++) {
    productFields.push(
      <div key={i} className="product-entry" style={{ marginTop: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "15px", fontSize: "1rem", color: "#666" }}>Product {i + 1}</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Product Name</label>
            <input
              name="productName"
              type="text"
              placeholder="e.g. Samsung Galaxy S24"
              required
            />
          </div>
          <div className="form-group">
            <label>Product Price (NPR)</label>
            <input
              name="productPrice"
              type="number"
              placeholder="e.g. 150000"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              name="quantity"
              type="number"
              placeholder="e.g. 1"
              min="1"
              required
            />
          </div>
        </div>
      </div>
    );
  }

  const handleGeneratePDF = (data, formData) => {
    const productNames = formData.getAll("productName");
    const productPrices = formData.getAll("productPrice");
    const quantities = formData.getAll("quantity");

    const products = productNames.map((name, i) => ({
      name,
      price: parseFloat(productPrices[i]),
      quantity: parseInt(quantities[i]),
    }));

    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Log to DB
    logGeneration({
      type: "Company",
      recipient: data.companyname,
      amount: total,
    });

    return generateCompanyPDF({
      ...data,
      products,
    });
  };

  return (
    <QuotationForm
      title="Company Quotation"
      pdfFilename="Company_Quotation.pdf"
      fields={fields}
      generatePDF={handleGeneratePDF}
    >
      <div className="products-section">
        {productFields}
        
        {productCount < 5 && (
          <button
            type="button"
            onClick={handleAddProduct}
            className="btn btn-secondary"
            style={{ marginTop: "15px", width: "100%" }}
          >
            + Add More Product ({productCount}/5)
          </button>
        )}
      </div>
    </QuotationForm>
  );
}
