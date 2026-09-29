import test from 'node:test';
import assert from 'node:assert/strict';
import {extractIssueNumbers, verifyIssueLink} from '../scripts/check_pr_issue.mjs';

test('extrai refs da Issue de PR e URL do próprio repositório',()=>{
  assert.deepEqual(extractIssueNumbers('Closes #1; Refs #2; https://github.com/talita-olv/smart-route/issues/3'),[1,2,3]);
});
test('rejeita PR sem Issue vinculada',async()=>{
  await assert.rejects(()=>verifyIssueLink({body:'Mudança sem vínculo',request:async()=>{throw Error('não deve chamar');}}),/deve citar/);
});
test('aceita Issue existente e não confunde Pull Request com Issue',async()=>{
  const requested=[];
  const request=async url=>{
    requested.push(url);
    const id=Number(url.split('/').at(-1));
    return {ok:true,json:async()=>id===4?{number:4,pull_request:{url:'x'}}:{number:id}};
  };
  assert.equal(await verifyIssueLink({body:'Refs #4 e #5',request}),5);
  assert.equal(requested.length,2);
});
test('rejeita referências a Issues inexistentes',async()=>{
  await assert.rejects(()=>verifyIssueLink({body:'Closes #9999',request:async()=>({ok:false})}),/Não foi encontrada/);
});
