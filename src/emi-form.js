import { initFormHandler } from "./form-handler.js";
import { generateEmiPDF } from "./emi-pdf.js";

initFormHandler({
  formId: "emiForm",
  pdfFilename: "EMI_Quotation.pdf",

  getFormData: () => ({
    customerName: document.getElementById("customerName").value,
    bank: document.getElementById("bank").value,
    productName: document.getElementById("productName").value,
    productPrice: parseFloat(document.getElementById("productPrice").value),
    downpayment: parseFloat(document.getElementById("downpayment").value),
    tenure: parseInt(document.getElementById("tenure").value),
  }),

  validate: (data) => {
    if (data.downpayment >= data.productPrice) {
      return "Downpayment must be less than the product price.";
    }
    return null;
  },

  generatePDF: generateEmiPDF,
});
