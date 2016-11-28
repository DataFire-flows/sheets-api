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


