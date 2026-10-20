/**
 * Provision or revoke existing, email-verified Firebase Auth accounts.
 * Requires ADMINISTRATOR credentials via GOOGLE_APPLICATION_CREDENTIALS,
 * a dedicated military project and a user created outside the public site.
 * Usage: node provision-user.mjs user@company.com viewer|editor|admin|revoke
 */
import admin from 'firebase-admin';
const [email,role]=process.argv.slice(2);
const roles=new Set(['viewer','editor','admin','revoke']);
if(!email||!email.includes('@')||!roles.has(role)){
 console.error('Usage: node provision-user.mjs <existing verified email> <viewer|editor|admin|revoke>');
 process.exit(2);
}
if(!process.env.GOOGLE_CLOUD_PROJECT&&!process.env.GCLOUD_PROJECT){
 console.error('Set GOOGLE_CLOUD_PROJECT to the DEDICATED Rehabwheel Military Firebase project ID.');
 process.exit(2);
}
if(!process.env.GOOGLE_APPLICATION_CREDENTIALS){
 console.error('Use a protected server-side GOOGLE_APPLICATION_CREDENTIALS path. Never commit the key.');
 process.exit(2);
}
admin.initializeApp({credential:admin.credential.applicationDefault(),projectId:process.env.GOOGLE_CLOUD_PROJECT||process.env.GCLOUD_PROJECT});
const auth=admin.auth();
try{
 const user=await auth.getUserByEmail(email);
 if(role!=='revoke'&&!user.emailVerified)throw Error('The target account email must be verified before access is granted.');
 const claims={...(user.customClaims||{})};
 if(role==='revoke'){delete claims.rehabwheelMilitary;delete claims.militaryRole;}
 else{claims.rehabwheelMilitary=true;claims.militaryRole=role;}
 await auth.setCustomUserClaims(user.uid,claims);
 await auth.revokeRefreshTokens(user.uid);
 console.log(role==='revoke'?'Access revoked. Existing ID tokens may remain valid until expiration.':'Role granted. User must sign in again for claims to refresh.');
}catch(err){console.error('Account provisioning failed:',err.message);process.exitCode=1;}
