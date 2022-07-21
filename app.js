
const express = require('express');
const corsAnywhere = require('cors-anywhere');
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;
var app = express();

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

app.all('/', (req, res) => {
    req.url = req.url.replace('/cors/', '/');
    req.url = '/https:/' + req.url;
    proxy.emit('request', req, res);
});

app.listen(port, () => {
    console.log("la-cors-anywhere --> listening at: " + port)
});