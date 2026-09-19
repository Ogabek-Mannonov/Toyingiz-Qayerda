const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const apiClientPath = path.join(srcDir, 'api', 'apiClient.js');

function refactorAxiosInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes("import axios from 'axios'")) {
    
    // apiClient gacha bo'lgan nisbiy (relative) yo'lni hisoblaymiz
    const fileDir = path.dirname(filePath);
    let relativePath = path.relative(fileDir, path.dirname(apiClientPath)).replace(/\\/g, '/');
    
    // agar bir xil papkada bo'lsa './' kerak
    if (relativePath === '') {
      relativePath = '.';
    } else if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    
    const importStatement = `import axios from '${relativePath}/apiClient'`;
    
    // Barcha import axios from 'axios' larni yangi yo'l bilan almashtiramiz
    content = content.replace(/import axios from 'axios';?/g, importStatement + ';');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ To'g'rilandi: ${filePath}`);
    return true;
  }
  return false;
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  let updatedCount = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updatedCount += traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      if (refactorAxiosInFile(fullPath)) {
        updatedCount++;
      }
    }
  }
  return updatedCount;
}

console.log('Frontend fayllar tekshirilmoqda...');
const count = traverseDirectory(srcDir);
console.log(`🎉 Jami ${count} ta faylda axios importlari to'g'rilandi!`);
