import fs from "fs";
import path from "path";

const sourceFolder = path.resolve("../../src/shared/utils/constants");
const targetFile = path.resolve("output.constants.txt");

// baca semua file
const files = fs.readdirSync(sourceFolder);

// hapus file output jika sudah ada
if (fs.existsSync(targetFile)) {
  fs.unlinkSync(targetFile);
}

files.forEach((file) => {
  const fullPath = path.join(sourceFolder, file);

  // hanya copy file biasa
  if (fs.statSync(fullPath).isFile()) {
    const content = fs.readFileSync(fullPath, "utf8");

    fs.appendFileSync(
      targetFile,
      `\n\n// ===== FILE: ${file} =====\n\n${content}`
    );
  }
});

console.log("Selesai! Semua isi file digabung ke output.txt");
