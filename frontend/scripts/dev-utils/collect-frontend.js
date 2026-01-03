import fs from "fs";
import path from "path";

const sourceFolder = path.resolve("src");
const outputFile = path.resolve("all_src_files.txt");

let allContent = `// ALL FILES FROM: ${sourceFolder}\n`;
allContent += `// GENERATED: ${new Date().toISOString()}\n\n`;

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      const relativePath = path.relative(sourceFolder, fullPath);
      const content = fs.readFileSync(fullPath, "utf8");
      
      allContent += `\n\n${'='.repeat(60)}\n`;
      allContent += `FILE: ${relativePath}\n`;
      allContent += `${'='.repeat(60)}\n\n`;
      allContent += content;
    }
  });
}

processDirectory(sourceFolder);
fs.writeFileSync(outputFile, allContent);
console.log(`✅ Done! All files combined into: ${outputFile}`);