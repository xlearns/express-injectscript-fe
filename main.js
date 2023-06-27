const express = require('express');
const fs = require('fs');
const fg = require('fast-glob');

const app = express();
const staticUrl = './project'
const PORT = process.env.PORT || 3000;

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
         app.use(`/${dir}`, express.static(`${staticUrl}/${dir}`));
    })

    app.get('/change',(req, res) => {
        const {url,token} = req.query
        res.redirect(url);
    })
    
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}.`);
    });
}

start()