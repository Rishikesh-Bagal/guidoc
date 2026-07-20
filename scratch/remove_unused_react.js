const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

// Use the current working directory, which will be the project root when executed from there.
const files = walkSync(path.join(process.cwd(), 'frontend/src'));

let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Remove "import React from 'react';"
  content = content.replace(/^import React from ['"]react['"];?\r?\n/gm, '');
  
  // Replace "import React, { " with "import { "
  content = content.replace(/^import React,\s*\{/gm, 'import {');

  if (content !== original) {
    fs.writeFileSync(file, content);
    count++;
  }
});

console.log(`Updated ${count} files.`);
