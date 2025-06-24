// Load the workbook and select the first sheet
const workbook = xlsx.readFile('input.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert sheet to array of rows
const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

// Define markers
const startMarker = 'V. Inversiones financieras a largo plazo';
const endMarker = 'VI. Activos por impuesto diferido';

// Find start and end indices
let startIndex = rows.findIndex(row => row[1] === startMarker);
let endIndex = rows.findIndex(row => row[1] === endMarker);

if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
  console.error('Markers not found or invalid range');
  process.exit(1);
}

// Extract data between markers (exclusive)
const data = [];
for (let i = startIndex + 1; i < endIndex; i++) {
  const description = rows[i][1];
  const balance = rows[i][2];
  data.push({ description, balance });
}

// Print the resulting array of dictionaries
console.log(JSON.stringify(data, null, 2));