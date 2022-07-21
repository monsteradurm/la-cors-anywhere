

var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;


const cors_proxy = require('cors-anywhere').createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: [],
    redirectSameOrigin: true,
    handleInitialRequest: (req, res, url) => {
        req.url = '/https:/' + req.url;
        console.log("HERE", req.url)
        return true;
    },
    httpProxyOptions: {
      // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
      //xfwd: false,
    },
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});