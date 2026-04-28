import jsPDF from "jspdf";

/**
 * Creates a new A4-sized jsPDF instance with the Sinja letterhead background.
 * @returns {Promise<{pdf: jsPDF, pageWidth: number, pageHeight: number}>}
 */
export async function createLetterheadPDF() {
  const pdf = new jsPDF("portrait", "pt", "a4");
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  const imgData = await fetch("/letterhead.png")
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
  pdf.setFontSize(12);

  return { pdf, pageWidth, pageHeight };
}

/**
 * Returns today's date formatted as "27 April 2025".
 * @returns {string}
 */
export function getFormattedDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Draws a two-column table on the PDF.
 * @param {jsPDF} pdf
 * @param {Array<[string, string]>} rows - Array of [label, value] pairs
 * @param {number} startY - Y position to start the table
 * @returns {number} The Y position after the table
 */
export function drawTable(pdf, rows, startY) {
  const col1X = 50;
  const col2X = 270;
  const col1Width = 220;
  const col2Width = 275;
  let y = startY;

  rows.forEach((row) => {
    const wrappedValue = pdf.splitTextToSize(row[1], col2Width - 20);
    const rowHeight = Math.max(40, wrappedValue.length * 15 + 10);

    // Draw cell borders
    pdf.rect(col1X, y, col1Width, rowHeight);
    pdf.rect(col2X, y, col2Width, rowHeight);

    // Label (bold)
    pdf.setFont(undefined, "bold");
    pdf.text(row[0], col1X + 10, y + 25);

    // Value (normal)
    pdf.setFont(undefined, "normal");
    pdf.text(wrappedValue, col2X + 10, y + 25);

    y += rowHeight;
  });

  return y;
}

/**
 * Draws the standard sign-off footer on the PDF.
 * @param {jsPDF} pdf
 * @param {number} startY - Y position to start the footer
 */
export function drawFooter(pdf, startY) {
  let y = startY + 40;
  pdf.setFont(undefined, "normal");
  pdf.text("Thank you for your support and cooperation.", 50, y);

  y += 30;
  pdf.text("Sincerely,", 50, y);

  y += 40;
  pdf.setFont(undefined, "bold");
  pdf.text("Manas Kharel", 50, y);
  pdf.text("Finance Department", 50, y + 20);
}
