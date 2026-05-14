import { createLetterheadPDF, getFormattedDate, drawQuotationTable, drawFooter } from "./pdf-utils";

/**
 * Generates a company-to-company quotation PDF with multiple products.
 */
export async function generateCompanyPDF({ companyname, address, products }) {
  const { pdf } = await createLetterheadPDF();

  // --- Addressee ---
  pdf.setFont(undefined, "bold");
  pdf.text("To,", 50, 160);
  pdf.setFont(undefined, "normal");
  pdf.text(companyname, 50, 180);
  pdf.text(address, 50, 200);

  // --- Date ---
  pdf.text(getFormattedDate(), 460, 160);

  // --- Subject ---
  pdf.setFont(undefined, "bold");
  const subject = products.length === 1 
    ? `RE: Quotation for ${products[0].name}`
    : "RE: Quotation for Multiple Products";
  const subjectLines = pdf.splitTextToSize(subject, 500);
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

  // --- Table Data ---
  const headers = ["Product Name", "Price (NPR)", "Quantity", "Total (NPR)"];
  
  // Truncate product names if they are too long (e.g., > 50 chars)
  const rows = products.map((p) => {
    let displayName = p.name;
    if (displayName.length > 55) {
      displayName = displayName.substring(0, 52) + "...";
    }
    
    return [
      displayName,
      p.price.toLocaleString(),
      p.quantity.toString(),
      (p.price * p.quantity).toLocaleString(),
    ];
  });

  // Grand Total Calculation
  const grandTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  
  // Add Grand Total Row with special formatting object
  rows.push({
    isTotal: true,
    label: "GRAND TOTAL",
    value: `NPR ${grandTotal.toLocaleString()}`
  });

  const colWidths = [200, 100, 80, 115]; // Total: 495pt
  const tableEndY = drawQuotationTable(pdf, headers, rows, colWidths, y);

  // --- Footer ---
  drawFooter(pdf, tableEndY);

  return pdf;
}
