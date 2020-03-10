Do you want to create RSA's for your clients or business in less than 10 minutes?

RSA Builder is that script.

Update the following fields in *rsa_builder.js* to create your own RSAs

RSA builder creates RSAs for the account you are logged into and cannot create RSAs outside that account.

Variable | Required | Type | Value
-------- | -------- | ----- | -----
SPREADSHEET_URL | Required | String | A url for a Google Doc
CIDs | Optional | Array (Strings) | An array of CID strings 
campaign_filtering | Optional | Boolean | Enable Campaign level filtering
CAMPAIGN_IDS | Optional | Array (Strings) | If campaign_filtering is enabled add an array of strings to filter on campaigns
adgroup_filtering | Optional | Boolean | Enable Adgroup level filtering
ADGROUP_IDS | Optional | Array (Strings) | If adgroup_filtering is enabled add an array of strings to filter on adgroups
adgroup_minimum_spend | Optional | Integer | filter by adgroup minimum spend set this to any value. Note all currencies are done at the account level. Should not be used for MCCs with multiple currencies
customHeadlines | Optional | Array (Strings) | // To set custom headlines replace this with an array of Custom headlines. i.e: ['Headline 1', 'Headline 2']
customDescriptions | Optional | Array (Strings) | // To set custom descriptions replace this with an array of Custom Descriptions. i.e: ['Description 1', 'Description 2']