"use strict";

let spreadsheet = module.exports = {};

spreadsheet.id="1LnVeld2tvZw1K9DxnNVHEzJhpQBfT5c2qZpeufiAcQo";

spreadsheet.fields = [{
  key: 'name',
  regex: /^\w{2,30}$/,
}, {
  key: 'age',
  regex: /^\d+$/,
}, {
  key: 'animal_type',
  regex: /^(dog|cat|gerbil)?$/,
}];

spreadsheet.getColumn = idx => {
  if (idx >= 26) return spreadsheet.getColumn(Math.floor(idx / 26) - 1) + spreadsheet.getColumn(idx % 26)
  return String.fromCharCode(idx + 65);
}
spreadsheet.getRowFromRange = range => {
  let rowNumber = +range.match(/A(\d+):\w+\d+/)[1];
  if (!rowNumber) throw new Error("Couldn't match row number:" + range);
  return rowNumber;
}
