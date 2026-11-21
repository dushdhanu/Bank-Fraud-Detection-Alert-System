import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

// Run the built Node server and verify HTTP behavior without external accounts.
const port = 8087;
const child = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let log = '';
child.stdout.on('data', d => { log += d; });
child.stderr.on('data', d => { log += d; });
child.on('error', e => { log += e.message; });
try {
  let response;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { response = await fetch(`http://127.0.0.1:${port}/`); break; } catch {
      if (child.exitCode !== null) throw new Error(`Server exited: ${log}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  assert.ok(response, `Server never became ready: ${log}`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /BANKGUARD/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const auth = await fetch(`http://127.0.0.1:${port}/auth`);
  assert.equal(auth.status, 200);
  assert.match(await auth.text(), /Sign in/);
  const missing = await fetch(`http://127.0.0.1:${port}/does-not-exist`);
  assert.equal(missing.status, 404);
  console.log('PASS: production landing, sign-in, security headers and 404 HTTP checks');
} finally {
  child.kill();
}
