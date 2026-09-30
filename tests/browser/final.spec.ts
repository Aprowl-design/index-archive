import {test,expect,type Page} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const data=JSON.parse(readFileSync('src/data/exhibitions.json','utf8'));
const items=JSON.parse(readFileSync('src/data/inspirations.json','utf8'));
const issues=new WeakMap<Page,string[]>();
test.beforeEach(async({page})=>{issues.set(page,[]);page.on('pageerror',e=>issues.get(page)!.push(e.message));page.on('console',m=>{if(m.type()==='warning')issues.get(page)!.push(m.text());});});
test.afterEach(async({page})=>{expect(issues.get(page)).toEqual([]);});
async function ready(page:Page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}));});}
test('FLOW 01: Homepage → Archive → SPACE → project → same filter',async({page})=>{
 await page.goto('/');await page.locator('.nav nav').getByRole('link',{name:'灵感档案 Archive'}).click();await page.getByRole('button',{name:'空间 SPACE',exact:true}).click();
 const count=data.filter((p:any)=>p.tags.includes('SPACE')||items.some((i:any)=>i.exhibitionId===p.id&&i.tags.includes('SPACE'))).length;
 await expect(page.locator('.archive-grid article')).toHaveCount(count);await expect(page.locator('.result-count')).toContainText(String(count).padStart(3,'0'));
 await page.locator('.archive-grid article a').first().click();await expect(page.locator('.detail')).toBeVisible();await page.getByRole('link',{name:'← 返回灵感档案'}).click();await expect(page).toHaveURL(/discipline=SPACE/);await expect(page.locator('.archive-grid article')).toHaveCount(count);
});
test('FLOW 02: grouped multilingual Search → inspiration anchor',async({page})=>{
 await page.goto('/');await page.locator('.nav>button').click();const input=page.getByRole('searchbox');await input.fill('灯光');await expect(page.locator('.inspiration-results article')).toHaveCount(13);expect(await page.locator('.search-results>a').count()).toBeGreaterThanOrEqual(4);
 for(const q of ['light','lighting']){await input.fill(q);await expect(page.locator('.inspiration-results article')).toHaveCount(13);}
 for(const q of ['材质','material','金属','metal','metallic','字体','type','typography','空间','space','装置','installation','information','信息','MoMA','伦敦']){await input.fill(q);expect(await page.locator('.inspiration-results article').count()).toBeGreaterThan(0);}
 await input.fill('灯光');await ready(page);await page.screenshot({path:'qa/search-light-desktop.png'});await page.getByRole('button',{name:/灵感素材 \/ 13/}).click();expect(await page.locator('#search-inspirations').evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThan(await page.locator('.dialog-head').evaluate(el=>el.getBoundingClientRect().bottom));await page.locator('.inspiration-results a').first().click();await expect(page).toHaveURL(/project\/.*#/);await expect(page.locator('dialog')).toHaveCount(0);await expect(page.locator('figure[data-current=true]')).toBeInViewport();
});
test('FLOW 03: save existing + create new → open board → remove → refresh',async({page})=>{
 await page.goto('/project/making-egypt');await page.locator('.detail>figure .save').click();await page.getByRole('button',{name:'METALLIC STUDIES'}).click();await expect(page.getByRole('button',{name:'METALLIC STUDIES'})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'＋ 新建灵感板',exact:true}).click();await page.getByLabel('灵感板名称').fill('课程研究 — 材料');await page.getByRole('button',{name:'创建灵感板'}).click();await expect(page.getByRole('button',{name:'课程研究 — 材料'})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'完成'}).click();
 await page.locator('.nav nav').getByRole('link',{name:'灵感板 Boards'}).click();await page.getByRole('link',{name:/课程研究 — 材料/}).click();await expect(page.locator('.saved-grid article')).toHaveCount(1);await page.reload();await expect(page.locator('.saved-grid article')).toHaveCount(1);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'导出 JSON'}).click();const download=await downloadPromise;const path=await download.path();expect(JSON.parse(readFileSync(path!,'utf8')).inspirations).toHaveLength(1);
 await page.getByRole('button',{name:'移除 ×'}).click();await page.reload();await expect(page.locator('.saved-grid article')).toHaveCount(0);await expect(page.getByText('留下一条视觉线索。')).toBeVisible();
});
test('FLOW 04: rename → persistence → delete → storage',async({page})=>{
 await page.goto('/board/metallic-studies');await page.getByRole('button',{name:'重命名',exact:true}).click();await page.getByLabel('灵感板名称').fill('金属 / FINAL');await page.getByRole('button',{name:'保存名称'}).click();await page.reload();await expect(page.locator('h1')).toHaveText('金属 / FINAL');await page.getByRole('button',{name:'删除灵感板',exact:true}).click();await page.getByRole('button',{name:'确认删除'}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('index.boards.v2')!).some((b:any)=>b.id==='metallic-studies'))).toBe(false);await page.goto('/boards');await expect(page.locator('.boards-grid>a')).toHaveCount(2);
});
test('FLOW 05: responsive 1440 / 1280 / 1024 / 768 / 390, navigation and controls',async({page})=>{
 for(const width of [1440,1280,1024,768,390]){await page.setViewportSize({width,height:1000});for(const route of ['/','/archive','/project/making-egypt','/boards','/board/typography','/about']){await page.goto(route);await ready(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+route).toBe(true);}
 await page.goto('/archive');await page.getByRole('button',{name:'灯光 LIGHT',exact:true}).click();expect(await page.locator('.archive-grid article').count()).toBeGreaterThan(0);await page.locator('.nav>button').click();await page.getByRole('searchbox').fill('灯光');await expect(page.locator('.inspiration-results article')).toHaveCount(13);expect(await page.locator('.dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);await page.getByRole('button',{name:'关闭',exact:true}).click();
 await page.goto('/');await ready(page);await page.screenshot({path:`qa/home-${width}.png`,fullPage:true});}
});
test('FLOW 06: empty, unknown route, broken image, corrupt and denied storage',async({page})=>{
 await page.goto('/archive?discipline=UNKNOWN');await expect(page.getByText('这个分类暂无展览')).toBeVisible();await page.getByRole('link',{name:'查看全部展览'}).click();await expect(page.locator('.archive-grid article')).toHaveCount(12);
 await page.locator('.nav>button').click();await page.getByRole('searchbox').fill('zzzzzzzz');await expect(page.getByRole('heading',{name:'未找到相关内容'})).toBeVisible();await page.getByRole('button',{name:'清除搜索'}).click();await expect(page.locator('.inspiration-results article')).toHaveCount(66);await page.keyboard.press('Escape');
 for(const route of ['/project/missing','/board/missing','/not-found']){await page.goto(route);await expect(page.getByText('这条线索还未归档。')).toBeVisible();}
 await page.route('**/images/more-than-human-01.jpg',route=>route.abort());await page.goto('/');await expect(page.locator('.hero .image-empty')).toBeVisible();await expect(page.locator('.hero img')).toHaveCount(0);await page.unrouteAll();
 await page.evaluate(()=>localStorage.setItem('index.boards.v2','{broken'));await page.goto('/boards');await expect(page.getByRole('alert')).toContainText('无法读取');await page.getByRole('button',{name:'＋ 新建灵感板',exact:true}).click();await page.getByLabel('灵感板名称').fill('恢复后的研究');await page.getByRole('button',{name:'创建灵感板'}).click();expect(await page.evaluate(()=>Object.keys(localStorage).some(key=>key.includes('.recovery.')&&localStorage.getItem(key)==='{broken'))).toBe(true);
 await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota exceeded','QuotaExceededError')}});await page.getByRole('button',{name:'＋ 新建灵感板',exact:true}).click();await page.getByLabel('灵感板名称').fill('暂存研究');await page.getByRole('button',{name:'创建灵感板'}).click();await expect(page.getByRole('alert')).toContainText('无法保存');
});
test('FLOW 07: navigation, keyboard modal focus, discipline focus and reduced motion',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'分类 Categories'}).click();await expect(page.locator('#disciplines')).toBeInViewport();await page.locator('.discipline').first().focus();await expect(page.locator('.discipline-preview')).toBeVisible();await page.locator('.discipline').first().press('Enter');await expect(page).toHaveURL(/discipline=SPACE/);
 await page.locator('.nav>button').focus();await page.keyboard.press('Enter');await expect(page.getByRole('searchbox')).toBeFocused();for(let i=0;i<12;i++)await page.keyboard.press('Tab');expect(await page.evaluate(()=>Boolean(document.activeElement?.closest('dialog')))).toBe(true);await page.keyboard.press('Escape');await expect(page.locator('.nav>button')).toBeFocused();
 await page.getByRole('link',{name:'关于 About'}).click();await expect(page.getByText('INDEX 索引 — 展览灵感档案平台 / v1.0')).toBeVisible();await page.getByRole('link',{name:'INDEX',exact:true}).click();await expect(page).toHaveURL('/');expect(await page.locator('.page-transition').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
test('Every detail, item anchor, image and source field resolves',async({page})=>{
 const failed:string[]=[];page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:5174'))failed.push(r.url());});
 for(const p of data){await page.goto('/project/'+p.slug);await ready(page);await expect(page.locator('h1')).toHaveText(p.titleZh);await expect(page.locator('.detail figure')).toHaveCount(items.filter((i:any)=>i.exhibitionId===p.id).length);expect(await page.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0))).toBe(true);for(const item of items.filter((i:any)=>i.exhibitionId===p.id))await expect(page.locator(`[id="${item.id}"]`)).toHaveCount(1);}
 expect(failed).toEqual([]);await page.goto('/project/making-egypt');await ready(page);await page.screenshot({path:'qa/detail-desktop.png',fullPage:true});
});
test('V2 saved references and cross-tab local persistence remain usable',async({page,context})=>{
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('index.boards.v2',JSON.stringify([{id:'legacy',name:'V2 保留',items:['es-devlin-ref-unavailable','making-egypt-01','es-devlin-extra-4']}])));await page.goto('/board/legacy');await expect(page.locator('.saved-grid article')).toHaveCount(3);await expect(page.getByText('这条素材暂时不可用')).toBeVisible();const other=await context.newPage();await other.goto('/boards');await page.getByRole('button',{name:'重命名',exact:true}).click();await page.getByLabel('灵感板名称').fill('跨标签研究');await page.getByRole('button',{name:'保存名称'}).click();await expect(other.getByRole('link',{name:/跨标签研究/})).toBeVisible();await other.close();
});
