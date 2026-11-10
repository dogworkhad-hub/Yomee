===================================================
      YOMEE VIDEO CALL APPLICATION - SOURCE & BUILD
===================================================

This ZIP file contains the full application code and ready-to-use production build.

CONTENTS:
1. /dist         - Compiled, production-ready web application (HTML, JS, CSS, Assets).
2. /src          - Full React 19 + TypeScript source code with components, styles, and data.
3. /public       - PWA Manifest, Service Worker, icons, and static assets.
4. package.json  - Dependencies and build scripts.
5. server.ts     - Full-stack Node.js Express server.

---------------------------------------------------
HOW TO RUN LOCALLY:
---------------------------------------------------
1. Extract this ZIP file.
2. Open terminal in the extracted folder.
3. Run:
      npm install
      npm run dev
4. Open http://localhost:3000 in your browser!

---------------------------------------------------
HOW TO CONVERT THIS TO AN ANDROID APK:
---------------------------------------------------
Method A (Fastest - Website 2 APK / Web2App):
1. Use any tool like "Website 2 APK Builder" or "AppMySite".
2. Select the /dist directory or point it to your web URL.
3. Click "Generate APK".

Method B (Capacitor - Official Native Android APK):
1. In this project folder, run:
      npm install @capacitor/core @capacitor/cli @capacitor/android
      npx cap init "Yomee" "com.yomee.app"
      npx cap add android
      npx cap copy
      npx cap open android
2. Android Studio will open -> Click "Build" -> "Build Bundle(s) / APK(s)" -> "Build APK(s)".
3. Your signed APK will be ready!

===================================================
