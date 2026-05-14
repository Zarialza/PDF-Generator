"use server";

import sql from "./db";

/**
 * Logs a PDF generation event to the database.
 * 
 * @param {Object} params
 * @param {string} params.type - "EMI" or "Company"
 * @param {string} params.recipient - Name of the customer or company
 * @param {number} params.amount - Total amount on the quotation
 */
export async function logGeneration({ type, recipient, amount }) {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not found. Skipping log.");
      return;
    }

    await sql`
      INSERT INTO quotation_logs (quotation_type, recipient_name, total_amount)
      VALUES (${type}, ${recipient}, ${amount})
    `;
    console.log(`Logged ${type} quotation for ${recipient} ($${amount})`);
  } catch (error) {
    console.error("Failed to log quotation:", error);
  }
}
