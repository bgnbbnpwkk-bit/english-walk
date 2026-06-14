# English Walk

A voice-based English conversation training PWA — a friendly AI partner you can talk to hands-free while walking. Built for Marc (Team Melli & Marc).

## What it does

- Sign in with Google (Firebase Auth) — access restricted to a single whitelisted email
- Tap **Start** → the AI greets you and speaks aloud (TTS)
- It then listens automatically (Web Speech API), sends your speech to **Gemini 2.5 Flash**, and replies — correcting grammar/vocabulary gently inline
- The speak → listen → reply loop continues until you tap **Stop**
- Installable PWA, optimized for iPhone (390px viewport)

## Tech stack

- Standalone HTML/CSS/JS — no build step, no frameworks
- Firebase Authentication (Google, compat SDK via CDN)
- Gemini 2.5 Flash API (key stored locally)
- Web Speech API (Speech Recognition + Speech Synthesis)
- Service Worker (auto-updating, never caches `index.html`)

## Setup

### 1. Firebase config
Open `index.html` and fill in the three placeholder values in `firebaseConfig`:

```js
apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
messagingSenderId: "REPLACE_WITH_MESSAGING_SENDER_ID",
appId: "REPLACE_WITH_APP_ID"
```

Get them from the Firebase console for project **unser-einkaufszettel**:
*Project settings → General → Your apps → SDK setup and configuration*.
The other fields (authDomain, projectId, storageBucket, databaseURL) are already filled in. These are public client-side config values and are safe to commit.

Make sure `bgnbbnpwkk-bit.github.io` is listed under
*Authentication → Settings → Authorized domains*.

### 2. Gemini API key
The Gemini key is **not** stored in the code. Open the app, tap ⚙️, paste your
key into *Gemini API Key*, and tap **Speichern**. It's saved to `localStorage`
(`englishwalk_gemini_key`) on the device only.

### 3. Deploy (GitHub Pages)
- Source: `main` branch, root folder
- The app must be served over HTTPS (GitHub Pages does this) — required for mic access

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire app (UI + logic) |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker (auto-update; HTML never cached) |
| `icon-192.png`, `icon-512.png` | App icons |

## Access control

Only `marc.saenger1975@gmail.com` may use the app. Any other Google account is
signed out immediately with: *"Zugriff verweigert. Diese App ist nur für
autorisierte Nutzer."*

---
Team Melli & Marc
