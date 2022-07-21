
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

const onRequest = (req, res) => {
    req.url = '/https:/' + req.url.replace('/la-cors-anywhere/', '/');

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