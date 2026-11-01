import {button} from './shared.js';
export function createDivinationHost(registry){
  let active=null;
  function destroy(){if(!active)return;const run=active;active=null;run.controller.abort();run.instance?.dispose?.();run.root.removeEventListener('click',run.retry);}
  async function open(root,id){
    destroy();const run={root,id,controller:new AbortController(),instance:null,retry:null};active=run;
    // A browser can cache a failed ES-module graph. A labelled page reload
    // retries the entire graph rather than pretending the same import recovered.
    run.retry=event=>{if(event.target.closest('[data-module-action="retry-module"]'))location.reload();};root.addEventListener('click',run.retry);
    root.innerHTML='<section class="panel module-loading" role="status" aria-busy="true">正在準備牌面…<p><a href="#/home">先回首頁</a></p></section>';
    try{
      const module=await registry.load(id,{signal:run.controller.signal});if(active!==run||!root.isConnected)return;
      run.instance=module.mount({root,signal:run.controller.signal});
      if(typeof run.instance?.dispose!=='function'||typeof run.instance?.clear!=='function')throw Error('Invalid session lifecycle');
    }catch(error){if(active!==run||run.controller.signal.aborted)return;run.controller.abort();run.instance?.dispose?.();root.innerHTML=`<section class="panel error" role="alert"><h2>這副牌暫時沒有載入。</h2><p>這次尚未抽牌。重新載入頁面可重試，也可以先換一種方式。</p><div class="actions">${button('重新載入頁面','retry-module','secondary')}<a class="button quiet" href="#/home">回到首頁</a></div></section>`;}
  }
  return {open,destroy,clear(){active?.instance?.clear();}};
}
