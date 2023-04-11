const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3000';
      },
    })
  );
};
