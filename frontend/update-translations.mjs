import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'src/locales');

const updateLocale = (lang, newKeys) => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  let current = {};
  if (fs.existsSync(filePath)) {
    current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // deep merge
  const merge = (target, source) => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) Object.assign(source[key], merge(target[key] || {}, source[key]));
    }
    Object.assign(target || {}, source);
    return target;
  };

  const updated = merge(current, newKeys);
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
};

const args = process.argv.slice(2);
const lang = args[0];
const jsonStr = args[1];

if (lang && jsonStr) {
  const data = JSON.parse(jsonStr);
  updateLocale(lang, data);
  console.log(`Updated ${lang} translations.`);
}
