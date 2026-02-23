const fs = require('fs');
const vm = require('vm');

const files = ['form-logic.js','home-logic.js','admin-logic.js'];
let failed = false;

files.forEach(f => {
  try {
    const code = fs.readFileSync(f, 'utf8');
    new vm.Script(code, { filename: f });
    console.log(f + ': OK');
  } catch (err) {
    failed = true;
    console.error(f + ': SYNTAX ERROR');
    console.error(err && err.stack ? err.stack : err);
  }
});
if (failed) process.exit(1);
else process.exit(0);
