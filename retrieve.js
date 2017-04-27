"use strict";

let datafire = require('datafire');
let spreadsheet = require('./spreadsheet');
let sheets = require('@datafire/google_sheets').actions;

const PAGE_SIZE = 10;

module.exports = new datafire.Action({
  inputs: [{
    title: 'id',
    type: 'integer',
    default: 0,
    description: "The ID of the item to get",
  }, {
    title: 'page',
    type: 'integer',
    minimum: 1,
    default: 1,
  }],
  inputSchema: {
    properties: {
      id: {type: 'integer', minimum: 1},
      page: {type: 'integer', minimum: 1, default: 1},
    },
  },
  accounts: {
    sheetsOwner: {integration: 'sheets'},
  },
  handler: (input, context) => {
    return datafire.flow(context)
      .then(_ => {
        let startRow = 1;
        let endRow = 1;
        if (input.id) {
          startRow = input.id;
          endRow = startRow + 1;
        } else {
          let page = input.page;
          startRow = (page - 1) * PAGE_SIZE + 1;
          endRow = startRow + PAGE_SIZE;
        }
        let lastCol = spreadsheet.getColumn(spreadsheet.fields.length - 1);
        let ranges = [];
        for (let i = startRow; i < endRow; ++i) {
          ranges.push('A' + i + ':' + lastCol + i);
        }
        context.accounts.google_sheets = context.accounts.sheetsOwner;
        return sheets.spreadsheets.values.batchGet({
            spreadsheetId: spreadsheet.id,
            ranges: ranges,
            valueRenderOption: 'UNFORMATTED_VALUE',
          }, context)
      })
      .then(rows => {
        let pets = rows.valueRanges
            .filter(range => range.values)
            .map(range => {
              let pet = {id: spreadsheet.getRowFromRange(range.range)};
              spreadsheet.fields.forEach((field, idx) => {
                pet[field.title] = range.values[0][idx]
              });
              return pet;
            });
        if (!pets.length && input.id) {
          return new datafire.Response({statusCode: 404, body: "Pet " + input.id + " not found"})
        }
        return input.id ? pets[0] : pets;
      })
  }
});

