"use strict";

let datafire = require('datafire');
let spreadsheet = require('./spreadsheet');
let sheets = datafire.Integration.new('google-sheets').as('default');

let flow = module.exports = new datafire.Flow('Retrieve Pets');

const PAGE_SIZE = 20;

flow.step('pets', {
  do: sheets.get("/v4/spreadsheets/{spreadsheetId}/values:batchGet"),
  params: data => {
    let startRow = 1 + (flow.params.page || 0) * PAGE_SIZE;
    let endRow = startRow + PAGE_SIZE;
    let lastCol = spreadsheet.getColumn(spreadsheet.fields.length - 1);
    let ranges = [];
    for (let i = startRow; i < endRow; ++i) {
      ranges.push('A' + i + ':' + lastCol + i);
    }
    return {
      spreadsheetId: spreadsheet.id,
      ranges: ranges,
    }
  },
  finish: data => {
    data.pets = data.pets.valueRanges
        .filter(range => range.values)
        .map(range => {
          let pet = {};
          spreadsheet.fields.forEach((field, idx) => {
            pet[field.key] = range.values[0][idx]
          });
          return pet;
        });
        flow.succeed(data.pets);
  }
})
