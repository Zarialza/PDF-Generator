import { initFormHandler } from "./form-handler.js";
import { generateCompanyPDF } from "./company-pdf.js";

initFormHandler({
  formId: "companyForm",
  pdfFilename: "Company_Quotation.pdf",

  getFormData: () => ({
    companyname: document.getElementById("companyname").value,
    address: document.getElementById("address").value,
    productName: document.getElementById("productName").value,
    productPrice: parseFloat(document.getElementById("productPrice").value),
  }),

  generatePDF: generateCompanyPDF,
});
