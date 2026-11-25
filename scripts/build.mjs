import {readFileSync,writeFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const js=['story','engine','simulation','app'].map(name=>read('src/'+name+'.js').replace(/^import .*?;\r?\n/gm,'').replace(/^export /gm,'')).join('\n');
const html=read('index.html').replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+read('style.css')+'</style>').replace('<script type="module" src="src/app.js"></script>','').replace('</body>',()=>'<script type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script></body>');
writeFileSync(new URL('../jogar.html',import.meta.url),html);
