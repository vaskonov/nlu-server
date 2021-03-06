// TP - the number of retrieved paraphrases that cover at least one phrase in the gold standard data
// FP - the number of retrieved paraphases that doesn't cover any record
// FN - the number of records that was left uncovered in gold standard data

var _ = require('underscore')._; 
var fs = require('fs');
var natural = require('natural');
var utils = require('./utils');
var async = require('async');
var redis = require("redis")

var client = redis.createClient(6369)

var output = {}


// var StanfordSimpleNLP = require('stanford-simple-nlp');


// var stanfordSimpleNLP = new StanfordSimpleNLP.StanfordSimpleNLP()
//   stanfordSimpleNLP.loadPipelineSync();

//   stanfordSimpleNLP.process('This is so good.', function(err, result) {
//     console.log(err)
//     console.log(result)
//     console.log()
//     process.exit(0)
//   });


client.select(3, function() {
     client.zrevrange("offer", 0, -1, 'WITHSCORES', function (err, results) {
        var lists = []
        var buffer = []
        _.each(results, function(value, key, list){ 
          if (value.indexOf("^") != -1)
            buffer = value.split("^")
          else
            // lists.push([buffer[0], buffer[1], value])
            {
	           buffer[1] = 'NO'
              if (!(buffer[1] in output))
                output[buffer[1]] = []
              output[buffer[1]].push([buffer[0], parseFloat(value)])
            }
        }, this)


        _.each(output, function(value, pos, list){ 
          output[pos] = _.sortBy(value, function(num){ return num[1]; });
        }, this)

        _.each(output['NO'], function(value, key, list){ 
          console.log(value[0])
        }, this)

        // console.log(output['NO'])

        // console.log(_.unique(lis))
        // console.log(lis.length)
      })
})

//              console.log(pos)
// //             // if (pos == null)
// //                 // console.log("nukl")
//      })
//  })

//var requestify = require('requestify'); 
// var querystring = require('querystring');

// utils.dep(function(res){
    // console.log(res)
// })

//requestify.post('http://127.0.0.1:10345/parse', {
//    hello: 'world',
  // tagged_text: 'The_DT boy_NN sat_VBD on_IN the_DT fence_NN ._. He_PRP laughed_VBD ._.'
//})

// var post_data = querystring.stringify({'tagged_text' : 'The_DT boy_NN sat_VBD on_IN the_DT fence_NN ._. He_PRP laughed_VBD ._.'})

// var client = redis.createClient(6369)
//var Lemmer = require('node-lemmer').Lemmer;
//var lemmerEng = new Lemmer('english');

//var wordnet = new natural.WordNet();

//var redis = require("redis")
//var clientpos = redis.createClient();

//var sync = require('synchronize')

//sync(utils, 'retrievepos')

// var data = sync.await(utils.retrievepos("I want a fruit", sync.defer()))
// console.log(data)
// process.exit(0)

// console.log("hi")
// sync(utils, 'cleanredis')


//sync.fiber(function(){
  //  console.log("begin")
    //var data  = utils.cleanpos("can offer")
    // cleanpos
  //  console.log(data)
  //  console.log("end")

//})




// client.select(0, function() {
//      client.zrevrange("offer",0,-1, function (err, pos) {
//              console.log(err)
//              console.log(pos)
// //             // if (pos == null)
// //                 // console.log("nukl")
//      })
//  })
// // var subst = function (str) {
// 	 async.series([
//     function(callback){
//     	utils.quickfetch(str, function(err, ret){
//     		return ret
//     	})
//     },
//     function(callback){
//     	return "a"
//     }
//     ])
// }


// console.log(subst('offer'))
// process.exit(0)
// var a = utils.lemmatize(['is','offering'])
// console.log(a)
// process.exit(0)
// console.log(lemmerEng.lemmatize('offered by offer'))



// var client = redis.createClient(6369, '127.0.0.1', {});

// utils.getcontent("be working", function (err,replies){
	// console.log(replies)
// })

// natural.lookupSynonyms(word, callback) {


//        var ptr = ptrs.pop();

//     this.get(ptr.synsetOffset, ptr.pos, function(result) {
//       synonyms.push(result);
// //       wordnet.loadSynonyms(synonyms, results, ptrs, callback);

// wordnet.lookup('offer', function(results) {
//      console.log(results)
  //   console.log(JSON.stringify(results, null, 4))
//     // var ptr = results.ptrs.pop();
//     // wordnet.get(ptr.synsetOffset, ptr.pos, function(result) {
//         // console.log(result)
//         // process.exit(0)
//     })

//     // process.exit(0)
// })
// 


// wordnet.lookup('offer', function(results) {
    // console.log(JSON.stringify(results, null, 4))
    // _.each(list, function(value, key, list){ 
// /            //   async.eachSeries(actual, function(actkey, callbackact){

    // }, this)

    // })
// wordnet.lookup('offer', function(results) {

    // _.each(results, function(res, key, list){ 
    // }, this)

 // async.series([
    // function(callback){

// var a = ['a','b','c']
// var b = ['1','2','3']
//     async.eachSeries(a, function(el1,done1){
//         async.eachSeries(b, function(el2, done2){
//             console.log(el1 + " " + el2)
//             done2()
//         }, done1())
//     })
    
// }])

    // async.eachSeries(results, function(res, callback){
        
//         console.log(res['lemma'])
//         console.log(res['pos'])
//         console.log(res['synonyms'])

//         async.eachSeries(res.ptrs, function(ptr, callback1){
//             wordnet.get(ptr.synsetOffset,ptr.pos, function (red){
//                 console.log(red['lemma'])
//                 console.log(red['pos'])
//                 if (red['pointerSymbol'] == "!") red['pointerSymbol'] = "Antonym"
//                 if (red['pointerSymbol'] == "@") red['pointerSymbol'] = "Hypernym"
//                 if (red['pointerSymbol'] == "~") red['pointerSymbol'] = "Hyponym"
//                 if (red['pointerSymbol'] == "*") red['pointerSymbol'] = "Entailment"
//                 console.log(red['pointerSymbol'])
//                 callback1()
//             })
//         })

//     })  
// })  


//     !    Antonym 
// @    Hypernym 
//  ~    Hyponym 
// *    Entailment 
