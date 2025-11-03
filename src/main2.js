import jsPDF from "jspdf";

const form = document.getElementById("companyForm");
const pdfPreview = document.getElementById("pdfPreview");
let currentPDF = null;

import { generateQuotationPDF } from './generator.js';

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const companyname = document.getElementById("companyname").value;
  const address = document.getElementById("address").value;
  const productName = document.getElementById("productName").value;
  const productPrice = parseFloat(document.getElementById("productPrice").value);

  const pdf = await generateQuotationPDF({
    companyname,
    address,
    productName,
    productPrice,
  });

  const blob = pdf.output("blob");
  pdfPreview.src = URL.createObjectURL(blob);
  currentPDF = pdf;
});


// Optional: Download or print
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (currentPDF) currentPDF.save("Company_Quotation.pdf");
});

document.getElementById("printBtn").addEventListener("click", () => {
  if (pdfPreview.src) window.open(pdfPreview.src, "_blank").print();
});
