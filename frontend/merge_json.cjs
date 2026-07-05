const fs = require('fs');

const file1 = process.argv[2];
const file2 = process.argv[3];

if (fs.existsSync(file1) && fs.existsSync(file2)) {
  const data1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
  const data2 = JSON.parse(fs.readFileSync(file2, 'utf8'));

  const merge = (target, source) => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        if (!target[key]) target[key] = {};
        Object.assign(source[key], merge(target[key] || {}, source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  };

  const updated = merge(data1, data2);
  fs.writeFileSync(file1, JSON.stringify(updated, null, 2));
  console.log(`Merged ${file2} into ${file1}`);
}
