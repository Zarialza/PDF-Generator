import jsPDF from "jspdf";

const form = document.getElementById("emiForm");
const pdfPreview = document.getElementById("pdfPreview");
let currentPDF = null;

import { generateQuotationPDF } from './generatePDF.js';

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const customerName = document.getElementById("customerName").value;
  const bank = document.getElementById("bank").value;
  const productName = document.getElementById("productName").value;
  const productPrice = parseFloat(document.getElementById("productPrice").value);
  const downpayment = parseFloat(document.getElementById("downpayment").value);
  const tenure = parseInt(document.getElementById("tenure").value);

  const pdf = await generateQuotationPDF({
    customerName,
    bank,
    productName,
    productPrice,
    downpayment,
    tenure
  });

  const blob = pdf.output("blob");
  pdfPreview.src = URL.createObjectURL(blob);
  currentPDF = pdf;
});


// Optional: Download or print
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (currentPDF) currentPDF.save("EMI_Quotation.pdf");
});

document.getElementById("printBtn").addEventListener("click", () => {
  if (pdfPreview.src) window.open(pdfPreview.src, "_blank").print();
});
