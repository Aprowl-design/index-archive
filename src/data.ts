import exhibitions from './data/exhibitions.json';
import inspirationData from './data/inspirations.json';
export type Img = {id:string;src:string;credit:string;altZh:string;sourcePage:string;thumbnail?:string;titleZh?:string;descriptionZh?:string;tags?:string[]};
export type Exhibition = Omit<typeof exhibitions[number], 'images'> & {images:Img[]};
export const projects = exhibitions as Exhibition[];
export const inspirations = inspirationData.map(item => ({...item, src:item.image, altZh:item.imageAlt, credit:item.imageCredit, sourcePage:item.source, project:projects.find(p=>p.id===item.exhibitionId)!}));
export type Inspiration = typeof inspirations[number];
const ids = new Set(inspirations.map(i=>i.id));
// Existing V2 references remain resolvable in boards; they are not counted as new Inspiration Items.
const legacy = projects.flatMap(project=>project.images.filter(i=>!ids.has(i.id)).map(i=>({...i,project,titleZh:'展览资料图',descriptionZh:'V2 中保存的视觉参考。',tags:project.tags})));
export const references = [...inspirations, ...legacy];
export const projectItems = (id:string) => inspirations.filter(i=>i.exhibitionId===id);
export const hasDiscipline = (project:Exhibition, category:string) => category==='ALL' || project.tags.includes(category) || projectItems(project.id).some(i=>i.tags.includes(category));
