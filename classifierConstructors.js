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


module.exports = {

createPassiveAggressiveClassifier: function() {
	var classifiers = require(__dirname+'/../machine-learning/classifiers');
	var settings = require(__dirname+'/classifierSettings')();
	var extend = require('util')._extend;

	return new classifiers.EnhancedClassifier(extend(settings,{
		classifierType: classifiers.multilabel.PassiveAggressive.bind(this, {
			Constant: 5.0,
			retrain_count: 12,
		}),
	}));
},

createWinnowSegmenter: function() {
	var classifiers = require(__dirname+'/../machine-learning/classifiers');
	var settings = require(__dirname+'/classifierSettings')();
	
	return new classifiers.EnhancedClassifier({
		normalizer: settings.normalizer,
		inputSplitter: settings.inputSplitter,
		pastTrainingSamples: [], // to enable retraining

		classifierType: classifiers.multilabel.BinarySegmentation.bind(this, {
			binaryClassifierType: classifiers.Winnow.bind(this, settings.winnowOptions),
			featureExtractor: settings.featureExtractor,
			//segmentSplitStrategy: 'shortestSegment',
			//segmentSplitStrategy: 'longestSegment',
			//segmentSplitStrategy: 'cheapestSegment',
			segmentSplitStrategy: null,
		}),
	});
},



createWinnowClassifier: function() {
	var classifiers = require(__dirname+'/../machine-learning/classifiers');
	var settings = require(__dirname+'/classifierSettings')();
	var extend = require('utils')._extend;

	return new classifiers.EnhancedClassifier(extend(settings, {
		classifierType: classifiers.multilabel.BinaryRelevance.bind(this, {
				binaryClassifierType: classifiers.Winnow.bind(this, settings.winnowOptions),
		}),
	}));
},



createBayesClassifier: function() {
	var classifiers = require(__dirname+'/../machine-learning/classifiers');
	var settings = require(__dirname+'/classifierSettings')();
	var extend = require('util')._extend;

	return new classifiers.EnhancedClassifier(extend(settings, {
		classifierType: classifiers.multilabel.BinaryRelevance.bind(this, {
				binaryClassifierType: classifiers.Bayesian.bind(this, {
				}),
		}),
	}));
},


createBayesSegmenter: function() {
	var classifiers = require(__dirname+'/../machine-learning/classifiers');
	var settings = require(__dirname+'/classifierSettings')();

	return new classifiers.EnhancedClassifier({
		normalizer: settings.normalizer,
		inputSplitter: settings.inputSplitter,
		pastTrainingSamples: [], // to enable retraining

		classifierType: classifiers.multilabel.MulticlassSegmentation.bind(this, {
			multiclassClassifierType: classifiers.Bayesian.bind(this, {
				calculateRelativeProbabilities: true,
			//	normalizeOutputProbabilities: true
			}),
			featureExtractor: settings.featureExtractor,
		}),
	});
},



createHomerClassifier: function() {
	var classifiers = require(__dirname+'/../machine-learning/classifiers');
	var settings = require(__dirname+'/classifierSettings')();
	var extend = require('util')._extend;
	var Hierarchy = require(__dirname+'/Hierarchy');

	return new classifiers.EnhancedClassifier(extend(settings, {
		classifierType: classifiers.multilabel.Homer.bind(this, {
			multilabelClassifierType: classifiers.multilabel.BinaryRelevance.bind(this, {
				binaryClassifierType: classifiers.Winnow.bind(this, settings.winnowOptions),
			}),
//			multilabelClassifierType: classifiers.multilabel.PassiveAggressive.bind(this, {
//				Constant: 5.0,
//				retrain_count: 1,
//			}),
			splitLabel: Hierarchy.splitJson,
			joinLabel:  Hierarchy.joinJson,
		}),
		//normalize_features: true,
	}));
},

}

//module.exports.defaultClassifier = module.exports.createPassiveAggressiveClassifier;
//module.exports.defaultClassifier = module.exports.createWinnowClassifier;
//module.exports.defaultClassifier = module.exports.createWinnowSegmenter;
//module.exports.defaultClassifier = module.exports.createBayesSegmenter;
module.exports.defaultClassifier = module.exports.createHomerClassifier;

if (!module.exports.defaultClassifier) throw new Error("Default classifier is null");
