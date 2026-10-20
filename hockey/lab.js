/* LegMaker Hockey Performance Lab: invitation-only front end.
   SECURITY: GitHub Pages serves public static files. Do not place confidential
   data in this folder. Protect the route at the edge and ALL backend resources
   with server-enforced authorization before storing sensitive information. */
const $ = (selector) => document.querySelector(selector);
const gate = $('#gate'), lab = $('#lab'), form = $('#login-form');
const status = $('#login-status'), emailInput = $('#email'), passwordInput = $('#password');
let auth = null;
let firebaseReady = false;
let authBusy = false;

$('#year').textContent = String(new Date().getFullYear());

function message(text, ok = false) {
  status.textContent = text;
  status.classList.toggle('ok', ok);
}
function showGate() {
  lab.hidden = true;
  gate.hidden = false;
  $('#user-badge').textContent = 'AUTHORIZED SESSION';
  $('#access-email').textContent = 'Authorized account';
}
function showLab(user) {
  emailInput.value = '';
  passwordInput.value = '';
  message('');
  $('#access-email').textContent = user.email || 'Authorized account';
  $('#user-badge').textContent = 'LAB ACCESS VERIFIED';
  gate.hidden = true;
  lab.hidden = false;
  showView('overview');
}
function showView(name) {
  const available = ['overview', 'protocols', 'telemetry', 'research', 'access'];
  if (!available.includes(name) || lab.hidden) return;
  document.querySelectorAll('.view').forEach((view) => {
    const selected = view.id === 'view-' + name;
    view.classList.toggle('active', selected);
    view.hidden = !selected;
  });
  document.querySelectorAll('.side-link').forEach((button) => {
    const selected = button.dataset.view === name;
    button.classList.toggle('active', selected);
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
document.querySelectorAll('[data-view], [data-go]').forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view || button.dataset.go));
});

$('#show-password').addEventListener('click', () => {
  const revealed = passwordInput.type === 'password';
  passwordInput.type = revealed ? 'text' : 'password';
  $('#show-password').textContent = revealed ? 'HIDE' : 'SHOW';
  $('#show-password').setAttribute('aria-label', revealed ? 'Hide password' : 'Show password');
});

const protocol = $('#protocol-form');
const fields = {
  name: $('#protocol-name'), mode: $('#protocol-mode'), goal: $('#protocol-goal'),
  rpm: $('#protocol-rpm'), resistance: $('#protocol-resistance'),
  duration: $('#protocol-duration'), position: $('#protocol-position')
};
function updateProtocol() {
  if (!protocol.checkValidity()) {
    protocol.reportValidity();
    return false;
  }
  const rpm = Number(fields.rpm.value);
  const minutes = Number(fields.duration.value);
  const resistance = Number(fields.resistance.value);
  if (!Number.isInteger(rpm) || !Number.isInteger(minutes) || !Number.isInteger(resistance) ||
      rpm < 10 || rpm > 60 || minutes < 5 || minutes > 60 ||
      resistance < 1 || resistance > 15) {
    $('#protocol-status').textContent = 'Choose valid whole-number values inside the specified ranges.';
    return false;
  }
  $('#preview-name').textContent = fields.name.value.trim() || 'Untitled draft';
  $('#preview-mode').textContent = fields.mode.value;
  $('#preview-rpm').textContent = String(rpm);
  $('#preview-duration').textContent = minutes + ' min';
  $('#preview-resistance').textContent = resistance + ' / 15';
  $('#preview-revs').textContent = (rpm * minutes).toLocaleString('en-US');
  $('#protocol-status').textContent = 'Draft preview updated locally. Nothing was saved or sent.';
  return true;
}
protocol.addEventListener('submit', (event) => {
  event.preventDefault();
  updateProtocol();
});
$('#print-protocol').addEventListener('click', () => {
  if (updateProtocol()) window.print();
});

async function requireAuthorization(user) {
  const token = await user.getIdTokenResult(true);
  // Must also be checked by server / database rules; client claims alone
  // never confer data permissions.
  if (user.emailVerified !== true || token.claims.hockeyLabAccess !== true) {
    await auth.signOut();
    showGate();
    message('This account has not been approved for this private lab. Contact the lab administrator.');
    return;
  }
  showLab(user);
}
async function initAuth() {
  const config = window.REHABWHEEL_HOCKEY_AUTH;
  if (!config || !config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    $('#login-button').disabled = true;
    $('#reset-password').disabled = true;
    message('Private account access is being configured. Request an invitation from the lab administrator.');
    return;
  }
  try {
    const [{ initializeApp }, firebaseAuth] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')
    ]);
    const app = initializeApp(config, 'rehabwheel-hockey-lab');
    auth = firebaseAuth.getAuth(app);
    await firebaseAuth.setPersistence(auth, firebaseAuth.inMemoryPersistence);
    firebaseReady = true;
    $('#login-button').disabled = false;
    $('#reset-password').disabled = false;
    firebaseAuth.onAuthStateChanged(auth, async (user) => {
      if (!user) { showGate(); return; }
      try {
        await requireAuthorization(user);
      } catch (error) {
        showGate();
        message('Access verification failed. Please try again.');
        try { await auth.signOut(); } catch (_) { /* no data access granted */ }
      }
    }, () => {
      showGate();
      message('The authentication service is temporarily unavailable.');
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!firebaseReady || authBusy || !form.reportValidity()) return;
      authBusy = true;
      $('#login-button').disabled = true;
      message('Checking your credentials and lab permissions…', true);
      try {
        await firebaseAuth.signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
      } catch (error) {
        message(error && error.code === 'auth/too-many-requests'
          ? 'Too many attempts. Try again later or contact the administrator.'
          : 'Unable to sign in. Check your credentials and approved access.');
      } finally {
        authBusy = false;
        $('#login-button').disabled = false;
      }
    });
    $('#reset-password').addEventListener('click', async () => {
      const email = emailInput.value.trim();
      if (!email || !emailInput.checkValidity()) {
        message('Enter your assigned work email above before requesting a reset.');
        emailInput.focus();
        return;
      }
      try {
        await firebaseAuth.sendPasswordResetEmail(auth, email);
        message('If an account exists, a password reset email will be sent.', true);
      } catch (_) {
        message('If an account exists, a password reset email will be sent.', true);
      }
    });
  } catch (_) {
    $('#login-button').disabled = true;
    message('Secure authentication could not load. Please try again later.');
  }
}
async function signOut() {
  if (!auth) { showGate(); return; }
  try { await auth.signOut(); }
  finally { showGate(); }
}
$('#sign-out').addEventListener('click', signOut);
$('#sign-out-secondary').addEventListener('click', signOut);
$('#login-button').disabled = true;
$('#reset-password').disabled = true;
initAuth();
