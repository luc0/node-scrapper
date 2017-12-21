'use strict';

const express = require('express');
const osmosis = require('osmosis');
const striptags = require('striptags');

// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  //res.send('Hello world\n');
  

	var FeedParser = require('feedparser');
	var request = require('request'); // for fetching the feed

	var req = request('https://www.infobae.com/feeds/rss/')
	var options = {};
	var feedparser = new FeedParser([options]);

	req.on('error', function (error) {
	  // handle any request errors
	});

	req.on('response', function (res) {
	  var stream = this; // `this` is `req`, which is a stream

	  if (res.statusCode !== 200) {
	    this.emit('error', new Error('Bad status code'));
	  }
	  else {
	    stream.pipe(feedparser);
	  }
	});

	feedparser.on('error', function (error) {
	  // always handle errors
	});

	feedparser.on('readable', function () {
	  // This is where the action is!
	  var stream = this; // `this` is `feedparser`, which is a stream
	  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
	  var item;

	  while (item = stream.read()) {
	  	if (striptags(item.description).length > 10) {
			console.log(item.title);
			console.log(striptags(item.description));
			console.log(item.link);
			console.log(item.author);
			console.log('---')
		}
	  }
	});

	// var natural = require('natural');
	// var classifier = new natural.BayesClassifier();
    //
	// classifier.addDocument('i am long qqqq', 'buy');
	// classifier.addDocument('buy the q\'s', 'buy');
	// classifier.addDocument('short gold', 'sell');
	// classifier.addDocument('sell gold', 'sell');
    //
	// classifier.train();
    //
	// console.log(classifier.classify('buy gold'));
});


app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
