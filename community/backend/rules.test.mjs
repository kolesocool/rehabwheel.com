import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
const env=await initializeTestEnvironment({projectId:"demo-rehabwheel-community",firestore:{host:"127.0.0.1",port:8080,rules:readFileSync(new URL("./firestore.rules",import.meta.url),"utf8")}});
const valid=(uid="alice")=>({ownerId:uid,sport:"Handcycling",title:"Personal session",durationMin:25,createdAt:new Date(),visibility:"private"});
let checks=0;
async function test(label,fn){await fn();checks++;console.log("PASS",label)}
try {
 const alice=env.authenticatedContext("alice").firestore();
 const bob=env.authenticatedContext("bob").firestore();
 const guest=env.unauthenticatedContext().firestore();
 const aliceDoc=alice.doc("users/alice/activities/session1");
 const bobCopy=bob.doc("users/alice/activities/session1");
 await test("Owner may create private activity",async()=>assertSucceeds(aliceDoc.set(valid())));
 await test("Owner may read private activity",async()=>assertSucceeds(aliceDoc.get()));
 await test("Other user cannot read private activity",async()=>assertFails(bobCopy.get()));
 await test("Guest cannot read private activity",async()=>assertFails(guest.doc("users/alice/activities/session1").get()));
 await test("Other user cannot write in owner's path",async()=>assertFails(bob.doc("users/alice/activities/intrusion").set(valid("alice"))));
 await test("Owner cannot publish private activity directly",async()=>assertFails(alice.doc("users/alice/activities/public").set({...valid(),visibility:"public"})));
 await test("Owner cannot add unrecognized health fields",async()=>assertFails(alice.doc("users/alice/activities/extra").set({...valid(),diagnosis:"sensitive"})));
 await test("Owner cannot create in another user's path",async()=>assertFails(alice.doc("users/bob/activities/forged").set(valid("alice"))));
 await test("Owner may update sport and minutes",async()=>assertSucceeds(aliceDoc.update({sport:"Wheelchair rolling",durationMin:30})));
 await test("Owner cannot change owner ID",async()=>assertFails(aliceDoc.update({ownerId:"bob"})));
 await test("Guest cannot create profiles",async()=>assertFails(guest.doc("profiles/public").set({displayName:"Anon",favoriteSports:[],visibility:"private",updatedAt:new Date()})));
 await test("Feed writes denied until moderation",async()=>assertFails(alice.doc("feed/post1").set({text:"hello"})));
 await test("Clinical writes denied",async()=>assertFails(alice.doc("clinical/record1").set({status:"test"})));
 await test("Only owner may delete private activity",async()=>{await assertFails(bobCopy.delete());await assertSucceeds(aliceDoc.delete())});

 // Restricted performance-lab memberships are provisioned with trusted Admin SDK only.
 await env.withSecurityRulesDisabled(async (context)=>{
   const admin=context.firestore();
   await admin.doc("performanceLabs/mma/members/coach").set({role:"coach",active:true});
   await admin.doc("performanceLabs/mma/members/inactive").set({role:"analyst",active:false});
   await admin.doc("performanceLabs/mma/members/unverified").set({role:"coach",active:true});
   await admin.doc("performanceLabs/mma/members/athlete").set({role:"athlete",active:true});
   await admin.doc("performanceLabs/mma/sessions/round1").set({performedAt:new Date(),sessionLabel:"Training",durationMin:20,rpe:5,rounds:3});
   await admin.doc("performanceLabs/basketball/sessions/game1").set({performedAt:new Date(),sessionLabel:"Training",durationMin:30,rpe:4,rounds:4});
 });
 const coach=env.authenticatedContext("coach",{email_verified:true}).firestore();
 const inactive=env.authenticatedContext("inactive",{email_verified:true}).firestore();
 const unverified=env.authenticatedContext("unverified",{email_verified:false}).firestore();
 const athlete=env.authenticatedContext("athlete",{email_verified:true}).firestore();
 await test("Verified coach can read own MMA membership",async()=>assertSucceeds(coach.doc("performanceLabs/mma/members/coach").get()));
 await test("Coach cannot list MMA members",async()=>assertFails(coach.collection("performanceLabs/mma/members").get()));
 await test("Coach cannot read another membership",async()=>assertFails(coach.doc("performanceLabs/mma/members/inactive").get()));
 await test("Member cannot grant themselves another lab",async()=>assertFails(coach.doc("performanceLabs/basketball/members/coach").set({role:"admin",active:true})));
 await test("Verified invited coach can read MMA session",async()=>assertSucceeds(coach.doc("performanceLabs/mma/sessions/round1").get()));
 await test("Verified invited coach can list MMA sessions",async()=>assertSucceeds(coach.collection("performanceLabs/mma/sessions").get()));
 await test("MMA coach cannot read Basketball session",async()=>assertFails(coach.doc("performanceLabs/basketball/sessions/game1").get()));
 await test("Guest cannot read MMA sessions",async()=>assertFails(guest.doc("performanceLabs/mma/sessions/round1").get()));
 await test("Inactive invitation denied",async()=>assertFails(inactive.doc("performanceLabs/mma/sessions/round1").get()));
 await test("Unverified member denied",async()=>assertFails(unverified.doc("performanceLabs/mma/sessions/round1").get()));
 await test("Nonstaff athlete role denied",async()=>assertFails(athlete.doc("performanceLabs/mma/sessions/round1").get()));
 await test("Client cannot alter sessions",async()=>assertFails(coach.doc("performanceLabs/mma/sessions/round1").update({durationMin:300})));
 await test("Client cannot create sessions",async()=>assertFails(coach.doc("performanceLabs/mma/sessions/forged").set({performedAt:new Date()})));
 await test("Client cannot create protocols",async()=>assertFails(coach.doc("performanceLabs/mma/protocols/test").set({title:"Forged"})));
 assert.equal(checks,28);console.log("\n"+checks+" Firestore privacy rules tests passed.");
} finally {await env.cleanup()}
