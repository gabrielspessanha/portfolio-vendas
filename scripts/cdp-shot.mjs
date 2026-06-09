// Captura uma seção de um site externo via Chrome DevTools Protocol.
// Rola a página (dispara animações de reveal), scrolla até a heading alvo e tira print do viewport.
// Pré-requisito: Chrome rodando com --remote-debugging-port=9222
import fs from 'fs';

const URL_TARGET = process.argv[2] || 'https://pianice.vercel.app';
const OUT = process.argv[3] || 'public/images/cases/_sobre.png';
const HEADING = process.argv[4] || 'jornada';
const PORT = 9222;

async function getPageTarget() {
  for (let i = 0; i < 20; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('Chrome remote debugging não respondeu');
}

const page = await getPageTarget();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let idc = 0;
const pending = new Map();
const waiters = [];

ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method) {
    for (const w of [...waiters]) w(msg);
  }
});
function send(method, params = {}) {
  const id = ++idc;
  return new Promise((res) => {
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
function waitEvent(method, timeout = 20000) {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('timeout ' + method)), timeout);
    const w = (msg) => {
      if (msg.method === method) {
        clearTimeout(t);
        const i = waiters.indexOf(w);
        if (i > -1) waiters.splice(i, 1);
        res(msg);
      }
    };
    waiters.push(w);
  });
}

await new Promise((r) => ws.addEventListener('open', r));
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 950,
  deviceScaleFactor: 2,
  mobile: false,
});
const loaded = waitEvent('Page.loadEventFired');
await send('Page.navigate', { url: URL_TARGET });
await loaded;

const expr = `new Promise((res) => {
  let y = 0;
  const step = () => {
    y += 500;
    window.scrollTo(0, y);
    if (y < document.body.scrollHeight) {
      setTimeout(step, 80);
    } else {
      // todos os reveals disparados; volta ao topo e mede a seção alvo
      setTimeout(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
          const hs = [...document.querySelectorAll('h1,h2,h3')];
          const h = hs.find((x) => new RegExp(${JSON.stringify(HEADING)}, 'i').test(x.textContent));
          if (!h) { res(JSON.stringify({ ok: false })); return; }
          const s = h.closest('section') || h.parentElement;
          const r = s.getBoundingClientRect();
          res(JSON.stringify({
            ok: true,
            x: Math.max(0, Math.round(r.left + window.scrollX)),
            y: Math.max(0, Math.round(r.top + window.scrollY)),
            w: Math.round(r.width),
            h: Math.round(r.height),
          }));
        }, 400);
      }, 500);
    }
  };
  step();
})`;
const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true });
const rect = JSON.parse(r.result?.result?.value || '{"ok":false}');
if (!rect.ok) {
  console.error('seção não encontrada para heading:', HEADING);
  ws.close();
  process.exit(2);
}
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h, scale: 1 },
});
fs.writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'));
console.log('saved', OUT, '| rect:', JSON.stringify(rect));
ws.close();
