# Create an API backed by Google Sheets
Use this repo to create a quick-and-dirty API that will store data in Google Sheets.
The API can be easily run on AWS Lambda with API Gateway.

## Demo
A demo is deployed on AWS. You can see the data
[on Google Sheets](https://docs.google.com/spreadsheets/d/12l8GpqPRbweYf-1DApcp3lBJ-btpA8yTr2GCMnZ1FQY/edit?usp=sharing)

Or via the API:
#### View pets
https://l5aqavmoah.execute-api.us-east-1.amazonaws.com/dev/pets

#### Add a pet
```
curl -X POST -d '{"name": "Lucy", "age": 2}' \
    https://l5aqavmoah.execute-api.us-east-1.amazonaws.com/dev/pets 
```

## Setup
First clone and install
```
git clone https://github.com/DataFire-flows/sheets-api && cd sheets-api
npm install
npm install -g datafire serverless
datafire authenticate google-sheets --generate_token
```

See below for instructions on getting your Google Sheets credentials

### Create a new sheet
You can manually create a new sheet at sheets.google.com, or 
run this command, replacing "Pet Store" with your title
```
datafire call google-sheets \
  -o spreadsheets.create \
  --p.body='{"properties": {"title": "Pet Store"}}' \
  --as default

# spreadsheetId: abcd
# properties:
#   title: Pet Store
# ...
```

Copy `spreadsheetId` from the response (or the sheets.google.com URL) and paste it into `spreadsheet.js`:

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

```yaml 
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
```


```
curl -X POST "https://id.execute-api.us-east-1.amazonaws.com/dev/pets" \
    -d '{"name": "Lucy", "age": 2}'
    
curl "https://id.execute-api.us-east-1.amazonaws.com/dev/pets"
```

## Creating a Google Sheets client
To register a Google Sheets client, visit
[console.developers.google.com](https://console.developers.google.com/apis/api/sheets.googleapis.com/overview)
* click "Enable API"
* click "Credentials"
* click "Create Credentials" -> "OAuth Client ID"
* Choose "web application"
* add `http://localhost:3000` as an "Authorized redirect URI"
