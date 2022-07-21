
const express = require('express');
const corsAnywhere = require('cors-anywhere');
const cors = require('cors');

var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;
var app = express();

app.options('*', cors())
app.use(cors());
app.disable('x-powered-by');
app.disable('x-xss-protection');
app.disable('x-content-type-options');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.headers);
    const csp = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
    res.set("Content-Security-Policy", csp);
    next();
  });

const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: [],
    redirectSameOrigin: true,
    httpProxyOptions: {
      // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
      //xfwd: false,
    },
});

const onRequest = (req, res) => {
    req.url = '/https:/' + req.url.replace('/la-cors-anywhere/', '/');
    if (req.url.indexOf('synsketch.com')) {
        req.headers['Authorization'] = 'apikey acranchliquidanimationcom:b1bb92aa73acc60d25721172ba0f64db2654e5ca';
    }
    
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