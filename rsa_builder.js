// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Include the spreadsheet where you want to have the output
var SPREADSHEET_URL = ''

// OPTION TO IMPLEMENT DIRRECTLY - NO TRIX

// FILTER FOR CID

// To filter by campaign ids set this to true
var campaign_filtering = true;
// Add Campaign Ids as an array if filtering
var CAMPAIGN_IDS = false;

// if filtering by adgroup id set this to true
var adgroup_filtering = true;
// Add adgroup ids if filtering on Adgroups
var ADGROUP_IDS = false;

// To filter by adgroup minimum spend set this to any value
// Note all currencies are done at the account level.
// Should not be used for MCCs with multiple currencies
var adgroup_minimum_spend = 1000;

// To set custom headlines replace this with an array of Custom headlines.
// i.e: ['Headline 1', 'Headline 2']
var customHeadlines = [];

// To set custom descriptions replace this with an array of Custom descriptions.
// i.e: ['Description 1', 'Description 2']
var customDescriptions = [];

// Pin the location of headlines 1-5
var headlines1Position = ' ';
var headlines2Position = ' ';
var headlines3Position = ' ';
var headlines4Position = ' ';
var headlines5Position = ' ';

//Pin the locations of description 1-3
var description1Position = ' ';
var description2Position = ' ';
var description3Position = ' ';

// Function to delete duplicated titles, descriptions, etc...
function remDups(arrArg) {
  return arrArg.filter(function(elem, pos,arr) {
    return arr.indexOf(elem) == pos;
  });
}


function main() {
  var accountIterator = MccApp.accounts().withLimit(50);
  accountIterator.executeInParallel('process');
}


function process() {
  try {
    var accountCost =
        AdWordsApp.currentAccount().getStatsFor('LAST_30_DAYS').getCost();
    var accountName = AdWordsApp.currentAccount().getName();
    var accountCID = AdWordsApp.currentAccount().getCustomerId();
    var RSAnumber = 0;
  } catch (e) {
  }

     var campaigns = AdsApp.campaigns().withCondition('AdvertisingChannelType = SEARCH').get();


  if (campaigns.totalNumEntities() != 0 && accountCost > 0) {
    var sheet1 = SpreadsheetApp.openByUrl(SPREADSHEET_URL)
                     .getSheetByName(accountName.concat(' -> ', accountCID));
    if (!sheet1) {
      sheet1 = SpreadsheetApp.openByUrl(SPREADSHEET_URL)
                   .insertSheet(accountName.concat(' -> ', accountCID));
    }

    // Spreadsheet cleared and first row implemented with headers
    sheet1.clear();
    sheet1.appendRow([
      'Campaign',      'Ad Group',
      'Ad Group ID',   'Ad Type',
      'Ad Status',     'Final URL',
      'Path 1',        'Path 2',
      'Headline 1',    'Headline 1 position',
      'Headline 2',    'Headline 2 position',
      'Headline 3',    'Headline 3 position',
      'Headline 4',    'Headline 4 position',
      'Headline 5',    'Headline 5 position',
      'Headline 6',    'Headline 6 position',
      'Headline 7',    'Headline 7 position',
      'Headline 8',    'Headline 8 position',
      'Headline 9',    'Headline 9 position',
      'Headline 10',   'Headline 10 position',
      'Headline 11',   'Headline 11 position',
      'Headline 12',   'Headline 12 position',
      'Headline 13',   'Headline 13 position',
      'Headline 14',   'Headline 14 position',
      'Headline 15',   'Headline 15 position',
      'Description 1', 'Description 1 position',
      'Description 2', 'Description 2 position',
      'Description 3', 'Description 3 position',
      'Description 4', 'Description 4 position'
    ]);


    // Number of RSA created
    var RSAnumber = 0;

    // Campaign iterator
    var campaigns =
        AdsApp.campaigns().withCondition('AdvertisingChannelType = SEARCH');
    if (campaign_filtering) {
      campaigns = campaigns.withIds(CAMPAIGN_IDS);
    };

    campaigns = campaigns.get()
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      if (campaign.isEnabled() && campaign.isExperimentCampaign() == false) {
        // Adgroup iterator
        var adgroups = campaign.adGroups()
        if (adgroup_filtering) {
          adgroups = adgroups.withIds(ADGROUP_IDS);
        };
        if (adgroup_minimum_spend) {
          adgroups = adgroups.withCondition("Cost >= " + adgroup_minimum_spend);
          adgroups = adgroups.forDateRange('LAST_MONTH')
        };
        adgroups = adgroups.get();
        while (adgroups.hasNext()) {

          var isRSA = false;
          var adgroup = adgroups.next();
          var adGroupID = adgroup.getId();
          var Headlines = [];
          var Descriptions = [];
          var Paths = [];
          var FinalURLs = [];
          var include_rsas= false;

          if (adgroup.isEnabled() == true) {

            // Ads iterator
            var ads = adgroup.ads().get();
            var i = 0;
            var j = 0;
            var k = 0;
            var m = 0;

            if (customHeadlines){
              Headlines = customHeadlines;
              i = customHeadlines.length
            };
            if (customDescriptions){
              Descriptions = customDescriptions;
              j = customDescriptions.length
            }
            while (ads.hasNext() && isRSA == false) {
              var ad = ads.next();

              // If a RSA ad exist, break while
              if (!include_rsas){
                if (ad.isEnabled() == true &&
                    ad.getType() == 'VERSATILE_TEXT_AD') {
                  isRSA = true;
                  break;
                };

                // If there is an ETA ad, include elements in array
              if (

                  ad.isEnabled() == true &&
                  ad.getType() == 'EXPANDED_TEXT_AD') {



                if (ad.getHeadlinePart1()) {
                  Headlines[i] = ad.getHeadlinePart1();
                  i++;
                }
                if (ad.getHeadlinePart2()) {
                  Headlines[i] = ad.getHeadlinePart2();
                  i++;
                }
                if (ad.getHeadlinePart3()) {
                  Headlines[i] = ad.getHeadlinePart3();
                  i++;

                }

                if (ad.getDescription1()) {
                  Descriptions[j] = ad.getDescription1();
                  j++;
                }
                if (ad.getDescription2()) {
                  Descriptions[j] = ad.getDescription2();
                  j++;
                }
                Paths[k] = ad.getPath1();
                k++;
                Paths[k] = ad.getPath2();
                k++;
                if (ad.urls().getFinalUrl() == 'undefined') {
                  continue;
                } else {
                  FinalURLs[m] = ad.urls().getFinalUrl();
                  m++;
                }
              }
            }

            // If there is no RSA at adgroup level, include the row at the
            // spreadsheet
            if (isRSA == false && FinalURLs[0] != undefined) {
              Headlines = remDups(Headlines);
              Headlines = Headlines.filter(String)
              Headlines = Headlines.sort()
              Descriptions = remDups(Descriptions);
              Descriptions = Descriptions.filter(String)
              Descriptions = Descriptions.sort();
              // if (Paths[0] == undefined) {
              //   Paths[0] = '';
              // };
              // if (Paths[1] == undefined) {
              //   Paths[1] = '';
              // };

              for (i = 0; i < 15; i++) {
                if (Paths[i] == undefined) {
                  Paths[i] = '';
                };
              }

              for (i = 0; i < 15; i++) {
                if (Headlines[i] == undefined) {
                  Headlines[i] = '';
                };
              }
              for (i = 0; i < 15; i++) {
                if (Descriptions[i] == undefined) {
                  Descriptions[i] = '';
                };
              }


              if (FinalURLs[0] != undefined && Headlines[0] != '' &&
                  Headlines[1] != '' && Headlines[2] != '' &&
                  Descriptions[0] != '' && Descriptions[1] != '' &&
                  (Headlines[3] != '' || Descriptions[2] != '')) {

                sheet1.appendRow([
                  campaign.getName(), adgroup.getName(),
                  adGroupID,          'responsive search ad',
                  'enabled',          FinalURLs[0],
                  Paths[0],           Paths[1],
                  Headlines[0],       headlines1Position,
                  Headlines[1],       headlines2Position,
                  Headlines[2],       headlines3Position,
                  Headlines[3],       headlines4Position,
                  Headlines[4],       headlines5Position,
                  Headlines[5],       ' ',
                  Headlines[6],       ' ',
                  Headlines[7],       ' ',
                  Headlines[8],       ' ',
                  Headlines[9],       ' ',
                  Headlines[10],      ' ',
                  Headlines[11],      ' ',
                  Headlines[12],      ' ',
                  Headlines[13],      ' ',
                  Headlines[14],      ' ',
                  Descriptions[0],    description1Position,
                  Descriptions[1],    description2Position,
                  Descriptions[2],    description3Position,
                  Descriptions[3],    ' '


                ]);

                RSAnumber = RSAnumber + 1;
              }
            }
          }
        }
      }
    }
  }
}
}
