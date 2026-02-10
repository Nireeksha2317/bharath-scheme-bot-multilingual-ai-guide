
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');

function addExtensions(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            addExtensions(filePath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Replace @shared/* aliases with relative paths
            // Assumption: imports from @shared are used in files within dist/server/
            // So @shared/foo -> ../shared/foo.js
            content = content.replace(/(from|import)\s+['"]@shared\/([^'"]+)['"]/g, (match, p1, p2) => {
                return `${p1} "../shared/${p2}.js"`;
            });

            // Replace relative imports with .js extensions
            content = content.replace(/(from|import)\s+['"](\.[^'"]+)['"]/g, (match, p1, p2) => {
                if (p2.endsWith('.js')) return match;
                return `${p1} "${p2}.js"`;
            });

            fs.writeFileSync(filePath, content);
            console.log(`Updated ${filePath}`);
        }
    }
}

if (fs.existsSync(distDir)) {
    addExtensions(distDir);
    console.log('Extensions added and aliases resolved.');
} else {
    console.log('Dist directory not found.');
}
