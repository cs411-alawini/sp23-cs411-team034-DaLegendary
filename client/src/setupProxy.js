const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000', // 这里是你Python Flask应用程序的地址和端口
      changeOrigin: true,
    })
  );
};