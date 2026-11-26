// Guides are native HTML details: available with JavaScript disabled.
const filters=document.querySelector('.filters');
const status=document.getElementById('filter-status');
if(filters)filters.hidden=false;
if(status)status.hidden=false;
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 let count=0;
 document.querySelectorAll('[data-role]').forEach(c=>{
  c.hidden=!(b.dataset.filter==='all'||c.dataset.role===b.dataset.filter||c.dataset.role==='everyone');
  if(!c.hidden)count++;
 });
 status.textContent=count+' previews shown';
}));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>document.getElementById('contact-dialog').showModal()));
