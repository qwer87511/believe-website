import {cards,version} from './data.js';
import {randomInt} from '../shared.js';
export function validateInput(input={}){if(![1,3].includes(Number(input.count)))throw Error('請選單張或三張牌。');return {count:Number(input.count),reversals:input.reversals===true};}
export function prepareDeck(input,source=globalThis.crypto){const options=validateInput(input),pool=[...cards];for(let i=pool.length-1;i>0;i--){const j=randomInt(i+1,source);[pool[i],pool[j]]=[pool[j],pool[i]];}return Object.freeze({version,...options,deck:Object.freeze(pool.map(c=>Object.freeze({id:c.id,reversed:options.reversals&&randomInt(2,source)===1})))});}
export function drawPrepared(prepared,cut=0){if(![0,26,52].includes(cut)||prepared.version!==version||prepared.deck.length!==78||new Set(prepared.deck.map(c=>c.id)).size!==78)throw Error('Invalid prepared deck or cut');return Object.freeze({version,count:prepared.count,reversals:prepared.reversals,cut,cards:Object.freeze(Array.from({length:prepared.count},(_,i)=>prepared.deck[(cut+i)%78]))});}
export function draw(input,source=globalThis.crypto){return drawPrepared(prepareDeck(input,source),input?.cut??0);}
