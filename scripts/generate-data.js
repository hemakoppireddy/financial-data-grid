import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const TOTAL_ROWS = 1000000;

const merchants = [
  "TechCorp",
  "Amazon",
  "Walmart",
  "Apple Store",
  "Google Services",
  "Netflix",
  "Uber",
  "Starbucks",
  "Microsoft",
  "Target"
];

const categories = [
  "Shopping",
  "Food",
  "Travel",
  "Entertainment",
  "Technology",
  "Utilities"
];

const statuses = ["Completed", "Pending", "Failed"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount() {
  return parseFloat((Math.random() * 1000).toFixed(2));
}

function randomDate() {
  const start = new Date(2023, 0, 1).getTime();
  const end = new Date().getTime();
  const random = new Date(start + Math.random() * (end - start));
  return random.toISOString();
}

function generateTransaction(id) {
  return {
    id: id,
    date: randomDate(),
    merchant: randomItem(merchants),
    category: randomItem(categories),
    amount: randomAmount(),
    status: randomItem(statuses),
    description: "Transaction at " + randomItem(merchants)
  };
}

function generateData() {
  const filePath = path.join(__dirname, "../public/transactions.json");

  console.log("Generating 1,000,000 transactions...");

  const stream = fs.createWriteStream(filePath);

  stream.write("[\n");

  for (let i = 1; i <= TOTAL_ROWS; i++) {
    const transaction = generateTransaction(i);

    const json = JSON.stringify(transaction);

    if (i === TOTAL_ROWS) {
      stream.write(json + "\n");
    } else {
      stream.write(json + ",\n");
    }

    if (i % 100000 === 0) {
      console.log(`${i} rows generated...`);
    }
  }

  stream.write("]");
  stream.end();

  console.log("Dataset created at public/transactions.json");
}

generateData();