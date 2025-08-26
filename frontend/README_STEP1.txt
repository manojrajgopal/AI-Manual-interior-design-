# Step 1 – AI Furnish UI + Backend Scaffold

## Frontend (static)
Files:
- ai.css
- ai.js

How to integrate into your existing build (no source rebuild needed):
1) Copy `ai.css` and `ai.js` into your app's `public/` (or same folder as index.html hosting path).
2) In `index.html`, add:
   <link rel="stylesheet" href="/ai.css" />
   <script defer src="/ai.js"></script>

You will see a floating "✨ AI Furnish" button. Clicking opens a modal to enter the prompt.
It dispatches browser events:
- `ai:generate-plan` with `{ prompt, floorplan }`
- `ai:plan-ready` with the backend JSON response, when available.

## Backend (FastAPI scaffold)
- backend/main.py  (run with:  uvicorn main:app --reload --port 8000)
- backend/requirements.txt

For local dev, serve your frontend at http://localhost:3000 and backend at http://localhost:8000, 
and change fetch('/api/generate-plan', ...) to fetch('http://localhost:8000/api/generate-plan', ...)
or use a proxy in your frontend dev server.

Step 2 will implement real OpenAI/Gemini calls.