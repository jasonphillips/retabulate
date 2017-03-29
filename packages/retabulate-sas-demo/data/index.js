const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const transform = require('stream-transform');

/**
 * generate JSON documents in 'public/' directory for demo 
**/
const files = [
    'births',
    'deaths',
];

const seen = {};

const transformer = (holder) => transform(function(record, callback) {
    const pre = holder.first ? '' : ',';
    holder.first = false;
    callback(null, pre + JSON.stringify(record));
}, {parallel: 1});

function saveDataset() {
  const name = files.shift();

  return new Promise((resolve, reject) => {
    const parsing = parse({columns:true, auto_parse:true});
    const outFile = fs.createWriteStream(path.join(__dirname, `../public/data/${name}.json`));
    outFile.write('{"records":[\n');

    fs.createReadStream(path.join(__dirname, `./${name}.csv`))
        .pipe(parsing)
        .pipe(transformer({first:true}))
        .pipe(outFile);
    
    parsing.on('finish', () => {
        outFile.close();
        fs.appendFileSync(path.join(__dirname, `../public/data/${name}.json`),'\n]}');

        if (files.length) resolve(saveDataset());
        else resolve(true);
    });
  });
}

saveDataset().then(() => 0);