/**
 * Create a new classifier for the ML server.
 *
 * This is the file where the classifier specification (type, options, etc.) is defined.
 *
 * The selection of which classifier to actually use is made in the last line of this file.
 *
 * 
 * @author Erel Segal-Halevi
 * @since 2013-08
 */

var ftrs = require('../machine-learning/features');
var fs = require('fs');

module.exports = function() {return {
		normalizer: [
			ftrs.LowerCaseNormalizer,
			ftrs.RegexpNormalizer(
				JSON.parse(fs.readFileSync('knowledgeresources/BiuNormalizations.json'))
		)],
		
		inputSplitter: ftrs.RegexpSplitter(/[.,;?!]|and/i),

		spellChecker: null,
		
		featureExtractor: [
			ftrs.WordsFromText(1,false/*,4,0.8*/),
			ftrs.WordsFromText(2,false/*,4,0.6*/),
		],
		
		featureExtractorForClassification: [
			ftrs.Hypernyms(JSON.parse(fs.readFileSync('knowledgeresources/hypernyms.json'))),
		],

		featureDocumentFrequency: {},
		multiplyFeaturesByIDF: true,

		pastTrainingSamples: [], // to enable retraining

		
		winnowOptions: {
				retrain_count: 12,  /* much better than 5, better than 10 */
				promotion: 1.5,
				demotion: 0.5,
				do_averaging: false,
				margin: 1,
				//debug: true,
		},
}};
