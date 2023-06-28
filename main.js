const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware')
const {addBackslashIfNeeded,checkAndReturnFunction}  = require('./utils');
const {target,port} = require('./config')

const app = express();


const proxyMiddleware = (_url,render)=>{
  return createProxyMiddleware({
    target: _url, 
    changeOrigin: true, 
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      const {url,token} = req.query 
      const response = responseBuffer.toString('utf8'); 
      
      return response.replace(
        "</head>",
        `<script>${render({port,url,token,...req.query})}</script><!-- EXPRESS_INJECTSCRIPT_FE_SCRIPT --></head>`
      )
    })
  })
};


target.forEach(({name,url,render})=>{
   app.use(addBackslashIfNeeded(name), proxyMiddleware(url,checkAndReturnFunction(render,()=>{
    return `console.log(default inject)`
   })));
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});