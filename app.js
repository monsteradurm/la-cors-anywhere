
const express = require('express');
const corsAnywhere = require('cors-anywhere');
const cors = require('cors');
const fs = require('fs');

var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;
var app = express();

var util = require('util');

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

app.options('*', cors())
app.use(cors());
app.disable('x-powered-by');
app.disable('x-xss-protection');
app.disable('x-content-type-options');
/*
app.use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', '*');
    const csp = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
    res.set("Content-Security-Policy", csp);
    next();
  });
*/
const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: [
        'cookie',
        'cookie2',
        'x-request-start'
      ],
      redirectSameOrigin: true,
      httpProxyOptions: {
        xfwd: true
      }
});

const onRequest = (req, res) => {
    req.url = '/https:/' + req.url.replace('/la-cors-anywhere/', '/');
    if (req.url.indexOf('synsketch.com')) {
        req.headers['Authorization'] = 'apikey acranchliquidanimationcom:b1bb92aa73acc60d25721172ba0f64db2654e5ca';
    }
    console.log(req.url)
    proxy.emit('request', req, res);
}
app.get('/la-cors-anywhere/*', onRequest);
app.post('/la-cors-anywhere/*', onRequest);
app.put('/la-cors-anywhere/*', onRequest);
app.patch('/la-cors-anywhere/*', onRequest);
app.delete('/la-cors-anywhere/*', onRequest);

app.listen(port, () => {
    console.log("la-cors-anywhere --> listening at: " + port)
});