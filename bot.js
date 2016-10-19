"use strict";
const Discord = require('discord.js');
var request = require('request');
const client = new Discord.Client();
var util = require('util');
var youtube_node = require('youtube-node');
var Wolfram = require('node-wolfram');


client.on('ready', () => {
  console.log('I am ready!');
});


function wolfram(){
	this.wolfram = new Wolfram("")
}

wolfram.prototype.respond = function (query, channel) {
	var tmpMsg = "";
	this.wolfram.query(query, function(error, result) {
			if (error) {
				console.log(error);
				tmpMsg = "Wolfram Unreachable";
			} else {
				var response = "";
				if(result.queryresult.$.success == "true"){
					tmpMsg = "";
					if(result.queryresult.hasOwnProperty("warnings")){
						for(var i in result.queryresult.warnings){
							for(var j in result.queryresult.warnings[i]){
								if(j != "$"){
									try {
										channel.sendMessage(result.queryresult.warnings[i][j][0].$.text);
									} catch(e){
										console.log("WolframAlpha: failed displaying warning:\n"+e.stack());
									}
								}
							}
						}
					}
					if(result.queryresult.hasOwnProperty("assumptions")){
						for(var i in result.queryresult.assumptions){
							for(var j in result.queryresult.assumptions[i]){
								if(j == "assumption"){
									try {
										channel.sendMessage(`Assuming ${result.queryresult.assumptions[i][j][0].$.word} is ${result.queryresult.assumptions[i][j][0].value[0].$.desc}`);
									} catch(e) {
										console.log("WolframAlpha: failed displaying assumption:\n"+e.stack());
									}
								}
							}
						}
					}
					for(var a=0; a<result.queryresult.pod.length; a++)
	        {
	            var pod = result.queryresult.pod[a];
	            response += "**"+pod.$.title+"**:\n";
	            for(var b=0; b<pod.subpod.length; b++)
	            {
	                var subpod = pod.subpod[b];
									//can also display the plain text, but the images are prettier
	                /*for(var c=0; c<subpod.plaintext.length; c++)
	                {
	                    response += '\t'+subpod.plaintext[c];
	                }*/
									for(var d=0; d<subpod.img.length;d++)
									{
										response += "\n" + subpod.img[d].$.src;
										channel.sendMessage(response);
										response = "";
									}
	            }
							response += "\n";
	        }
				}	else {
					if(result.queryresult.hasOwnProperty("didyoumeans")){
						var msg = [];
						for(var i in result.queryresult.didyoumeans){
							for(var j in result.queryresult.didyoumeans[i].didyoumean) {
								msg.push(result.queryresult.didyoumeans[i].didyoumean[j]._);
							}
						}
						tmpMsg = "Did you mean: " + msg.join(" ");
					} else {
						tmpMsg = "No results from Wolfram Alpha";
					}
				}
			}
		});
};

function youtube() {
	this.pm = 'http://www.youtube.com/watch?v=qomoxbo3v-I';
	this.bochka = 'http://www.youtube.com/watch?v=r5uzc3U8Qhc';
	this.youtube = new youtube_node();
	this.youtube.setKey("");
	this.youtube.addParam('type', 'video');
};


youtube.prototype.respond = function (query, channel) {
	this.youtube.search(query, 1, function(error, result) {
			if (error || (!result || !result.items || result.items.length < 1)) {
				channel.sendMessage("error boys");
			}
			else {
			
					channel.sendMessage("http://www.youtube.com/watch?v=" + result.items[0].id.videoId);
				}
		});

};

client.on('message', message => {
    if (message.content === 'ping') {
    	message.reply('pong');
	}
	else if(message.content.slice(0,5) === "-join"){
		var voiceChannel = message.content.slice(6);
		voiceChannel.join()
 			.then(connection => console.log('Connected!'))
			.catch(console.log);
    }
    else if(message.content.slice(0,4) === '-fck'){
  		message.channel.sendMessage('fuck off ' + message.content.slice(5));
    }
    else if(message.content.slice(0,6) ==  '-meirl'){
  		request('https://www.reddit.com/r/meirl/.json', function (error, response, body) {
  			if (!error && response.statusCode == 200) {
    			var response = JSON.parse(body);
    			console.log(response);
    			var count = 0;
    			var limit = 2;
    			limit = parseInt(message.content.slice(7));
    			response.data.children.forEach(function(child) {
					if(child.data.domain !== 'self.node' && count < limit) {
						count += 1
	  					console.log('URL : ' + child.data.url);
	  					message.channel.sendMessage(child.data.url);
					}
      		});
  		}
	})
  	}
    else if(message.content.slice(0,5) === "-play"){
		var yt = new youtube();
  		yt.respond(message.content.slice(6), message.channel);
    }
    else if(message.content.slice(0,3) === "-wf"){
  		var wf = new wolfram();
  		wf.respond(message.content.slice(4), message.channel);
    }
});

client.login('');