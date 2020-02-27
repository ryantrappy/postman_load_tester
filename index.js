/**
 * @fileOverview A sample script to demonstrate parallel collection runs using async.
 */
const path = require('path'), // ensures that the path is consistent, regardless of where the script is run from

	async = require('async'), // https://npmjs.org/package/async
	newman = require('newman'), // change to require('newman'), if using outside this repository

	/**
	 * A set of collection run options for the parallel collection runs. For demonstrative purposes in this script, an
	 * identical set of options has been used. However, different options can be used, so as to actually run different
	 * collections, with their corresponding run options in parallel.
	 *
	 * @type {Object}
	 */
	options = {
		collection: path.join(__dirname, 'collection_name.postman_collection.json'),
		insecure: true
	},

	/**
	 * A collection runner function that runs a collection for a pre-determined options object.
	 *
	 * @param {Function} done - A callback function that marks the end of the current collection run, when called.
	 */
	parallelCollectionRun = function (done) {
		newman.run(options, done);
	};
	const runIterations = 2;
	const tasks = [];
	for(let i = 0; i< runIterations; i++){
		tasks.push(parallelCollectionRun);
	}

	const printStats = function(results){
		if(results.length === 0){
			console.log('No results');
			return;
		}
		const averageTimes = [];
		let averageResponse = 0;
		results.forEach(function (result) {
			averageResponse = result.run.timings.responseAverage + averageResponse;
			averageTimes.push(result.run.timings.responseAverage);
		});
		averageResponse = averageResponse/results.length/1000;
		let resultString = 'Average response: ' + averageResponse + ' seconds';
		console.log(resultString);
		console.log('Raw times:');
		console.log(JSON.stringify(averageTimes));
	};
	console.log('Starting parallel tests');
// Runs tasks runIterations times
async.parallel(tasks,

	/**
	 * The
	 *
	 * @param {?Error} err - An Error instance / null that determines whether or not the parallel collection run
	 * succeeded.
	 * @param {Array} results - An array of collection run summary objects.
	 */
	function (err, results) {
		err && console.error(err);
		printStats(results);
	});

