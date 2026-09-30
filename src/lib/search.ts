const groups = [
  ['light', 'lighting', '灯光', '照明'], ['material', 'materials', '材质', '材料'],
  ['metal', 'metallic', '金属', 'steel', '钢'], ['type', 'typography', '字体'],
  ['space', '空间'], ['installation', '装置'], ['information', '信息'],
  ['graphic', 'graphics', '平面', '图形'], ['london', '伦敦'], ['new york', '纽约'],
];
export function matchesQuery(text: string, query: string): boolean {
  const source = text.normalize('NFKC').toLowerCase();
  const normalized = query.normalize('NFKC').toLowerCase().trim();
  if (!normalized) return true;
  const exact = groups.find(group => group.includes(normalized));
  const terms = exact ? [normalized] : normalized.split(/\s+/);
  return terms.every(term => (groups.find(group => group.includes(term)) || [term]).some(alias =>
    /^[a-z]+$/.test(alias) ? new RegExp(`(^|[^a-z])${alias}([^a-z]|$)`).test(source) : source.includes(alias),
  ));
}
