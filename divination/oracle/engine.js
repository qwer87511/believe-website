import {cards,version} from './data.js';
import {randomInt} from '../shared.js';
export function validateInput(input={}){if(input.count!==undefined&&input.count!==1)throw Error('原創卡每次一張');return {count:1};}
export function draw(input={},source=globalThis.crypto){validateInput(input);return Object.freeze({version,cardId:cards[randomInt(cards.length,source)].id});}
