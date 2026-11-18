from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os,sys
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'.readiness-results';OUT.mkdir(exist_ok=True)
AXE=Path(os.environ.get('HUGONOMY_AXE_PATH',str(ROOT/'.readiness-tools/node_modules/axe-core/axe.min.js')))
BASE=os.environ.get('HUGONOMY_TEST_URL','http://127.0.0.1:5302')
routes=['/','/systems.html','/business/','/business/sebanori/','/website-notices.html']
out=[]
with sync_playwright() as p:
 for engine in (sys.argv[1:] or ['chromium','firefox','webkit']):
  b=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe') if engine=='edge' else getattr(p,engine).launch()
  for route in routes:
   for width in [1440,390]:
    c=b.new_context(viewport={'width':width,'height':900});pg=c.new_page()
    pg.goto(BASE+route,wait_until='networkidle')
    pg.add_script_tag(path=str(AXE))
    for state in ['initial','preferences']:
     if state=='preferences':pg.locator('[data-analytics-settings]').click()
     result=pg.evaluate('''async()=>{let r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};}''')
     out.append({'engine':engine,'route':route,'width':width,'state':state,**result})
    c.close()
  b.close()
(OUT/('axe-'+'-'.join(sys.argv[1:] or ['all'])+'.json')).write_text(json.dumps(out,indent=2),encoding='utf8')
print(json.dumps([r for r in out if r['violations']],indent=2))
print('Audited',len(out),'page/states with axe-core')
