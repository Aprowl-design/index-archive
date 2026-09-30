export type Board = {id: string; name: string; items: string[]};
export const STORAGE_KEY = 'index.boards.v2';
export const defaultBoards = (): Board[] => [
  {id:'metallic-studies',name:'METALLIC STUDIES',items:[]},
  {id:'exhibition-space',name:'EXHIBITION SPACE',items:[]},
  {id:'typography',name:'TYPOGRAPHY',items:[]},
];
export function parseBoards(value: string | null): Board[] {
  if (value === null) return defaultBoards();
  const data: unknown = JSON.parse(value);
  if (!Array.isArray(data)) throw new Error('Invalid board data');
  const ids = new Set<string>();
  return data.map((b: unknown) => {
    if (!b || typeof b !== 'object') throw new Error('Invalid board');
    const item = b as Record<string, unknown>;
    if (typeof item.id !== 'string' || !item.id || ids.has(item.id) || typeof item.name !== 'string' || !item.name.trim() || !Array.isArray(item.items) || !item.items.every(i => typeof i === 'string')) throw new Error('Invalid board');
    ids.add(item.id);
    return {id:item.id, name:item.name, items:[...new Set(item.items as string[])]};
  });
}
