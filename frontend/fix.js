const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}
walk('d:/Coding/InvoicePro/frontend/src').forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('class="')) {
    content = content.replace(/class="/g, 'className="');
    fs.writeFileSync(f, content, 'utf8');
  }
});
