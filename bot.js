"use strict";
const Discord = require('discord.js');
var request = require('request');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

function me_irl(){
  var url = "";
  request('https://www.reddit.com/r/meirl/.rss', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    url = console.log(body)
  }
  })
  var re = new RegExp("([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))");
  return re[Symbol.match](url);
}

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
	}
  else if(message.content.slice(0,4) === '-fck'){
  	message.channel.sendMessage('fuck off ' + message.content.slice(5));
  }
  else if(message.content === '-meirl'){
  	message.channel.sendMessage(me_irl())
  }
});

client.login('-redacted-');