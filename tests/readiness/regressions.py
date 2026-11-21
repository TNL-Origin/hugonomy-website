from playwright.sync_api import sync_playwright
from pathlib import Path
import json,os,time
BASE=os.environ.get('HUGONOMY_TEST_URL','http://127.0.0.1:5320')
KEY='hugonomy.website.analytics.v1'
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe')
 def context(choice=None,width=1440,gpc=False):
  c=b.new_context(viewport={'width':width,'height':900}); requests=[]
  if choice:c.add_init_script(f"localStorage.setItem('{KEY}',JSON.stringify({{version:1,choice:'{choice}',savedAt:Date.now()}}))")
  if gpc:c.add_init_script("Object.defineProperty(navigator,'globalPrivacyControl',{value:true})")
  def intercept(r):
   if r.request.url.startswith(BASE+'/'):return r.continue_()
   requests.append(r.request.url)
   if 'googletagmanager.com/gtag/js' in r.request.url:return r.fulfill(content_type='application/javascript',body='window.__tagStubLoaded=true;')
   return r.fulfill(status=200,body='',content_type='text/plain')
  c.route('**/*',intercept)
  return c,c.new_page(),requests
 for width in [320,390,1440]:
  for example in ['grocery','bakery','deli','cafe','dental']:
   c,pg,req=context('rejected',width);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
   pg.goto(BASE+'/business/sebanori/',wait_until='networkidle');pg.click('[data-example='+example+']');pg.click('#next-stage');pg.click('#next-stage')
   pg.click('[data-step="4"]');original=pg.locator('.lab-preview-skills').inner_text()
   pg.click('[data-step="1"]');pg.locator('[data-up="1"]').focus();pg.keyboard.press('Enter')
   assert pg.locator(':focus').get_attribute('data-remove')=='0'
   pg.click('[data-step="4"]');assert pg.locator('.lab-preview-skills').inner_text()==original
   pg.click('[data-step="1"]');pg.locator('[data-remove="3"]').focus();pg.keyboard.press('Enter')
   assert pg.locator(':focus').get_attribute('data-remove')=='2'
   pg.fill('#new-skill','Unpublished <img src=x onerror=alert(1)>');pg.click('#add-skill button')
   pg.click('[data-step="4"]');assert pg.locator('.lab-preview-skills').inner_text()==original
   pg.click('[data-action="orb"]');assert 'Unpublished' not in pg.locator('.lab-small-orb').inner_text()
   pg.click('[data-step="1"]');pg.click('#next-stage');pg.click('[data-step="4"]')
   assert 'Unpublished <img' in pg.locator('.lab-preview-skills').inner_text()
   assert pg.locator('#demo-screen img').count()==0
   pg.click('[data-step="1"]')
   while pg.locator('.lab-tree li').count()>1:pg.locator('[data-remove="0"]').focus();pg.keyboard.press('Enter')
   assert pg.locator(':focus').evaluate('(e)=>e.tagName')=='LI'
   pg.click('[data-step="0"]');pg.click('#next-stage');pg.click('[data-step="4"]');assert 'Unpublished' in pg.locator('.lab-preview-skills').inner_text()
   pg.click('#reset-example');pg.click('[data-step="4"]');assert pg.locator('.lab-preview-skills').count()==0
   assert not req and not errors,(req,errors)
   assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
   rows.append({'test':'plan snapshot, reapprove, redraft, reset and keyboard focus','example':example,'width':width});c.close()
 for page in ['foldspace','about','shape','faculty','news','vision','privacy']:
  for choice,gpc in [(None,False),('rejected',False),('accepted',False),('accepted',True)]:
   c,pg,req=context(choice,390,gpc);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
   assert pg.goto(BASE+'/'+page,wait_until='networkidle').status==200
   ga=[u for u in req if 'googletagmanager.com/gtag/js' in u]
   assert bool(ga)==(choice=='accepted' and not gpc),(page,choice,gpc,req)
   assert not errors,(page,errors)
   assert pg.locator('[data-analytics-settings]').is_visible()
   pg.locator('[data-analytics-settings]').click();assert pg.locator('dialog').is_visible();pg.keyboard.press('Escape')
   rows.append({'test':'legacy consent','page':page,'choice':choice,'gpc':gpc});c.close()
 for channel in ['rpark0715','tiktok','faculty','nelson','mobile-bridge','homepage','reddit','invented','<script>','a'*100]:
  c,pg,req=context('rejected');pg.goto(BASE+'/foldspace?src='+channel,wait_until='networkidle')
  expected=channel if channel in ['rpark0715','tiktok','faculty','nelson','mobile-bridge','homepage','reddit'] else 'homepage'
  assert pg.evaluate('window.HugonomyAttribution.src')==expected
  pg.evaluate("""()=>{window.fetch=async(url,options)=>{window.__submitted=Array.from(options.body.entries());return {json:async()=>({success:true})}}; const d=document.createElement('div');d.className='ml-embedded';d.dataset.srcOverride='mobile-bridge';d.innerHTML='<form action="https://assets.mailerlite.com/test" method="POST"><input name="fields[email]" value="fictional@example.invalid"><button type="submit">Submit test</button></form>';document.body.append(d);d.querySelector('form').requestSubmit();}""")
  pg.wait_for_function('window.__submitted!==undefined');assert ['fields[src]','mobile-bridge'] in pg.evaluate('window.__submitted')
  rows.append({'test':'attribution and intercepted form submission','channel':channel});c.close()
 b.close()
out=Path(__file__).resolve().parents[2]/'.readiness-results'
out.mkdir(exist_ok=True)
(out/'regressions-results.json').write_text(json.dumps(rows,indent=2))
print('PASS',len(rows),'targeted browser scenarios; outside requests stubbed, no form or analytics sent')
