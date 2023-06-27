const express = require('express');
const fs = require('fs');
const fg = require('fast-glob');

const app = express();
const staticUrl = './project'
const PORT = process.env.PORT || 3000;
const cachedFiles = {};

function ensureTrailingSlash(str) {
    if (!str.endsWith('/')) {
      str += '/';
    }
    return str;
}

async function start(){
    const tranUrl = ensureTrailingSlash(staticUrl);
    const directories = await fg([`${tranUrl}*`], { onlyDirectories: true }); 
    directories.map((url)=>url.replace(new RegExp(tranUrl),'')).forEach(dir=>{
         app.use(`/${dir}`, express.static(`${tranUrl}${dir}`));
    })


    app.get('/change',(req, res) => {
      const { url, token } = req.query;
      const file = `${tranUrl}${url}/index.html`;

      let fileContent = cachedFiles[url];
        
      if (!fileContent) {
        try {
          fileContent = fs.readFileSync(file, 'utf8');
        } catch (err) {
          console.error(`Failed to read file ${file}: ${err}`);
          return res.status(500).send('Failed to read file');
        }
    
        cachedFiles[url] = fileContent;
      }
    
      const template = `alert(${token})`;
    
      let newHtml;
      if (fileContent.includes('<!-- EXPRESS_INJECTSCRIPT_FE_SCRIPT -->')) {
        newHtml = fileContent.replace(
          '<!-- EXPRESS_INJECTSCRIPT_FE_SCRIPT -->',
          `<script>${template}</script><!-- EXPRESS_INJECTSCRIPT_FE_SCRIPT -->`
        );
      } else {
        newHtml = fileContent.replace(
          '</head>',
          `<script>${template}</script><!-- EXPRESS_INJECTSCRIPT_FE_SCRIPT --></head>`
        );
      }
      try {
        fs.writeFileSync(file, newHtml);
      } catch (err) {
        console.error(`Failed to write file ${file}: ${err}`);
        return res.status(500).send('Failed to write file');
      }
    
      res.redirect(url);
    });
    
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}.`);
    });
}

start()