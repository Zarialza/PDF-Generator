import jsPDF from "jspdf";

export async function generateQuotationPDF({
  companyname,
  address,
  productName,
  productPrice,
}) {
  const pdf = new jsPDF("portrait", "pt", "a4");
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Load the letterhead image
  const imgUrl = "/letterhead.png";
  const imgData = await fetch(imgUrl)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

  pdf.setFont("Helvetica");

  // ---------------------------
  // Top Content
  // ---------------------------
  pdf.setFontSize(12);
  pdf.setFont(undefined, "bold");
  pdf.text("To,", 50, 160);
  pdf.setFont(undefined, "normal");
  pdf.text(`${companyname}`, 50, 180);
  pdf.text(`${address}`, 50, 200);

  // Date
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;
  pdf.text(formattedDate, 460, 160);

  // Product name in subject (wrap long product name)
  pdf.setFont(undefined, "bold");
  const subjectText = `RE: Quotation for ${productName}`;
  const wrappedSubject = pdf.splitTextToSize(subjectText, 500);
  pdf.text(wrappedSubject, 50, 240);

  // Calculate the Y position after wrapped subject
  const subjectHeight = wrappedSubject.length * 15;
  let currentY = 240 + subjectHeight + 30;

  pdf.text("To whom it may concern,", 50, currentY);
  currentY += 30;

  pdf.setFont(undefined, "normal");
  const paragraph = `The requested quotation as per our conversation is provided as follows:`;
  const wrappedPara = pdf.splitTextToSize(paragraph, 500);
  pdf.text(wrappedPara, 50, currentY);
  currentY += wrappedPara.length * 15 + 20;

  // ---------------------------
  // Table Content
  // ---------------------------
  const col1Width = 220;
  const col2Width = 275;
  let y = currentY;

  const tableData = [
    ["Product Name", productName],
    ["Product Amount (Including VAT)", productPrice.toString()],
  ];

  pdf.setFont(undefined, "bold");

  tableData.forEach((row) => {
    pdf.setFont(undefined, "bold");
    const wrappedCol2 = pdf.splitTextToSize(row[1], col2Width - 20);
    const rowHeight = Math.max(40, wrappedCol2.length * 15 + 10);

    // Draw cells
    pdf.rect(50, y, col1Width, rowHeight);
    pdf.rect(270, y, col2Width, rowHeight);

    // Column 1
    pdf.text(row[0], 60, y + 25);

    // Column 2
    pdf.setFont(undefined, "normal");
    pdf.text(wrappedCol2, 280, y + 25);

    // Move Y for next row
    y += rowHeight;
  });

  // ---------------------------
  // Footer
  // ---------------------------
  y += 40;
  pdf.setFont(undefined, "normal");
  pdf.text("Thank you for your support and cooperation.", 50, y);
  y += 30;
  pdf.text("Sincerely,", 50, y);

  y += 40;
  pdf.setFont(undefined, "bold");
  pdf.text("Manas Kharel", 50, y);
  pdf.text("Finance Department", 50, y + 20);

  return pdf;
}
