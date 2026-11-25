import {readFileSync,writeFileSync} from 'node:fs';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const core=read('core.mjs').replace(/^export /gm,'');
const html=read('template.html').replace('/* CORE */',()=>core);
writeFileSync(new URL('../autonomo.html',import.meta.url),html);
