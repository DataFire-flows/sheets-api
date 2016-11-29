# Create an API backed by Google Sheets

## Setup
First clone and install
```
git clone https://github.com/DataFire/sheets-backed-api && cd sheets-backed-api
npm install
npm install -g datafire
```

To register a Google Sheets client, visit
[console.developers.google.com](https://console.developers.google.com/apis/credentials)
* click "Enable API"
* choose Sheets
* click "Credentials"
* click "Create Credentials" -> "OAuth Client ID"
* add http://localhost:3000 as a Callback URL

Now run:
```
datafire integrate google-sheets
datafire authenticate google-sheets --generate_token
# Copy your client_id and client_secret generated above,
# then visit the URL generated
```

### Create a new sheet
Run this command, replacing "Pet Store" with your title
```
datafire call google-sheets \
  -o sheets.spreadsheets.create \
  --p.body='{"properties": {"title": "Pet Store"}}' \
  --as default

# spreadsheetId: abcd
# properties:
#   title: Pet Store
# ...
```

Copy `spreadsheetId` and paste it into `spreadsheet.js`:

```
spreadsheet.id="abcd";
```

While you're in `spreadsheet.js`, you can edit the fields available and the
regexen that validate them.

## Running
```
datafire run create -p.name Lucy -p.age 2 -p.animal_type dog
datafire run retrieve
```

### Serverless
You can use [Serverless](https://github.com/serverless/serverless) to
deploy your API to AWS. Edit `serverless.yml` to control which endpoints
are exposed:

functions:
  create:
    handler: create.handler
    events:
      - http:
          method: post
          path: pets
  retrieve:
    handler: retrieve.handler
    events:
      - http:
          method: get
          path: pets
      - http:
          method: get
          path: pets/{id}
