import fs from "fs";
import path from "path";

const inputFile = path.resolve("all_frontend_files.txt");
const outputDir = path.resolve("split_output_final");

console.log("📖 Reading large file:", inputFile);

const fileContent = fs.readFileSync(inputFile, "utf8");
const totalSize = Buffer.byteLength(fileContent, "utf8");
const targetPartSize = totalSize / 3;

console.log(`📊 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`🎯 Target per part: ${(targetPartSize / 1024 / 1024).toFixed(2)} MB`);

// Method 1: Split by clear file separators
const sections = fileContent.split(/\n\n(?=={70}\n📁 FILE: |={62}\nFILE: )/);

console.log(`📁 Found ${sections.length} sections with split method`);

// Process sections to identify files
const fileSections = [];
let currentFile = null;

for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    
    // Skip empty sections
    if (!section) continue;
    
    // Check if this is a file header
    const isRootFile = section.startsWith("======================================================================\n📁 FILE:");
    const isSrcFile = section.startsWith("============================================================\nFILE:");
    
    if (isRootFile || isSrcFile) {
        // Save previous file if exists
        if (currentFile) {
            fileSections.push(currentFile);
        }
        
        // Extract filename
        let filename = "";
        if (isRootFile) {
            const match = section.match(/📁 FILE: (.+?)\n/);
            filename = match ? match[1] : `file_${fileSections.length + 1}`;
        } else {
            const match = section.match(/FILE: (.+?)\n/);
            filename = match ? match[1] : `file_${fileSections.length + 1}`;
        }
        
        currentFile = {
            filename: filename,
            content: section,
            size: Buffer.byteLength(section, "utf8")
        };
    } else if (currentFile) {
        // Continue adding to current file
        currentFile.content += '\n\n' + section;
        currentFile.size += Buffer.byteLength('\n\n' + section, "utf8");
    }
}

// Don't forget the last file
if (currentFile) {
    fileSections.push(currentFile);
}

console.log(`📄 Identified ${fileSections.length} file sections`);

// If still no files found, use alternative method
if (fileSections.length === 0) {
    console.log("🔄 Using alternative parsing method...");
    
    // Alternative: Split by double newlines and group logically
    const allSections = fileContent.split(/\n\n/);
    let altCurrentFile = null;
    
    for (let i = 0; i < allSections.length; i++) {
        const section = allSections[i];
        
        if (section.includes("FILE:") && (section.includes("SIZE:") || section.includes("characters"))) {
            if (altCurrentFile) {
                fileSections.push(altCurrentFile);
            }
            
            const filenameMatch = section.match(/FILE: (.+?)(\n|$)/);
            altCurrentFile = {
                filename: filenameMatch ? filenameMatch[1].trim() : `file_${fileSections.length + 1}`,
                content: section,
                size: Buffer.byteLength(section, "utf8")
            };
        } else if (altCurrentFile && section.trim()) {
            altCurrentFile.content += '\n\n' + section;
            altCurrentFile.size += Buffer.byteLength('\n\n' + section, "utf8");
        }
    }
    
    if (altCurrentFile) {
        fileSections.push(altCurrentFile);
    }
    
    console.log(`📄 Found ${fileSections.length} files with alternative method`);
}

if (fileSections.length === 0) {
    console.log("❌ ERROR: Cannot extract any files. File format may be corrupted.");
    process.exit(1);
}

console.log(`\n📊 First 5 files found:`);
fileSections.slice(0, 5).forEach((file, i) => {
    console.log(`  ${i + 1}. ${file.filename} (${(file.size / 1024).toFixed(1)} KB)`);
});

// Sequential splitting into 3 parts
const parts = [[], [], []];
const partSizes = [0, 0, 0];
let currentPart = 0;

for (const file of fileSections) {
    // If current part is getting full and not the last part, move to next
    if (currentPart < 2 && partSizes[currentPart] + file.size > targetPartSize) {
        console.log(`🔄 Moving to part ${currentPart + 2} after ${parts[currentPart].length} files (${(partSizes[currentPart] / 1024 / 1024).toFixed(2)} MB)`);
        currentPart++;
    }
    
    parts[currentPart].push(file);
    partSizes[currentPart] += file.size;
}

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log("\n📊 Final Distribution:");
parts.forEach((partFiles, index) => {
    const sizeMB = partSizes[index] / 1024 / 1024;
    console.log(`  Part ${index + 1}: ${partFiles.length} files, ${sizeMB.toFixed(2)} MB`);
});

// Write output files
parts.forEach((partFiles, partIndex) => {
    const outputFile = path.join(outputDir, `frontend_part_${partIndex + 1}_of_3.txt`);
    
    let content = `// FRONTEND FILES - PART ${partIndex + 1} OF 3\n` +
                  `// TOTAL FILES: ${partFiles.length}\n` +
                  `// APPROXIMATE SIZE: ${(partSizes[partIndex] / 1024 / 1024).toFixed(2)} MB\n` +
                  `// FROM: ${path.basename(inputFile)}\n` +
                  `// GENERATED: ${new Date().toISOString()}\n\n`;
    
    // Add original header to part 1
    if (partIndex === 0) {
        const originalHeader = fileContent.match(/(\/\/ ALL FILES FROM FRONTEND:[\s\S]*?EXCLUDED: node_modules\n\n\n)/);
        if (originalHeader) {
            content = originalHeader[1] + content;
        }
    }
    
    // Add all files
    partFiles.forEach(file => {
        content += file.content + '\n\n';
    });
    
    // Add file list summary
    content += `\n// FILE LIST IN THIS PART (${partFiles.length} files):\n`;
    partFiles.forEach((file, idx) => {
        content += `// ${idx + 1}. ${file.filename}\n`;
    });
    
    content += `\n// END OF PART ${partIndex + 1}`;
    
    fs.writeFileSync(outputFile, content);
    const outputSize = Buffer.byteLength(content, "utf8");
    console.log(`✅ Part ${partIndex + 1}: ${(outputSize / 1024 / 1024).toFixed(2)} MB, ${partFiles.length} files`);
});

const totalOutputSize = parts.reduce((total, partFiles) => {
    return total + partFiles.reduce((sum, file) => sum + file.size, 0);
}, 0);

console.log(`\n🎉 SUCCESS! File successfully split into 3 parts`);
console.log(`📈 Original: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📈 Output: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📁 Location: ${outputDir}/`);