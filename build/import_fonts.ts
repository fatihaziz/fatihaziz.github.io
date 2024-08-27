import fs from 'fs';
import path from 'path';

function getAllFontCssFilesRecursively(dir:string) {
  let results:any[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively search within this directory
      results = results.concat(getAllFontCssFilesRecursively(filePath));
    } else if (file.endsWith('.css')) {
      // Add the CSS file to the results
      results.push(filePath);
    }
  });

  return results;
}

export function getAllFontCssFiles() {
  const fontDir = path.resolve(__dirname, '../assets/font');
  const fontFiles = getAllFontCssFilesRecursively(fontDir);

  // Convert absolute paths to relative paths with Nuxt alias
  return fontFiles.map((file:any) => {
    const relativePath = path.relative(path.resolve(__dirname, '..'), file);
    return `~/${relativePath.replace(/\\/g, '/')}`;
  });
}