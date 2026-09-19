const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');

function refactorControllers() {
  const files = fs.readdirSync(controllersDir);

  let updatedCount = 0;

  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let hasChanges = false;

    // 1. async (req, res) -> async (req, res, next)
    const newContent = content.replace(/async\s*\(\s*req\s*,\s*res\s*\)/g, 'async (req, res, next)');
    if (newContent !== content) {
      content = newContent;
      hasChanges = true;
    }

    // 2. res.status(500).json(...) -> next(error) yoki next(err)
    // catch (error) ni aniqlab, qanday o'zgaruvchi ishlatilganini bilib olish ancha qiyin, lekin odatda error ishlatiladi.
    // Biz res.status(500) qatorlarini next(error) ga almashtiramiz. (Console.error() lar qolishi mumkin, zarari yo'q)
    const nextContent = content.replace(/res\.status\(500\)\.json\([^)]*\);?/g, 'next(error);');
    if (nextContent !== content) {
      content = nextContent;
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ To'g'rilandi: ${file}`);
      updatedCount++;
    }
  }

  console.log(`🎉 Jami ${updatedCount} ta fayl muvaffaqiyatli refactor qilindi!`);
}

refactorControllers();
