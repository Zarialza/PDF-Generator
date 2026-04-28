import { createLetterheadPDF, getFormattedDate, drawTable, drawFooter } from "./pdf-utils";

/**
 * Generates a company-to-company quotation PDF.
 */
export async function generateCompanyPDF({ companyname, address, productName, productPrice }) {
  const { pdf } = await createLetterheadPDF();

  // --- Addressee ---
  pdf.setFont(undefined, "bold");
  pdf.text("To,", 50, 160);
  pdf.setFont(undefined, "normal");
  pdf.text(companyname, 50, 180);
  pdf.text(address, 50, 200);

  // --- Date ---
  pdf.text(getFormattedDate(), 460, 160);

  // --- Subject (handles long product names) ---
  pdf.setFont(undefined, "bold");
  const subjectLines = pdf.splitTextToSize(`RE: Quotation for ${productName}`, 500);
  pdf.text(subjectLines, 50, 240);

  const subjectHeight = subjectLines.length * 15;
  let y = 240 + subjectHeight + 30;

  // --- Body ---
  pdf.text("To whom it may concern,", 50, y);
  y += 30;

  pdf.setFont(undefined, "normal");
  const paragraph = "The requested quotation as per our conversation is provided as follows:";
  const bodyLines = pdf.splitTextToSize(paragraph, 500);
  pdf.text(bodyLines, 50, y);
  y += bodyLines.length * 15 + 20;

  // --- Table ---
  const tableEndY = drawTable(pdf, [
    ["Product Name", productName],
    ["Product Amount (Including VAT)", productPrice.toString()],
  ], y);

  // --- Footer ---
  drawFooter(pdf, tableEndY);

  return pdf;
}
