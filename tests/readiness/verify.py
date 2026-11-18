"""Final local readiness checks; external analytics are intercepted, never transmitted."""
from pathlib import Path
import json,os,sys,time
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'.readiness-results';OUT.mkdir(exist_ok=True)
BASE=os.environ.get('HUGONOMY_TEST_URL','http://127.0.0.1:5302');KEY='hugonomy.website.analytics.v1';ID='G-ZVT4SCXJSF'
ROUTES=['/','/systems.html','/business/','/business/sebanori/','/website-notices.html']
results={'responsive':[],'consent':[],'limits':'Analytics loader/consent are tested with intercepted synthetic provider responses, not the live GA reporting account.'}
with sync_playwright() as p:
 for engine in (sys.argv[1:] or ['chromium','firefox','webkit']):
  print('Checking',engine,flush=True)
  b=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe') if engine=='edge' else getattr(p,engine).launch()
  def context(width=1440,init=None,js=True):
   c=b.new_context(viewport={'width':width,'height':900},java_script_enabled=js,service_workers='block')
   outside=[]
   def intercept(route):
    url=route.request.url
    if url.startswith(BASE+'/'):return route.continue_()
    outside.append(url)
    if url.startswith('https://www.googletagmanager.com/gtag/js?'):
     return route.fulfill(status=200,content_type='application/javascript',body='window.__tagStubLoaded=true;fetch("https://region1.google-analytics.com/g/collect",{method:"POST",body:"synthetic"}).catch(()=>{});')
    if url.startswith('https://region1.google-analytics.com/g/collect'):
     return route.fulfill(status=204,headers={'Access-Control-Allow-Origin':'*'})
    return route.abort()
   c.route('**/*',intercept)
   if init:c.add_init_script(init)
   return c,c.new_page(),outside
  for path in ROUTES:
   for width in [1440,1024,820,768,390,320]:
    c,pg,outside=context(width);errors=[]
    pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    response=pg.goto(BASE+path,wait_until='networkidle')
    pg.evaluate('''async()=>{await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode();}catch{}}));}''')
    m=pg.evaluate('''()=>({scroll:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),h1:document.querySelectorAll('h1').length,description:!!document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href})''')
    assert response.status==200 and m['scroll']<=width+1 and m['images'] and m['h1']==1 and m['description'] and m['canonical'] and not outside and not errors,(engine,path,width,m,outside,errors)
    if engine=='webkit':
     # This Windows WebKit build excludes links from native Tab navigation.
     # Verify skip-link activation without claiming Safari's native Tab preference was tested.
     pg.locator('.skip').focus()
    else:
     pg.keyboard.press('Tab');assert pg.locator(':focus').inner_text().strip()=='Skip to content'
    pg.keyboard.press('Enter');assert pg.evaluate('document.activeElement.id')=='main'
    if engine!='webkit':
     pg.keyboard.press('Tab');assert pg.evaluate("!!document.activeElement.closest('main')")
    results['responsive'].append({'engine':engine,'path':path,'width':width,'pass':True,'keyboard':'programmatic skip activation; native link Tab not covered' if engine=='webkit' else 'native first Tab, skip Enter and next Tab'})
    if width==390 and path in ['/','/business/']:
     pg.screenshot(path=str(OUT/(engine+'-'+('home' if path=='/' else 'business')+'-390.png')),full_page=True)
    c.close()
  # Explicit acceptance, persistence across routes, modal Escape and withdrawal.
  c,pg,outside=context();pg.goto(BASE+'/',wait_until='networkidle');assert not outside
  pg.get_by_role('button',name='Accept Google Analytics',exact=True).click()
  pg.wait_for_function('window.__tagStubLoaded===true');pg.wait_for_timeout(150)
  assert any('region1.google-analytics.com' in u for u in outside),outside
  config=pg.evaluate("Array.from(window.dataLayer).map(x=>Array.from(x)).find(x=>x[0]==='config')")
  assert config[1]==ID and config[2]['allow_google_signals'] is False and config[2]['allow_ad_personalization_signals'] is False
  pg.goto(BASE+'/systems.html',wait_until='networkidle');assert pg.locator('.analytics-banner').is_hidden()
  assert pg.evaluate('window.__tagStubLoaded===true')
  pg.locator('[data-analytics-settings]').click();assert pg.locator('dialog').is_visible()
  assert pg.evaluate("!!document.activeElement.closest('dialog')")
  pg.keyboard.press('Escape');pg.locator('dialog').wait_for(state='hidden',timeout=3000)
  c.add_cookies([{'name':'_ga','value':'synthetic','url':BASE},{'name':'_ga_TEST','value':'synthetic','url':BASE}])
  pg.locator('[data-analytics-settings]').click();before=len(outside)
  with pg.expect_navigation(wait_until='networkidle'):
   pg.get_by_role('dialog').get_by_role('button',name='Reject optional analytics').click()
  assert len(outside)==before and pg.evaluate('window.__tagStubLoaded!==true')
  assert json.loads(pg.evaluate('localStorage.getItem("'+KEY+'")'))['choice']=='rejected'
  assert not [x for x in c.cookies() if x['name'].startswith('_ga')]
  c.close();results['consent'].append({'engine':engine,'case':'accept-persist-dialog-escape-withdraw-clear-cookies','pass':True})
  for name,init in [
   ('fresh-reject',None),
   ('invalid-stored',f'localStorage.setItem({json.dumps(KEY)},"invalid JSON")'),
   ('expired-stored',f'localStorage.setItem({json.dumps(KEY)},JSON.stringify({{version:1,choice:"accepted",savedAt:1}}))'),
   ('storage-blocked','Storage.prototype.setItem=function(){throw new DOMException("Blocked","SecurityError")}'),
   ('global-privacy-control',f'Object.defineProperty(navigator,"globalPrivacyControl",{{value:true}});localStorage.setItem({json.dumps(KEY)},JSON.stringify({{version:1,choice:"accepted",savedAt:Date.now()}}))')]:
   c,pg,outside=context(init=init);pg.goto(BASE+'/',wait_until='networkidle');assert not outside,(engine,name,outside)
   if name=='fresh-reject':
    pg.get_by_role('button',name='Reject optional analytics',exact=True).click()
    pg.goto(BASE+'/business/',wait_until='networkidle');assert pg.locator('.analytics-banner').is_hidden() and not outside
   elif name=='storage-blocked':
    pg.get_by_role('button',name='Accept Google Analytics',exact=True).click();assert 'could not save' in pg.locator('.analytics-banner').inner_text() and not outside
   elif name=='global-privacy-control':
    pg.locator('[data-analytics-settings]').click();assert pg.get_by_role('dialog').get_by_role('button',name='Accept Google Analytics').is_disabled()
   else:assert pg.locator('.analytics-banner').is_visible()
   c.close();results['consent'].append({'engine':engine,'case':name,'pass':True})
  c,pg,outside=context(js=False);pg.goto(BASE+'/',wait_until='networkidle');assert not outside
  assert pg.locator('.systems-path').get_attribute('href')=='/foldspace';c.close()
  results['consent'].append({'engine':engine,'case':'javascript-disabled-no-analytics-and-readable-links','pass':True})
  b.close()
  (OUT/('final-'+engine+'.json')).write_text(json.dumps(results,indent=2),encoding='utf8')
  print('PASS',engine,flush=True)
(OUT/('final-'+'-'.join(sys.argv[1:] or ['all'])+'.json')).write_text(json.dumps(results,indent=2),encoding='utf8')
print('PASS',len(results['responsive']),'responsive/keyboard loads;',len(results['consent']),'consent scenarios. External analytics intercepted, not transmitted.')
