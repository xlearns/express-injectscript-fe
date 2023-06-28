const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware')

const app = express();
const port =3000;
const config = {
  url:'http://localhost:17173',
  node:`http://localhost:${port}`
}
const template = `
sessionStorage.setItem('token','')
setTimeout(()=>{
  if(window.location.pathname.includes('login')){
    window.location.href = '${config.node}'
  }
},200)`
const proxyMiddleware = createProxyMiddleware({
  target: config.url, 
  changeOrigin: true, 
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8'); 
    
    return response.replace(
      "</head>",
      `<script>${template}</script><!-- EXPRESS_INJECTSCRIPT_FE_SCRIPT --></head>`
    )
  })
});

app.use('/', proxyMiddleware);

app.listen(port, () => {
  console.log(`Server running at ${config.node}`);
});