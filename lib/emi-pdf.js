import { createLetterheadPDF, getFormattedDate, drawTable, drawFooter } from "./pdf-utils";

/**
 * Generates an EMI quotation PDF addressed to a bank.
 */
export async function generateEmiPDF({ customerName, bank, productName, productPrice, downpayment, tenure }) {
  const { pdf } = await createLetterheadPDF();

  const financeAmount = productPrice - downpayment;
  const emiTerm = `${tenure} Months`;

  // --- Addressee ---
  pdf.setFont(undefined, "bold");
  pdf.text("To,", 50, 160);
  pdf.setFont(undefined, "normal");
  pdf.text(`${bank} Bank`, 50, 180);

  // --- Date ---
  pdf.text(getFormattedDate(), 460, 160);

  // --- Subject ---
  pdf.setFont(undefined, "bold");
  pdf.text(`RE: Quotation for ${productName}`, 50, 210);

  // --- Body ---
  pdf.text("To whom it may concern,", 50, 240);
  pdf.setFont(undefined, "normal");
  const paragraph = `We, Sinja Commerce Pvt. Ltd., would like to inform you that our customer, Mr./Ms. ${customerName}, has requested to avail the EMI facility provided by your esteemed bank for the following products purchased from us:`;
  pdf.text(pdf.splitTextToSize(paragraph, 500), 50, 270);

  // --- Table ---
  const tableEndY = drawTable(pdf, [
    ["Product Name", productName],
    ["Product Amount", productPrice.toString()],
    ["Finance Amount", financeAmount.toString()],
    ["EMI Term", emiTerm],
  ], 340);

  // --- Footer ---
  drawFooter(pdf, tableEndY);

  return pdf;
}
