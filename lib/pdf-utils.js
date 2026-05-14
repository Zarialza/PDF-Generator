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

/**
 * Draws a multi-column table for quotations.
 * @param {jsPDF} pdf
 * @param {Array<string>} headers - Array of column headers
 * @param {Array<Array<string>|Object>} rows - Array of rows. 
 *        Can be an array of values, or an object { isTotal: true, label: string, value: string }
 * @param {Array<number>} colWidths - Array of column widths
 * @param {number} startY - Y position to start the table
 * @returns {number} The Y position after the table
 */
export function drawQuotationTable(pdf, headers, rows, colWidths, startY) {
  const startX = 50;
  let y = startY;

  // Draw Header
  pdf.setFont(undefined, "bold");
  let currentX = startX;
  headers.forEach((header, i) => {
    pdf.rect(currentX, y, colWidths[i], 30);
    pdf.text(header, currentX + 5, y + 20);
    currentX += colWidths[i];
  });
  y += 30;

  // Draw Rows
  rows.forEach((row) => {
    if (row.isTotal) {
      // Handle Grand Total Row (Colspan behavior)
      pdf.setFont(undefined, "bold");
      const labelWidth = colWidths[0] + colWidths[1] + colWidths[2];
      const valueWidth = colWidths[3];
      const rowHeight = 30;

      // Label cell (spans 3 columns)
      pdf.rect(startX, y, labelWidth, rowHeight);
      pdf.text(row.label, startX + labelWidth - 10, y + 20, { align: "right" });

      // Value cell (last column)
      pdf.rect(startX + labelWidth, y, valueWidth, rowHeight);
      pdf.text(row.value, startX + labelWidth + 5, y + 20);

      y += rowHeight;
    } else {
      // Handle Standard Row
      pdf.setFont(undefined, "normal");
      let currentX = startX;
      
      let maxRowHeight = 30;
      row.forEach((cell, i) => {
        const wrapped = pdf.splitTextToSize(cell.toString(), colWidths[i] - 10);
        const cellHeight = wrapped.length * 15 + 10;
        if (cellHeight > maxRowHeight) maxRowHeight = cellHeight;
      });

      row.forEach((cell, i) => {
        pdf.rect(currentX, y, colWidths[i], maxRowHeight);
        const wrapped = pdf.splitTextToSize(cell.toString(), colWidths[i] - 10);
        pdf.text(wrapped, currentX + 5, y + 20);
        currentX += colWidths[i];
      });
      y += maxRowHeight;
    }
  });

  return y;
}
