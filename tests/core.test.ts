import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {matchesQuery} from '../src/lib/search.ts';
import {parseBoards} from '../src/lib/boards.ts';
const exhibitions=JSON.parse(readFileSync(new URL('../src/data/exhibitions.json',import.meta.url),'utf8'));
const items=JSON.parse(readFileSync(new URL('../src/data/inspirations.json',import.meta.url),'utf8'));
test('12 exhibitions, at least 60 distinct inspiration images, 4–6 per exhibition',()=>{
 assert.equal(exhibitions.length,12);assert.ok(items.length>=60);const hashes=new Set<string>();
 for(const p of exhibitions){const count=items.filter((i:any)=>i.exhibitionId===p.id).length;assert.ok(count>=4&&count<=6,p.slug);assert.ok(p.officialSource.startsWith('https://'));}
 for(const i of items){for(const key of ['id','titleZh','titleEn','imageAlt','descriptionZh','source','imageCredit'])assert.ok(i[key],i.id+':'+key);assert.ok(i.tags.some((t:string)=>['SPACE','GRAPHIC','TYPOGRAPHY','MATERIAL','LIGHT','INSTALLATION'].includes(t)));const file=new URL('../public'+i.image,import.meta.url);assert.ok(existsSync(file));assert.ok(existsSync(new URL('../public'+i.thumbnail,import.meta.url)));const hash=createHash('sha256').update(readFileSync(file)).digest('hex');assert.ok(!hashes.has(hash),'duplicate image '+i.id);hashes.add(hash);}
});
test('Chinese and English aliases return identical item sets',()=>{
 for(const words of [['灯光','light','lighting'],['材质','material'],['金属','metal','metallic'],['字体','type','typography'],['空间','space'],['装置','installation'],['信息','information']]){
 const result=(q:string)=>items.filter((i:any)=>matchesQuery([i.titleZh,i.titleEn,i.descriptionZh,...i.tags].join(' '),q)).map((i:any)=>i.id);
 assert.ok(result(words[0]).length>0,words[0]);for(const word of words)assert.deepEqual(result(word),result(words[0]));
 }
 assert.equal(matchesQuery('Prototype material','type'),false);assert.equal(matchesQuery('SPACE London','space london'),true);assert.equal(matchesQuery('SPACE London','space tokyo'),false);
});
test('Boards keep empty arrays, deduplicate item IDs, reject corrupt data and duplicate board IDs',()=>{
 assert.equal(parseBoards(null).length,3);assert.deepEqual(parseBoards('[]'),[]);assert.throws(()=>parseBoards('{'));assert.throws(()=>parseBoards('{}'));assert.throws(()=>parseBoards('[null]'));
 const board={id:'a',name:'材料研究',items:['one','one','two']};assert.deepEqual(parseBoards(JSON.stringify([board]))[0].items,['one','two']);assert.throws(()=>parseBoards(JSON.stringify([board,board])));assert.equal(parseBoards(JSON.stringify([{...board,name:'<script>alert(1)</script>'}]))[0].name,'<script>alert(1)</script>');
});
