import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import {createRequire} from 'node:module';
const resolve = createRequire(import.meta.url).resolve;
test('the locked dependency graph contains no vulnerable sprintf-js', () => {
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  assert.deepEqual(Object.keys(lock.packages).filter(p => p.endsWith('/sprintf-js')), []);
  const yamlPath = path.dirname(resolve('js-yaml/package.json', {paths: [path.dirname(resolve('@istanbuljs/load-nyc-config'))]}));
  const argparse = resolve('argparse/package.json', {paths: [yamlPath]});
  assert.equal(JSON.parse(fs.readFileSync(argparse, 'utf8')).version, '2.0.1');
});
test('NYC YAML configuration retains arrays, booleans and kebab-case fields', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nyc-audit-'));
  try {
    fs.writeFileSync(path.join(dir, 'package.json'), '{}');
    fs.writeFileSync(path.join(dir, '.nycrc.yml'), 'include: [src/**]\nexclude: [test/**]\nall: true\ncheck-coverage: true\n');
    const {loadNycConfig} = await import('@istanbuljs/load-nyc-config');
    const config = await loadNycConfig({cwd: dir, nycrcPath: '.nycrc.yml'});
    assert.deepEqual(config.include, ['src/**']); assert.deepEqual(config.exclude, ['test/**']);
    assert.equal(config.all, true); assert.equal(config.checkCoverage, true);
    fs.writeFileSync(path.join(dir, '.nycrc.yml'), 'include: [unterminated');
    await assert.rejects(loadNycConfig({cwd: dir, nycrcPath: '.nycrc.yml'}));
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});
test('legacy js-yaml CLI still parses valid input and rejects invalid input', () => {
  const yamlPath = path.dirname(resolve('js-yaml/package.json', {paths: [path.dirname(resolve('@istanbuljs/load-nyc-config'))]}));
  const cli = path.join(yamlPath, 'bin/js-yaml.js');
  const ok = cp.spawnSync(process.execPath, [cli, '--compact'], {input: 'count: 4\n', encoding: 'utf8', timeout: 3000});
  assert.equal(ok.status, 0); assert.deepEqual(JSON.parse(ok.stdout), {count: 4});
  const bad = cp.spawnSync(process.execPath, [cli], {input: 'count: [unterminated', encoding: 'utf8', timeout: 3000});
  assert.equal(bad.status, 1); assert.match(bad.stderr, /YAMLException/);
});
test('indexed source maps with extreme offsets finish without scanning absent code', () => {
  const fixture = `const {SourceMapConsumer, SourceNode} = require('source-map-js');
const map = {version:3,sections:[{offset:{line:10000000,column:0},map:{version:3,sources:['x.js'],names:[],mappings:'AAAA',sourcesContent:['x']}}]};
process.stdout.write(SourceNode.fromStringWithSourceMap('x',new SourceMapConsumer(map)).toString());`;
  const result = cp.spawnSync(process.execPath, ['-e', fixture], {encoding:'utf8', timeout:3000});
  assert.equal(result.error, undefined); assert.equal(result.status, 0); assert.equal(result.stdout, 'x');
});

test('section offsets above the supported bound are rejected', async () => {
  const {SourceMapConsumer} = await import('source-map-js');
  assert.throws(() => new SourceMapConsumer({version:3,sections:[{offset:{line:10000001,column:0},map:{version:3,sources:[],names:[],mappings:''}}]}), /Section offset line must not exceed 10000000/);
});

// Regression cases for GHSA-8r5x-fm3f-whwj and GHSA-p8wg-vrv2-v86f.
// See upstream advisories; these fixtures do not execute injected commands.
test('Handlebars rejects a Program with non-array block parameters', () => {
  const h = createRequire(import.meta.url)('handlebars');
  const ast = h.parse('{{#if ok}}hello{{/if}}');
  ast.body[0].program.blockParams = {length: '0'};
  assert.throws(() => h.precompile(ast), /blockParams|array|Array/);
  assert.equal(h.compile('{{#if ok}}hello {{name}}{{/if}}')({ok:true,name:'reader'}), 'hello reader');
});
test('Handlebars prevents prototype constructor lookup while preserving plain data', () => {
  const h = createRequire(import.meta.url)('handlebars');
  h.registerHelper('inspect', (value, options) => options.lookupProperty(value, 'constructor') === Function ? 'exposed' : 'blocked');
  assert.equal(h.compile('{{inspect target}}')({target:Function.prototype}, {allowProtoMethodsByDefault:true}), 'blocked');
  assert.equal(h.compile('{{constructor.name}}')({constructor:{name:'ordinary'}}), 'ordinary');
});
