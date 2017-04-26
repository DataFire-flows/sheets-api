"use strict";

let spreadsheet = module.exports = {};

spreadsheet.id="12l8GpqPRbweYf-1DApcp3lBJ-btpA8yTr2GCMnZ1FQY";

spreadsheet.fields = [{
  title: 'name',
  type: 'string',
  pattern: "^\\w{2,30}$",
}, {
  title: 'age',
  type: 'integer',
  minimum: 0,
}, {
  title: 'animal_type',
  type: 'string',
  enum: ['', 'dog', 'cat', 'gerbil'],
  default: '',
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
