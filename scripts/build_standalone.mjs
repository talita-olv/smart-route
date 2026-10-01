/** Gera HTML único para demonstração offline do código próprio. */
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(base,p),'utf8');
let html=read('index.html');
const css=read('assets/style.css');
const core=read('assets/core.mjs').replace(/^export /gm,'');
const demo=read('assets/demo.mjs').replace(/^export /gm,'');
const geo=read('assets/geo.mjs').replace(/^export /gm,'');
const app=read('assets/app.mjs').replace(/^import .*?;\s*$/gm,'');
const bundled=[core,demo,geo,app].join('\n\n');
if(bundled.includes('</script>')||css.includes('</style>'))throw Error('Elemento HTML inesperado no código.');

const stylesheet=/<link rel="stylesheet" href="assets\/style\.css(?:\?[^"]*)?">/;
const scriptTag=/<script type="module" src="assets\/app\.mjs(?:\?[^"]*)?"><\/script>/;
if(!stylesheet.test(html)||!scriptTag.test(html))throw Error('Referências esperadas não encontradas em index.html.');
html=html.replace(stylesheet,()=>'<style>\n'+css+'\n</style>');
html=html.replace(scriptTag,()=>'<script type="module">\n'+bundled+'\n</script>');

for(const [file,mime] of [
 ['Modelo_SmartRoute.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
 ['Modelo_SmartRoute.csv','text/csv']
]){
 const b64=readFileSync(join(base,'exemplos',file)).toString('base64');
 html=html.replaceAll('href="exemplos/'+file+'" download','href="data:'+mime+';base64,'+b64+'" download="'+file+'"');
}
const output=join(base,'SmartRoute_Demonstracao.html');
writeFileSync(output,html);
console.log('Gerado '+output+' ('+Buffer.byteLength(html)+' bytes)');
