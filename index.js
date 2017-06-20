'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = "amzn1.ask.skill.d14afcb5-1220-4781-b6db-7127045aedd7";

var SKILL_NAME = "Country Information";
var GET_FACT_MESSAGE = "Here's the information: ";
var HELP_MESSAGE = "You can say tell me about country, or something about country or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
var indiaData = [
    "India is an Asian country with New Delhi as the capital city. It's currency is Indian Rupee. It has around 1.2 Billion population."
];

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
        var slotCountry = this.event.request.intent.slots.CountryName.value;
        var output = "Sorry, I could not find the requested information for the country you asked";
        body = JSON.parse(body);
        request.get('https://restcountries.eu/rest/v2/name/'+slotCountry, (err, res, body) => {
            if(err || res.statusCode != 200){
                output = "Sorry, I could not find the requested information for the country " + slotCountry;
            }else {
                let co =body[0];
                randomFact = slotCountry + "is from "+ co.region + "region with "+  co.capital + " as the capital city. It's currency is " +
                co.currencies[0].name +"  It has around "+co.population+" in population.";
            }
            let randomFact = output;
            let speechOutput = output;
            this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
        });
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