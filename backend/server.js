require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = Number(process.env.PORT || 3000);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in backend/.env");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

app.use(express.json({ limit: "100kb" }));

const allowedOrigins = (process.env.ALLOWED_ORIGIN || "")
  .split(",").map(v => v.trim()).filter(Boolean);

const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = allowedOrigins.length ? {
  origin: (origin, callback) => {
    if (!origin || origin === "null" || allowedOrigins.includes(origin) || localOriginPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
} : { origin: true };

app.use(cors(corsOptions));

const excelPath = path.resolve(
  __dirname,
  process.env.EXCEL_FILE || "../excel/GoGloria_Charter_Requests.xlsx"
);

const excelColumns = [
  "id", "name", "email", "phone", "yacht",
  "date", "message", "status", "created_at"
];

function validateRequest(body) {
  if (!body || !body.name || !String(body.name).trim()) return "Name is required.";

  const email = typeof body.email === "string" ? body.email.trim() : String(body.email ?? "").trim();

  if (!email) return "Email is required.";

  const emailRegex = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*$/i;

  if (!emailRegex.test(email)) {
    return "A valid email is required.";
  }

  return null;
}

async function getWorkbook() {
  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(excelPath)) {
    await workbook.xlsx.readFile(excelPath);
  }

  let sheet = workbook.getWorksheet("Charter Requests");

  if (!sheet) {
    sheet = workbook.addWorksheet("Charter Requests");
  }

  if (sheet.rowCount === 0) {
    sheet.addRow(excelColumns);
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = { from: "A1", to: "I1" };

    [38, 24, 32, 20, 22, 16, 55, 18, 28]
      .forEach((width, index) => sheet.getColumn(index + 1).width = width);
  }

  return { workbook, sheet };
}

async function appendToExcel(record) {
  const { workbook, sheet } = await getWorkbook();

  sheet.addRow(excelColumns.map(column => record[column] ?? ""));
  await workbook.xlsx.writeFile(excelPath);
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "GoGloria Backend",
    database: "Supabase"
  });
});

app.post("/api/charter-requests", async (req, res) => {
  try {
    const validationError = validateRequest(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const record = {
      name: String(req.body.name).trim(),
      email: String(req.body.email).trim(),
      phone: String(req.body.phone || "").trim(),
      yacht: String(req.body.yacht || "").trim(),
      date: req.body.date || null,
      message: String(req.body.message || "").trim(),
      status: "New"
    };

    // PRIMARY DATABASE: Supabase
    const { data, error } = await supabase
      .from("charter_requests")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({
        error: "The request could not be saved to Supabase."
      });
    }

    // SECONDARY COPY: Excel
    let excelSync = true;

    try {
      await appendToExcel(data);
    } catch (excelError) {
      excelSync = false;
      console.error("Excel synchronization error:", excelError);
    }

    return res.status(201).json({
      success: true,
      data,
      excelSync
    });

  } catch (error) {
    console.error("Backend error:", error);
    return res.status(500).json({
      error: "Unexpected server error."
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GoGloria Backend running at http://localhost:${PORT}`);
    console.log(`Supabase: connected through server-side credentials`);
    console.log(`Excel: ${excelPath}`);
  });
}

module.exports = app;
