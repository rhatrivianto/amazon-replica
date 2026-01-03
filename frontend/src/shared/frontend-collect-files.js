

import fs from "fs";
import path from "path";

const sourceFolder = path.resolve("shared"); // Current folder (frontend)
const outputFile = path.resolve("all_shared.txt");

console.log("🔍 Processing frontend folder:", sourceFolder);

let allContent = `// ALL FILES FROM FRONTEND: ${sourceFolder}\n`;
allContent += `// GENERATED: ${new Date().toISOString()}\n`;
allContent += `// EXCLUDED: node_modules, .jpg, .svg, .md\n\n`;

let fileCount = 0;

// Folder yang akan di-exclude
const excludedFolders = ['node_modules'];
// Ekstensi file yang akan di-exclude
const excludedExtensions = ['.jpg', '.svg', '.md', '.png', '.ico'];

function shouldExclude(filePath, item) {
    const fullPath = path.join(filePath, item);
    
    try {
        const stat = fs.statSync(fullPath);
        
        // Exclude berdasarkan nama folder
        if (stat.isDirectory() && excludedFolders.includes(item)) {
            return true;
        }
        
        // Exclude berdasarkan ekstensi file
        if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (excludedExtensions.includes(ext)) {
                return true;
            }
        }
        
        // Exclude berdasarkan path lengkap (untuk folder node_modules di subdirectory)
        const relativePath = path.relative(sourceFolder, fullPath);
        return excludedFolders.some(folder => 
            relativePath.includes(path.sep + folder + path.sep) || 
            relativePath.startsWith(folder + path.sep)
        );
    } catch (error) {
        console.log(`❌ Error checking: ${fullPath}`, error.message);
        return true; // Skip jika ada error
    }
}

function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach((item) => {
        // Skip excluded items
        if (shouldExclude(dir, item)) {
            console.log(`⏭️  Skipped: ${path.join(dir, item)}`);
            return;
        }
        
        const fullPath = path.join(dir, item);
        
        try {
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                processDirectory(fullPath);
            } else if (stat.isFile()) {
                const relativePath = path.relative(sourceFolder, fullPath);
                const content = fs.readFileSync(fullPath, "utf8");
                
                allContent += `\n\n${'='.repeat(70)}\n`;
                allContent += `📁 FILE: ${relativePath}\n`;
                allContent += `📏 SIZE: ${content.length} characters\n`;
                allContent += `${'='.repeat(70)}\n\n`;
                allContent += content;
                
                fileCount++;
                console.log(`✓ Processed: ${relativePath}`);
            }
        } catch (error) {
            console.log(`❌ Error reading: ${fullPath}`, error.message);
        }
    });
}

// Process semua file di frontend
console.log("🔄 Processing frontend files...");
processDirectory(sourceFolder);

// Update total files count
allContent += `\n\n// TOTAL FILES PROCESSED: ${fileCount}\n`;

// Tulis output
fs.writeFileSync(outputFile, allContent);
console.log(`\n🎉 SUCCESS! Processed ${fileCount} files into: ${outputFile}`);