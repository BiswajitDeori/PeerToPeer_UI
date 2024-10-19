const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/socket.io', // Proxy all requests to /socket.io
    createProxyMiddleware({
      target: 'http://localhost:5000', // Your server's base URL
      changeOrigin: true,
    })
  );
};
