"use strict";

let datafire = require('datafire');
let spreadsheet = require('./spreadsheet');
let sheets = datafire.Integration.new('google-sheets').as('default');

let flow = module.exports = new datafire.Flow('Retrieve Pets');

const PAGE_SIZE = 10;

flow.step('pets', {
  do: sheets.get("/v4/spreadsheets/{spreadsheetId}/values:batchGet"),
  params: data => {
    let startRow = 1;
    let endRow = 1;
    if (flow.params.id) {
      startRow = +flow.params.id;
      endRow = startRow + 1;
    } else {
      let page = (flow.params.page || 1);
      startRow = (page - 1) * PAGE_SIZE + 1;
      endRow = startRow + PAGE_SIZE;
    }
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
          let pet = {id: spreadsheet.getRowFromRange(range.range)};
          spreadsheet.fields.forEach((field, idx) => {
            pet[field.key] = range.values[0][idx]
          });
          return pet;
        });
    flow.succeed(flow.params.id ? data.pets[0] : data.pets);
  }
})
