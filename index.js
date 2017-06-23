'use strict';
var Alexa = require('alexa-sdk');
var syncRequest = require("sync-request")

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = "amzn1.ask.skill.d14afcb5-1220-4781-b6db-7127045aedd7";

var SKILL_NAME = "Country Information";
var GET_FACT_MESSAGE = "Here's the information: ";
var HELP_MESSAGE = "You can say - Ask Country Information to tell me about country India, or, you can say Open Country Information and search Australia, or exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('CountryInformationIntent');
    },
    'CountryInformationIntent': function () {
        console.log(this.event.request.intent);
        if(this.event.request.intent === undefined ){
            this.emit('AMAZON.HelpIntent');
            return;
        }
        var slots=this.event.request.intent.slots;
        console.log(slots);
        if(slots === undefined || slots.length === 0){
            this.emit('AMAZON.HelpIntent');
            return;
        }
        var slotCountry = slots.CountryName.value;
        var data = "Sorry, I could not find the requested information for the country you asked";
        // registering remote methods
        var res = syncRequest('GET', 'https://restcountries.eu/rest/v2/name/'+slotCountry);
        //console.log(res);
        if(res.statusCode != 200){
          data = "Sorry, I could not find the requested information for the country " + slotCountry;
        } else {
          var countryObj =JSON.parse(res.getBody('utf8'));
          console.log(countryObj);
          if(countryObj.length == 1){
              data = countryObj[0].name + " is from "+ countryObj[0].region  + " region with "+  countryObj[0].capital + " as the capital city. It's currency is " +
              countryObj[0].currencies[0].name +". It has around "+countryObj[0].population+" in population.";
          } else if (countryObj.length >= 2){

              data = "Found multiple matches with country name " +slotCountry + ". Here is the information for first two matches: "
              + countryObj[0].name  + " is from "+ countryObj[0].region  + " region with "+  countryObj[0].capital + " as the capital city. It's currency is " +
              countryObj[0].currencies[0].name +". It has around "+countryObj[0].population+" in population."

              + "And, " + countryObj[1].name  +
              " is from "+ countryObj[1].region  + " region with "+  countryObj[1].capital + " as the capital city. It's currency is " +
             countryObj[1].currencies[0].name +". It has around "+countryObj[1].population+" in population.";
          }
        }
        var randomFact = data;
        //console.log("Output Text:" + randomFact);
        var speechOutput =  randomFact;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};
