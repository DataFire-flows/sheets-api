"use strict";

let datafire = require('datafire');
let spreadsheet = require('./spreadsheet');
let sheets = require('@datafire/google_sheets').actions;
let retrieve = require('./retrieve');

module.exports = new datafire.Action({
  inputs: spreadsheet.fields,
  handler: (input, context) => {
    context.accounts.google_sheets = context.accounts.sheetsOwner;
    let row = spreadsheet.fields.map(f => input[f.title]);
    return datafire.flow(context)
      .then(_ => {
        return sheets.spreadsheets.values.append({
          spreadsheetId: spreadsheet.id,
          range: 'A1:A' + spreadsheet.fields.length,
          valueInputOption: 'USER_ENTERED',
          body: {
            values: [row],
          }
        }, context)
      })
      .then(item => {
        let range = item.updates.updatedRange;
        let id = spreadsheet.getRowFromRange(range);
        return id;
      })
      .then(id => {
        return retrieve({id}, context);
      })
  }
})
