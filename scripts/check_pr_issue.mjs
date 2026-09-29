/** Exige que a descrição do PR cite pelo menos uma Issue existente deste repositório. */
import {pathToFileURL} from 'node:url';

export function extractIssueNumbers(body, repo='talita-olv/smart-route') {
  const found=new Set();
  const text=String(body??'');
  for (const match of text.matchAll(/(?:^|[\s(])#([1-9]\d*)\b/gm)) found.add(Number(match[1]));
  const escaped=repo.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  for (const match of text.matchAll(new RegExp('https:\\/\\/github\\.com\\/'+escaped+'\\/issues\\/([1-9]\\d*)\\b','gi'))) found.add(Number(match[1]));
  return [...found];
}

export async function verifyIssueLink({body, repo='talita-olv/smart-route', token='', request=fetch}) {
  const numbers=extractIssueNumbers(body,repo);
  if (!numbers.length) throw new Error('A descrição do PR deve citar uma Issue deste repositório: Closes #N ou Refs #N.');
  for (const number of numbers) {
    const response=await request('https://api.github.com/repos/'+repo+'/issues/'+number, {
      headers:{Accept:'application/vnd.github+json',...(token?{Authorization:'Bearer '+token}:{})}
    });
    if (!response.ok) continue;
    const issue=await response.json();
    if (!issue.pull_request && issue.number===number) return number;
  }
  throw new Error('Não foi encontrada uma Issue válida com os números indicados na descrição deste PR.');
}

if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    const number=await verifyIssueLink({body:process.env.PR_BODY,repo:process.env.GITHUB_REPOSITORY||'talita-olv/smart-route',token:process.env.GITHUB_TOKEN});
    console.log('Referência válida à Issue #'+number+'.');
  } catch(error) {
    console.error('::error::'+error.message);
    process.exitCode=1;
  }
}
