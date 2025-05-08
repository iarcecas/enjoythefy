import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certificatesDir = path.join(__dirname, "..", "certificates");

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir);
}

// Generate private key
execSync("openssl genpkey -algorithm RSA -out localhost.key", {
  stdio: "inherit",
});

// Generate CSR
execSync(
  'openssl req -new -key localhost.key -out localhost.csr"',
  { stdio: "inherit" },
);

// Generate self-signed certificate
execSync(
  "openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt",
  { stdio: "inherit" },
);

console.log("Certificates generated successfully!");
