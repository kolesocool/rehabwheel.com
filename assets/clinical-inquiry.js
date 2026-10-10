/* Rehabwheel public inquiry: no PHI collection, no clinical data processing. */
(()=>{'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const select=document.getElementById('inquiryType'),form=document.getElementById('rwClinicalInquiryForm');
 if(!select||!form)return;
 const params=new URLSearchParams(location.search);
 const mapping={demo:'LegMaker Demo Request',clinical:'Clinical Evaluation',deployment:'Deployment Planning',customer:'Customer Support',question:'General Question',funding:'Funding Resources Inquiry',research:'Research Collaboration'};
 const requested=mapping[params.get('inquiry')];if(requested)select.value=requested;
 const descriptions={
 'LegMaker Demo Request':['Product demonstration','Tell us about your organization and the LegMaker prototype features you would like to discuss.'],
 'Clinical Evaluation':['Clinical evaluation inquiry','Describe your clinical or research setting and evaluation goals without including patient information.'],
 'Deployment Planning':['Pilot and deployment planning','Share your organization type, approximate site requirements and intended pilot scope. Availability is not guaranteed.'],
 'Customer Support':['Customer inquiry','Tell us about a general product or prior inquiry. Do not include patient data, credentials or payment details.'],
 'Research Collaboration':['Research collaboration','Share your research institution, broad study interests and collaboration questions.'],
 'Funding Resources Inquiry':['Funding resources','Ask about general funding and purchasing resources without submitting financial account details.'],
 'General Question':['General inquiry','Ask a question about Rehabwheel or LegMaker without including sensitive personal information.'],
 'Strategic Partnership':['Strategic partnership','Describe the organization and proposed collaboration.'],
 'Investor Relations':['Investor relations','Share your organization and the subject of your business inquiry.']
 };
 const title=document.getElementById('rwPathwayTitle'),description=document.getElementById('rwPathwayDescription'),links=[...document.querySelectorAll('.rw-clinical-paths a')];
 const update=()=>{const [t,d]=descriptions[select.value]||descriptions['General Question'];if(title)title.textContent=t;if(description)description.textContent=d;for(const link of links){const code=new URL(link.href).searchParams.get('inquiry');const active=mapping[code]===select.value;link.classList.toggle('is-selected',active);if(active)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');}};
 select.addEventListener('change',update);update();
 if(params.get('sent')==='1'){const status=document.getElementById('formStatus');if(status){status.textContent='You returned from the external form service. Please check its confirmation; this website cannot verify delivery.';status.classList.add('success');}}
 const message=form.querySelector('textarea[name="Message"]');
 if(message){message.addEventListener('input',()=>{const suspicious=/\b(?:date of birth|dob|social security|ssn|medical record number|mrn|patient name|diagnosed with)\b/i.test(message.value);message.setCustomValidity(suspicious?'Please remove patient-identifiable or medical-record information before submitting.':'');});}
 form.addEventListener('submit',e=>{if(message){message.dispatchEvent(new Event('input'));if(!message.checkValidity()){e.preventDefault();message.reportValidity();return;}}});
});
})();