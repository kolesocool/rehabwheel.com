// Rehabwheel Performance Labs — invited-user, read-only client.
// No shared passwords, client-side role grants, private data in source, or localStorage athlete data.
const LABS = Object.freeze({
  mma: {
    eyebrow: '01 — MIXED MARTIAL ARTS PERFORMANCE',
    name: 'MMA',
    label: 'MMA / PERFORMANCE LAB',
    description: 'The MMA Performance Lab explores round-based workload, lower-limb cadence, resistance and recovery observations under coach supervision.',
    title: 'THE ROUND\\nENGINE.',
    feature: 'Explore repeat-effort workload and recovery between MMA rounds without implying punch-force or fight-outcome prediction.',
    protocols: [
      ['01 / CONDITIONING', 'Round-based workload', 'Explore coached work/recovery intervals alongside session duration and reported exertion.'],
      ['02 / MOVEMENT', 'Lower-limb cadence', 'Assess device-reported RPM and resistance only when instrument readings are calibrated and validated.'],
      ['03 / REVIEW', 'Between-round recovery', 'Record explicitly sourced observations; do not infer physiologic recovery from unvalidated signals.']
    ]
  },
  basketball: {
    eyebrow: '02 — BASKETBALL PERFORMANCE',
    name: 'Basketball',
    label: 'BASKETBALL / PERFORMANCE LAB',
    description: 'The Basketball Performance Lab explores repeat-effort conditioning, seated lower-limb movement and monitored training sessions.',
    title: 'THE FOURTH\\nQUARTER.',
    feature: 'Explore repeat-effort tolerance, lower-limb movement and pacing observations—not unvalidated jump-height or on-court performance claims.',
    protocols: [
      ['01 / CONDITIONING', 'Repeated effort', 'Compare supervised work/rest observations without extrapolating directly to game performance.'],
      ['02 / MOVEMENT', 'Leg drive / cadence', 'Review investigational lower-limb motion measurements where device calibration supports their use.'],
      ['03 / REVIEW', 'Training load', 'Pair session minutes and coach-reported effort with clearly labeled data provenance.']
    ]
  }
});
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let sport = Object.hasOwn(LABS, params.get('lab')) ? params.get('lab') : 'mma';
let firebase = null, auth = null, db = null, modules = null;
let accessGeneration = 0;
let activeMember = null;

function setStatus(message, isError = false) {
  const el = $('loginStatus');
  el.textContent = message;
  el.dataset.state = isError ? 'error' : 'info';
}
function showGate() {
  $('access').hidden = false;
  $('workspace').hidden = true;
  activeMember = null;
  clearMetrics();
}
function clearMetrics() {
  $('sessionCount').textContent = '—';
  $('minutesTotal').textContent = '—';
  $('latestRpe').textContent = '—';
  $('lastDate').textContent = '—';
  $('sessionsBody').replaceChildren();
  const tr = document.createElement('tr'), td = document.createElement('td');
  td.colSpan = 5; td.textContent = 'No records loaded.'; tr.append(td); $('sessionsBody').append(tr);
}
function selectSport(next) {
  if (!Object.hasOwn(LABS, next)) return;
  sport = next;
  document.documentElement.dataset.sportTheme = next;
  const config = LABS[next];
  document.querySelectorAll('[data-sport]').forEach((button) => {
    const isActive = button.dataset.sport === next;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  $('labKicker').textContent = config.eyebrow;
  $('labDescription').textContent = config.description;
  $('dashboardTitle').textContent = config.label;
  $('featureTitle').textContent = config.title.replace('\\n','\n');
  $('featureTitle').style.whiteSpace = 'pre-line';
  $('featureDescription').textContent = config.feature;
  $('protocolHeading').textContent = config.name.toUpperCase() + ' PERFORMANCE TRACKS';
  $('protocolCards').replaceChildren(...config.protocols.map(([index,title,description]) => {
    const card = document.createElement('article');
    const num = document.createElement('span'), heading = document.createElement('h4'), p = document.createElement('p');
    num.textContent = index; heading.textContent = title; p.textContent = description;
    card.append(num,heading,p); return card;
  }));
  const url = new URL(location.href); url.searchParams.set('lab', next);
  history.replaceState({}, '', url);
  showGate();
  if (auth?.currentUser) void authorizeAndLoad(auth.currentUser);
}
function selectPanel(panel) {
  document.querySelectorAll('[data-panel]').forEach((button) => {
    const active = button.dataset.panel === panel;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    $(`panel-${button.dataset.panel}`).hidden = !active;
  });
}
function readableDate(value) {
  const date = value?.toDate?.() ?? (value instanceof Date ? value : null);
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(date);
}
function safeLabel(value, max = 80) {
  return typeof value === 'string' ? value.slice(0,max) : '—';
}
function renderSessions(snapshot) {
  const docs = snapshot.docs.map((d) => d.data());
  $('sessionCount').textContent = String(docs.length);
  $('minutesTotal').textContent = String(docs.reduce((total,d) => total + (Number.isInteger(d.durationMin) && d.durationMin > 0 && d.durationMin <= 600 ? d.durationMin : 0),0));
  const rated = docs.find(d => typeof d.rpe === 'number' && d.rpe >= 0 && d.rpe <= 10);
  $('latestRpe').textContent = rated ? rated.rpe.toFixed(1).replace(/\\.0$/,'') + '/10' : '—';
  $('lastDate').textContent = docs.length ? readableDate(docs[0].performedAt) : '—';
  const body = $('sessionsBody'); body.replaceChildren();
  if (!docs.length) {
    const tr=document.createElement('tr'),td=document.createElement('td');
    td.colSpan=5;td.textContent='No authorized sessions recorded for this lab yet.';tr.append(td);body.append(tr);return;
  }
  docs.forEach(d => {
    const row=document.createElement('tr');
    const fields=[readableDate(d.performedAt),safeLabel(d.sessionLabel),Number.isInteger(d.durationMin)?String(d.durationMin):'—',typeof d.rpe === 'number' && d.rpe >= 0 && d.rpe <= 10?String(d.rpe):'—',Number.isInteger(d.rounds)&&d.rounds>=0?String(d.rounds):'—'];
    fields.forEach(v=>{const td=document.createElement('td');td.textContent=v;row.append(td)});
    body.append(row);
  });
}
async function authorizeAndLoad(user) {
  const generation=++accessGeneration;
  showGate();
  if (!user.emailVerified) {
    setStatus('Please verify your email address before accessing the lab.',true);
    await modules.signOut(auth);
    return;
  }
  setStatus('Checking your invitation and lab permissions…');
  try {
    const memberRef=modules.doc(db,'performanceLabs',sport,'members',user.uid);
    const member=await modules.getDoc(memberRef);
    if (generation!==accessGeneration || auth.currentUser?.uid!==user.uid) return;
    if (!member.exists() || !['admin','coach','analyst'].includes(member.data().role) || member.data().active !== true) {
      setStatus('Your account does not have an active invitation for this lab. Contact Rehabwheel to request access.',true);
      return;
    }
    activeMember=member.data();
    $('signedInAs').textContent=safeLabel(user.email,254)+' · '+safeLabel(activeMember.role,15);
    $('access').hidden=true;
    $('workspace').hidden=false;
    clearMetrics();
    selectPanel('overview');
    const sessionsRef=modules.collection(db,'performanceLabs',sport,'sessions');
    const q=modules.query(sessionsRef,modules.orderBy('performedAt','desc'),modules.limit(50));
    try {
      const snap=await modules.getDocs(q);
      if (generation===accessGeneration && auth.currentUser?.uid===user.uid && !($('workspace').hidden)) renderSessions(snap);
    } catch {
      if (generation===accessGeneration) $('sessionsBody').querySelector('td').textContent='Sessions could not be loaded. Verify security rules and project access.';
    }
  } catch {
    if (generation===accessGeneration) setStatus('Secure access verification is unavailable. Ask the lab administrator to check Firebase configuration and Firestore rules.',true);
  }
}
async function init() {
  selectSport(sport);
  document.querySelectorAll('[data-sport]').forEach(button => button.addEventListener('click',()=>selectSport(button.dataset.sport)));
  document.querySelectorAll('[data-panel]').forEach(button => {
    button.addEventListener('click',()=>selectPanel(button.dataset.panel));
    button.addEventListener('keydown',(event)=>{
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const tabs=[...document.querySelectorAll('[data-panel]')];
      const index=tabs.indexOf(button),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
      selectPanel(tabs[next].dataset.panel);tabs[next].focus();
    });
  });
  const loginButton=$('loginButton'); loginButton.disabled=true;
  try {
    // Firebase web app configuration is public, but is deployment-specific and
    // deliberately NOT included until the owner provisions a real project.
    const configModule=await import('./firebase-config.js');
    const cfg=configModule.firebaseConfig;
    if (!cfg || !cfg.apiKey || !cfg.projectId || !cfg.authDomain || !cfg.appId || Object.values(cfg).some(v=>typeof v==='string'&&v.startsWith('REPLACE_'))) throw new Error('not configured');
    const [appLib,authLib,storeLib]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
    ]);
    modules={...authLib,...storeLib};
    firebase=appLib.initializeApp(cfg,'rehabwheel-performance-labs');
    auth=authLib.getAuth(firebase);
    db=storeLib.getFirestore(firebase);
    authLib.onAuthStateChanged(auth,(user)=>{
      if (user) void authorizeAndLoad(user);
      else {++accessGeneration;showGate();setStatus('Sign in with your invited, email-verified account.');}
    },()=>setStatus('Authentication is unavailable. Please contact your administrator.',true));
    loginButton.disabled=false;
    $('loginForm').addEventListener('submit',async event=>{
      event.preventDefault();
      const email=$('email').value.trim(), password=$('password').value;
      if (!email || !password) {setStatus('Enter your work email and password.',true);return;}
      loginButton.disabled=true;setStatus('Authenticating…');
      try {await authLib.signInWithEmailAndPassword(auth,email,password);$('password').value='';}
      catch {setStatus('Could not sign in. Check your credentials or contact the lab administrator.',true);}
      finally {loginButton.disabled=false;}
    });
    $('logoutButton').addEventListener('click',async()=>{++accessGeneration;showGate();await authLib.signOut(auth);});
  } catch {
    setStatus('Private sign-in is not activated yet. Rehabwheel must configure Firebase Authentication and member permissions before access can open.',true);
    loginButton.disabled=true;
  }
}
void init();
