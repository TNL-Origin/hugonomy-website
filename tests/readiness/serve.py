"""Local test server: applies existing headers and simulates Netlify HTML aliases."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote
import tomllib,sys
ROOT=Path(__file__).resolve().parents[2]
config=tomllib.loads((ROOT/'netlify.toml').read_text())
ROOT=ROOT/'public-site' if '--public' in sys.argv else ROOT
headers=config['headers'][0]['values']
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        path=urlsplit(self.path).path
        # Only alias flat, extensionless HTML names. Directory indexes use normal handling.
        if '/' not in path.strip('/') and path.strip('/') and '.' not in path:
            candidate=ROOT/(unquote(path.strip('/'))+'.html')
            if candidate.is_file():self.path=path+'.html'+(('?'+urlsplit(self.path).query) if urlsplit(self.path).query else '')
        super().do_GET()
    def end_headers(self):
        for name,value in headers.items():self.send_header(name,value)
        super().end_headers()
    def log_message(self,*args):pass
print('Local candidate server with candidate CSP; HTML aliases simulated, not a Netlify deploy.',flush=True)
ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1]) if len(sys.argv)>1 else 5302),Handler).serve_forever()
