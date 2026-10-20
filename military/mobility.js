/* LegMaker Military Mobility concept: non-sensitive, illustrative content.
   This public JavaScript asset is NEVER an authorization boundary.
   Module is rendered only after the Military Hub's verified role gate. */
const scenarios = {
  travel: {
    title: "01 / Room to rehabilitation",
    label: "Coordinated transit + exercise",
    description: "Concept scenario: an authorized care team evaluates whether wheelchair propulsion and prescribed lower-limb movement could operate together during a supervised journey within a clinical facility.",
    focus: "Research question: can the system coordinate propulsion, exercise effort and braking without adding patient or staff risk?",
    active: ["PROPULSION", "PEDAL MOVEMENT", "SUPERVISION"]
  },
  therapy: {
    title: "02 / Exercise first",
    label: "Stationary rehabilitation",
    description: "LegMaker's wheelchair-attached cycling architecture provides the exercise foundation. The mobility module is proposed as an additional, separately controlled function—not a replacement for therapist-directed exercise.",
    focus: "Research question: what mechanical interlocks and control rules should prevent unintended drive motion during stationary sessions?",
    active: ["PEDAL MOVEMENT", "SUPERVISION"]
  },
  handoff: {
    title: "03 / Safe arrival",
    label: "Transition & handoff",
    description: "At the destination, the concept transitions to a fully stopped and secured wheelchair before a clinician evaluates the next therapy step. No autonomous travel or hands-free safety is assumed.",
    focus: "Research question: can staff reliably confirm stopped status, wheel restraint and exercise disengagement?",
    active: ["BRAKE / STOP", "SUPERVISION"]
  }
};
const diagram = `<svg class="mm-sketch" viewBox="0 0 650 420" role="img" aria-labelledby="mmSketchTitle mmSketchDesc">
<title id="mmSketchTitle">Proposed wheelchair with two powered wheels and front LegMaker exercise pedals</title>
<desc id="mmSketchDesc">Side-perspective concept diagram. Two drive wheels support wheelchair movement, while a detachable front module provides lower-limb exercise. Not an engineering drawing or completed product.</desc>
<defs>
<linearGradient id="mmSteel" x1="0" x2="1"><stop offset="0" stop-color="#d1eee3"/><stop offset="1" stop-color="#77aa9e"/></linearGradient>
<linearGradient id="mmGold" x1="0" x2="1"><stop offset="0" stop-color="#f4d5a0"/><stop offset="1" stop-color="#d98c49"/></linearGradient>
</defs>
<path d="M40 320H610" stroke="#71948b" stroke-width="2" stroke-dasharray="8 9"/>
<path d="M160 80L151 212L270 214L325 289M170 210L350 210L433 293" stroke="#b8d8ca" stroke-width="13" stroke-linecap="round" fill="none"/>
<path d="M157 85L263 85L288 153L174 153" fill="#17433f" stroke="#b8d8ca" stroke-width="5" stroke-linejoin="round"/>
<path d="M154 92L135 51M136 51L109 51" stroke="#b8d8ca" stroke-width="9" stroke-linecap="round"/>
<path d="M188 166L286 166L365 268L340 277L257 204L196 203Z" fill="url(#mmSteel)" opacity=".9"/>
<circle cx="234" cy="282" r="83" fill="#0e3235" stroke="#c5e7d6" stroke-width="7"/>
<circle cx="234" cy="282" r="59" fill="none" stroke="#88bbab" stroke-width="3" stroke-dasharray="3 13"/>
<circle cx="234" cy="282" r="24" fill="url(#mmGold)" stroke="#e8c092" stroke-width="4"/>
<path d="M234 221V343M173 282H295M192 240L276 324M276 240L192 324" stroke="#9bcdbb" stroke-width="3"/>
<circle cx="397" cy="300" r="43" fill="#123b3e" stroke="#b5dbc9" stroke-width="6"/>
<circle cx="397" cy="300" r="14" fill="#e3aa73"/>
<path d="M334 275L461 265L500 185" fill="none" stroke="#b2d9cd" stroke-width="9" stroke-linecap="round"/>
<rect x="461" y="168" width="94" height="63" rx="14" fill="#dca06b" stroke="#fff0d5" stroke-width="3"/>
<circle cx="504" cy="200" r="14" fill="#174044"/>
<path d="M504 200L476 178M504 200L526 223" stroke="#174044" stroke-width="8" stroke-linecap="round"/>
<path d="M471 178L451 174M530 227L549 231" stroke="#f6e5ca" stroke-width="10" stroke-linecap="round"/>
<path d="M230 282L160 357M397 300L430 358" stroke="#e5bd8b" stroke-width="2" stroke-dasharray="6 7"/>
<path d="M99 368h176M382 369h132" stroke="#d4e7dd" stroke-width="1"/>
<text x="97" y="390" fill="#e9f7ec" font-size="13" font-family="Arial,sans-serif" font-weight="700">POWERED WHEEL SYSTEM</text>
<text x="385" y="390" fill="#e9f7ec" font-size="13" font-family="Arial,sans-serif" font-weight="700">LEGMAKER MODULE</text>
<path d="M320 85H525" stroke="#edc398" stroke-width="1"/>
<text x="320" y="74" fill="#f7dbb3" font-size="13" font-weight="700" font-family="Arial,sans-serif">CONCEPT / NOT A PROTOTYPE PHOTO</text>
</svg>`;
export function renderMobility(root){
  // Only static, publishable research concept copy belongs in the public repo.
  root.innerHTML = `
  <div class="mm-module">
    <section class="mm-cover" aria-labelledby="mm-title">
      <div class="mm-cover-copy">
        <p class="mm-kicker"><span class="mm-pulse" aria-hidden="true"></span> REHABWHEEL / MILITARY MOBILITY R&amp;D</p>
        <h2 id="mm-title">ONE CHAIR.<br><span>TWO POWERED WHEELS.</span><br>LEGS IN MOTION.</h2>
        <p class="mm-deck">Imagine a recovering service member traveling from a hospital room toward physical therapy. Our proposed detachable drive module would move a compatible wheelchair while the wheelchair-attached LegMaker system supports prescribed lower-limb movement.</p>
        <div class="mm-buttons">
          <a class="mm-primary" href="#mm-scenario">Explore the scenario <span aria-hidden="true">↗</span></a>
          <a class="mm-secondary" href="#mm-validation">View test gates <span aria-hidden="true">↓</span></a>
        </div>
        <p class="mm-subnote">Concept-stage R&amp;D. Simultaneous propulsion and exercise is proposed—not demonstrated safe or clinically effective.</p>
      </div>
      <div class="mm-visual">
        <div class="mm-visual-head"><span>DESIGN STUDY / 01</span><span>ILLUSTRATIVE SCHEMATIC</span></div>
        ${diagram}
        <div class="mm-visual-foot"><span>WHEELCHAIR-FIRST ARCHITECTURE</span><span>LEG EXERCISE + DRIVE SYSTEM</span></div>
      </div>
    </section>

    <div class="mm-quickfacts" aria-label="Concept summary">
      <div><strong>02</strong><span>Proposed powered wheels</span></div>
      <div><strong>01</strong><span>Compatible wheelchair</span></div>
      <div><strong>03</strong><span>Research workstreams</span></div>
      <div><strong>06</strong><span>Safety &amp; verification gates</span></div>
    </div>

    <section class="mm-section" id="mm-scenario" aria-labelledby="mm-scenario-title">
      <div class="mm-sectionhead"><p class="mm-overline">01 / MISSION SCENARIO</p><h3 id="mm-scenario-title">Movement should have a purpose.</h3><p>An interactive research storyboard, not device telemetry or a functional simulator.</p></div>
      <div class="mm-story">
        <div class="mm-story-nav" role="group" aria-label="Choose an illustrative scenario">
          <button type="button" class="mm-stage is-active" data-stage="travel" aria-pressed="true"><span>01</span><strong>Room to therapy</strong><small>Supervised transit</small></button>
          <button type="button" class="mm-stage" data-stage="therapy" aria-pressed="false"><span>02</span><strong>Exercise first</strong><small>Stationary cycling</small></button>
          <button type="button" class="mm-stage" data-stage="handoff" aria-pressed="false"><span>03</span><strong>Safe arrival</strong><small>Secure &amp; hand off</small></button>
        </div>
        <div class="mm-story-content" aria-live="polite" aria-atomic="true">
          <p class="mm-overline" id="mm-scenario-label">Coordinated transit + exercise</p>
          <h4 id="mm-scenario-heading">01 / Room to rehabilitation</h4>
          <p id="mm-scenario-description">Concept scenario: an authorized care team evaluates whether wheelchair propulsion and prescribed lower-limb movement could operate together during a supervised journey within a clinical facility.</p>
          <div class="mm-system-chips" id="mm-system-chips"><span>PROPULSION</span><span>PEDAL MOVEMENT</span><span>SUPERVISION</span></div>
          <p class="mm-research-question" id="mm-research-question"><strong>Research question:</strong> can the system coordinate propulsion, exercise effort and braking without adding patient or staff risk?</p>
        </div>
      </div>
    </section>

    <section class="mm-section" aria-labelledby="mm-architecture-title">
      <div class="mm-sectionhead"><p class="mm-overline">02 / SYSTEM DESIGN</p><h3 id="mm-architecture-title">Two motions. One coordinated safety case.</h3><p>Separate functions demand a controlled interface and explicit priority rules before any integrated testing.</p></div>
      <div class="mm-architecture">
        <article><span class="mm-card-num">01 / DRIVE</span><div class="mm-card-icon" aria-hidden="true">↗</div><h4>Detachable propulsion</h4><p>Proposed two-wheel motor-assisted drive module for controlled wheelchair transport on defined, evaluated surfaces.</p><span class="mm-tag">ENGINEERING CONCEPT</span></article>
        <article><span class="mm-card-num">02 / EXERCISE</span><div class="mm-card-icon" aria-hidden="true">◉</div><h4>LegMaker lower-limb motion</h4><p>Wheelchair-attached pedal architecture intended for passive, assistive and active lower-limb exercise modes.</p><span class="mm-tag">INVESTIGATIONAL PLATFORM</span></article>
        <article><span class="mm-card-num">03 / COORDINATION</span><div class="mm-card-icon" aria-hidden="true">⇄</div><h4>Supervisory controls</h4><p>Proposed logic for clinician permissions, velocity limits, mode transitions, system state and movement interlocks.</p><span class="mm-tag">TO BE DEVELOPED</span></article>
      </div>
    </section>

    <section class="mm-section mm-safety" id="mm-validation" aria-labelledby="mm-validation-title">
      <div class="mm-sectionhead"><p class="mm-overline">03 / VALIDATION ROADMAP</p><h3 id="mm-validation-title">Safety before speed.</h3><p>Six planned test gates must be addressed before making any claim about suitability for patient transport or simultaneous exercise.</p></div>
      <ol class="mm-gates">
        <li><span>01</span><div><h4>Secure mechanical attachment</h4><p>Compatibility, structural retention, mounting repeatability and seated clearance.</p></div><em>PLANNED</em></li>
        <li><span>02</span><div><h4>Propulsion and braking</h4><p>Drive control, stopping distance, manual override and power-loss behavior.</p></div><em>PLANNED</em></li>
        <li><span>03</span><div><h4>Stability and terrain</h4><p>Tip risk, turning, slope transitions, obstacles and indoor routing constraints.</p></div><em>PLANNED</em></li>
        <li><span>04</span><div><h4>Exercise / travel interlocks</h4><p>Independent stop controls, clinician restrictions and hazard analysis for synchronized modes.</p></div><em>PLANNED</em></li>
        <li><span>05</span><div><h4>Human factors</h4><p>Accessible controls, staff workflow, patient tolerance and emergency procedures.</p></div><em>PLANNED</em></li>
        <li><span>06</span><div><h4>Clinical &amp; regulatory review</h4><p>Risk management, verification plan, institutional approvals and appropriate regulatory pathway.</p></div><em>PLANNED</em></li>
      </ol>
    </section>

    <section class="mm-closing" aria-labelledby="mm-closing-title">
      <p class="mm-overline">04 / RESEARCH COLLABORATION</p>
      <h3 id="mm-closing-title">Build the evidence.<br><em>Then build the mission.</em></h3>
      <p>Rehabwheel seeks technical, rehabilitation and institutional feedback on this proposed mobility-plus-exercise architecture. We welcome conversations about requirements, feasibility studies and controlled validation—not procurement claims or deployment promises.</p>
      <div class="mm-buttons"><a class="mm-primary" href="mailto:info@rehabwheel.com?subject=LegMaker%20Military%20Mobility%20Research%20Discussion">Discuss an evaluation <span aria-hidden="true">↗</span></a><a class="mm-secondary" href="/technology.html">Explore LegMaker technology <span aria-hidden="true">↗</span></a></div>
      <div class="mm-legal"><strong>Important:</strong> LegMaker is investigational. Military Mobility is a proposed research concept and is not presented as a validated assistive transport system, marketed medical device, approved clinical intervention or government program. No U.S. Department of Defense, service branch, or federal endorsement or partnership is implied. This static presentation contains no confidential records.</div>
    </section>
  </div>`;
  const label=root.querySelector('#mm-scenario-label'),heading=root.querySelector('#mm-scenario-heading');
  const description=root.querySelector('#mm-scenario-description');
  const question=root.querySelector('#mm-research-question'),chips=root.querySelector('#mm-system-chips');
  root.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>{
    const data=scenarios[button.dataset.stage];if(!data)return;
    root.querySelectorAll('[data-stage]').forEach(other=>{
      const selected=other===button;
      other.classList.toggle('is-active',selected);
      other.setAttribute('aria-pressed',String(selected));
    });
    label.textContent=data.label;heading.textContent=data.title;description.textContent=data.description;
    question.textContent=data.focus;
    chips.replaceChildren(...data.active.map(item=>{const el=document.createElement('span');el.textContent=item;return el;}));
  }));
}
