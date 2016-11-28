"use strict";

let datafire = require('datafire');
let spreadsheet = require('./spreadsheet');
let sheets = datafire.Integration.new('google-sheets').as('default');

let flow = module.exports = new datafire.Flow('Create a Pet');

flow
  .step('check_input', {
    do: data => {
      spreadsheet.fields.forEach(field => {
        let value = flow.params[field.key] || '';
        if (field.regex && !value.match(field.regex)) {
          flow.fail(400, field.key + " must match " + field.regex);
        }
      })
    }
  })
  .step('add_item', {
    do: sheets.post('/v4/spreadsheets/{spreadsheetId}/values/{range}:append'),
    params: data => {
      let row = spreadsheet.fields.map(f => flow.params[f.key])
      return {
        spreadsheetId: spreadsheet.id,
        range: 'A1:A' + spreadsheet.fields.length,
        valueInputOption: 'RAW',
        body: {
          values: [row],
        }
      }
    }
  })
  .step('succeed', {
    do: data => {
      console.log(data.add_item);
      let range = data.add_item.updates.updatedRange;
      let rowNumber = +range.match(/A(\d+):\w+\d+/)[1];
      if (!rowNumber) throw new Error("Couldn't match row number:" + range);
      flow.params.id = rowNumber;
      flow.succeed(flow.params);
    }
  })
