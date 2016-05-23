var express = require('express');
var request = require('request');
var log4js = require('log4js');
var bodyParser = require('body-parser');
var app = express();
var conf = require('./conf')
app.use(bodyParser.json({
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));

log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'file',
      filename: 'logs/access.log',
      maxLogSize: 1024,
      backups:3,
      category: 'normal'
    }
  ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.post('/forward', function(req, res) {
    //@name age is @age
    /*
      {"name":"leo","age":"26"}
    */
    var message= req.body.name+"'s age is "+req.body.age ;

    logger.info('message: '+message);
    logger.info("rawBody: "+req.rawBody);
    var options = {
  		uri: conf.destination,
  		method: 'POST',
  		headers: {
  		  'Content-Type':'application/json'
  		},
  		json: {
        "text": message
      }
    };

	request(options, function (error, response, body) {

	  if (!error && response.statusCode == 200) {

	  }else{
      if(error){
        logger.error("Error: "+error);
      }else{
        logger.error("Error response code: "+response.statusCode);
        logger.error("body: "+body);
      }
    }
	});

    res.send("ok");
});
app.post('/echo', function(req, res) {
    logger.info('echo message: '+req.body.text);
    res.send("OK");
});
app.listen(8888);
