// Names/order/symbol references: Waite, Pictorial Key, Part II §2. See TAROT_SOURCES.md.
// All Chinese reflection text and SVG compositions are original believe writing/art.
import {minorCards} from './minor-data.js';
import {historical,historicalVerification} from './history.js';
export const version='believe-tarot-rws-78-v1';
const rows=[
['fool','0','愚者','The Fool','啟程','給新經驗留一點空間，也看清腳下。','出發前，先確認自己有沒有足夠餘裕。','有哪些未知，可以先用小實驗了解？','用十分鐘試一件新事，不急著承諾。','cliff'],
['magician','I','魔術師','The Magician','運用','留意手邊已經有的工具，讓想法落地。','工具很多時，也可以先選一樣專心練習。','目前可用的一項能力是什麼？','用現有資源完成一個最小版本。','tools'],
['priestess','II','女祭司','The High Priestess','傾聽','在安靜裡辨認自己的感受。','先分開直覺與猜測，允許自己還不知道。','我感受到什麼，又有哪些事尚未確認？','留五分鐘安靜，把事實與感受分開。','pillars'],
['empress','III','皇后','The Empress','滋養','照顧需要時間的事，也照顧自己。','給予太多時，留意自己的界線。','哪個需要，值得我好好照料？','安排一段不必表現的休息。','garden'],
['emperor','IV','皇帝','The Emperor','界線','建立一個讓生活更安穩的次序。','當規則太緊，看看是否需要一點彈性。','什麼安排能保護我的時間？','為一件事寫下清楚而可調整的界線。','throne'],
['hierophant','V','教宗','The Hierophant','學習','向經驗學習，也保留提問的空間。','當習慣成為負擔，可以重新了解它的理由。','我接受的規則，是否仍符合我的價值？','向可信任的人請教一個具體問題。','keys'],
['lovers','VI','戀人','The Lovers','選擇','在關係與選擇中，說清楚自己在乎的事。','先確認彼此的期待，不急著替別人作答。','我希望這個選擇照顧到什麼？','用一句話表達一個真實需要。','pair'],
['chariot','VII','戰車','The Chariot','方向','把不同的力量，帶向一個可行方向。','用力之前，先檢查方向與節奏。','現在最值得集中精力的一件事是什麼？','刪去今天一項不必要的分心。','chariot'],
['strength','VIII','力量','Strength','溫柔','用耐心回應困難，力量也可以很柔軟。','覺得累的時候，不必靠硬撐證明自己。','我能用什麼溫和方式照顧這個難處？','先緩慢呼吸，再回應一件令你急躁的事。','lion'],
['hermit','IX','隱者','The Hermit','尋光','退一步，讓自己的判斷更清楚。','獨處之外，也留一條能求助的路。','安靜之後，我真正想問的是什麼？','減少一段資訊輸入，給自己十分鐘。','lantern'],
['wheel','X','命運之輪','Wheel of Fortune','變動','留意變化，尋找當下能調整的位置。','當事情反覆，可以先照顧穩定的日常。','有哪些能控制與不能控制的部分？','各說出一件能改變與需要接受的事。','wheel'],
['justice','XI','正義','Justice','衡量','把事實與影響放在一起，耐心衡量。','先補齊資訊，也聽見自己可能忽略的聲音。','這個選擇對相關的人公平嗎？','確認一項資訊，再作下一步決定。','scales'],
['hanged','XII','吊人','The Hanged Man','換位','暫停慣常做法，試著從另一側觀看。','等待太久時，可以重新選擇如何參與。','換一個人的角度，會看到什麼？','用另一種說法描述眼前的困惑。','inverted'],
['death','XIII','死神','Death','轉化','讓已經結束的階段，有一個告別的位置。','改變可以很慢，先承認自己仍需要適應。','有什麼舊習慣，已不再適合現在的我？','收好一件舊物，為新的安排留空間。','seed'],
['temperance','XIV','節制','Temperance','調和','在不同需要之間，尋找能持續的節奏。','失去平衡時，先做一個小調整。','哪些事情需要多一點，哪些可以少一點？','把今天的安排減到舒服而可行。','cups'],
['devil','XV','惡魔','The Devil','鬆綁','看見讓自己難以放手的習慣與牽掛。','先鬆開一個小束縛，不必一次改變全部。','我以為不能放下的事，真的完全沒有選擇嗎？','為一項耗能習慣設一個小界線。','chain'],
['tower','XVI','高塔','The Tower','重整','當既有想法被打斷，先安頓，再重新理解。','不必預設災難；可以慢慢檢查需要修整的地方。','哪個假設值得重新確認？','先整理一件能讓自己安穩的小事。','tower'],
['star','XVII','星星','The Star','希望','把目光放回仍值得照顧的一點希望。','希望不必很大，也不用立刻感到振作。','哪一件小事，讓我願意再試一次？','做一件平日能恢復精神的小事。','star'],
['moon','XVIII','月亮','The Moon','未明','面對模糊時，容許感受存在，也慢慢核實。','別急著把想像當答案，讓輪廓逐漸清楚。','哪些是已知，哪些只是擔心？','把一個猜測改成可以求證的問題。','moon'],
['sun','XIX','太陽','The Sun','明朗','注意生活裡清楚而簡單的喜悅。','不必要求自己一直積極，也可以有陰天。','最近一件值得好好感受的小事是什麼？','停一分鐘，感受今天一件舒服的事。','sun'],
['judgement','XX','審判','Judgement','回望','回看走過的路，選擇下一步如何回應。','自我檢視不需要變成苛責，給改變一點時間。','哪段經驗能成為下一步的提醒？','說出一件學到的事，而不是一句自責。','calling'],
['world','XXI','世界','The World','整合','看見已完成的一段路，讓經驗慢慢整合。','還有未收尾的地方時，先辨認最小的一步。','這段經歷裡，我想帶走什麼？','為一件完成的事留下一句記錄。','wreath']
];
const scenes=['崖邊行者與行囊','桌上四種工具與舉起的手','雙柱之間的靜坐人物','穀物與花園中的人物','石座上的冠冕人物','教導人物與交叉鑰匙','兩人與上方天使','車輿與兩隻斯芬克斯','人物溫和接近獅子','持燈與杖的獨行人物','輪與周圍象徵','持劍與秤的坐姿人物','一足懸掛的人物','旗幟、騎乘骨骸與遠方日光','人物在兩杯間倒水','角狀人物與鏈條','被閃電擊中的塔','星空下向地與水倒水的人物','雙塔、月亮與遠路','陽光、白馬與孩子','號角下起身回應的人物','花環中人物與四角象徵'];
export const cards=Object.freeze([...rows.map((r,index)=>Object.freeze({id:r[0],index,roman:r[1],name:r[2],english:r[3],arcana:'major',suit:null,rank:null,court:false,scene:scenes[index],theme:r[4],upright:r[5],reversed:r[6],question:r[7],action:r[8],symbol:r[9],sourceId:'waite-part2',sourceLocator:'Part II §2 · '+r[3],interpretation:'believe-original-reflection-v1'})),...minorCards].map(c=>Object.freeze({...c,historicalInterpretation:historical[c.index],verification:historicalVerification[c.id],verificationStatus:historicalVerification[c.id]?.verificationStatus||'pending',sceneVerificationStatus:'pending',historicalSourceId:'waite-part3',historicalLocator:'Part III §'+(c.arcana==='major'?'3':'2')+' · '+(c.id==='strength'?'Fortitude':c.id==='judgement'?'The Last Judgment':c.english)}))); 
