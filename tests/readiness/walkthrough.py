"""Exercise the fictional walkthrough after rejecting optional analytics."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json,sys
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'.readiness-results';OUT.mkdir(exist_ok=True)
BASE=os.environ.get('HUGONOMY_TEST_URL','http://127.0.0.1:5302')
AXE=Path(os.environ.get('HUGONOMY_AXE_PATH',str(ROOT/'.readiness-tools/node_modules/axe-core/axe.min.js')))
rows=[]
with sync_playwright() as p:
 for engine in (sys.argv[1:] or ['chromium','firefox','webkit']):
  browser=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe') if engine=='edge' else getattr(p,engine).launch()
  for width in [1440,390]:
   c=browser.new_context(viewport={'width':width,'height':900});outside=[];errors=[]
   c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE+'/') else (outside.append(r.request.url),r.abort())[-1])
   pg=c.new_page();pg.on('pageerror',lambda e:errors.append(str(e)))
   pg.goto(BASE+'/business/sebanori/',wait_until='networkidle')
   pg.get_by_role('button',name='Reject optional analytics',exact=True).click()
   pg.add_script_tag(path=str(AXE))
   def check(label):
    bad=pg.evaluate('''async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)}));}''')
    assert not bad and not outside and not errors,(engine,width,label,bad,outside,errors)
    assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    rows.append({'engine':engine,'width':width,'state':label,'pass':True})
   check('describe');pg.click('#next-stage');check('draft')
   pg.fill('#new-skill','<img src=x onerror=window.__injection=1>');pg.click('#add-skill button[type=submit]')
   assert pg.evaluate('window.__injection===undefined') and pg.locator('#demo-screen img').count()==0
   pg.click('#next-stage');check('approved');pg.click('#next-stage');check('adapt')
   pg.click('[data-change=resource]');check('resource-pending');pg.click('[data-action=apply]');check('resource-applied')
   pg.click('[data-change=accent]');pg.click('[data-action=apply]');check('accent-applied')
   pg.click('[data-change=cards]');pg.click('[data-action=apply]');check('cards-applied')
   pg.click('#next-stage');check('connections')
   assert pg.locator('[data-document][value=private]').is_disabled()
   pg.check('[data-document][value=opening]');pg.click('[data-action=sharing]');check('sharing-preview')
   pg.click('[data-action=share]');check('shared');pg.click('#next-stage');check('trainee')
   assert 'TRAINEE VIEW' in pg.locator('#demo-screen').inner_text()
   pg.click('[data-action=orb]');check('orb-detail')
   assert pg.evaluate('Object.keys(localStorage)')==['hugonomy.website.analytics.v1']
   assert pg.evaluate('sessionStorage.length')==0
   c.close()
  browser.close()
(OUT/('walkthrough-'+'-'.join(sys.argv[1:] or ['all'])+'.json')).write_text(json.dumps(rows,indent=2),encoding='utf8')
print('PASS',len(rows),'walkthrough checkpoints, including input escaping and accessibility scans; no external requests.')
