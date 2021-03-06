// 106 dialogues

var _ = require('underscore')._; 
var fs = require('fs');
var utils = require('./utils') 

var data = []

data = JSON.parse(fs.readFileSync("../../../datasets/DatasetDraft/dial_usa_rule.json"))



function activedialogue(dial)
{
	 if (dial['status'].indexOf("goodconv") != -1)
	 	return true
	 else
	 	return false
}



function activeturn(turn)
{

if (_.isArray(turn['status']))
	if (turn['status'].indexOf('active') != -1)
		return true
	else
		return false
else
	if (turn['status'] == 'active')
		return true
	else
		return false
return false
}

function humanturn(turn)
{
	if (turn['user'].match(/Agent/g) == undefined )
		return true
	else
		return false
}	

function keysofturn(turn)
{
	if (!('intent_keyphrases_rule' in turn))
		return []
	else
		return Object.keys(turn['intent_keyphrases_rule'])
}	


var gooddial = 0
var newagentgood = 0
var kbagentgood = 0
var numberofturns = []
var numberofintents = []
var agentstr = ""
var humansentences = []
var roles = []

var activehuman = 0
var activeturns = []

var activeactivehuman = 0
var activeactiveturns = []

_.each(data, function(value, key, list){

	_.each(value['turns'], function(turn, key, list){ 
		
		if ((humanturn(turn) == true) && (activeturn(turn) == true) && (keysofturn(turn).length > 0))
			{
				activehuman += 1
				activeturns.push(keysofturn(turn))
			}

		if ((activedialogue(value) == true)&& (humanturn(turn) == true) && (activeturn(turn) == true) && (keysofturn(turn).length > 0))
				{
					activeactivehuman += 1
					activeactiveturns.push(keysofturn(turn))
				}

	}, this)


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

			/*var dial = []
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
*/
			// roles = roles.concat(_.pluck(_.filter(value['turns'], function(turn){ return turn['user'].match(/Agent/g) == undefined }), 'role'))
 		}
}, this)

console.log(data.length)

console.log("gooddial "+gooddial)
// 61 dialogues that marked as "goodconv"
console.log("newagentgood " + newagentgood)
// 31 dialogues
console.log("kbagentgood " + kbagentgood)
// 30 dialogues
// console.log(numberofturns)
// // huge variance
// console.log(_.reduce(numberofturns, function(memo, num){ return memo + num[0] + num[1]; }, 0) / numberofturns.length)
// // average number of turns
// console.log(_.reduce(numberofturns, function(memo, num){ return memo + num[2]; }, 0))
// // total number of  active turns
// console.log(numberofintents)
// // one/several intents
// console.log(_.unique(roles))
// Human is  [Candidate]
// Candidate Employer consistence/ if all human sentences are of the same role

console.log("activeactivehuman " + activeactivehuman)
console.log("activehuman" + activehuman)

var counted = _.countBy(activeactiveturns, function(num) { return num });

console.log(counted)

/*106
gooddial 61
newagentgood 31
kbagentgood 30
activeactivehuman 353
activehuman353

{ Offer: 261,
  Accept: 49,
  Query: 15,
  Reject: 13,
  Greet: 14,
  Insist: 1 }*/