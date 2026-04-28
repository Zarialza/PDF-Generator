/**
 * Initializes the quotation form flow: submit → generate PDF → preview/download/print.
 *
 * @param {Object} config
 * @param {string}   config.formId       - The form element ID
 * @param {string}   config.pdfFilename  - Default filename for downloads (e.g. "EMI_Quotation.pdf")
 * @param {Function} config.getFormData  - Returns an object with form field values
 * @param {Function} config.validate     - Optional custom validation, return error string or null
 * @param {Function} config.generatePDF  - Async function that receives form data and returns a jsPDF instance
 */
export function initFormHandler({ formId, pdfFilename, getFormData, validate, generatePDF }) {
  const form = document.getElementById(formId);
  const pdfPreview = document.getElementById("pdfPreview");
  const submitBtn = document.getElementById("submitbtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const printBtn = document.getElementById("printBtn");
  const previewBody = document.getElementById("previewBody");
  let currentPDF = null;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = getFormData();

    // Optional custom validation
    if (validate) {
      const error = validate(data);
      if (error) {
        alert(error);
        return;
      }
    }

    // Loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      const pdf = await generatePDF(data);

      const blob = pdf.output("blob");
      pdfPreview.src = URL.createObjectURL(blob);
      previewBody.classList.add("has-pdf");
      currentPDF = pdf;

      downloadBtn.disabled = false;
      printBtn.disabled = false;
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate quotation. Please try again.");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (currentPDF) currentPDF.save(pdfFilename);
  });

  printBtn.addEventListener("click", () => {
    if (pdfPreview.src) window.open(pdfPreview.src, "_blank").print();
  });
}
