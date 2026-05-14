-- SQL script to create the quotation_logs table in NeonDB

CREATE TABLE IF NOT EXISTS quotation_logs (
    id SERIAL PRIMARY KEY,
    quotation_type VARCHAR(50) NOT NULL, -- 'EMI' or 'Company'
    recipient_name TEXT NOT NULL,       -- Customer or Company Name
    total_amount DECIMAL(15, 2) NOT NULL, -- Grand Total
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
