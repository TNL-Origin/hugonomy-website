// Scripted illustration, not product runtime: no AI, network, uploads, accounts or persistence.
const examples={
 grocery:{
   name:'The Corner Pantry', label:'Small grocery',
   brief:'We run a neighborhood grocery. When a delivery arrives, our new colleague needs to find the shelf map, work beside the stock lead and tell the next shift what still needs shelving.',
   skills:['Find an item on the shelf map','Observe a delivery handover','Practise shelving with the stock lead','Hand over an unfinished restock']
 },
 bakery:{
   name:'The Little Bakery', label:'Bakery',
   brief:'I open the bakery counter with a new colleague. I want them to learn the names of the day’s bakes, find the product guide and flag a low display tray before the morning rush.',
   skills:['Match display labels to the day’s bakes','Find the bakery’s product guide','Show the baker which tray needs a refill','Hand over the counter for the next shift']
 },
 deli:{
   name:'The Neighborhood Deli', label:'Deli',
   brief:'At our deli counter, one colleague takes the order and another packs it. A new teammate needs practice reading a sample order back, finding our counter guide and passing the order along.',
   skills:['Find the deli counter guide','Read back an invented counter order','Pass the order to the packing station','Ask the counter lead about a substitution']
 },
 cafe:{
   name:'The Garden Café', label:'Café / bistro',
   brief:'Our café team shares a counter and a tiny dining room. Before the lunch rush, I show a new teammate the table map and how a sample order moves from the till to the pickup shelf.',
   skills:['Find a table on the dining-room map','Observe the handoff from till to bar','Match a sample drink ticket to the pickup shelf','Hand over a table request to the floor lead']
 },
 dental:{
   name:'Maple Lane Dental', label:'Dental office',
   brief:'I train people on the front desk at a small dental office. We practise with blank welcome packets and the office map so a new teammate can greet a visitor, give directions and find the office lead.',
   skills:['Find the reception desk on the office map','Assemble a blank welcome packet','Practise welcoming an invented visitor','Route a front-desk question to the office lead']
 }
};
const initial=()=>({stage:0,example:'grocery',brief:examples.grocery.brief,skills:[],published:[],approved:false,pending:null,resource:false,accent:false,cards:false,selected:[],shared:[],sharing:false,detail:false,resourceOpen:false,notice:''});
let s=initial();
const $=q=>document.querySelector(q),current=()=>examples[s.example];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badge=(text,kind='')=>`<span class="lab-badge ${kind}">${text}</span>`;
const tip=(heading,text)=>`<div class="lab-guidance"><span aria-hidden="true">↳</span><div><strong>${heading}</strong><p>${text}</p></div></div>`;
const title=(label,heading,text)=>`<p class="screen-eyebrow">${label}</p><h3 id="workspace-title" tabindex="-1">${heading}</h3><p class="lab-description">${text}</p>`;
const btn=(action,label,kind='primary',disabled=false)=>`<button class="button ${kind} compact" data-action="${action}" ${disabled?'disabled':''}>${label}</button>`;
function describe(){
 const choices=Object.entries(examples).map(([id,e])=>
   `<button type="button" data-example="${id}" aria-pressed="${s.example===id}">${e.label}</button>`
 ).join('');
 return '<h3 id="workspace-title" tabindex="-1">What kind of business do you run?</h3>'+
   `<div class="lab-choices" role="group" aria-label="Choose an example business">${choices}</div><label class="lab-label" for="work-brief">How would you describe the work? <span>Invented information only</span></label><textarea id="work-brief" maxlength="700" rows="4">${esc(s.brief)}</textarea>`+
   tip('Try the mentor’s role.','Each business has a scripted starting plan. You can edit the description for practice, then add or reorder skills in the draft before you approve it.')+
   (s.skills.length?'<p class="lab-small">Drafting again replaces the draft. The trainee keeps the last approved plan until you approve a replacement.</p>':'');
}
function tree(){if(!s.skills.length)return title('LEARNING TREE','A plan starts with the work.','Choose an example business first, then draft its learning tree.')+btn('draft','Draft the selected example →');return title('MENTOR REVIEW',s.approved?'Your example tree is approved.':'A draft you can make your own.','These skills illustrate a training plan. A mentor supplies the workplace procedures. Add a skill or change the teaching order before you approve.')+badge(s.approved?'Mentor-approved example':'Scripted AI draft · not approved',s.approved?'approved':'draft')+`<ol class="lab-tree">${s.skills.map((k,i)=>`<li><span class="lab-node">${i+1}</span><span>${esc(k)}<small>${i?'Builds on the previous example skill':'Starting point'} · Not yet</small></span><button class="lab-icon-btn" data-up="${i}" aria-label="Move skill ${i+1} earlier" ${i===0?'disabled':''}>↑</button><button class="lab-icon-btn" data-remove="${i}" aria-label="Remove skill ${i+1}" ${s.skills.length===1?'disabled':''}>×</button></li>`).join('')}</ol><form id="add-skill" class="lab-add"><label for="new-skill" class="lab-label">A skill you want included</label><div><input id="new-skill" maxlength="80" placeholder="e.g. Find the shift handover notes" required><button class="button outline compact" type="submit">Add skill</button></div></form>`+tip('Approval belongs to the mentor.','New skills start at Not yet. Edits stay in draft while the trainee keeps the last approved plan. Only your next approval publishes those changes; AI never approves a plan or awards competence.');}
const changes={resource:{label:'Add an opening-checklist button',why:'Give approved resources a clear place.',before:'No opening-checklist button on Today.',after:'An Opening checklist button appears on Today.',access:'This illustration opens a local example panel. Real resources need an approved destination. No learner records are shared.'},accent:{label:'Make the focus stand out',why:'Try a warm color for the next step.',before:'Today’s focus uses a soft green background.',after:'Today’s focus uses a soft amber accent.',access:'Appearance only. No new data access, connector or skill mark changes.'},cards:{label:'Show skills as touch-friendly cards',why:'Make the plan easier to scan.',before:'The trainee sees a compact skill list.',after:'Each approved skill appears in its own card.',access:'Presentation only. The approved skills and access permissions stay the same.'}};
function preview(){return `<div class="lab-preview"><div class="lab-preview-head"><span>TODAY · EXAMPLE PREVIEW</span>${badge('Mira → Theo')}</div><div class="lab-focus ${s.accent?'warm':''}"><small>TODAY’S FOCUS</small><strong>${esc(s.published.length?s.published[0]:'The mentor will choose a focus')}</strong><p>${s.published.length?'Example approved plan. All skills begin at Not yet.':'Approve the example tree to preview it here.'}</p></div><div class="lab-preview-skills ${s.cards?'as-cards':''}">${(s.published.length?s.published:['Approved skills appear here']).map(k=>`<div><span aria-hidden="true">○</span>${esc(k)}</div>`).join('')}</div>${s.resource?'<button class="lab-resource" data-action="open-resource">↗ Opening checklist <span>Example resource</span></button>':''}</div>`;}
function adapt(){return title('ADAPT THIS WORKSPACE','Ask for a change. See the effect.','Try a scripted request. Inspect its purpose and permissions, then approve it. This is a proposed AI-assisted interaction, not a live AI-generated interface.')+`<div class="lab-adapt-grid"><div><div class="lab-request-list" role="group" aria-label="Example adaptation requests">${Object.entries(changes).map(([key,v])=>`<button data-change="${key}" ${s[key]?'disabled':''} aria-pressed="${s.pending===key}"><span aria-hidden="true">✳</span><div><strong>${v.label}</strong><small>${s[key]?'Applied in this example':v.why}</small></div><span aria-hidden="true">→</span></button>`).join('')}</div>${s.pending?`<section class="lab-change-review" aria-label="Proposed change"><p class="screen-eyebrow">SCRIPTED PROPOSAL · WAITING FOR YOU</p><h4>${changes[s.pending].label}</h4><p><strong>Before:</strong> ${changes[s.pending].before}</p><p><strong>After:</strong> ${changes[s.pending].after}</p><p class="lab-permission"><strong>Access and effects:</strong> ${changes[s.pending].access}</p><div class="lab-inline-actions">${btn('apply','Approve example change')}${btn('decline','Decline','outline')}</div></section>`:tip('Preview → inspect → approve.','Choose a request above. Nothing changes until you approve. Then look at the Today preview.')} </div><div>${preview()}${s.resource||s.accent||s.cards?'<button class="lab-text-button" data-action="undo">Restore the original example layout ↶</button>':''}</div></div>`;}
const docs=[{id:'opening',name:'Opening handover.pdf',detail:'Invented handover headings only.'},{id:'product',name:'Product guidance.txt',detail:'Invented pointer to approved information.'},{id:'private',name:'Private staffing notes.txt',detail:'Excluded: not a training resource.',blocked:true}];
function connections(){return title('CONNECTIONS · FUTURE CONCEPT','Connect with a clear boundary.','Explore selected-document sharing. No Google account is connected, no files are read and nothing is sent to a provider.')+`<div class="lab-provider"><div><strong>✳ AI drafting</strong><small>Scripted preview · no provider connected</small></div>${badge('Simulation only','draft')}</div><section class="lab-drive"><div class="lab-drive-heading"><div><h4>Google Drive</h4><p>${s.shared.length?`Simulated permission for ${s.shared.length} invented document${s.shared.length===1?'':'s'}.`:'Proposed selected-file experience. Not available in the current app.'}</p></div>${badge(s.shared.length?'Simulated access':'Not connected',s.shared.length?'approved':'')}</div><p class="lab-small">Choose the invented documents the mock assistant may use. An account connection must not imply access to the entire Drive.</p><div class="lab-documents">${docs.map(d=>`<label><input type="checkbox" value="${d.id}" data-document ${d.blocked?'disabled':''} ${s.selected.includes(d.id)?'checked':''}><span><strong>${d.name}</strong><small>${d.detail}</small></span>${d.blocked?badge('Excluded'):''}</label>`).join('')}</div><div class="lab-inline-actions">${btn('sharing','Preview sharing permissions','primary',!s.selected.length)}${s.shared.length?btn('disconnect','Disconnect simulation','outline'):''}</div>${s.sharing?`<section class="lab-change-review" aria-label="Sharing preview"><p class="screen-eyebrow">CHECK BEFORE APPROVING</p><h4>${s.selected.length} selected example document${s.selected.length===1?'':'s'}</h4><p><strong>Included:</strong> ${docs.filter(d=>s.selected.includes(d.id)).map(d=>d.name).join(', ')}.</p><p><strong>Purpose:</strong> prepare a draft learning resource. <strong>Recipients:</strong> in this demo, none. A real flow must name the service and AI processor before approval.</p><p><strong>Not included:</strong> other files, staffing notes, learner messages, marks or credentials. Model-training use would require a separate agreement.</p>${btn('share','Approve simulated access')}</section>`:''}</section>`;}
function trainee(){if(!s.published.length)return title('TRAINEE PREVIEW','The mentor’s decision comes first.','Approve an example tree before viewing it as the trainee. Pending drafts are not published.')+btn('review','Review the example tree →');return title('THEO · TRAINEE VIEW','A clear next step, with support.','See the example plan and layout you approved as mentor. The trainee cannot edit the layout or approve their own marks.')+`<div class="lab-trainee-grid"><div>${preview()}${s.resourceOpen?'<section class="lab-change-review"><h4>Opening checklist · invented resource</h4><p>Find the approved department guidance, confirm the learning focus with the mentor and ask where help is needed. No operational or safety procedure is provided.</p>'+btn('close-resource','Close resource','outline')+'</section>':''}</div><section class="lab-small-orb"><p class="screen-eyebrow">THEO’S LEARNING ORB</p><div class="mini-orb all-new" aria-hidden="true"></div><h4>${s.published.length} skills. A shared view.</h4><p>○ ${s.published.length} Not yet<br>△ 0 With help<br>◇ 0 Independent</p>${btn('orb',s.detail?'Close skill detail':'Unfold the orb','outline')}${s.detail?`<ul>${s.published.map(k=>`<li>${esc(k)} <small>Not yet</small></li>`).join('')}</ul>`:''}<p class="lab-small">Only mentor-approved observations change marks.</p></section></div>`;}
function reveal(selector){const element=$(selector);if(!element)return;element.tabIndex=-1;element.focus({preventScroll:true});element.scrollIntoView({block:'nearest',behavior:'instant'});}
function focusSkill(index,action){
 const row=document.querySelectorAll('.lab-tree li')[index];
 const control=row?.querySelector(`[data-${action}]:not(:disabled)`)||row?.querySelector('button:not(:disabled)');
 if(control)control.focus({preventScroll:true});
 else if(row){row.tabIndex=-1;row.focus({preventScroll:true});}
}
const views=[describe,tree,adapt,connections,trainee];
function render(focus=false){$('#demo-screen').innerHTML=views[s.stage]();document.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.step)===s.stage)));$('#lab-person').textContent=s.stage===4?'Theo · trainee':'Mira · mentor';$('#lab-role').textContent=s.stage===4?'Read-only trainee preview':'Mentor workspace';$('#lab-shop').textContent=current().name;$('#previous-stage').hidden=s.stage===0;$('#next-stage').textContent=['Draft an example tree →',s.approved?'Explore interface adaptation →':'Approve example tree →','Explore connections →','See the trainee view →','Start another example ↻'][s.stage];$('#next-stage').disabled=s.stage===1&&!s.skills.length;$('#lab-feedback').textContent=s.notice||['Choose a business, then draft its example learning tree.','Edit the draft. Only your explicit approval publishes it.','Try a request. The preview changes after approval.','Inspect which documents and permissions are included.','The trainee sees approved learning, without layout controls.'][s.stage];if(focus){$('#workspace-title').focus({preventScroll:true});$('#interactive-lab').scrollIntoView({block:'start',behavior:'instant'});}}
function go(stage){const field=$('#work-brief');if(field)s.brief=field.value.slice(0,700);s.stage=stage;s.notice='';s.resourceOpen=false;render(true);}
function draft(){const field=$('#work-brief');if(field)s.brief=field.value.slice(0,700);if(!s.brief.trim()){s.notice='Add an invented description first.';$('#lab-feedback').textContent=s.notice;field?.focus();return;}s.skills=[...current().skills];s.approved=false;s.stage=1;s.notice=`Scripted ${current().label.toLowerCase()} draft prepared. Nothing was sent anywhere.`;render(true);}
$('#interactive-lab').addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b||b.disabled||b.closest('form'))return;
 if(b.id==='reset-example'){s=initial();s.notice='Example reset. No data was saved or sent.';render(true);return;}
 if(b.dataset.step!==undefined){go(Number(b.dataset.step));return;}
 if(b.dataset.example){
   const id=b.dataset.example;
   if(id===s.example)return;
   s={...initial(),example:id,brief:examples[id].brief};
   s.notice=`${examples[id].label} selected. Draft its example tree next.`;
   render();
   document.querySelector(`[data-example="${id}"]`)?.focus({preventScroll:true});
   return;
 }
 if(b.dataset.change){s.pending=b.dataset.change;s.notice='Inspect the proposal. The preview is unchanged until approval.';render();reveal('.lab-change-review');return;}
 if(b.dataset.up!==undefined){const i=Number(b.dataset.up);[s.skills[i-1],s.skills[i]]=[s.skills[i],s.skills[i-1]];s.approved=false;s.notice='Teaching order changed. Review and approve again.';render();focusSkill(i-1,'up');return;}
 if(b.dataset.remove!==undefined){const i=Number(b.dataset.remove);s.skills.splice(i,1);s.approved=false;s.notice='Skill removed. Review and approve the revised draft.';render();focusSkill(Math.min(i,s.skills.length-1),'remove');return;}
 const a=b.dataset.action;
 if(a==='draft'){draft();return;}if(a==='review'){go(1);return;}
 if(a==='apply'){s[s.pending]=true;s.pending=null;s.notice='Example change approved. The Today preview has updated.';}
 if(a==='decline'){s.pending=null;s.notice='Proposal declined. The layout is unchanged.';}
 if(a==='undo'){s.resource=s.accent=s.cards=false;s.pending=null;s.notice='Original layout restored; the approved tree is unchanged.';}
 if(a==='sharing'){s.sharing=true;s.notice='Review the selected documents before approving.';}
 if(a==='share'){s.shared=[...s.selected];s.sharing=false;s.notice='Simulated access approved. No real files were read or sent.';}
 if(a==='disconnect'){s.shared=[];s.selected=[];s.sharing=false;s.notice='Simulation disconnected. No real account was connected.';}
 if(a==='orb')s.detail=!s.detail;
 if(a==='open-resource'){if(!s.published.length){s.notice='Approve the example tree first, then explore this resource as the trainee.';}else{s.stage=4;s.resourceOpen=true;s.notice='Local invented resource opened in trainee preview.';}}
 if(a==='close-resource')s.resourceOpen=false;
 if(b.id==='previous-stage'){go(s.stage-1);return;}
 if(b.id==='next-stage'){if(s.stage===0){draft();return;}if(s.stage===1&&!s.approved){s.approved=true;s.published=[...s.skills];s.notice='Tree approved by you as mentor. All skills remain Not yet.';render();return;}if(s.stage===4){s=initial();render(true);return;}go(s.stage+1);return;}
 render();
 if(a==='apply')reveal('.lab-preview');
 if(a==='sharing')reveal('.lab-change-review');
 if(a==='share'||a==='disconnect')reveal('.lab-drive-heading');
 if(a==='decline')$('.lab-request-list button:not(:disabled)')?.focus({preventScroll:true});
 if(a==='orb')reveal('.lab-small-orb');
 if(a==='open-resource'&&s.resourceOpen)reveal('.lab-change-review');
});
$('#interactive-lab').addEventListener('change',event=>{if(event.target.matches('[data-document]')){s.selected=[...document.querySelectorAll('[data-document]:checked')].map(e=>e.value);s.sharing=false;s.notice='Selection changed; preview and approve again before using a different selection.';const selectedId=event.target.value;render();document.querySelector(`[data-document][value="${selectedId}"]`)?.focus({preventScroll:true});}});
$('#interactive-lab').addEventListener('submit',event=>{if(event.target.id!=='add-skill')return;event.preventDefault();const text=$('#new-skill').value.trim().slice(0,80);if(!text)return;if(s.skills.length>=8){$('#lab-feedback').textContent='This short example supports up to eight skills.';return;}s.skills.push(text);s.approved=false;s.notice='Skill added to the draft. Approval is required again.';render();$('#new-skill').focus({preventScroll:true});});
render();
