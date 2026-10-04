const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUTPUT_FILE = path.join(ROOT, 'project-export.txt');

// Carpetas a incluir
const INCLUDE_DIRS = ['src', 'server', 'public'];

// Carpetas/archivos a ignorar
const IGNORE = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.cache',
  'coverage',
  '.env',
  '.env.local',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

// Extensiones de archivos de texto a incluir
const TEXT_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.html', '.json', 
  '.md', '.txt', '.env', '.gitignore', '.dockerignore', '.yml', '.yaml',
  '.svg', '.xml', '.sh', '.bat', '.config', '.prettierrc', '.eslintrc'
];

// Tamaño máximo por archivo (500KB)
const MAX_FILE_SIZE = 500 * 1024;

let output = '';
let fileCount = 0;

function shouldIgnore(filePath) {
  const relativePath = path.relative(ROOT, filePath);
  return IGNORE.some(ignore => 
    relativePath.includes(ignore) || 
    path.basename(filePath) === ignore
  );
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath).toLowerCase();
  
  // Archivos sin extensión pero conocidos
  if (['dockerfile', 'makefile', 'license', 'readme'].includes(basename)) return true;
  
  return TEXT_EXTENSIONS.includes(ext) || ext === '';
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (shouldIgnore(fullPath)) continue;
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && isTextFile(fullPath)) {
      try {
        const stats = fs.statSync(fullPath);
        
        if (stats.size > MAX_FILE_SIZE) {
          output += `\n=== FILE: ${path.relative(ROOT, fullPath)} ===\n`;
          output += `[ARCHIVO DEMASIADO GRANDE: ${Math.round(stats.size / 1024)}KB - OMITIDO]\n`;
          output += `=== END FILE ===\n\n`;
          continue;
        }
        
        const content = fs.readFileSync(fullPath, 'utf-8');
        const relativePath = path.relative(ROOT, fullPath);
        
        output += `\n=== FILE: ${relativePath} ===\n`;
        output += content;
        output += `\n=== END FILE ===\n\n`;
        
        fileCount++;
        console.log(`✓ ${relativePath}`);
      } catch (error) {
        console.error(`✗ Error leyendo ${fullPath}: ${error.message}`);
      }
    }
  }
}

console.log('📦 Exportando proyecto...\n');

// Agregar metadata al inicio
output += `# EXPORTACIÓN DE PROYECTO\n`;
output += `# Fecha: ${new Date().toISOString()}\n`;
output += `# Total de archivos: ${fileCount}\n`;
output += `# ========================================\n\n`;

// Procesar cada carpeta
for (const dir of INCLUDE_DIRS) {
  const dirPath = path.join(ROOT, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`\n📂 Procesando ${dir}/`);
    processDirectory(dirPath);
  } else {
    console.log(`⚠️  Carpeta ${dir}/ no encontrada`);
  }
}

// También incluir archivos de configuración en la raíz
const rootFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'vite.config.js', 'tailwind.config.js', 'tailwind.config.ts', 'postcss.config.js', 'Dockerfile', 'docker-compose.yml', '.env.example'];

console.log('\n📄 Procesando archivos de configuración');
for (const file of rootFiles) {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      output += `\n=== FILE: ${file} ===\n`;
      output += content;
      output += `\n=== END FILE ===\n\n`;
      fileCount++;
      console.log(`✓ ${file}`);
    } catch (error) {
      console.error(`✗ Error leyendo ${file}: ${error.message}`);
    }
  }
}

// Actualizar el contador al inicio
output = output.replace('# Total de archivos: 0', `# Total de archivos: ${fileCount}`);

// Guardar archivo
fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

console.log(`\n✅ ¡Exportación completada!`);
console.log(`📄 Archivo generado: ${OUTPUT_FILE}`);
console.log(`📊 Total de archivos exportados: ${fileCount}`);
console.log(`\n💡 Ahora abre el archivo 'project-export.txt', copia TODO su contenido y pégalo en el chat.`);