export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const button=(label,action,variant='')=>`<button type="button" class="button ${variant}" data-module-action="${action}">${label}</button>`;
export function randomInt(max,source=globalThis.crypto) {
  if(!Number.isInteger(max)||max<1||max>0x100000000)throw Error('Invalid random bound');
  const limit=Math.floor(0x100000000/max)*max,value=new Uint32Array(1);
  for(let i=0;i<1024;i++){source.getRandomValues(value);if(value[0]<limit)return value[0]%max;}
  throw Error('Random source unavailable');
}
export function progress(current,labels){return `<ol class="div-progress" aria-label="占卜進度">${labels.map((label,i)=>`<li ${i===current?'aria-current="step"':''}><span aria-hidden="true">${i+1}</span>${label}</li>`).join('')}</ol>`;}
export function resultNote(version){return `<details class="reading-rules"><summary>抽取規則與資料說明</summary><p>瀏覽器隨機抽取，不是 AI 或確定預測。${escapeHTML(version)}</p><p>問題與塔羅牌面只留當頁記憶；離開、重整或結束即清除，不送出、不持續儲存。原創問道卡仍沿用既有分頁紀錄。</p></details>`;}
