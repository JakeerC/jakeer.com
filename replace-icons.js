const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/components/ArticleCard.tsx",
  "src/components/CodeBlockClient.tsx",
  "src/components/CommandPalette.tsx",
  "src/components/Navbar.tsx",
  "src/lib/data.ts",
  "src/components/FaqItem.tsx",
  "src/app/projects/page.tsx",
  "src/app/writing/WritingClient.tsx",
  "src/app/writing/[slug]/page.tsx",
  "src/app/page.tsx",
  "src/app/tools/page.tsx",
  "src/app/notes/page.tsx",
  "src/app/snippets/[category]/page.tsx"
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Find the import statement from 'lucide-react'
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importStr = match[1];
    const icons = importStr.split(',').map(s => s.trim()).filter(s => s);
    
    // Create new import statement
    const newIcons = icons.map(icon => `Lu${icon}`);
    const newImportStr = `import { ${newIcons.join(', ')} } from "react-icons/lu";`;
    
    // Replace the import statement
    content = content.replace(match[0], newImportStr);

    // Replace usages of the icons
    icons.forEach(icon => {
      // We need to replace whole word occurrences of the icon name.
      // e.g. <Clock to <LuClock
      // Clock} to LuClock}
      // Clock, to LuClock,
      // But we should not replace it if it's already part of another word.
      // We can use word boundaries \b, but since it starts with capital letter, we can be a bit more robust:
      const iconRegex = new RegExp(`\\b${icon}\\b`, 'g');
      content = content.replace(iconRegex, `Lu${icon}`);
    });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
