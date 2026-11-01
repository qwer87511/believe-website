import {cards,version} from './data.js';
export const KEY='believe.demo.oracle.v1';
export const oracleSession={result:null,error:''};
try{const raw=sessionStorage.getItem(KEY);if(raw){const saved=JSON.parse(raw);if(saved.version!==version||!cards.some(c=>c.id===saved.cardId))throw Error('Invalid record');oracleSession.result=saved;}}catch{oracleSession.error='上次的示範紀錄無法讀取。請到「本分頁紀錄」清除後再試。';}
export function saveResult(result){sessionStorage.setItem(KEY,JSON.stringify(result));oracleSession.result=result;oracleSession.error='';}
export function clearRecord(){sessionStorage.removeItem(KEY);oracleSession.result=null;oracleSession.error='';}
