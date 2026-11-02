# OMOR AI — Android WebView Starter

A responsive HTML/CSS/JavaScript frontend prototype for the OMOR AI Android app.

## Included
- Home dashboard and bottom navigation
- AI Chat demo interface
- Image Studio interface
- AI Writer interface
- Voice Assistant interface
- AI Coding interface
- Profile and settings screen
- Login / signup UI and Google sign-in placeholder
- Developer credit: Omor Faruk

## Run locally
Open `index.html` in a modern browser.

## Android WebView
1. Create an Android Studio project using an Empty Views Activity.
2. Put `index.html`, `styles.css`, and `app.js` in `app/src/main/assets/`.
3. Add a WebView to your Activity layout.
4. Enable JavaScript on the WebView and load:
   `file:///android_asset/index.html`
5. For production, add proper Android back navigation, network security configuration, and a Content Security Policy.

Example Java:
```java
WebView webView = findViewById(R.id.webView);
webView.getSettings().setJavaScriptEnabled(true);
webView.loadUrl("file:///android_asset/index.html");
```

## Important
This is a frontend starter, not a production AI app yet. Login and Google sign-in are placeholders. Chat replies are demo text. Image generation, speech, AI APIs, database, subscriptions and admin panel require a secure backend and provider configuration.

Never place private AI API keys in `app.js`, HTML, or the Android APK. Keep provider keys on the backend.
