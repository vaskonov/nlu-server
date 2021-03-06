/**
 * Trains and tests the NLU component.
 * 
 * @author Erel Segal-Halevi
 * @since 2013-06
 */


var Hierarchy = require(__dirname+'/Hierarchy');

// var intent_stat = false
// var add_context = false
// var convert_tran = false
// var try_sequence = false
// var prepare_sequence = false
// var compare_performance = false
// var project_dataset = false
// var prepare_truthteller = false
// var do_separate_dialogue = false
// var test_conv = false
// var sample_kbagent = false
// var do_coverage = false
// var do_coverage_version2 = false
// var do_separate_datasets = false
// var test_aggregate_errors = false
// var test_aggregate_keyphases = false
// var test_underscore = false
// var test_error_analysis = false
// var test_keywords = false
// var test_egypt = false
// var test_natural = false
// var test_spell = false
// var test_segmentation = false
// var do_spell_correction_test = false
// var do_compare_approach = false
// var do_partial_classification = false
// var do_unseen_word_fp = false
// var do_unseen_word_curve = false
// var do_checking_tag = false
// var do_small_temporary_test = false
// var do_small_temporary_serialization_test = false

var shuffle = false
var sequnce_classification = true
var test_gaby = false
var new_dial_stats = false
var test_dataset = false
var prepare_dataset_for_gaby1 = false
var prepare_dataset_for_gaby = false
var do_keyphrase_only_rule = false
var do_small_temporary_serialization_test = false
var do_mlrule = false
var do_learning_curves = false
var do_test_sagae = false
var do_cross_dataset_testing = false
var do_learning_curves_dialogue = false
var do_final_test = false
var do_cross_validation = false
var do_serialization = false
var do_test_on_training_data = false
var do_small_temporary_test_dataset = false
var do_small_test_multi_threshold = false
var naive = false
var naive1 = false
var count_2_intents_2_attributes = false
var do_comparison = false
var regexnor = false
var just_test = false
var do_keyphrase_annotaiton = false
var do_keyphrase_gold_annotaiton = false
var do_keyphrase_predict_annotaiton = false
var do_pull_all_utterance_to_file = false

var _ = require('underscore')._;
var fs = require('fs');
var trainAndTest= require('./utils/trainAndTest').trainAndTest_hash;
var Hierarchy = require(__dirname+'/Hierarchy');
var multilabelutils = require('limdu/classifiers/multilabel/multilabelutils');
var trainutils = require('./utils/bars')
// var Lemmer = require('node-lemmer').Lemmer;
var rules = require("./research/rule-based/rules.js")

// var grammarDataset = JSON.parse(fs.readFileSync("datasets/Employer/0_grammar.json"));
// var collectedDatasetMulti = JSON.parse(fs.readFileSync("datasets/Employer/1_woz_kbagent_students.json"));
// var collectedDatasetSingle = JSON.parse(fs.readFileSync("datasets/Employer/1_woz_kbagent_students1class.json"));
// var collectedDatasetMulti2 = JSON.parse(fs.readFileSync("datasets/Employer/2_experts.json"));
// var collectedDatasetSingle2 = JSON.parse(fs.readFileSync("datasets/Employer/2_experts1class.json"));
// var collectedDatasetMulti4 = JSON.parse(fs.readFileSync("datasets/Employer/3_woz_kbagent_turkers_negonlp2.json"));
// var collectedDatasetMulti8 = JSON.parse(fs.readFileSync("datasets/Employer/4_various.json"));

var verbosity = 0;
var explain = 0;

var cheapest_paths = require('limdu/node_modules/graph-paths').cheapest_paths;
var natural = require('natural');
var execSync = require('execSync').exec
var partitions = require('limdu/utils/partitions');
var PrecisionRecall = require('limdu/utils/PrecisionRecall');
// var trainAndTest = require('limdu/utils/trainAndTest').trainAndTest;
var trainAndTest = require('./utils/trainAndTest');
// var trainAndCompare = require('limdu/utils/trainAndTest').trainAndCompare;
// var trainAndTestLite = require('limdu/utils/trainAndTest').trainAndTestLite;
// var trainAndTestLite = require('./utils/trainAndTest').trainAndTestLite;
// var ToTest = require('limdu/utils/trainAndTest').test;
// var ToTest = require('./utils/trainAndTest').test;
var serialization = require('serialization');
var curves = require('./utils/learning_curves');
// var unseen_words_curves = require('limdu/utils/unseen_curves').unseen_word_curves;
// var unseen_correlation = require('limdu/utils/unseen_correlation').unseen_correlation;
// var tokenize = require('limdu/utils/unseen_correlation').tokenize;

var limdu = require("limdu");
var ftrs = limdu.features;

var Fiber = require('fibers');

var f = Fiber(function() {
  		var fiber = Fiber.current;


var classifier = require(__dirname+'/classifiers')

// var regexpNormalizer = ftrs.RegexpNormalizer(
		// JSON.parse(fs.readFileSync('knowledgeresources/BiuNormalizations1.json')));

var regexpNormalizer = ftrs.RegexpNormalizer(
		JSON.parse(fs.readFileSync(__dirname+'/knowledgeresources/BiuNormalizations.json')));

var stringifyClass = function (aClass) {
  	return (_(aClass).isString()? aClass: JSON.stringify(aClass));
  };

var createNewClassifier = function() {
	var defaultClassifier = require(__dirname+'/classifiers').defaultClassifier;
	return new defaultClassifier();
}
var normalizeClasses = function (expectedClasses) {
	if (!_(expectedClasses).isArray())
		expectedClasses = [expectedClasses];
	expectedClasses = expectedClasses.map(stringifyClass);
	expectedClasses.sort();
	return expectedClasses;
};

function normalizer(sentence) {
	sentence = sentence.toLowerCase().trim();
	return regexpNormalizer(sentence);
}


// var clonedataset  = function(dataset) {

// 	trainSet1 = []
// 		_.each(dataset, function(value, key, list){
// 			trainSet1.push(_.clone(value))
// 			})
// 		return trainSet1
// };

var datasetNames = [
			"0_grammar.json",
			"1_woz_kbagent_students.json",
			"1_woz_kbagent_students1class.json",
			"2_experts.json",
			"2_experts1class.json",
			"4_various.json",
			"4_various1class.json",
			"6_expert.json",
			"3_woz_kbagent_turkers_negonlp2.json",
			"5_woz_ncagent_turkers_negonlp2ncAMT.json",
			"nlu_kbagent_turkers_negonlpAMT.json",
			"nlu_ncagent_students_negonlpnc.json",
			"nlu_ncagent_turkers_negonlpncAMT.json",
			"woz_kbagent_students_negonlp.json"
			];


// sentence = sentence.toLowerCase().trim();
// 	sentence = regexpNormalizer(sentence)
// 	sentence = rules.generatesentence({'input':sentence, 'found': rules.findData(sentence)})['generated']
// 	// sentence = sentence.replace(/<VALUE>/g,'')
// 	// sentence = sentence.replace(/<ATTRIBUTE>/g,'')
// 	sentence = sentence.trim()
// 	sentence = sentence.replace(/\s+/g,' ')

/*performs 
turkers_keyphrases_only_rule.json
students_keyphrases_only_rule.json*/


if (shuffle)
{
	var data = JSON.parse(fs.readFileSync("../datasets/Employer/Dialogue/turkers_keyphrases_only_rule.json"))
	data = _.shuffle(data)	
	data = _.shuffle(data)	
	data = _.shuffle(data)	
	console.log(JSON.stringify(data, null, 4))
	console.log()
	process.exit(0)
}


if (sequnce_classification)
{

	var ppdb = require("./research/ppdb/evalmeasure_5ed_embed.js")
	var ppdb_utils = require("./research/ppdb/utils.js")

	var datasets = [
              'turkers_keyphrases_only_rule_shuffled.json',
              // 'students_keyphrases_only_rule.json'
            ]

	var data = []

	_.each(datasets, function(value, key, list){
	    data = JSON.parse(fs.readFileSync("../datasets/Employer/Dialogue/"+value))
	}, this)

	// data = _.shuffle(data)

	var datas = partitions.partition(data, 1, Math.round(data.length*0.8))

	console.log("test dialogues "+ datas['test'].length)
	console.log("train dialogues "+ datas['train'].length)

	var testset = trainutils.extractturns(datas['test'])
	var trainset = trainutils.extractturns(datas['train'])

	var seeds = ppdb_utils.loadseeds(trainset)
	// var seeds_original = ppdb_utils.enrichseeds_original(seeds)

	var stats_ppdb = []

	ppdb_utils.enrichseeds(seeds, function(err, seeds_ppdb){
		ppdb.trainandtest(trainset, testset, seeds_ppdb, 1, function(err, response_ppdb){
			fiber.run(response_ppdb)
		})
	})
	
   	var stats_ppdb = Fiber.yield()

   	/*_.each(stats_ppdb['data'], function(value, key, list){ 
   		if ((value['eval']['FP'].length != 0) || (value['eval']['FN'].length != 0))
   		{
   			console.log(JSON.stringify(value, null, 4))
   		}
   	}, this)
	*/

   	console.log(JSON.stringify(stats_ppdb['stats'], null, 4))

   	process.exit(0)
}


if (test_dataset)
{
	var data = JSON.parse(fs.readFileSync("./test2.json"))
	process.exit(0)
}

if (prepare_dataset_for_gaby1)
{

	var utdata = []

	var olddata = JSON.parse(fs.readFileSync("./dialogue_restore/dial_usa.json"))

	var oldddata = JSON.parse(fs.readFileSync("./datasets/Employer/Dialogue/turkers_keyphrases_only_rule.json"))
	oldddata = trainutils.extractturns(oldddata)
	var transfer = []

	var scfg = JSON.parse(fs.readFileSync("./scfg_detailed.json"))
	
	// _.each(trainutils.dividedataset(oldddata)['one'], function(value, key, list){ 
	_.each(oldddata, function(value, key, list){ 
		value['input'] = normalizer(value['input'])
		if (
			(value['input'].indexOf('salary') == -1) &&
			(value['input'].indexOf('NIS') == -1) &&
			(value['input'].indexOf('12000') == -1) &&
			(value['input'].indexOf('7000') == -1)&&
			(value['input'].indexOf('20000') == -1)
			)
		{
			transfer.push({'input':value['input'], 'output':value['output']})
		}
	}, this)

	// 
	// utdata = _.shuffle(utdata)
	// var clean = partitions.partition(utdata, 1, Math.round(utdata.length*0.4))

	// console.log("one "+trainutils.dividedataset(utdata)['one'].length)
	// console.log("two "+trainutils.dividedataset(utdata)['two'].length)
	
	// console.log()
	// process.exit(0)
	// var filename = './dialogue_restore/new_ag1.json'
	// data = JSON.parse(fs.readFileSync(filename))


	_.each(olddata, function(dialogue, key, list){ 
		// console.log(dialogue['status'])
		if (_.find(dialogue['users'], function(num){ return num.indexOf("NewAgent")}) != -1)
		{
			_.each(dialogue['turns'], function(turn, key, list){ 
				if ((turn['user'].toLowerCase().indexOf('agent') == -1) &&
					(turn['output'] != ''))
				{
					utdata.push({'input': normalizer(turn['input']),
								'output': turn['output']})
				}
			}, this)
		}
	}, this)


	utdata = utdata.concat(transfer)
	// console.log(utdata.length)
	// console.log(JSON.stringify(utdata, null, 4))

	// utdata = utdata.concat(olddata)
	utdata = _.shuffle(utdata)

	var dataset = partitions.partition(utdata, 1, Math.round(utdata.length*0.4))

	// console.log("one "+trainutils.dividedataset(utdata)['one'].length)
	// console.log("two "+trainutils.dividedataset(utdata)['two'].length)

	_.each(scfg, function(value, key, list){ 
		dataset['train'].push({'input': normalizer(value['input']),
								'output': value['output']})
	}, this)
	
	var output = {}
	var zero = 0
	var inputs = []

	// _.each(dataset['train'], function(value, key, list){ 
		// if (value["output"]  == "")
			// inputs.push(value['input'])
	// }, this)

	// console.log(inputs)
	// process.exit(0)

	_.each(trainutils.dividedataset(dataset['train'])['one'], function(value, key, list){
		
		// console.log(value)
		// process.exit(0)
		// console.log(value['output'][0])
		var str = _.isString(value['output'][0])? value['output'][0]: JSON.stringify(value['output'][0])
		
		// var str = JSON.stringify(value['output'][0])
		if (!(str in output))
			 output[str] = []
		output[str].push(normalizer(value['input']))
		output[str] = _.compact(_.unique(output[str]))
	}, this)

	// console.log(zero)
		
	_.each(output, function(value, key, list){ 
		output[key] = _.sample(value,50)
	}, this)


	var test = []
	_.each(dataset['test'], function(value, key, list){ 
			var out = []

			// console.log(value['output'])
			_.each(value['output'], function(value1, key1, list1){ 

					out.push(_.isString(value1)? JSON.parse(value1): value1)
			}, this)

		test.push({'input': normalizer(value['input']),
					// 'output': _.isString(value['output'])? value['output']: JSON.stringify(value['output'])})
					'output': out})
	}, this)

	console.log(JSON.stringify(output, null, 4))
	
	
	test = _.sample(test, 200)

	console.log(JSON.stringify(test, null, 4))
	process.exit(0)
}


if (prepare_dataset_for_gaby)
{
	
	var olddata = []
	var utdata = []
	
	olddata = olddata.concat(JSON.parse(fs.readFileSync("./datasets/Employer/Dialogue/students_keyphrases_only_rule.json")))
	olddata = olddata.concat(JSON.parse(fs.readFileSync("./datasets/Employer/Dialogue/turkers_keyphrases_only_rule.json")))
	olddata = trainutils.extractturns(olddata)
	
	// utdata = _.shuffle(utdata)
	// var clean = partitions.partition(utdata, 1, Math.round(utdata.length*0.4))

	// console.log("one "+trainutils.dividedataset(utdata)['one'].length)
	// console.log("two "+trainutils.dividedataset(utdata)['two'].length)
	
	// console.log()
	// process.exit(0)
	var filename = './dialogue_restore/new_ag1.json'
	data = JSON.parse(fs.readFileSync(filename))


	_.each(data, function(dialogue, key, list){ 
		// console.log(dialogue['status'])
		if (dialogue['status'] == 'goodconv')
		{
			_.each(dialogue['turns'], function(turn, key, list){ 
				if (turn['user'].toLowerCase().indexOf('agent') == -1)
				{
					utdata.push({'input': normalizer(turn['input']),
								'output': turn['output']})
				}
			}, this)
		}
	}, this)

	// console.log(utdata.length)
	// console.log(JSON.stringify(utdata, null, 4))

	utdata = utdata.concat(olddata)
	utdata = _.shuffle(utdata)

	var dataset = partitions.partition(utdata, 1, Math.round(utdata.length*0.4))

	// console.log("one "+trainutils.dividedataset(utdata)['one'].length)
	// console.log("two "+trainutils.dividedataset(utdata)['two'].length)
	
	var output = {}
	var zero = 0
	var inputs = []

	// _.each(dataset['train'], function(value, key, list){ 
		// if (value["output"]  == "")
			// inputs.push(value['input'])
	// }, this)

	// console.log(inputs)
	// process.exit(0)

	_.each(trainutils.dividedataset(dataset['train'])['one'], function(value, key, list){
		
		// console.log(value)
		// process.exit(0)
		// console.log(value['output'][0])
		var str = _.isString(value['output'][0])? value['output'][0]: JSON.stringify(value['output'][0])
		
		// var str = JSON.stringify(value['output'][0])
		if (!(str in output))
			 output[str] = []
		output[str].push(normalizer(value['input']))
		output[str] = _.compact(_.unique(output[str]))
	}, this)

	// console.log(zero)
	console.log(JSON.stringify(output, null, 4))


	var test = []
	_.each(dataset['train'], function(value, key, list){ 
		test.push({'input': normalizer(value['input']),
					'output': _.isString(value['output'])? value['output']: JSON.stringify(value['output'])})
	}, this)

	console.log(JSON.stringify(test, null, 4))
	process.exit(0)
}

if (do_keyphrase_only_rule)
{
	var datalist = [
				"students_keyphrases_gold_rule.json"
				// "turkers_keyphrases_only_rule.json"
			]

	var data = []
	_.each(datalist, function(value, key, list){ 
		data = data.concat(JSON.parse(fs.readFileSync("./datasets/Employer/Dialogue/"+value)))
	})

	_.each(data, function(dialogue, key, list){ 
		_.each(dialogue['turns'], function(turn, key1, list1){ 
			
			if (!('intent_keyphrases_rule' in turn))
				turn['intent_keyphrases_rule'] = {}

			if ('intent_keyphrases_gold' in turn)
				{
					_.each(turn['intent_keyphrases_gold'], function(value, intent, list){ 
						if (!(intent in turn['intent_keyphrases_rule']))
							turn['intent_keyphrases_rule'][intent] = value[1]
					}, this)
				}

			if ('Offer' in turn['intent_keyphrases_rule'])
				{
				if (turn['intent_keyphrases_rule']['Offer'] == "")	
					turn['intent_keyphrases_rule']['Offer'] = "DEFAULT INTENT"
				}

			delete data[key]['turns'][key1]['intent_keyphrases_gold']
			delete data[key]['turns'][key1]['is_correct']
			
			turn['status'] = 'active'

		}, this)
	}, this)

	console.log(JSON.stringify(data, null, 4))
	process.exit(0)
}



if (do_pull_all_utterance_to_file)
	{
	var datalist = [
			// "turkers_keyphrases_gold.json"
				// "students_keyphrases_.json"
				'turkers_keyphrases_only_rule.json',
				'students_keyphrases_only_rule.json'
			]

	var data = []
	_.each(datalist, function(value, key, list){ 
		data = data.concat(JSON.parse(fs.readFileSync("./datasets/Employer/Dialogue/"+value)))
	})
	
	var data = trainutils.extractturns(data)
	// normalizer
	var output = []
	_.each(data, function(value, key, list){ 
		output.push(normalizer(value['input']))
	}, this)
	
	output = _.unique(output)
	_.each(output, function(value, key, list){ 
		console.log(value)
	}, this)
	process.exit(0)
	}


// takes the dialogues dataset and senetnce with only single label, then omit attribute and value and add
// only salient phrase of intent to the dataset
if (do_keyphrase_predict_annotaiton)
	{
	// var datalist = [
			// "turkers_keyphrases_gold.json"
				// "students_keyphrases_gold.json"
			// ]

	// var data = []
	// _.each(datalist, function(value, key, list){ 
		// data = data.concat(JSON.parse(fs.readFileSync("../datasets/Employer/Dialogue/"+value)))
	// })
	data = JSON.parse(fs.readFileSync("../datasets/DatasetDraft/dial_usa.json"))


	_.each(data, function(dialogue, key, list){ 
        if (dialogue['status'].indexOf("goodconv") != -1)
		_.each(dialogue['turns'], function(turn, key1, list1){ 
			if (turn['status'] == "active")
			{
			turn['input'] = turn['input'].replace(/[^\x00-\x7F]/g, "")
        		if ('user' in turn)
          			if (turn['user'].indexOf('Agent') == -1)
            			if (turn['input'] != "")
            			{
						var intent_list = Hierarchy.splitPartEquallyIntent(turn['output'])

						if (intent_list.length == 1)
						{
							var intent = intent_list[0] 
							if (!('intent_keyphrases_rule' in turn))
								turn['intent_keyphrases_rule'] = {}
							// var intent = Hierarchy.splitPartEquallyIntent(turn['output'])
							if (!(intent in turn['intent_keyphrases_rule']))
								{
								var sentence = turn['input']
								var original = turn['input']
								sentence = sentence.toLowerCase().trim()
								sentence = regexpNormalizer(sentence)
								sentence = rules.generatesentence({'input':sentence, 'found': rules.findData(sentence)})['generated']
								sentence = sentence.replace(/<VALUE>/g,'')
								sentence = sentence.replace(/<ATTRIBUTE>/g,'')
								sentence = sentence.replace(/NIS/,'')
								sentence = sentence.replace(/nis/,'')
								sentence = sentence.replace(/track/,'')
								sentence = sentence.replace(/USD/,'')
								sentence = sentence.trim()

								var keyphrase = sentence
								// console.log("intent "+intent)
								// console.log("original "+original)
								// console.log("sentence "+sentence)
								if (sentence.replace(" ","").length == 0)
									keyphrase = "DEFAULT INTENT"

								data[key]['turns'][key1]['intent_keyphrases_rule'][intent] = keyphrase
								}
								// else
							// process.exit(0)
							}
							else
							{
						// console.log(turn['output'])
							}
						}
					}
				// }
		}, this)
	}, this)

	// var keyphrases = JSON.parse(fs.readFileSync("./research/test_aggregate_keyphases/keyphases.09.2014.json"))

console.log(JSON.stringify(data, null, 4))
process.exit(0)
}

// takes dialogues datasets and keyphrase set and combines them = dialogues with gold standard keyphrases
if (do_keyphrase_gold_annotaiton)
	{
	var datalist = [
			"turkers.json"
			]

	var data = []
	_.each(datalist, function(value, key, list){ 
		data = data.concat(JSON.parse(fs.readFileSync("./datasets/Employer/Dialogue/"+value)))
	})

	var keyphrases = JSON.parse(fs.readFileSync("./research/test_aggregate_keyphases/keyphases.09.2014.json"))



// [
//     {
//         "sentence": "it is much too high.",
//         "labels": {
//             "Reject": [
//                 ""
//             ],
//             "Salary": [
//                 ""
//             ]
//         }
//     },
//     {
//         "sentence": "i think 7000 is good",
//         "labels": {
//             "Offer": [
//                 "i think"
//             ],
//             "Salary": [
//                 "VALUE"
//             ],
//             "7,000 NIS": [
//                 "7000"
//             ]
//         }
//     },

// console.log("keyphrases "+keyphrases.length)
// console.log("data "+data.length)

var got = 0
var Itents = ['Append', 'Offer', 'Accept', 'Reject', 'Insist', 'Query', 'Greet', 'Quit', 'accept', 'compromise', 'bid', 'issues']

	_.each(keyphrases, function(keysentence, key2, list2){ 
		// console.log("@"+key2)
		_.each(data, function(dialogue, key, list){ 
			// console.log(key)
			_.each(dialogue['turns'], function(utterance, key1, list1){
				if (keysentence['sentence'] == utterance['input'])
					{
					got = got + 1
					data[key]['turns'][key1]['intent_keyphrases_gold'] = {}

					_.each(keysentence['labels'], function(keyphrase, intent, list){ 
						keyphrase = keyphrase['0']
						if (keyphrase.length>0)
						{
							if (Itents.indexOf(intent)!=-1)
								{

								var begin = utterance['input'].indexOf(keyphrase)
								var end = begin + keyphrase.length - 1

								if (keyphrase == "DEFAULT INTENT")
									{
										begin = -2
										end = -2
									}

								if (begin == -1)
									{	console.log("error"+keyphrase+" "+utterance['input'])
											process.exit(0)
									}

								data[key]['turns'][key1]['intent_keyphrases_gold'][intent] = []
								data[key]['turns'][key1]['intent_keyphrases_gold'][intent].push([begin, end])
								data[key]['turns'][key1]['intent_keyphrases_gold'][intent].push(keyphrase)
								}
						}
					}, this)
					}
			}, this)
		}, this)
	}, this)

console.log(JSON.stringify(data, null, 4))
// console.log()
process.exit(0)
}

// new prototype


if (new_dial_stats)
	{

		// dial_usa.json
		// dial_isr.json

		// dialogies = JSON.parse(fs.readFileSync("./dialogue_restore/dial_isr.json"))
		dialogies = JSON.parse(fs.readFileSync("./dialogue_restore/dial_usa.json"))

		var gooddial = 0
		var utter = 0

		_.each(dialogies, function(dialogue, key, list){ 
			if (dialogue['status'] == 'goodconv')
				gooddial = gooddial + 1
		}, this)

		
		var agents = []
		_.each(dialogies, function(dialogue, key, list){ 
			if (dialogue['status'] == 'goodconv')
			{
				utter = utter  + dialogue['turns'].length
				var agent = ""
				_.each(dialogue['turns'], function(turn, key1, list1){ 
					if (turn['user'].indexOf('NewAgent')!=-1)	agent = 'NewAgent'
					if (turn['user'].indexOf('KBAgent')!=-1)	agent = 'KBAgent'
				}, this)
			agents.push(agent)
			}
		}, this)

		
		var agentshash = _.countBy(agents, function(num) { return num})


		console.log("good dialogues")
		console.log(gooddial)

		console.log("agents")
		console.log(agentshash)

		console.log("utterances")
		console.log(utter)

		process.exit(0)
	}


if (do_mlrule)
	{

	// trainset = trainutils.filteraccept(JSON.parse(fs.readFileSync("datasets/Employer/trainonelabel.json")))
	// testset = trainutils.filteraccept(JSON.parse(fs.readFileSync("datasets/Employer/testalllabels.json")))

	var datalist = [
			// "datasetrules.js",
			// "datasetrules1.js"
			// "trainonelabel.json",
			// "testalllabels.json"	
			"turkers_keyphrases_only_rule.json",
			"students_keyphrases_only_rule.json"
			]

	var data = []
	_.each(datalist, function(value, key, list){ 
		// data = data.concat(JSON.parse(fs.readFileSync("./datasets/Employer/"+value)))
		data = data.concat(JSON.parse(fs.readFileSync("../datasets/Employer/Dialogue/"+value)))
	})

	// var ppdb = require("./research/ppdb/utils.js")

	var data = trainutils.extractturns(data)

	_.each(data, function(value, key, list){ 
		var str = value['input'].toLowerCase().trim();
		data[key]['input'] = regexpNormalizer(str)
		
		// ppdb.cachepos(data[key]['input'].replace(/\./g,""), function(err, response){	
  		// })
	}, this)

	// console.log()
	// process.exit(0)

	data = _.shuffle(data)

	var dataset = partitions.partition(data, 1, Math.round(data.length*0.3))

	// console.log(trainutils.dividedataset(dataset['train'])['one'].length)
	// console.log(dataset['test'].length)
	// console.log(JSON.stringify(trainutils.dividedataset(dataset['train'])['one'], null, 4))
	// process.exit(0)
	
	console.log("sizes")
	console.log("train "+trainutils.dividedataset(dataset['train'])['one'].length)
	console.log("test "+dataset['test'].length)

	// console.log()
	// process.exit(0)

    // var stats = trainAndTest.trainAndTest_hash(classifier.PartialClassificationEquallySagae, train, trainutils.dividedataset(test)['one'], 5)
   		var stats = trainAndTest.trainAndTest_hash(classifier.PartialClassificationEquallySagae, trainutils.dividedataset(dataset['train'])['one'], dataset['test'], 5)
   		console.log(JSON.stringify(stats, null, 4))
   
	}

if (just_test)
	{
	var datalist = [
			"usd-nlu_ncagent_students_negonlpnc.json",
			]

	var data = []
	_.each(datalist, function(value, key, list){ 
		data = data.concat(JSON.parse(fs.readFileSync("datasets/Employer-usa/"+value)))
	})

	_.each(data, function(value, key, list){ 

	}, this)
	
	var dataset = partitions.partition(data, 1, Math.round(data.length*0.3))

	var stats = trainAndTest.trainAndTest_hash(createNewClassifier, dataset['train'], dataset['test'], 5)

	// console.log(stats[0]['data'])
	console.log(JSON.stringify(stats[0]['data'], null, 4))
	
	process.exit(0)
	}




if (do_learning_curves) {

	datasetNames = [
			"turkers_separated.json",
			"students_separated.json"
			// "5_woz_ncagent_turkers_negonlp2ncAMT.json",
			// "nlu_ncagent_students_negonlpnc.json",
			// "nlu_ncagent_turkers_negonlpncAMT.json",
			 // "3_woz_kbagent_turkers_negonlp2.json",
			// "woz_kbagent_students_negonlp.json",
			// "nlu_kbagent_turkers_negonlpAMT.json"
			// "turkers.json"
			]

	dataset = []

	_.each(datasetNames, function(value, key, list){ 
		// dataset = dataset.concat(JSON.parse(fs.readFileSync("datasets/Employer/"+value)))
		dataset = dataset.concat(JSON.parse(fs.readFileSync("../datasets/Employer/Dialogue/"+value)))
	});


	dataset = _.shuffle(dataset)

	// var dataset = partitions.partition(dataset, 1, Math.round(dataset.length*0.4))

	// data1 = []
	// _.each(dataset, function(value, key, list){ 
		// data1 = data1.concat(value['turns'])
	// }, this)
	// data1 = _.shuffle(data1)
	// dataset = data1


	// console.log(dataset)
	// process.exit(0)
	// dataset= _.sample(dataset, 120)


	// console.log(trainutils.dividedataset(data2)['one'].length)



	// datasetNames = ["students.json"]
	// datasettest = []

	// _.each(datasetNames, function(value, key, list){ 
		// dataset = dataset.concat(JSON.parse(fs.readFileSync("datasets/Employer/"+value)))
		// datasettest = datasettest.concat(JSON.parse(fs.readFileSync("datasets/Employer/Dialogue/"+value)))
	// });

	// data2 = []
	// _.each(datasettest, function(value, key, list){ 
		// data2 = data2.concat(value['turns'])
	// }, this)

	// data2 = _.shuffle(data2)
	// var trainset = trainutils.filteraccept(JSON.parse(fs.readFileSync("datasets/Employer/trainonelabel.json")))
	// var testset = trainutils.filteraccept(JSON.parse(fs.readFileSync("datasets/Employer/testalllabels.json")))

	// var trainset = _.shuffle(JSON.parse(fs.readFileSync("datasets/Employer/trainonelabel.json")))
	// var testsetncagent = _.shuffle(JSON.parse(fs.readFileSync("datasets/Employer/testalllabels.json")))
	// var testsetkbagent = _.shuffle(JSON.parse(fs.readFileSync("datasets/Employer/testkbagent.json")))


	// console.log(testsetncagent.length)

	// console.log(trainutils.dividedataset(testsetncagent)['two'].length)

	// console.log(trainutils.dividedataset(testsetncagent)['one'].length)


	// testsetkbagent
	// console.log(testsetkbagent.length)
	// 132
	// console.log(trainutils.dividedataset(testsetkbagent)['two'].length)
	// 93
	// console.log(trainutils.dividedataset(testsetkbagent)['one'].length)
	// 39
	// var testset = _.sample(testsetncagent, 99)
	// var testset = testsetncagent

	// console.log(testset.length)
	// process.exit(0)

	// console.log(trainutils.dividedataset(testset)['two'].length)
	// console.log(trainutils.dividedataset(testset)['one'].length)
	// console.log()
	// process.exit(0)

	// testset = trainutils.dividedataset(testset)['two']
// more than 2
// 103
// exactly one
// 166

// mix - test set with length of global trainutils
// 293 3 fold and test 293

// one 
// train 293 3 fold test 275

// two
// test 174


	// console.log(trainutils.dividedataset(test)['one'].length)


	// console.log(trainset.length)
	// console.log(testset.length)
	// console.log()
	// process.exit(0)

	classifiers  = {

		Baseline_0: classifier.PartialClassificationEquallyIntent

		// Baseline_1: classifier.SvmPerfClassifier,
		// Baseline_2: classifier.PartialClassificationEquallySagae,

		// Composite_Sagae: classifier.WinnowSegmenter, 
		
		// Component: classifier.PartialClassificationEqually_Component,
		// Composite: classifier.SvmOutputPartialEqually_Composite

		// Intent_AttributeValue: classifier.PartialClassificationJustTwo,
		 //SVM_Separated: classifier.SvmPerfClassifierPartial,
		// Intent_Attribute_Value: classifier.PartialClassificationEqually
		//New_approach: classifier.PartialClassificationEquallyNoOutput, 
		// SVM_SeparatedAfter: classifier.SvmOutputPartialEqually,
		// SVM_SeparatedClassification: classifier.PartialClassificationEqually,
		// SVM_SeparatedClassification_IS: classifier.PartialClassificationEquallyIS

		// Intent_Attribute_AttributeValue: classifier.PartialClassificationVersion1,
		// Intent_AttributeValue: classifier.PartialClassificationVersion2,

	// HomerSvmPerf: classifier.HomerSvmPerf,
	// SvmPerf: classifier.SvmPerfClassifier,

	// HomerWinnow: classifier.HomerWinnow, 
	// Winnow: classifier.WinnowClassifier,  

	// HomerAdaboost: classifier.HomerAdaboostClassifier,
	// Adaboost: classifier.AdaboostClassifier, 

	// SVM: classifier.SvmPerfClassifier,
	// Homer: classifier.HomerWinnow,
	// PartialClassificationEquallyGreedy: classifier.PartialClassificationEquallyGreedy,
		// PartialClassificationEquallyGreedyISNoTrick: classifier.PartialClassificationEquallyGreedyISNoTrick,
		// PartialClassificationEquallyGreedyISTrick: classifier.PartialClassificationEquallyGreedyISTrick,
		// SVM: classifier.SvmPerfClassifier,

		// PartialClassificationEquallyGreedyNoISBiagram: classifier.PartialClassificationEquallyGreedyTrick,
		
		// Component_Sagae_Improved: classifier.PartialClassificationEquallySagaeImp,

		// Component_Sagae: classifier.PartialClassificationEquallySagae,
		// Component_Sagae: classifier.PartialClassificationEquallySagae,

		// Component_Sagae_NoCompletion: classifier.PartialClassificationEquallySagaeNoCompletion,

		// Composite_SVM_IS: classifier.SvmPerfClassifierIS,


		// Component_Sagae_Imp: classifier.PartialClassificationEquallySagaeImp,
		// Component_Sagae_Nospell: classifier.PartialClassificationEquallySagaeNospell,
		// Component_Sagae_no_Completion: classifier.PartialClassificationEquallySagaeNoCompletition,
		// Composite_Sagae: classifier.WinnowSegmenter, 
		// Composite_SVM_noIS_nospell: classifier.SvmPerfClassifierNoIS,
		// Composite_SVM: classifier.SvmPerfClassifier
		// Composite_SVM_noIS_spell: classifier.SvmPerfClassifierSpell
// 
	

		// SvmPerfClassifier: classifier.SvmPerfClassifier,
		// SvmPerfClassifierStemmer: classifier.SvmPerfClassifierLematization,
		// SvmPerfClassifierNatural: classifier.SvmPerfClassifierSimilarity
		
	};

	// parameters = ['F1','TP','FP','FN','Accuracy','Precision','Recall']
	parameters = ['F1','Precision','Recall', 'Accuracy']
	// curves.learning_curves(classifiers, dataset, parameters, 10, 5, data2)
	curves.learning_curves(classifiers, dataset, parameters, 2, 2,  5)
	console.log()
	process.exit(0)
}


	
if (do_small_temporary_serialization_test) {
	var classifier = createNewClassifier(); 
	classifier.trainBatch(collectedDatasetSingle);
	console.log("\nConvert to string, and test on training data again");
	serialization.toStringVerified(classifier, createNewClassifier, __dirname, collectedDatasetSingle, /*explain=*/4);
	process.exit(1);
}

if (do_cross_dataset_testing) {
	verbosity=0;
	
	console.log("Train on grammar, test on multi8: "+
			trainAndTest(createNewClassifier, grammarDataset, collectedDatasetMulti8, verbosity).shortStats())+"\n";
//	console.log("Train on grammar+single1, test on multi8: "+
//			trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle), collectedDatasetMulti8, verbosity).shortStats())+"\n";
	console.log("Train on grammar+multi1, test on multi8: "+
			trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetMulti), collectedDatasetMulti8, verbosity).shortStats())+"\n";
	console.log("Train on grammar+single1+multi1, test on multi8: "+
			trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle).concat(collectedDatasetMulti), collectedDatasetMulti8, verbosity).shortStats())+"\n";

	console.log("Train on grammar+multi2, test on multi8: "+
		trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetMulti2), collectedDatasetMulti8, verbosity).shortStats())+"\n";
//	console.log("Train on grammar+single2, test on multi8: "+
//		trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle2), collectedDatasetMulti8, verbosity).shortStats())+"\n";
	console.log("Train on grammar+single2+multi2, test on multi8: "+
			trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle2).concat(collectedDatasetMulti2), collectedDatasetMulti8, verbosity).shortStats())+"\n";
	
//	console.log("Train on grammar+multi1+multi2, test on multi8: "+
//		trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetMulti).concat(collectedDatasetMulti2), collectedDatasetMulti8, verbosity).shortStats())+"\n";
//	console.log("Train on grammar+single1+single2, test on multi8: "+
//		trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle).concat(collectedDatasetSingle2), collectedDatasetMulti8, verbosity).shortStats())+"\n";
	console.log("Train on grammar+single1+multi1+single2+multi2, test on multi8: "+
		trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle).concat(collectedDatasetMulti).concat(collectedDatasetSingle2).concat(collectedDatasetMulti2), collectedDatasetMulti8, verbosity).shortStats())+"\n";
	
//	console.log("\nTrain on grammar+single1+multi8, test on multi2: "+
//		trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle).concat(collectedDatasetMulti8), collectedDatasetMulti2, verbosity).shortStats())+"\n";
//	console.log("Train on grammar+single1+multi1+multi8, test on multi2: "+
//			trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle).concat(collectedDatasetMulti).concat(collectedDatasetMulti8), collectedDatasetMulti2, verbosity).shortStats())+"\n";

//	console.log("\nTrain on grammar data, test on woz single class: "+
//		trainAndTest(createNewClassifier, grammarDataset, collectedDatasetSingle, verbosity).shortStats())+"\n";
//	console.log("Train on grammar data, test on woz multi class: "+
//		trainAndTest(createNewClassifier, grammarDataset, collectedDatasetMulti, verbosity).shortStats())+"\n";
	console.log("\nTrain on woz single class, test on woz multi class: "+
		trainAndTest(createNewClassifier, collectedDatasetSingle, collectedDatasetMulti, verbosity).shortStats())+"\n";
	console.log("Train on woz multi class, test on woz single class: "+
		trainAndTest(createNewClassifier, collectedDatasetMulti, collectedDatasetSingle, verbosity).shortStats())+"\n";

	collectedDatasetMultiPartition = partitions.partition(collectedDatasetMulti, 0, collectedDatasetMulti.length/2);
	collectedDatasetSinglePartition = partitions.partition(collectedDatasetSingle, 0, collectedDatasetSingle.length/2);
	console.log("Train on mixed, test on mixed: "+
		trainAndTest(createNewClassifier, 
			collectedDatasetMultiPartition.train.concat(collectedDatasetSinglePartition.train), 
			collectedDatasetMultiPartition.test.concat(collectedDatasetSinglePartition.test), 
			verbosity).shortStats())+"\n";
	console.log("Train on mixed, test on mixed (2): "+
		trainAndTest(createNewClassifier, 
			collectedDatasetMultiPartition.test.concat(collectedDatasetSinglePartition.test), 
			collectedDatasetMultiPartition.train.concat(collectedDatasetSinglePartition.train), 
			verbosity).shortStats())+"\n";
} // do_cross_dataset_testing

if (do_final_test) {
	verbosity=0;
	
	["Employer"/*,"Candidate"*/].forEach(function(classifierName) {
		console.log("\nFinal test for "+classifierName);

		var grammarDataset = JSON.parse(fs.readFileSync("datasets/"+classifierName+"/0_grammar.json"));
		var collectedDatasetMulti = JSON.parse(fs.readFileSync("datasets/"+classifierName+"/1_woz_kbagent_students.json"));
		var collectedDatasetSingle = JSON.parse(fs.readFileSync("datasets/"+classifierName+"/1_woz_kbagent_students1class.json"));
		var collectedDatasetMulti2 = JSON.parse(fs.readFileSync("datasets/"+classifierName+"/2_experts.json"));
		var collectedDatasetSingle2 = JSON.parse(fs.readFileSync("datasets/"+classifierName+"/2_experts1class.json"));
		var amtDataset = JSON.parse(fs.readFileSync("datasets/"+classifierName+"/3_woz_kbagent_turkers_negonlp2.json"));
		
		console.log("Train on grammar, test on AMT: "+
				trainAndTest(createNewClassifier, grammarDataset, amtDataset, verbosity).shortStats())+"\n";
		console.log("Train on grammar+multi1, test on AMT: "+
				trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetMulti), amtDataset, verbosity).shortStats())+"\n";
		console.log("Train on grammar+single1+multi1, test on AMT: "+
				trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle).concat(collectedDatasetMulti), amtDataset, verbosity).shortStats())+"\n";
		console.log("Train on grammar+multi2, test on AMT: "+
				trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetMulti2), amtDataset, verbosity).shortStats())+"\n";
		console.log("Train on grammar+single2+multi2, test on AMT: "+
				trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle2).concat(collectedDatasetMulti2), amtDataset, verbosity).shortStats())+"\n";
		console.log("Train on grammar+single1+multi1+single2+multi2, test on AMT: "+
				trainAndTest(createNewClassifier, grammarDataset.concat(collectedDatasetSingle).concat(collectedDatasetMulti).concat(collectedDatasetSingle2).concat(collectedDatasetMulti2), amtDataset, verbosity).shortStats())+"\n";
	});
} // do_final_test

if (do_cross_validation) {
	verbosity=0;

	var numOfFolds = 5; // for k-fold cross-validation
	var microAverage = new PrecisionRecall();
	var macroAverage = new PrecisionRecall();
	
	var constantTrainSet = (grammarDataset).concat(collectedDatasetSingle);
	var devSet = (collectedDatasetMulti2).concat(collectedDatasetMulti8);
	var startTime = new Date();
	console.log("\nstart "+numOfFolds+"-fold cross-validation on "+grammarDataset.length+" grammar samples and "+collectedDatasetSingle.length+" single samples and "+devSet.length+" collected samples");
	partitions.partitions(devSet, numOfFolds, function(trainSet, testSet, index) {
		var stats = trainAndTest(createNewClassifier,
			trainSet.concat(constantTrainSet), testSet, verbosity,
			microAverage, macroAverage).shortStats();
		console.log("partition #"+index+": "+(new Date()-startTime)+" [ms]: "+stats);
	});
	//_(macroAverage).each(function(value,key) { macroAverage[key] = value/numOfFolds; });
	console.log("end "+numOfFolds+"-fold cross-validation: "+(new Date()-startTime)+" [ms]");

	//if (verbosity>0) {console.log("\n\nMACRO AVERAGE FULL STATS:"); console.dir(macroAverage.fullStats());}
	//console.log("\nMACRO AVERAGE SUMMARY: "+macroAverage.shortStats());

	microAverage.calculateStats();
	console.log("MICRO AVERAGE SUMMARY: "+microAverage.shortStats());
} // do_cross_validation

if (do_serialization) {
	verbosity=0;
		["Employer-egypt-translate", "Employer-egypt-generate", "Employer-egypt"].forEach(function(classifierName) {
		console.log("\nBuilding classifier for "+classifierName);
		var classifier = createNewClassifier();
		var jsonEmpty = classifier.toJSON();  // just to check that it works

		try { var datasetNames = fs.readdirSync("datasets/" + classifierName) }

		catch (e)
		{	
			throw new Error(e);
		}

		var dataset = datasetNames.reduce(function(previous, current) {
			return previous.concat(
				JSON.parse(
					fs.readFileSync(
						"datasets/"+classifierName+"/" + current )));
		}, []);

		console.log("\nstart training on "+dataset.length+" samples"); var startTime = new Date();
		classifier.trainBatch(dataset);
		console.log("end training on "+dataset.length+" samples, "+(new Date()-startTime)+" [ms]");

		if (do_test_on_training_data) console.log("\ntest on training data: " + test(classifier, dataset).shortStats());

		console.log("\nConvert to string, and test on training data again");
		fs.writeFileSync("trainedClassifiers/"+classifierName+"/MostRecentClassifier.json", 
			(do_test_on_training_data? 
					serialization.toStringVerified(classifier, createNewClassifier, __dirname, dataset):
					serialization.toString(classifier, createNewClassifier, __dirname))
			, 'utf8');
	});
} // do_serialization



})


f.run();
