import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const nextRequire = createRequire(import.meta.url);
const pluginRequire = createRequire(nextRequire.resolve('@next/eslint-plugin-next'));
const glob = pluginRequire('fast-glob');
const rootUtil = path.join(path.dirname(nextRequire.resolve('@next/eslint-plugin-next')), 'utils/get-root-dirs.js');
const {getRootDirs} = nextRequire(rootUtil);

test('Next root resolver retains directory patterns and excludes files', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'next-glob-'));
  try {
    for (const dir of ['apps/web/pages', 'apps/admin/pages', 'apps/énergie/pages', '.hidden/pages']) fs.mkdirSync(path.join(temp, dir), {recursive:true});
    fs.writeFileSync(path.join(temp, 'apps/file'), 'not a directory');
    const canonical = patterns => getRootDirs({cwd:temp, settings:{next:{rootDir:patterns}}}).map(x=>path.resolve(x)).sort();
    const expected = ['admin','web','énergie'].map(x=>path.join(temp,'apps',x)).sort();
    assert.deepEqual(canonical(`${temp}/apps/*`), expected);
    assert.deepEqual(canonical(`${temp}/apps/{web,admin}`), expected.filter(x=>!x.endsWith('énergie')));
    assert.deepEqual(canonical([`${temp}/apps/web`,`${temp}/apps/admin`]), expected.filter(x=>!x.endsWith('énergie')));
    assert.deepEqual(canonical(`${temp.replaceAll('/', '\\')}\\apps\\web`), [path.join(temp,'apps','web')]);
    assert.deepEqual(getRootDirs({cwd:temp,settings:{}}), [temp]);
    assert.deepEqual(canonical(`${temp}/apps/missing*`), []);
    assert.equal(glob.globSync(`${temp}/apps/*`,{onlyDirectories:true}).length, 3);
  } finally {fs.rmSync(temp,{recursive:true,force:true});}
});

test('nested brace input completes on a reduced stack without recursion failure', () => {
  const script = `const g=require(${JSON.stringify(pluginRequire.resolve('fast-glob'))}); g.globSync('{'.repeat(3000)+'x,y'+'}'.repeat(3000), {onlyDirectories:true});`;
  const result=spawnSync(process.execPath,['--stack_size=256','-e',script],{encoding:'utf8',timeout:5000});
  assert.equal(result.status,0,result.stderr || String(result.error));
});
