var express = require('express');
var http = require('http');
var exec = require('child_process').exec;
var Firebase = require('firebase');
var root = new Firebase("https://michaelx-metadata.firebaseio.com")

var app = express();

// all environments


app.set('port', 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);


app.use(express.cookieParser());
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({ secret: 'SECRET' }));

//app.use(routes.initialRouter);
app.use(app.router);

console.log(__dirname);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function analyzePosition(req, res) {
  if (req.query.fen) {
    var command = 'python evaluate_move.py ' + req.query.fen;
    exec(command, function(error, stdout, stderr) {
      if (error || stderr) {
        console.log(stderr);
        res.send('ERROR: ' + stderr);
      } else {
        res.send(stdout);
      }
    });
  } else{
    res.send('Missing FEN. Send with ?fen="..." quotes are important.');
  }
}

function inferMove(req, res) {
  if (req.query.fen && req.query.heatmap) {
    console.log(req.query.heatmap);
    console.log(req.query.fen);
    var command = 'python infer_move.py ' + req.query.heatmap + ' ' + req.query.fen;
    exec(command, function(error, stdout, stderr) {
      if (error || stderr) {
        console.log(stderr);
        res.send('ERROR: ' + stderr);
      } else {
        res.send(stdout);
      }
    });
  } else{
    res.send('Missing FEN or heatmap string!');
  }
}

function makeMove(req, res) {
  if (req.query.fen && req.query.move) {
    var command = 'python make_move.py ' + req.query.fen + " " + req.query.move;
    exec(command, function(error, stdout, stderr) {
      if (error || stderr) {
        console.log(stderr);
        res.send('ERROR: ' + stderr);
      } else {
        res.send(stdout);
      }
    });
  } else{
    res.send('Missing FEN or move. Send with ?fen="..."&move="..." quotes are important.');
  }
}

function welcomeDisplay(req, res) {
  res.send("Welcome to bot.haus, we're currently running a chess analyzer. Try hitting /analyze and /move for more instructions!");
}

function forwardImageReq(imageEndpoint, req, res) {
  root.child('servers').child('9470m').once('value', function(data) {
    var ipObj = data.val();
    var options = {
      host: ipObj.ip,
      path: imageEndpoint
    };
    try {
      http.request(options, function(response) {
        var bodyChunks = [];
        response.on('data', function(chunk) {
          bodyChunks.push(chunk);
        });

        response.on('end', function() {
          var body = Buffer.concat(bodyChunks);
          res.writeHead(200, {'Content-Type': 'jpeg'} );
          res.write(body);
          res.end();
        });
      }).end();
    } catch(e) {
      res.send(e);
    }
  });

}

function getImage(req, res) {
  forwardImageReq("/getimage", req, res);
}

function getEdgeImage(req, res) {
  forwardImageReq("/getedgeimage", req, res);
}

function getBorderImage(req, res) {
  forwardImageReq("/getborderimage", req, res);
}



//app.get('/getborderimage', getBorderImage);
//app.get('/getedgeimage', getEdgeImage);
//app.get('/getimage', getImage);
app.get('/analyze', analyzePosition);
app.get('/infer', inferMove);
app.get('/move', makeMove);
app.get('/', welcomeDisplay);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
