// Only the reversal preference reaches device storage. Readings stay in page memory.
export const PREFERENCE_KEY='believe.normal.tarot.preferences.v1';
let kept=null,choice;
export function reversalPreference(){
  if(typeof choice==='boolean')return choice;
  try{const saved=JSON.parse(globalThis.localStorage.getItem(PREFERENCE_KEY)||'null');choice=typeof saved?.reversals==='boolean'?saved.reversals:true;}
  catch{choice=true;}
  return choice;
}
export function setReversalPreference(value){
  choice=Boolean(value);
  try{globalThis.localStorage.setItem(PREFERENCE_KEY,JSON.stringify({reversals:choice}));return true;}
  catch{return false;}
}
export function rememberReading(state){
  if(!state.result)return;
  kept={phase:state.phase==='reading'?'reading':'cards',count:state.result.count,reversals:state.result.reversals,
    range:state.range,result:state.result,revealed:new Set(state.revealed)};
}
export function recallReading(){return kept?{...kept,revealed:new Set(kept.revealed)}:null;}
export function clearReading(){kept=null;}
