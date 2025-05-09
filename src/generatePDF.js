import jsPDF from "jspdf";

export async function generateQuotationPDF({
  customerName,
  bank,
  productName,
  productPrice,
  downpayment,
  tenure,
}) {
  const financeAmount = productPrice - downpayment;
  const emiTerm = `${tenure} Months`;

  const pdf = new jsPDF("portrait", "pt", "a4");
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Load the letterhead image
  const imgUrl = "/letterhead.png";
  const imgData = await fetch(imgUrl)
    .then(res => res.blob())
    .then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

  pdf.setFont("Helvetica");

  // ---------------------------
  // Top Content
  // ---------------------------
  pdf.setFontSize(12);
  pdf.setFont(undefined, "bold");
  pdf.text("To,", 50, 160);
  pdf.setFont(undefined, "normal");
  pdf.text(`${bank} Bank`, 50, 180);

  pdf.text(`5th May ${new Date().getFullYear()}`, 460, 160);

  pdf.setFont(undefined, "bold");
  pdf.text(`RE: Quotation for ${productName}`, 50, 210);

  pdf.setFont(undefined, "bold");
  pdf.text("To whom it may concern,", 50, 240);

  pdf.setFont(undefined, "normal");
  const paragraph = `We, Sinja Commerce Pvt. Ltd., would like to inform you that our customer, Mr./Ms. ${customerName}, has requested to avail the EMI facility provided by your esteemed bank for the following products purchased from us:`;
  pdf.text(pdf.splitTextToSize(paragraph, 500), 50, 270);

  // ---------------------------
  // Table Content
  // ---------------------------
  const tableTop = 340;
  const rowHeight = 40;

  pdf.setDrawColor(0);
  pdf.setLineWidth(1);
  pdf.setFont(undefined, "bold");

  const tableData = [
    ["Product Name", productName],
    ["Product Amount", productPrice.toString()],
    ["Finance Amount", financeAmount.toString()],
    ["EMI Term", emiTerm],
  ];

  tableData.forEach((row, i) => {
    const y = tableTop + i * rowHeight;
    pdf.rect(50, y, 220, rowHeight);
    pdf.rect(270, y, 275, rowHeight);
    pdf.text(row[0], 60, y + 25);
    pdf.setFont(undefined, "normal");
    pdf.text(row[1], 280, y + 25);
    pdf.setFont(undefined, "bold");
  });

  // ---------------------------
  // Footer
  // ---------------------------
  pdf.setFont(undefined, "normal");
  pdf.text("Thank you for your support and cooperation.", 50, tableTop + 4 * rowHeight + 40);
  pdf.text("Sincerely,", 50, tableTop + 4 * rowHeight + 70);

  pdf.setFont(undefined, "bold");
  pdf.text("Manas Kharel", 50, tableTop + 4 * rowHeight + 110);
  pdf.text("Finance Department", 50, tableTop + 4 * rowHeight + 130);

  return pdf;
}
