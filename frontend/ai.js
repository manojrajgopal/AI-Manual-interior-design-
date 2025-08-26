(function () {
  // Inject floating button
  const btn = document.createElement('button');
  btn.id = 'ai-furnish-btn';
  btn.textContent = '✨ AI Furnish';
  document.body.appendChild(btn);

  // Backdrop and modal
  const backdrop = document.createElement('div');
  backdrop.id = 'ai-modal-backdrop';
  const modal = document.createElement('div');
  modal.id = 'ai-modal';
  modal.innerHTML = `
    <header>
      <h3>Describe your room style</h3>
      <button id="ai-close" title="Close">×</button>
    </header>
    <textarea id="ai-prompt" placeholder="e.g., Make this a cozy modern living room with a 3-seater sofa against the longest wall, TV opposite, light oak floor, and plants near the window."></textarea>
    <div id="ai-controls">
      <button class="ai-btn" id="ai-cancel">Cancel</button>
      <button class="ai-btn primary" id="ai-generate">Generate</button>
    </div>
    <div id="ai-status"></div>
  `;
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  const show = () => { backdrop.style.display = 'block'; modal.style.display = 'block'; };
  const hide = () => { backdrop.style.display = 'none'; modal.style.display = 'none'; setStatus(''); };
  const setStatus = (msg) => { document.getElementById('ai-status').textContent = msg || ''; };

  btn.addEventListener('click', show);
  backdrop.addEventListener('click', hide);
  document.getElementById('ai-close').addEventListener('click', hide);
  document.getElementById('ai-cancel').addEventListener('click', hide);

  document.getElementById('ai-generate').addEventListener('click', async () => {
    const prompt = document.getElementById('ai-prompt').value.trim();
    if (!prompt) { setStatus('Please enter a prompt.'); return; }

    // Try to collect current floorplan JSON if available (Blueprint3D stores it globally in many apps).
    let floorplan = null;
    try {
      // Heuristic hooks – adapt later once we wire exact API.
      if (window.bp3d && window.bp3d.getFloorplanJson) {
        floorplan = window.bp3d.getFloorplanJson();
      } else if (window.blueprint && window.blueprint.getSceneJson) {
        const scene = window.blueprint.getSceneJson();
        floorplan = scene && scene.floorplan ? scene.floorplan : null;
      } else {
        // As a fallback, send null; backend can decide.
        floorplan = null;
      }
    } catch (e) {
      console.warn('Unable to read floorplan JSON:', e);
    }

    setStatus('Sending to AI…');
    document.getElementById('ai-generate').disabled = true;

    // Emit an event for the React/Blueprint layer (we will also do a fetch later when backend is ready)
    const detail = { prompt, floorplan };
    window.dispatchEvent(new CustomEvent('ai:generate-plan', { detail }));

    // Optional: call backend (will be implemented in Step 2)
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detail)
      });
      if (!res.ok) throw new Error('Backend not available yet');
      const plan = await res.json();
      // Emit result event for the app to consume and place items
      window.dispatchEvent(new CustomEvent('ai:plan-ready', { detail: plan }));
      setStatus('Plan received. Placing items…');
    } catch (err) {
      console.info('Backend not set up yet (expected in Step 2). Using event-only mode.', err);
      setStatus('Plan requested. Waiting for app to handle event.');
    } finally {
      document.getElementById('ai-generate').disabled = false;
    }
  });
})();