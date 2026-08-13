const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

async function main() {
  const output = path.resolve(__dirname, "../excel/GoGloria_Charter_Requests.xlsx");
  fs.mkdirSync(path.dirname(output), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Charter Requests");

  const headers = [
    "id", "name", "email", "phone", "yacht",
    "date", "message", "status", "created_at"
  ];

  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: "A1", to: "I1" };

  [38, 24, 32, 20, 22, 16, 55, 18, 28]
      .forEach((width, index) => sheet.getColumn(index + 1).width = width);

  await workbook.xlsx.writeFile(output);
  console.log(`Created ${output}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
