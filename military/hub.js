/* Rehabwheel Military Programs Hub • all records remain server-side.
   Static GitHub Pages shell is public; private Firestore/Storage data requires
   verified Firebase authentication AND server-side military role rules.
   The application FAILS CLOSED if config, claims, or network are absent. */
import {firebaseConfig} from './firebase-config.js';

const $=id=>document.getElementById(id);
const screens={login:$('loginScreen'),denied:$('deniedScreen'),hub:$('hubScreen')};
const status=$('loginStatus'),loginButton=$('loginButton');
const roles=['viewer','editor','admin'];
const catalogs={
 programs:{title:'Program pipeline',subtitle:'Military-facing opportunities and submission checkpoints.',columns:['title','status','owner','deadline'],fields:['title','status','owner','deadline','notes']},
 tasks:{title:'Action center',subtitle:'Accountable next steps, owners and due dates.',columns:['title','status','owner','deadline'],fields:['title','status','owner','deadline','priority','notes']},
 engineering:{title:'Engineering readiness',subtitle:'Prototype milestones and technical verification coordination.',columns:['title','status','owner','deadline'],fields:['title','status','owner','deadline','notes']},
 procurement:{title:'Procurement',subtitle:'Sourcing and purchasing coordination.',columns:['title','status','owner','deadline'],fields:['title','status','owner','deadline','notes']},
 documents:{title:'Protected document vault',subtitle:'Authenticated team documents stored outside public GitHub Pages.',columns:['title','category','filename','updatedAt'],fields:['title','category','file']}
};
const sectionNames={overview:'Command overview',programs:'Program pipeline',tasks:'Action center',engineering:'Engineering',procurement:'Procurement',documents:'Document vault'};
const states=['Planning','In progress','Submitted','On hold','Complete'];
const priorities=['Normal','High','Critical'];
let auth=null,db=null,storage=null,authApi=null,dbApi=null,storageApi=null;
let currentUser=null,role=null,authEpoch=0,active='overview',lastActivity=Date.now();
const cache=Object.fromEntries(Object.keys(catalogs).map(k=>[k,[]]));
const allowedFileTypes=new Set(['pdf','docx','xlsx','pptx','txt']);
const maxFileBytes=10*1024*1024;
const idleMs=15*60*1000;
let loadingRecords=false;
function show(which){for(const [key,node] of Object.entries(screens))node.hidden=which!==key; $('signout').hidden=which!=='hub';}
function loginMessage(message,error=false){status.textContent=message;if(error)status.dataset.error='';else delete status.dataset.error;}
function element(tag,cls,content){const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=String(content);return n;}
function clearPrivateState(){currentUser=null;role=null;active='overview';for(const key in cache)cache[key]=[];$('workspaceContent').replaceChildren();$('identityEmail').textContent='';}
function verifiedRole(token){const c=token?.claims||{};return c.email_verified===true&&c.rehabwheelMilitary===true&&roles.includes(c.militaryRole)?c.militaryRole:null;}
function canEdit(){return role==='admin'||role==='editor';}
function friendlyError(error){const code=String(error?.code||'');if(code==='auth/too-many-requests')return 'Sign-in is temporarily restricted. Please try again later.';if(code.startsWith('auth/'))return 'Access was not verified. Check your email and password, then try again.';if(code.includes('permission-denied')||code==='storage/unauthorized')return 'This operation is not authorized for your account.';return 'Unable to complete this request securely. Check your connection or contact the administrator.';}
function configIsReady(c){return !!(c&&typeof c==='object'&&typeof c.apiKey==='string'&&c.apiKey.length>3&&typeof c.authDomain==='string'&&typeof c.projectId==='string'&&typeof c.appId==='string'&&typeof c.storageBucket==='string');}
function setUserIdentity(user){$('identityEmail').textContent=user.email||'Authorized account';$('roleChip').textContent=role||'member';}
async function signOutNow(){authEpoch++;clearPrivateState();if(auth&&authApi){try{await authApi.signOut(auth)}catch{} } show('login');$('password').value='';loginMessage('Signed out. Reauthenticate to open the private workspace.');}
async function checkAuthorization(user,epoch){
  try{
   const token=await authApi.getIdTokenResult(user,true);
   if(epoch!==authEpoch)return;
   const authorized=verifiedRole(token);
   if(!authorized){clearPrivateState();show('denied');return;}
   currentUser=user;role=authorized;lastActivity=Date.now();setUserIdentity(user);show('hub');await activate(active);
  }catch(e){if(epoch!==authEpoch)return;clearPrivateState();show('denied');}
}
async function boot(){
 show('login');
 if(!configIsReady(firebaseConfig)){loginMessage('Private access is being provisioned. The login is disabled until the protected authentication service is configured.');loginButton.disabled=true;return;}
 try{
  const v='11.0.2',base='https://www.gstatic.com/firebasejs/'+v+'/';
  const [appMod,authMod,fireMod,storageMod]=await Promise.all([
   import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js'),import(base+'firebase-storage.js')
  ]);
  authApi=authMod;dbApi=fireMod;storageApi=storageMod;
  const app=appMod.initializeApp(firebaseConfig,'rehabwheel-military-hub');
  auth=authMod.getAuth(app);db=fireMod.getFirestore(app);storage=storageMod.getStorage(app);
  await authMod.setPersistence(auth,authMod.inMemoryPersistence);
  authMod.onIdTokenChanged(auth,user=>{const epoch=++authEpoch;if(!user){clearPrivateState();show('login');loginMessage('Secure sign-in available for authorized Rehabwheel team members.');loginButton.disabled=false;return;}loginMessage('Verifying organizational permissions…');checkAuthorization(user,epoch);});
  loginButton.disabled=false;
  loginMessage('Sign in with your verified Rehabwheel account.');
 }catch(e){loginButton.disabled=true;loginMessage('The secure identity service is unavailable. No content can be accessed until it is restored.',true);}
}
$('loginForm').addEventListener('submit',async event=>{
 event.preventDefault();
 if(!auth||!authApi)return;
 const email=$('email').value.trim(),password=$('password').value;
 if(!email||!password||!$('email').checkValidity()){loginMessage('Enter a valid work email and your password.',true);return;}
 loginButton.disabled=true;loginMessage('Verifying credentials and role…');
 try{await authApi.signInWithEmailAndPassword(auth,email,password);$('password').value='';}
 catch(error){loginMessage(friendlyError(error),true);}
 finally{if(screens.login.hidden===false)loginButton.disabled=false;}
});
$('revealPassword').addEventListener('click',()=>{
 const field=$('password'),show=field.type==='password';field.type=show?'text':'password';
 $('revealPassword').textContent=show?'Hide':'Show';$('revealPassword').setAttribute('aria-label',show?'Hide password':'Show password');$('revealPassword').setAttribute('aria-pressed',String(show));
});
$('signout').addEventListener('click',signOutNow);
$('deniedSignout').addEventListener('click',signOutNow);
for(const evt of ['pointerdown','keydown'])document.addEventListener(evt,()=>{if(currentUser)lastActivity=Date.now();},{passive:true});
setInterval(()=>{if(currentUser&&Date.now()-lastActivity>idleMs)signOutNow();},60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&currentUser){const epoch=++authEpoch;checkAuthorization(currentUser,epoch);}});
$('hubNav').addEventListener('click',event=>{const btn=event.target.closest('[data-view]');if(!btn||!currentUser)return;activate(btn.dataset.view);});
function updatedValue(value){if(!value)return '—';if(typeof value==='string')return value;if(typeof value.toDate==='function')return value.toDate().toLocaleDateString();return '—';}
async function readCollection(key){
 if(!currentUser||!role||!catalogs[key])throw Error('unauthorized');
 const userAtRequest=currentUser,epoch=authEpoch;
 const docs=await dbApi.getDocs(dbApi.collection(db,'militaryHub',key,'entries'));
 if(epoch!==authEpoch||userAtRequest!==currentUser)throw Error('session_changed');
 const list=docs.docs.map(doc=>({id:doc.id,...doc.data()}));
 list.sort((a,b)=>{const aa=a.updatedAt?.toMillis?.()||0,bb=b.updatedAt?.toMillis?.()||0;return bb-aa;});
 cache[key]=list;return list;
}
async function activate(key){
 if(!currentUser||!(key==='overview'||catalogs[key]))return;
 active=key;
 for(const b of $('hubNav').querySelectorAll('[data-view]')){if(b.dataset.view===key)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');}
 $('currentView').textContent=sectionNames[key];
 $('workspaceHeading').textContent=key==='overview'?'A clearer view of what moves next.':catalogs[key].title;
 $('workspaceIntro').textContent=key==='overview'?'Live authorized team records, tasks, and documents—nothing is published here.':catalogs[key].subtitle;
 const root=$('workspaceContent');root.replaceChildren(element('p','loading','Loading private records…'));
 try{
  if(key==='overview'){await overview(root);}
  else{const items=await readCollection(key);if(active===key)renderSection(root,key,items);}
 }catch(e){if(active===key)root.replaceChildren(element('p','loading',friendlyError(e)));if(String(e?.code||'').includes('permission-denied')){clearPrivateState();show('denied');}}
}
function appendHeader(root,title,subtitle,controls=[]){
 const box=element('div','panel-header');const left=element('div');
 left.append(element('h2',null,title),element('p',null,subtitle));const actions=element('div','panel-actions');controls.forEach(n=>actions.append(n));box.append(left,actions);root.append(box);
 return box;
}
function metric(label,value,description){const el=element('article','metric');el.append(element('small',null,label),element('strong',null,value),element('span',null,description));return el;}
async function overview(root){
 const epoch=authEpoch;
 const keys=Object.keys(catalogs);
 const groups=await Promise.all(keys.map(k=>readCollection(k)));
 if(epoch!==authEpoch||active!=='overview')return;
 root.replaceChildren();
 const grid=element('div','metric-grid');
 const openTasks=cache.tasks.filter(x=>x.status!=='Complete').length;
 const activePrograms=cache.programs.filter(x=>x.status!=='Complete').length;
 grid.append(metric('Program records',cache.programs.length,'Authorized pipeline entries'),metric('Open tasks',openTasks,'Not marked complete'),metric('Engineering',cache.engineering.length,'Technical work items'),metric('Vault documents',cache.documents.length,'Protected file references'));
 root.append(grid);
 const panel=element('section','data-panel');
 appendHeader(panel,'Your operational picture','Counts reflect authorized server records. No sample contracts, scores or awards are fabricated.');
 const wrapper=element('div','features-summary');
 const recent=[...cache.tasks,...cache.programs,...cache.engineering,...cache.procurement].sort((a,b)=>(b.updatedAt?.toMillis?.()||0)-(a.updatedAt?.toMillis?.()||0)).slice(0,6);
 if(!recent.length){wrapper.append(empty('Workspace ready','When an authorized editor adds work items, recent activity will appear here.'));}
 else{const table=makeTable(['Record','Status','Owner','Updated'],recent.map(r=>[r.title||'Untitled',r.status||'—',r.owner||'—',updatedValue(r.updatedAt)]));wrapper.append(table);}
 panel.append(wrapper);root.append(panel);
}
function empty(title,message){const block=element('div','empty-state');block.append(element('div','empty-symbol','↗'),element('h3',null,title),element('p',null,message));return block;}
function button(text,cls,callback){const b=element('button','panel-button '+(cls||''),text);b.type='button';b.addEventListener('click',callback);return b;}
function makeTable(headings,rows){
 const scroll=element('div','table-scroll'),table=element('table'),thead=element('thead'),tr=element('tr');
 for(const h of headings)tr.append(element('th',null,h));
 thead.append(tr);table.append(thead);const tbody=element('tbody');
 for(const row of rows){const tr=element('tr');for(const value of row)tr.append(element('td',null,value));tbody.append(tr);}
 table.append(tbody);scroll.append(table);return scroll;
}
function statusClass(status){return status==='On hold'?'blocked':status==='In progress'||status==='Submitted'?'warn':'';}
function renderSection(root,key,items){
 root.replaceChildren();
 const mod=catalogs[key],panel=element('section','data-panel');
 const search=element('input','panel-search');search.type='search';search.placeholder='Search this module';search.setAttribute('aria-label','Search '+mod.title);search.autocomplete='off';
 const controls=[search,button('Refresh','',()=>activate(key))];
 if(canEdit())controls.push(button(key==='documents'?'Upload file':'New record','primary',()=>editor.hidden=!editor.hidden));
 appendHeader(panel,mod.title,mod.subtitle,controls);
 const body=element('div'),editor=element('div','form-layer');editor.hidden=true;
 const draw=(filter='')=>{
  body.replaceChildren();
  const list=items.filter(x=>!filter||[x.title,x.status,x.owner,x.filename,x.notes,x.category].some(v=>String(v||'').toLowerCase().includes(filter)));
  if(!list.length){body.append(empty(items.length?'No matching records':'No records yet',items.length?'Try another search term.':'No items have been added to this protected workspace.'));return;}
  const sc=element('div','table-scroll'),table=element('table'),thead=element('thead'),hdr=element('tr');
  const headings=key==='documents'?['Document','Category','File','Updated','Action']:['Work item','Status','Owner','Target date','Action'];
  headings.forEach(h=>hdr.append(element('th',null,h)));thead.append(hdr);table.append(thead);
  const tbody=element('tbody');
  for(const item of list){
   const tr=element('tr'),cell=(text,cls)=>{const td=element('td',cls,text);tr.append(td);return td;};
   cell(item.title||'Untitled','row-title');
   if(key==='documents'){cell(item.category||'—');cell(item.filename||'—');}
   else{const td=cell('');const badge=element('span','status-pill '+statusClass(item.status),item.status||'—');td.append(badge);cell(item.owner||'—');cell(item.deadline||'—');}
   if(key==='documents')cell(updatedValue(item.updatedAt));
   const actions=cell('');
   if(key==='documents'){const get=button('Open securely','',()=>downloadDocument(item));get.classList.add('table-action');actions.append(get);}
   else if(canEdit()){const edit=button('Edit','',()=>{editor.hidden=false;buildEditor(editor,key,item);editor.scrollIntoView({block:'nearest',behavior:'smooth'});});edit.classList.add('table-action');actions.append(edit);}
   else actions.textContent='View only';
   tbody.append(tr);
  }
  table.append(tbody);sc.append(table);body.append(sc);
 };
 draw();
 search.addEventListener('input',()=>draw(search.value.trim().toLowerCase()));
 if(canEdit())buildEditor(editor,key);
 panel.append(body,editor);root.append(panel);
 if(key==='documents'){root.append(element('p','vault-warning','Security note: this vault is designed for company-confidential documents after security review. Do not upload classified information, CUI, export-controlled technical data or medical records.'));}
}
function makeField(name,type='text',value=''){
 const label=element('label',null,name==='notes'?'Notes':name==='deadline'?'Target date':name[0].toUpperCase()+name.slice(1));
 let input;
 if(name==='notes'){input=element('textarea');input.maxLength=2000;}
 else if(name==='status'||name==='priority'){input=element('select');const vals=name==='status'?states:priorities;for(const v of vals){const opt=element('option',null,v);opt.value=v;input.append(opt);}}
 else{input=element('input');input.type=type;input.maxLength=name==='title'?120:100;}
 input.name=name;input.value=value||'';if(name==='title')input.required=true;
 label.append(input);if(name==='notes')label.classList.add('full');
 return label;
}
function buildEditor(container,key,item=null){
 container.replaceChildren();const config=catalogs[key];
 if(key==='documents'){uploadForm(container);return;}
 const form=element('form','editor-form');form.autocomplete='off';
 const fields=config.fields;
 for(const f of fields)form.append(makeField(f,f==='deadline'?'date':'text',item?.[f]||''));
 const buttons=element('div','form-buttons full');
 const save=element('button','panel-button primary',item?'Save changes':'Create record');save.type='submit';
 const cancel=button('Cancel','',()=>{container.hidden=true;});
 const info=element('p','inline-status');info.setAttribute('role','status');info.setAttribute('aria-live','polite');
 buttons.append(save,cancel,info);form.append(buttons);
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!currentUser||!canEdit())return;
  const data={};for(const f of fields){const input=form.elements.namedItem(f);data[f]=String(input?.value||'').trim();}
  data.title=data.title.slice(0,120);if(!data.title){info.dataset.error='';info.textContent='A title is required.';return;}
  for(const f of ['status','owner','deadline','priority','notes'])if(!(f in data))data[f]=f==='status'?'Planning':f==='priority'?'Normal':'';
  if(data.notes.length>2000){info.textContent='Notes exceed the maximum length.';return;}
  save.disabled=true;info.textContent='Saving to protected records…';delete info.dataset.error;
  try{
   const ref=item?dbApi.doc(db,'militaryHub',key,'entries',item.id):dbApi.doc(dbApi.collection(db,'militaryHub',key,'entries'));
   const payload={title:data.title,status:data.status,owner:data.owner,deadline:data.deadline,priority:data.priority,notes:data.notes,updatedAt:dbApi.serverTimestamp()};
   if(item){await dbApi.updateDoc(ref,payload);}else{await dbApi.setDoc(ref,{...payload,createdBy:currentUser.uid});}
   info.textContent='Saved securely.';await activate(key);
  }catch(err){info.dataset.error='';info.textContent=friendlyError(err);}
  finally{save.disabled=false;}
 });
 container.append(form);
}
function uploadForm(container){
 const form=element('form','editor-form');form.autocomplete='off';
 form.append(makeField('title'));
 const category=element('label',null,'Category');const select=element('select');select.name='category';
 for(const name of ['Proposal','Technical','Manufacturing','Procurement','Other']){const o=element('option',null,name);o.value=name;select.append(o);}category.append(select);form.append(category);
 const label=element('label','full','File (PDF, DOCX, XLSX, PPTX or TXT · max 10 MB)');
 const file=element('input','file-input');file.type='file';file.accept='.pdf,.docx,.xlsx,.pptx,.txt';file.required=true;label.append(file);form.append(label);
 const actions=element('div','form-buttons full');
 const submit=element('button','panel-button primary','Upload to private vault');submit.type='submit';
 const cancel=button('Cancel','',()=>container.hidden=true);
 const info=element('p','inline-status');info.setAttribute('role','status');actions.append(submit,cancel,info);form.append(actions);
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!currentUser||!canEdit())return;
  const f=file.files?.[0],title=String(form.elements.namedItem('title')?.value||'').trim();
  if(!f||!title)return;
  const ext=f.name.split('.').pop().toLowerCase();
  if(!allowedFileTypes.has(ext)||f.size>maxFileBytes||f.size===0){info.dataset.error='';info.textContent='Choose an approved file type between 1 byte and 10 MB.';return;}
  const map={pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',txt:'text/plain'};
  const contentType=map[ext],fileId=crypto.randomUUID(),storagePath='military/'+currentUser.uid+'/'+fileId;
  submit.disabled=true;info.textContent='Uploading through authorized storage…';delete info.dataset.error;
  try{
   await storageApi.uploadBytes(storageApi.ref(storage,storagePath),f,{contentType,customMetadata:{origin:'rehabwheel-military-hub'}});
   await dbApi.addDoc(dbApi.collection(db,'militaryHub','documents','entries'),{title:title.slice(0,120),category:select.value,filename:f.name.slice(0,180),contentType,bytes:f.size,storagePath,updatedAt:dbApi.serverTimestamp(),createdBy:currentUser.uid});
   info.textContent='Uploaded securely.';await activate('documents');
  }catch(err){info.dataset.error='';info.textContent=friendlyError(err);}
  finally{submit.disabled=false;}
 });
 container.append(form);
}
async function downloadDocument(item){
 if(!currentUser||!role||!item.storagePath)return;
 // Avoid Firebase Storage getDownloadURL: tokenized links can be shared publicly.
 // getBlob uses the live authenticated session and Storage Security Rules.
 const expected='military/';
 if(!String(item.storagePath).startsWith(expected))return;
 try{
  const blob=await storageApi.getBlob(storageApi.ref(storage,item.storagePath),maxFileBytes);
  const url=URL.createObjectURL(blob),anchor=document.createElement('a');
  anchor.href=url;anchor.download=String(item.filename||'rehabwheel-document').replace(/[\\/]/g,'_');anchor.style.display='none';
  document.body.append(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
 }catch(err){const root=$('workspaceContent');const notice=element('p','inline-status',friendlyError(err));notice.dataset.error='';root.prepend(notice);}
}
boot();
