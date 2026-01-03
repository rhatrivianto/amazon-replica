import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// fix ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFolder = path.join(__dirname, "src/shared/utils/formatters");
const targetFile = path.join(__dirname, "output.formatters.txt");

const files = fs.readdirSync(sourceFolder);

if (fs.existsSync(targetFile)) {
  fs.unlinkSync(targetFile);
}

files.forEach((file) => {
  const fullPath = path.join(sourceFolder, file);

  if (fs.statSync(fullPath).isFile()) {
    const content = fs.readFileSync(fullPath, "utf8");

    fs.appendFileSync(
      targetFile,
      `\n\n// ===== FILE: ${file} =====\n\n${content}`
    );
  }
});

console.log("SELESAI! File digabung ke:", targetFile);
