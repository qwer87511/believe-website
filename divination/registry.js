const defaults=[
  {id:'tarot',title:'塔羅',scope:'78 張 · 牌庫與閱讀',description:'用圖像，換一個角度看此刻。',route:'divination',load:()=>import('./tarot/module.js')},
  {id:'oracle',title:'原創問道卡',scope:'believe 原創六張',description:'把一個小提醒，帶回日常。',route:'divination/oracle',load:()=>import('./oracle/module.js')},
  {id:'astrology',title:'星座與關係',scope:'太陽・月亮・上升／雙人比較',description:'先看計算，再把差異說清楚。',route:'divination/astrology',load:()=>import('../astrology/module.js')}
];
export function createRegistry(entries=defaults){
  const map=new Map();for(const entry of entries){if(!/^[a-z][a-z0-9-]*$/.test(entry.id)||map.has(entry.id)||typeof entry.load!=='function')throw Error('Invalid or duplicate module');map.set(entry.id,Object.freeze({...entry}));}
  return Object.freeze({list:()=>[...map.values()],async load(id,{signal}={}){
    const entry=map.get(id);if(!entry)throw Error('Unknown module');signal?.throwIfAborted();const module=await entry.load();signal?.throwIfAborted();
    if(module.definition?.id!==id||!module.definition.version||typeof module.mount!=='function'||typeof module.validateInput!=='function'||typeof module.draw!=='function')throw Error('Invalid module contract');return module;
  }});
}
export const registry=createRegistry();
