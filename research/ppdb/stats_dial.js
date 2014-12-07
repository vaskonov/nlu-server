// 106 dialogues

var _ = require('underscore')._; 
var fs = require('fs');
var utils = require('./utils') 

var data = []

data = JSON.parse(fs.readFileSync("../../../datasets/DatasetDraft/dial_usa_rule.json"))


var gooddial = 0
var newagentgood = 0
var kbagentgood = 0
var numberofturns = []
var numberofintents = []
var agentstr = ""
var humansentences = []

_.each(data, function(value, key, list){
	if (value['status'].indexOf("goodconv") != -1)
		{

			gooddial += 1
			var evens = _.filter(value['users'], function(str){ return str.match(/NewAgent/) != undefined });
			if (evens != 0)	
				{
					newagentgood += 1	
 					agentstr = 'NewAgent'
 				}

			var evens = _.filter(value['users'], function(str){ return str.match(/KBAgent/g) != undefined });
			if (evens != 0)	
				{
					kbagentgood += 1		
 					agentstr = 'KBAgent'
				}

			var dial = []
			dial.push(_.filter(value['turns'], function(turn){ return ((turn['status'] == 'active')   && (turn['user'].match(/Agent/g) != undefined)) }).length)
			dial.push(_.filter(value['turns'], function(turn){ return ((turn['status'] == 'inactive') && (turn['user'].match(/Agent/g) != undefined)) }).length)
			dial.push(_.filter(value['turns'], function(turn){ return ((turn['status'] == 'active')   && (turn['user'].match(/Agent/g) == undefined)) }).length)
			dial.push(_.filter(value['turns'], function(turn){ return ((turn['status'] == 'inactive') && (turn['user'].match(/Agent/g) == undefined)) }).length)
 			numberofturns.push(dial)

 			var intents = []
			intents.push(_.filter(value['turns'], function(turn){ return ((utils.onlyIntents(turn['output']).length == 1) && (turn['user'].match(/Agent/g) != undefined)) }).length)
			intents.push(_.filter(value['turns'], function(turn){ return ((utils.onlyIntents(turn['output']).length > 1)  && (turn['user'].match(/Agent/g) != undefined)) }).length)
			intents.push(_.filter(value['turns'], function(turn){ return ((utils.onlyIntents(turn['output']).length == 1) && (turn['user'].match(/Agent/g) == undefined)) }).length)
			intents.push(_.filter(value['turns'], function(turn){ return ((utils.onlyIntents(turn['output']).length > 1)  && (turn['user'].match(/Agent/g) == undefined)) }).length)
			intents.push(agentstr)
			intents.push(value['id'])
			numberofintents.push(intents)

		
 		
 		}
}, this)

console.log(data.length)

console.log("gooddial "+gooddial)
// 61 dialogues that marked as "goodconv"
console.log("newagentgood " + newagentgood)
// 31 dialogues
console.log("kbagentgood " + kbagentgood)
// 30 dialogues
console.log(numberofturns)
// huge variance
console.log(_.reduce(numberofturns, function(memo, num){ return memo + num[0] + num[1]; }, 0) / numberofturns.length)
// average number of turns
console.log(_.reduce(numberofturns, function(memo, num){ return memo + num[2]; }, 0))
// total number of  active turns
console.log(numberofintents)
// one/several intents



