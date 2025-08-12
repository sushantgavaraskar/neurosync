// Simple backend smoke test covering auth, search, ask, upload
import 'dotenv/config';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:' + (process.env.PORT || 4000);
const API = BASE + '/api';

function log(step, info) {
  console.log(`[test] ${step}`, info ?? '');
}

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  return { res, data };
}

async function main() {
  // health
  log('health', BASE + '/health');
  const health = await jsonFetch(BASE + '/health');
  assert.equal(health.res.status, 200);
  assert.equal(health.data.status, 'ok');

  // login
  log('login', API + '/auth/login');
  const { res: loginRes, data: loginData } = await jsonFetch(API + '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
  });
  assert.equal(loginRes.status, 200);
  assert.ok(loginData.accessToken, 'missing accessToken');
  assert.ok(loginData.refreshToken, 'missing refreshToken');
  const authHeader = { Authorization: `Bearer ${loginData.accessToken}` };

  // refresh
  log('refresh', API + '/auth/refresh');
  const { res: refreshRes, data: refreshData } = await jsonFetch(API + '/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: loginData.refreshToken })
  });
  assert.equal(refreshRes.status, 200);
  assert.ok(refreshData.accessToken, 'missing refreshed accessToken');

  // search
  log('search', API + '/search?q=hello');
  const { res: searchRes, data: searchData } = await jsonFetch(API + '/search?q=hello', {
    headers: authHeader,
  });
  assert.equal(searchRes.status, 200);
  assert.ok(Array.isArray(searchData.results), 'results should be array');

  // ask
  log('ask', API + '/ask');
  const { res: askRes, data: askData } = await jsonFetch(API + '/ask', {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ query: 'What is NeuroSync?' })
  });
  assert.equal(askRes.status, 200);
  assert.ok(typeof askData.answer === 'string', 'answer should be string');

  // upload (skipped if no S3 configured)
  const s3RequiredVars = ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'];
  const hasS3 = s3RequiredVars.every((k) => process.env[k]);
  if (hasS3) {
    log('upload', API + '/files/upload');
    const form = new FormData();
    const tmpFile = path.join(process.cwd(), 'test.txt');
    fs.writeFileSync(tmpFile, 'hello world');
    form.append('file', new Blob([fs.readFileSync(tmpFile)]), 'test.txt');
    const upRes = await fetch(API + '/files/upload', { method: 'POST', headers: authHeader, body: form });
    const upJson = await upRes.json();
    assert.equal(upRes.status, 200);
    assert.ok(upJson.key, 'missing upload key');
    fs.unlinkSync(tmpFile);
  } else {
    log('upload', 'skipped (S3 env missing)');
  }

  console.log('[test] OK');
}

main().catch((err) => {
  console.error('[test] FAILED', err);
  process.exit(1);
});


