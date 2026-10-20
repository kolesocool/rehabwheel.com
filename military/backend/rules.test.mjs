// Firebase Emulator Suite role-based security tests. DEMO project only.
// Never run against production resources or a real Rehabwheel project.
import {readFileSync} from 'node:fs';
import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,updateDoc,deleteDoc,serverTimestamp} from 'firebase/firestore';
import {ref,uploadBytes,getBytes,getMetadata,deleteObject} from 'firebase/storage';
const projectId='demo-rehabwheel-military';
const env=await initializeTestEnvironment({
 projectId,
 firestore:{host:'127.0.0.1',port:8087,rules:readFileSync(new URL('./firestore.rules',import.meta.url),'utf8')},
 storage:{host:'127.0.0.1',port:9199,rules:readFileSync(new URL('./storage.rules',import.meta.url),'utf8')}
});
const member=(uid,role='viewer')=>env.authenticatedContext(uid,{email_verified:true,rehabwheelMilitary:true,militaryRole:role});
const guest=env.unauthenticatedContext(),outsider=env.authenticatedContext('outsider',{email_verified:true}),unverified=env.authenticatedContext('pending',{email_verified:false,rehabwheelMilitary:true,militaryRole:'admin'});
const alice=member('alice','editor'),viewer=member('viewer','viewer'),admin=member('admin','admin');
const good=uid=>({title:'Sample internal work item',status:'Planning',owner:'',deadline:'',priority:'Normal',notes:'Fixture only, no confidential data',createdBy:uid,updatedAt:serverTimestamp()});
const p='militaryHub/programs/entries/fixture1';
const af=alice.firestore(),vf=viewer.firestore(),gf=guest.firestore(),nf=outsider.firestore(),uf=unverified.firestore();
let passes=0;
async function check(name,operation){await operation();passes++;console.log('PASS',name);}
try{
 await check('Anonymous user cannot read protected records',()=>assertFails(getDoc(doc(gf,p))));
 await check('Signed-in nonmember cannot read protected records',()=>assertFails(getDoc(doc(nf,p))));
 await check('Unverified admin claim cannot read protected records',()=>assertFails(getDoc(doc(uf,p))));
 await check('Editor creates valid protected record',()=>assertSucceeds(setDoc(doc(af,p),good('alice'))));
 await check('Viewer can read authorized program',()=>assertSucceeds(getDoc(doc(vf,p))));
 await check('Viewer cannot create records',()=>assertFails(setDoc(doc(vf,'militaryHub/tasks/entries/bad'),good('viewer'))));
 await check('Editor cannot grant themselves role by writing claims document',()=>assertFails(setDoc(doc(af,'militaryHub/members/entries/alice'),{role:'admin'})));
 await check('Unknown collection denied',()=>assertFails(setDoc(doc(af,'anything/secret'),{secret:'no'})));
 await check('Extra health field rejected',()=>assertFails(setDoc(doc(af,'militaryHub/tasks/entries/health'),{...good('alice'),diagnosis:'not-allowed'})));
 await check('Oversized notes rejected',()=>assertFails(setDoc(doc(af,'militaryHub/tasks/entries/oversized'),{...good('alice'),notes:'x'.repeat(2001)})));
 await check('Editor can update valid work item',()=>assertSucceeds(updateDoc(doc(af,p),{status:'In progress',updatedAt:serverTimestamp()})));
 await check('Editor cannot overwrite createdBy',()=>assertFails(updateDoc(doc(af,p),{createdBy:'admin',updatedAt:serverTimestamp()})));
 await check('Editor cannot delete other records',()=>assertFails(deleteDoc(doc(af,p))));
 await check('Admin can delete record',()=>assertSucceeds(deleteDoc(doc(admin.firestore(),p))));
 const bucket='gs://'+projectId+'.firebasestorage.app';
 const file='military/alice/testfile',blob=new Uint8Array([37,80,68,70,45,49,46,55,10,37,37,69,79,70]);
 const storageCtx=c=>c.storage(bucket);
 await check('Anonymous storage read is denied',()=>assertFails(getBytes(ref(storageCtx(guest),file))));
 await check('Signed-in nonmember storage read is denied',()=>assertFails(getBytes(ref(storageCtx(outsider),file))));
 await check('Editor can upload approved PDF to own path',()=>assertSucceeds(uploadBytes(ref(storageCtx(alice),file),blob,{contentType:'application/pdf'})));
 await check('Authorized viewer can read authenticated PDF',()=>assertSucceeds(getBytes(ref(storageCtx(viewer),file))));
 await check('Authorized editor cannot overwrite uploaded bytes',()=>assertFails(uploadBytes(ref(storageCtx(alice),file),blob,{contentType:'application/pdf'})));
 await check('Viewer cannot upload new file',()=>assertFails(uploadBytes(ref(storageCtx(viewer),'military/viewer/denied'),blob,{contentType:'application/pdf'})));
 await check('Admin can remove stored file',()=>assertSucceeds(deleteObject(ref(storageCtx(admin),file))));
 console.log('\n'+passes+' Firebase Firestore/Storage rules tests passed.');
}catch(e){console.error('Rule test failed:',e);process.exitCode=1;}
finally{await env.cleanup();}
