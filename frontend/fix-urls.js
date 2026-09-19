import fs from 'fs';
import path from 'path';

const directoryPath = path.join(process.cwd(), 'src');

function fixUrlsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('http://localhost:5000')) {
    const originalContent = content;
    // Barcha 'http://localhost:5000' yozuvlarini olib tashlaymiz
    content = content.replace(/http:\/\/localhost:5000/g, '');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ To'g'rilandi: ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      fixUrlsInFile(fullPath);
    }
  }
}

console.log('Fayllar tekshirilmoqda...');
traverseDirectory(directoryPath);

// vite.config.js faylini proxy uchun yangilaymiz
const viteConfigPath = path.join(process.cwd(), 'vite.config.js');
const proxyConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000'
    }
  }
})
`;
fs.writeFileSync(viteConfigPath, proxyConfig, 'utf-8');
console.log('✅ vite.config.js yangilandi!');
console.log('Barcha ishlar yakunlandi!');
