/*
 * Launcher service. TizenBrew runs this with Node on the TV when the module
 * opens. TizenBrew module pages (served from 127.0.0.1:8081) cannot call the
 * TV's own API on 127.0.0.1:8001 directly, so the page asks this service and
 * the service asks the TV.
 *
 *   GET  /ping            -> {ok:true}
 *   GET  /app/<appId>     -> the TV's status for that app (name, running, visible)
 *   POST /launch/<appId>  -> open that app
 *
 * Locked down: listens on 127.0.0.1 only, answers only TizenBrew's page origin,
 * and every request must carry the X-Launcher header (which forces a CORS
 * preflight, so other web pages on the TV cannot fire launches blindly).
 */
var http = require('http');

var PORT = 8097;
var TV_HOST = process.env.TV_HOST || '127.0.0.1';   // env override only for testing off-TV
var TV_PORT = 8001;
var ORIGINS = ['http://127.0.0.1:8081', 'http://localhost:8081'];
var ID_RE = /^[A-Za-z0-9._-]{3,64}$/;

function reply(req, res, code, body) {
  var origin = req.headers.origin;
  var headers = { 'Content-Type': 'application/json', 'Vary': 'Origin' };
  if (origin && ORIGINS.indexOf(origin) !== -1) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'X-Launcher';
  }
  res.writeHead(code, headers);
  res.end(JSON.stringify(body));
}

function tv(method, path, cb) {
  var r = http.request({ host: TV_HOST, port: TV_PORT, method: method, path: path, timeout: 5000 }, function (resp) {
    var text = '';
    resp.on('data', function (c) { text += c; });
    resp.on('end', function () {
      var json = null;
      try { json = JSON.parse(text); } catch (e) {}
      cb(null, resp.statusCode, json);
    });
  });
  r.on('error', function (e) { cb(e); });
  r.on('timeout', function () { r.destroy(new Error('timeout')); });
  r.end();
}

http.createServer(function (req, res) {
  var url = req.url.split('?')[0];
  var origin = req.headers.origin;

  if (req.method === 'OPTIONS') return reply(req, res, 204, {});
  if (origin && ORIGINS.indexOf(origin) === -1) return reply(req, res, 403, { ok: false, error: 'origin not allowed' });
  if (!req.headers['x-launcher']) return reply(req, res, 403, { ok: false, error: 'missing X-Launcher header' });

  if (req.method === 'GET' && url === '/ping') return reply(req, res, 200, { ok: true });

  var m = /^\/(app|launch)\/([^\/]+)$/.exec(url);
  if (!m) return reply(req, res, 404, { ok: false, error: 'no such route' });
  var id = decodeURIComponent(m[2]);
  if (!ID_RE.test(id)) return reply(req, res, 400, { ok: false, error: 'bad app id' });
  var path = '/api/v2/applications/' + encodeURIComponent(id);

  if (m[1] === 'app' && req.method === 'GET') {
    return tv('GET', path, function (e, code, json) {
      if (e) return reply(req, res, 502, { ok: false, error: 'TV API unreachable' });
      reply(req, res, 200, { ok: code === 200, code: code, app: json });
    });
  }
  if (m[1] === 'launch' && req.method === 'POST') {
    return tv('POST', path, function (e, code) {
      if (e) return reply(req, res, 502, { ok: false, error: 'TV API unreachable' });
      if (code === 200) return reply(req, res, 200, { ok: true });
      if (code === 404) return reply(req, res, 200, { ok: false, error: 'app not installed' });
      reply(req, res, 502, { ok: false, error: 'TV refused (' + code + ')' });
    });
  }
  reply(req, res, 405, { ok: false, error: 'method not allowed' });
}).listen(PORT, '127.0.0.1');
