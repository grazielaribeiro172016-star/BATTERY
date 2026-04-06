# BATTERY ⚡
### Transforme conhecimento em energia.

PWA completo, pronto para hospedar e empacotar para Android.

---

## Estrutura de arquivos

```
battery-app/
├── index.html          ← App completo (HTML + CSS + JS)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker (offline + push)
├── generate-icons.py   ← Script para gerar ícones PNG
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-192.png
    └── icon-512.png
```

---

## 1. Gerar os ícones

```bash
pip install cairosvg
python3 generate-icons.py
```

Ou use https://realfavicongenerator.net/ com qualquer logo 512×512.

---

## 2. Hospedar (opções gratuitas)

### Vercel (recomendado)
```bash
npm i -g vercel
cd battery-app
vercel --prod
```

### Netlify
1. Acesse app.netlify.com
2. Arraste a pasta `battery-app` para o deploy

### GitHub Pages
1. Crie repositório no GitHub
2. Faça push dos arquivos
3. Settings → Pages → Deploy from branch `main`

> ⚠️ HTTPS é obrigatório para Service Worker funcionar.

---

## 3. Empacotar para Android (TWA via Bubblewrap)

```bash
# Instalar Bubblewrap
npm i -g @bubblewrap/cli

# Inicializar (use sua URL real)
bubblewrap init --manifest https://SEU-DOMINIO.com/manifest.json

# Construir APK/AAB
bubblewrap build
```

O arquivo `app-release-bundle.aab` gerado pode ser enviado direto para o Google Play.

**Configurar Digital Asset Links:**
- No Google Play Console, copie o SHA-256 fingerprint
- Crie o arquivo em: `https://SEU-DOMINIO.com/.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.battery.app",
    "sha256_cert_fingerprints": ["SEU_SHA256_AQUI"]
  }
}]
```

---

## 4. Firebase (para login e sync entre dispositivos)

```bash
npm install firebase
```

Adicione no `index.html` antes do `</body>`:

```html
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.x/firebase-app.js';
  import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider } 
    from 'https://www.gstatic.com/firebasejs/10.x/firebase-auth.js';
  import { getFirestore, doc, setDoc, getDoc } 
    from 'https://www.gstatic.com/firebasejs/10.x/firebase-firestore.js';

  const app = initializeApp({
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
  });

  const auth = getAuth(app);
  const db   = getFirestore(app);

  // Login anônimo automático
  signInAnonymously(auth);
</script>
```

---

## 5. Push Notifications (streak reminder)

```javascript
// Solicitar permissão
const perm = await Notification.requestPermission();
if (perm === 'granted') {
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'SUA_VAPID_PUBLIC_KEY'
  });
  // Envie `sub` para seu backend/Firebase Functions
}
```

Configure Cloud Functions para disparar às 21h diariamente para usuários com streak > 0.

---

## Roadmap técnico

| Fase | Feature |
|------|---------|
| v1.0 | PWA standalone + localStorage |
| v1.1 | Firebase Auth (anon + Google) |
| v1.2 | Firestore sync multi-device |
| v1.3 | Push notifications (streak) |
| v1.4 | Challenges P2P |
| v1.5 | Ranking semanal |
| v2.0 | Android APK via Bubblewrap |
| v2.1 | Revenue Cat + Battery Pro |

---

## Métricas a monitorar

- **AHA Moment**: tempo até primeira bateria carregada
- **D1 Retention**: usuários que voltam no dia seguinte
- **D7 Retention**: meta ≥ 40%
- **Streak Length**: média de dias
- **Lesson Completion Rate**: por bateria

---

Criado com Battery App v1.0
