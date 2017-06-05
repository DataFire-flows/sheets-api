# Create an API backed by Google Sheets
Use this repo to create a quick-and-dirty API that will store data in Google Sheets.

## Setup
First clone and install
```
git clone https://github.com/DataFire-flows/sheets-api && cd sheets-api
npm install
npm install -g datafire
```

### Authenticate
Use `datafire authenticate` to add your credentials.
[See below](https://github.com/DataFire-flows/sheets-api#creating-a-google-sheets-client)
for instructions on getting your Google Sheets credentials

```
datafire authenticate google_sheets --alias sheetsOwner
```

### Create a new sheet
You can manually create a new sheet at sheets.google.com, or
run this command, replacing "Pet Store" with your title
```
datafire run google_sheets/spreadsheets.create \
  --input.body.properties.title "Pet Store" \
  --accounts.google_sheets sheetsOwner

# spreadsheetId: abcd
# properties:
#   title: Pet Store
# ...
```

Copy `spreadsheetId` from the response (or the sheets.google.com URL) and paste it into `spreadsheet.js`:

```js
spreadsheet.id = "abcd";
```

## Running
Start the server with `datafire serve`:
```
datafire serve --port 3000 &
```
#### View pets
```
# Get the first 10 results
curl http://localhost:3000/pets

# Get the second page
curl http://localhost:3000/pets?page=2

# Get pet #12
curl http://localhost:3000/pets/12
```

#### Add a pet
```
curl -X POST -d '{"name": "Lucy", "age": 2}' \
    http://localhost:3000/pets
```

#### Stop the server
```
kill $!
```

## Modify the API
The field names and validation info are all in [spreadsheet.js](./spreadsheet.js). You can modify
that file to change the API.

You can also change the URL from `/pets` to something new by editing DataFire.yml.

## Creating a Google Sheets client
To register a Google Sheets client, visit
[console.developers.google.com](https://console.developers.google.com/apis/api/sheets.googleapis.com/overview)
* click "Enable API"
* click "Credentials"
* click "Create Credentials" -> "OAuth Client ID"
* Choose "web application"
* add `http://localhost:3000` as an "Authorized redirect URI"
