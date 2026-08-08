# Developer Evidence Portfolio Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the support-framed evidence set with three truthful public developer-evidence cards, remove the Portfolio languages hero metric, and preserve the portfolio's primary Technical Support Engineer identity and six translated routes.

**Architecture:** Keep the existing Express/EJS page, six locale dictionaries, responsive evidence grid, static local evidence assets, and HTML-to-PDF résumé pipeline. Render the three repositories in the user-specified order from authored locale content; no runtime GitHub fetch is added. Tests enforce repository order, public-link count, collaborative attribution, deployment-readiness limitations, locale parity, and résumé consistency.

**Tech Stack:** Node.js, Express, EJS, JSON locale dictionaries, Tailwind CSS v4 source styles, vanilla JavaScript, Jest, jsdom, Puppeteer Core, SVG, PDF utilities

## Global Constraints

- Keep **Technical Support Engineer** as the primary portfolio and résumé role.
- Use the English eyebrow **Developer Evidence** and heading **Evidence from systems I have worked on**.
- Render exactly three primary public repositories in this order: Noor Notes, Emergency Medicine Finder, House Shifting Services.
- Add PCIU CGPA Calculator below the cards as a compact **Collaborative contribution** with a public link and no specific individual-contribution claim.
- House Shifting Services must be visibly labeled **Collaborative work** and must never imply sole authorship or an undocumented individual contribution.
- Emergency Medicine Finder must retain visible CSRF, rate-limit, security-header, cookie, validation, and upload-hardening limitations and must not be described as deployment-ready.
- Do not add metrics, performance improvements, adoption claims, deployment claims, or contribution boundaries absent from the repositories or direct user confirmation.
- Remove Smart Attendance Tracker from the web and résumé evidence sets without exposing or deleting its private source material elsewhere.
- Remove the **6 Portfolio languages** hero metric while preserving the six translated routes and language selector.
- Keep all six locale dictionaries key-identical and preserve Arabic RTL behavior.
- Keep the local `.env` ignored and untracked. Never stage or print SMTP credentials.
- Do not stage `logs/combined.log`.

---

## File Structure

- Modify `views/index.ejs` — render the ordered three-card developer evidence grid.
- Modify `views/index.ejs` — remove the Portfolio languages hero metric while keeping the three verified career metrics.
- Modify `locales/en-US.json`, `locales/bn.json`, `locales/hi.json`, `locales/ar.json`, `locales/es.json`, `locales/fr.json` — replace the support/private evidence dictionary with developer-evidence copy.
- Modify `public/css/input.css` — replace private/aside-only evidence styles with a collaborative card badge.
- Modify `public/assets/evidence/emergency-supportability.svg` — change its visible heading from supportability to feature/remediation evidence while preserving the open-work warning.
- Create `public/assets/evidence/house-shifting-collaboration.svg` — add a neutral repository-derived workflow diagram.
- Delete `public/assets/evidence/attendance-sync.svg` — remove the now-unused private evidence visual.
- Modify `tests/page.test.js` and `tests/i18n.test.js` — enforce public links, ordering, attribution, visuals, and locale contract.
- Modify `public/resume.html` and `tests/resume.test.js` — use the same three developer-evidence items and links.
- Regenerate `public/Abdullah Al Mamun Resume.pdf` — keep the committed PDF aligned with the HTML source.
- Modify `README.md` — document the new three-repository evidence policy.

---

### Task 1: Replace the website evidence contract and presentation

**Files:**
- Modify: `tests/page.test.js`
- Modify: `tests/i18n.test.js`
- Modify: `views/index.ejs`
- Modify: `locales/en-US.json`
- Modify: `locales/bn.json`
- Modify: `locales/hi.json`
- Modify: `locales/ar.json`
- Modify: `locales/es.json`
- Modify: `locales/fr.json`
- Modify: `public/css/input.css`
- Modify: `public/assets/evidence/emergency-supportability.svg`
- Create: `public/assets/evidence/house-shifting-collaboration.svg`
- Delete: `public/assets/evidence/attendance-sync.svg`

**Interfaces:**
- Consumes: `t(key)` from `utils/i18n.js`; existing `[data-evidence-card]` and `[data-evidence-source]` test hooks.
- Produces: three ordered cards with `data-evidence="noor-notes|emergency-medicine-finder|house-shifting-services"`; three primary public anchors; one PCIU collaborative-contribution anchor; `.collaborative-badge`; `.contribution-note`; locale keys listed below.

- [ ] **Step 1: Add the hero-metric removal to the page and locale tests**

In the existing verified-metrics test in `tests/page.test.js`, replace the four-value expectation with:

```js
expect([...page.querySelectorAll('[data-metric]')].map((node) => node.dataset.metric)).toEqual([
  'years',
  'github-history',
  'industries',
]);
expect([...page.querySelectorAll('[data-metric] strong')].map((node) =>
  node.textContent.trim()
)).toEqual(['7+', 'Since 2022', '3']);
expect(page.querySelector('[data-metric="portfolio-languages"]')).toBeNull();
```

In `tests/i18n.test.js`, remove `portfolioLanguages: 'Portfolio languages'` from `english.metrics` and add:

```js
expect(english).not.toHaveProperty('metrics.portfolioLanguages');
```

Keep the existing locale-route and locale-parity tests unchanged so removing the hero card cannot remove translation functionality.

- [ ] **Step 2: Rewrite the page test to express the new evidence contract**

Replace the existing private-case-study test in `tests/page.test.js` with:

```js
it('renders three ordered primary repositories and one collaborative contribution', () => {
  const cards = [...page.querySelectorAll('[data-evidence-card]')];
  const links = [...page.querySelectorAll('[data-evidence-source]')];
  const contribution = page.querySelector('[data-collaborative-contribution]');

  expect(cards.map((card) => card.dataset.evidence)).toEqual([
    'noor-notes',
    'emergency-medicine-finder',
    'house-shifting-services',
  ]);
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    'https://github.com/saamaamr/noor-notes',
    'https://github.com/saamaamr/emergency-medicine-finder',
    'https://github.com/saamaamr/house-shifting-services',
  ]);
  expect(contribution.textContent).toContain('PCIU CGPA Calculator');
  expect(contribution.textContent).toContain('Collaborative contribution');
  expect(contribution.querySelector('[data-contribution-source]').getAttribute('href')).toBe(
    'https://github.com/saamaamr/pciu-cgpa-calculator'
  );
  expect(page.querySelector('[data-private-evidence]')).toBeNull();
  expect(page.querySelector('[data-collaborative-evidence]').textContent).toContain(
    'Collaborative work'
  );
  expect(page.getElementById('evidence').textContent).toContain('Developer Evidence');
  expect(page.getElementById('evidence').textContent).not.toContain('Smart Attendance Tracker');
});
```

Update the visual expectation to:

```js
const expectedSources = [
  '/assets/evidence/noor-notes-library.png',
  '/assets/evidence/emergency-supportability.svg',
  '/assets/evidence/house-shifting-collaboration.svg',
];
```

Add these checks to the existing claim-boundary test:

```js
expect(text).toContain('production-grade feature scope');
expect(text).toContain('not presented as deployment-ready');
expect(text).toContain('collaborative work');
expect(text).toContain('PCIU CGPA Calculator');
expect(text).not.toContain('Smart Attendance Tracker');
expect(page.querySelector('.collaborative-note')).toBeNull();
expect(page.querySelector('.contribution-note')).not.toBeNull();
```

- [ ] **Step 3: Rewrite the locale evidence contract test**

In `tests/i18n.test.js`, replace the `evidence.attendancePrivate` expectation with:

```js
expect(english).toHaveProperty('evidence.eyebrow', 'Developer Evidence');
expect(english).toHaveProperty('evidence.title', 'Evidence from systems I have worked on');
expect(english).toHaveProperty('evidence.houseBadge', 'Collaborative work');
expect(english).toHaveProperty('evidence.pciuBadge', 'Collaborative contribution');
expect(english).not.toHaveProperty('evidence.attendanceTitle');
expect(english).not.toHaveProperty('evidence.collaborativeBody');
```

Extend the translated-value list with `evidence.eyebrow`, `evidence.intro`, `evidence.noorBody`, `evidence.medicineBody`, `evidence.houseBody`, and `evidence.pciuBody` so each differs from English.

- [ ] **Step 4: Run the focused tests and confirm the red state**

Run:

```bash
npm test -- --runInBand tests/page.test.js tests/i18n.test.js
```

Expected: FAIL because the hero still renders four metrics, the page still renders Noor, Smart Attendance, Emergency order, only two public links exist, and developer keys and the House card do not exist.

- [ ] **Step 5: Remove the Portfolio languages metric from the page and locales**

Delete the `data-metric="portfolio-languages"` card from `views/index.ejs`. Remove `metrics.portfolioLanguages` from all six locale dictionaries while preserving the three hero cards and all language-route content.

Change the desktop `.hero-proof-grid` rule in `public/css/input.css` to:

```css
.hero-proof-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

At `max-width: 64rem`, keep three columns for `.hero-proof-grid` by removing it from the shared two-column selector. At `max-width: 45rem`, set `.hero-proof-grid { grid-template-columns: 1fr; }`. Keep the existing `max-width: 24rem` one-column fallback.

- [ ] **Step 6: Replace each locale's `evidence` object with the exact key schema**

Every locale must contain exactly these keys in this order:

```text
eyebrow, title, intro,
medicineCategory, medicineTitle, medicineBody, medicineAlt, medicineLink,
noorCategory, noorTitle, noorBody, noorAlt, noorLink,
houseCategory, houseBadge, houseTitle, houseBody, houseAlt, houseLink
pciuBadge, pciuTitle, pciuBody, pciuLink
```

Use this exact English content in `locales/en-US.json`:

```json
{
  "eyebrow": "Developer Evidence",
  "title": "Evidence from systems I have worked on",
  "intro": "Selected development work showing application architecture, user workflows, data handling, testing, documentation, and responsible limitations.",
  "medicineCategory": "Full-stack web application",
  "medicineTitle": "Emergency Medicine Finder",
  "medicineBody": "A Node.js, Express, EJS, and MySQL application with a production-grade feature scope across user, shopkeeper, and admin roles, including medicine search, inventory, requests, sales, expenses, exports, backups, validation, and tests. Documented CSRF, rate-limit, security-header, cookie, validation, and upload-hardening work remains, so it is not presented as deployment-ready.",
  "medicineAlt": "Emergency Medicine Finder feature and remediation review showing roles, workflows, tests, backups, exports, and open security work",
  "medicineLink": "View public repository",
  "noorCategory": "Native Linux desktop application",
  "noorTitle": "Noor Notes",
  "noorBody": "A Rust, GTK4, and libadwaita notes application with a responsive library and editor, rich and source modes, encrypted local storage, autosave and recovery behavior, Linux packaging, accessibility-aware controls, and automated verification.",
  "noorAlt": "Noor Notes library screen showing the native Linux notes interface",
  "noorLink": "View public repository",
  "houseCategory": "Collaborative full-stack web application",
  "houseBadge": "Collaborative work",
  "houseTitle": "House Shifting Services",
  "houseBody": "A collaborative Node.js, Express, EJS, and MySQL service-booking system with user, worker, and admin flows, registration and authentication, service listings, bookings, verification and hold actions, and file uploads. It is presented as collaborative work; individual contribution boundaries are not claimed.",
  "houseAlt": "House Shifting Services workflow diagram connecting users, service bookings, workers, and administration",
  "houseLink": "View public repository",
  "pciuBadge": "Collaborative contribution",
  "pciuTitle": "PCIU CGPA Calculator",
  "pciuBody": "PCIU CGPA Calculator is collaborative work and is not presented as independently built. No specific individual contribution is claimed.",
  "pciuLink": "View public repository"
}
```

Use these exact localized fields; preserve product names, technology names, and the existing localized `title` and repository-link wording:

```text
bn:
eyebrow=ডেভেলপার প্রমাণ
intro=অ্যাপ্লিকেশন স্থাপত্য, ব্যবহারকারীর কর্মপ্রবাহ, ডেটা পরিচালনা, পরীক্ষা, ডকুমেন্টেশন ও দায়িত্বশীল সীমাবদ্ধতা দেখানো নির্বাচিত ডেভেলপমেন্ট কাজ।
medicineCategory=ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন
noorCategory=নেটিভ Linux ডেস্কটপ অ্যাপ্লিকেশন
houseCategory=সহযোগিতামূলক ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন
houseBadge=সহযোগিতামূলক কাজ
houseBody=ব্যবহারকারী, কর্মী ও অ্যাডমিন প্রবাহ, নিবন্ধন ও প্রমাণীকরণ, সেবা তালিকা, বুকিং, যাচাই ও স্থগিতকরণ এবং ফাইল আপলোডসহ একটি সহযোগিতামূলক Node.js, Express, EJS ও MySQL সেবা-বুকিং সিস্টেম। এটি সহযোগিতামূলক কাজ হিসেবে উপস্থাপিত; ব্যক্তিগত অবদানের অনথিভুক্ত সীমা দাবি করা হয়নি।
pciuBadge=সহযোগিতামূলক অবদান
pciuBody=PCIU CGPA Calculator একটি সহযোগিতামূলক কাজ এবং স্বাধীনভাবে নির্মিত হিসেবে উপস্থাপিত নয়। কোনো নির্দিষ্ট ব্যক্তিগত অবদানের দাবি করা হয়নি।

hi:
eyebrow=डेवलपर प्रमाण
intro=एप्लिकेशन आर्किटेक्चर, उपयोगकर्ता कार्यप्रवाह, डेटा प्रबंधन, परीक्षण, दस्तावेज़ीकरण और जिम्मेदार सीमाएँ दिखाने वाला चुना गया विकास कार्य।
medicineCategory=फुल-स्टैक वेब एप्लिकेशन
noorCategory=नेटिव Linux डेस्कटॉप एप्लिकेशन
houseCategory=सहयोगी फुल-स्टैक वेब एप्लिकेशन
houseBadge=सहयोगी कार्य
houseBody=उपयोगकर्ता, कर्मचारी और एडमिन प्रवाह, पंजीकरण और प्रमाणीकरण, सेवा सूचियाँ, बुकिंग, सत्यापन और होल्ड कार्रवाई तथा फ़ाइल अपलोड वाला सहयोगी Node.js, Express, EJS और MySQL सेवा-बुकिंग सिस्टम। इसे सहयोगी कार्य के रूप में प्रस्तुत किया गया है; व्यक्तिगत योगदान की अप्रमाणित सीमाओं का दावा नहीं किया गया है।
pciuBadge=सहयोगी योगदान
pciuBody=PCIU CGPA Calculator सहयोगी कार्य है और इसे स्वतंत्र रूप से बनाया गया प्रोजेक्ट नहीं बताया गया है। किसी विशिष्ट व्यक्तिगत योगदान का दावा नहीं किया गया है।

ar:
eyebrow=أدلة المطور
intro=أعمال تطوير مختارة تُظهر بنية التطبيقات ومسارات المستخدم ومعالجة البيانات والاختبارات والتوثيق والقيود المسؤولة.
medicineCategory=تطبيق ويب متكامل
noorCategory=تطبيق سطح مكتب أصلي لنظام Linux
houseCategory=تطبيق ويب متكامل تعاوني
houseBadge=عمل تعاوني
houseBody=نظام تعاوني لحجز الخدمات مبني باستخدام Node.js وExpress وEJS وMySQL، ويشمل مسارات المستخدم والعامل والمسؤول والتسجيل والمصادقة وقوائم الخدمات والحجوزات وإجراءات التحقق والتعليق ورفع الملفات. يُعرض كعمل تعاوني ولا تُنسب حدود مساهمة فردية غير موثقة.
pciuBadge=مساهمة تعاونية
pciuBody=PCIU CGPA Calculator عمل تعاوني ولا يُعرض كمشروع بُني بصورة مستقلة. لا تُنسب مساهمة فردية محددة.

es:
eyebrow=Evidencia de desarrollo
intro=Trabajo de desarrollo seleccionado que muestra arquitectura de aplicaciones, flujos de usuario, gestión de datos, pruebas, documentación y limitaciones responsables.
medicineCategory=Aplicación web full-stack
noorCategory=Aplicación de escritorio nativa para Linux
houseCategory=Aplicación web full-stack colaborativa
houseBadge=Trabajo colaborativo
houseBody=Un sistema colaborativo de reserva de servicios con Node.js, Express, EJS y MySQL, con flujos para usuarios, trabajadores y administración, registro y autenticación, catálogo de servicios, reservas, acciones de verificación y espera, y carga de archivos. Se presenta como trabajo colaborativo; no se atribuyen límites de contribución individual no documentados.
pciuBadge=Contribución colaborativa
pciuBody=PCIU CGPA Calculator es un trabajo colaborativo y no se presenta como un proyecto creado de forma independiente. No se atribuye una contribución individual específica.

fr:
eyebrow=Preuves de développement
intro=Une sélection de travaux de développement illustrant l’architecture applicative, les parcours utilisateur, la gestion des données, les tests, la documentation et des limites responsables.
medicineCategory=Application web full-stack
noorCategory=Application de bureau Linux native
houseCategory=Application web full-stack collaborative
houseBadge=Travail collaboratif
houseBody=Un système collaboratif de réservation de services avec Node.js, Express, EJS et MySQL, comprenant des parcours utilisateur, intervenant et administrateur, l’inscription et l’authentification, les listes de services, les réservations, les actions de validation et de mise en attente, ainsi que le téléversement de fichiers. Il est présenté comme un travail collaboratif sans attribuer de limites de contribution individuelle non documentées.
pciuBadge=Contribution collaborative
pciuBody=PCIU CGPA Calculator est un travail collaboratif et n’est pas présenté comme un projet réalisé indépendamment. Aucune contribution individuelle précise n’est revendiquée.
```

Use these exact remaining localized values:

```text
bn:
medicineBody=ব্যবহারকারী, দোকানদার ও অ্যাডমিন ভূমিকাজুড়ে প্রোডাকশন-গ্রেড ফিচার স্কোপসহ একটি Node.js, Express, EJS ও MySQL অ্যাপ্লিকেশন; এতে ওষুধ অনুসন্ধান, ইনভেন্টরি, অনুরোধ, বিক্রয়, ব্যয়, এক্সপোর্ট, ব্যাকআপ, যাচাই ও পরীক্ষা রয়েছে। নথিভুক্ত CSRF, রেট-লিমিট, নিরাপত্তা-হেডার, কুকি, যাচাই ও আপলোড-হার্ডেনিং কাজ বাকি আছে, তাই এটিকে ডেপ্লয়মেন্টের জন্য প্রস্তুত হিসেবে উপস্থাপন করা হয়নি।
medicineAlt=ভূমিকা, কর্মপ্রবাহ, পরীক্ষা, ব্যাকআপ, এক্সপোর্ট ও উন্মুক্ত নিরাপত্তা কাজ দেখানো Emergency Medicine Finder ফিচার ও প্রতিকার পর্যালোচনা
noorBody=রেসপনসিভ লাইব্রেরি ও এডিটর, রিচ ও সোর্স মোড, এনক্রিপ্টেড স্থানীয় স্টোরেজ, অটোসেভ ও পুনরুদ্ধার আচরণ, Linux প্যাকেজিং, অ্যাক্সেসিবিলিটি-সচেতন নিয়ন্ত্রণ ও স্বয়ংক্রিয় যাচাইসহ একটি Rust, GTK4 ও libadwaita নোট অ্যাপ্লিকেশন।
noorAlt=নেটিভ Linux নোট ইন্টারফেস দেখানো Noor Notes লাইব্রেরি স্ক্রিন
houseAlt=ব্যবহারকারী, সেবা বুকিং, কর্মী ও প্রশাসনকে সংযুক্ত করা House Shifting Services কর্মপ্রবাহ চিত্র

hi:
medicineBody=उपयोगकर्ता, दुकानदार और एडमिन भूमिकाओं में प्रोडक्शन-ग्रेड फीचर स्कोप वाला Node.js, Express, EJS और MySQL एप्लिकेशन, जिसमें दवा खोज, इन्वेंटरी, अनुरोध, बिक्री, खर्च, निर्यात, बैकअप, सत्यापन और परीक्षण शामिल हैं। दर्ज CSRF, रेट-लिमिट, सुरक्षा-हेडर, कुकी, सत्यापन और अपलोड-हार्डनिंग कार्य शेष है, इसलिए इसे डिप्लॉयमेंट के लिए तैयार नहीं बताया गया है।
medicineAlt=भूमिकाएँ, कार्यप्रवाह, परीक्षण, बैकअप, निर्यात और खुला सुरक्षा कार्य दिखाने वाली Emergency Medicine Finder फीचर और सुधार समीक्षा
noorBody=रिस्पॉन्सिव लाइब्रेरी और एडिटर, रिच और सोर्स मोड, एन्क्रिप्टेड स्थानीय स्टोरेज, ऑटोसेव और रिकवरी व्यवहार, Linux पैकेजिंग, एक्सेसिबिलिटी-सचेत नियंत्रण और स्वचालित सत्यापन वाला Rust, GTK4 और libadwaita नोट्स एप्लिकेशन।
noorAlt=नेटिव Linux नोट्स इंटरफेस दिखाने वाला Noor Notes लाइब्रेरी स्क्रीन
houseAlt=उपयोगकर्ताओं, सेवा बुकिंग, कर्मचारियों और प्रशासन को जोड़ने वाला House Shifting Services कार्यप्रवाह आरेख

ar:
medicineBody=تطبيق مبني باستخدام Node.js وExpress وEJS وMySQL بنطاق ميزات بمستوى إنتاجي عبر أدوار المستخدم وصاحب الصيدلية والمسؤول، ويشمل البحث عن الأدوية والمخزون والطلبات والمبيعات والمصروفات والتصدير والنسخ الاحتياطي والتحقق والاختبارات. لا تزال أعمال موثقة متبقية في CSRF وحدود المعدل وترويسات الأمان وملفات الارتباط والتحقق وتقوية الرفع، لذلك لا يُقدّم على أنه جاهز للنشر.
medicineAlt=مراجعة ميزات ومعالجة Emergency Medicine Finder تعرض الأدوار ومسارات العمل والاختبارات والنسخ الاحتياطية والتصدير وأعمال الأمان المفتوحة
noorBody=تطبيق ملاحظات مبني باستخدام Rust وGTK4 وlibadwaita، ويضم مكتبة ومحررًا متجاوبين وأوضاع النص المنسق والمصدر وتخزينًا محليًا مشفرًا وحفظًا تلقائيًا وسلوك استعادة وحزم Linux وعناصر تحكم تراعي إمكانية الوصول وتحققًا آليًا.
noorAlt=شاشة مكتبة Noor Notes تعرض واجهة الملاحظات الأصلية لنظام Linux
houseAlt=مخطط سير House Shifting Services يربط المستخدمين وحجز الخدمات والعاملين والإدارة

es:
medicineBody=Una aplicación con Node.js, Express, EJS y MySQL con un alcance de funciones de nivel productivo para usuarios, propietarios de farmacia y administración, que incluye búsqueda de medicamentos, inventario, solicitudes, ventas, gastos, exportaciones, copias de seguridad, validación y pruebas. Queda trabajo documentado sobre CSRF, límites de tasa, cabeceras de seguridad, cookies, validación y endurecimiento de cargas, por lo que no se presenta como lista para desplegar.
medicineAlt=Revisión de funciones y remediación de Emergency Medicine Finder con roles, flujos, pruebas, copias de seguridad, exportaciones y trabajo de seguridad pendiente
noorBody=Una aplicación de notas con Rust, GTK4 y libadwaita que incluye biblioteca y editor adaptables, modos enriquecido y de código fuente, almacenamiento local cifrado, autoguardado y recuperación, empaquetado para Linux, controles atentos a la accesibilidad y verificación automatizada.
noorAlt=Pantalla de biblioteca de Noor Notes con la interfaz nativa de notas para Linux
houseAlt=Diagrama de flujo de House Shifting Services que conecta usuarios, reservas de servicios, trabajadores y administración

fr:
medicineBody=Une application Node.js, Express, EJS et MySQL au périmètre fonctionnel de niveau production couvrant les rôles utilisateur, pharmacien et administrateur, avec recherche de médicaments, stock, demandes, ventes, dépenses, exports, sauvegardes, validation et tests. Des travaux documentés restent à mener sur CSRF, les limites de débit, les en-têtes de sécurité, les cookies, la validation et le durcissement des téléversements ; elle n’est donc pas présentée comme prête au déploiement.
medicineAlt=Revue des fonctionnalités et corrections d’Emergency Medicine Finder montrant les rôles, les parcours, les tests, les sauvegardes, les exports et les travaux de sécurité ouverts
noorBody=Une application de notes Rust, GTK4 et libadwaita avec bibliothèque et éditeur adaptatifs, modes riche et source, stockage local chiffré, sauvegarde automatique et récupération, paquetage Linux, contrôles attentifs à l’accessibilité et vérification automatisée.
noorAlt=Écran de bibliothèque Noor Notes présentant l’interface native de notes pour Linux
houseAlt=Schéma du flux House Shifting Services reliant utilisateurs, réservation de services, intervenants et administration
```

- [ ] **Step 7: Render the three ordered public cards**

In `views/index.ejs`, render Noor Notes first, Emergency Medicine Finder second, and House Shifting Services third. Give every primary card anchor `data-evidence-source`. Give the House article `data-collaborative-evidence`, render `<span class="collaborative-badge">` using `evidence.houseBadge`, and remove the old `.collaborative-note` aside.

After the grid, render a compact `<aside class="contribution-note" data-collaborative-contribution>` for PCIU CGPA Calculator. Use `evidence.pciuBadge`, `evidence.pciuTitle`, `evidence.pciuBody`, and a public anchor with `data-contribution-source` pointing to `https://github.com/saamaamr/pciu-cgpa-calculator`. Do not give this aside `data-evidence-card`.

The House link must be:

```html
<a href="https://github.com/saamaamr/house-shifting-services" target="_blank" rel="noopener noreferrer" class="project-link" data-evidence-source>
```

- [ ] **Step 8: Replace the unused private visual with a truthful House workflow**

Delete `public/assets/evidence/attendance-sync.svg`. Create `public/assets/evidence/house-shifting-collaboration.svg` as a 900×560 local SVG with these visible labels only:

```text
Collaborative service workflow
User
Service booking
Worker
Admin review
Node.js · Express · EJS · MySQL
```

Use arrows `User → Service booking → Worker` and `Service booking → Admin review`. Include a visible `COLLABORATIVE WORK` badge. Do not show contributor names, ownership percentages, performance metrics, deployment claims, or private data.

In `public/assets/evidence/emergency-supportability.svg`, change:

```text
Emergency Medicine Finder supportability review → Emergency Medicine Finder development evidence
Supportability review → Feature & remediation review
Operational paths documented → User, shopkeeper & admin paths
Recovery paths reviewed → Backup and export paths
```

Keep `Remediation priorities`, `OPEN WORK`, and `Not presented as deployment-ready` unchanged.

- [ ] **Step 9: Replace obsolete private/aside CSS with a collaborative badge**

Remove `.private-badge` and the old `.collaborative-note` rule group from `public/css/input.css`. Add:

```css
.collaborative-badge {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.7rem;
  border: 1px solid color-mix(in srgb, var(--teal) 40%, var(--border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--teal) 12%, var(--surface));
  color: var(--teal);
  padding: 0.32rem 0.65rem;
  font-size: 0.7rem;
  font-weight: 800;
}

.contribution-note {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: 1rem 1.2rem;
}

.contribution-note h3,
.contribution-note p {
  margin: 0;
}

.contribution-note p {
  color: var(--text-muted);
  font-size: 0.84rem;
}
```

At `max-width: 45rem`, set `.contribution-note { grid-template-columns: 1fr; }`. Update the CSS assertion in `tests/page.test.js` to require `.collaborative-badge` and `.contribution-note` and reject `.private-badge` and `.collaborative-note`.

- [ ] **Step 10: Run focused tests and build the production stylesheet**

Run:

```bash
npm test -- --runInBand tests/page.test.js tests/i18n.test.js
npm run build:css
```

Expected: both suites pass; locale parity passes; the Tailwind build exits 0.

- [ ] **Step 11: Commit the website evidence and hero metric update**

Stage only the listed website, locale, asset, CSS, and test files. Do not stage `.env` or `logs/combined.log`.

```bash
git commit -m "feat: present focused developer evidence"
```

---

### Task 2: Align the English résumé and PDF

**Files:**
- Modify: `tests/resume.test.js`
- Modify: `public/resume.html`
- Modify: `public/Abdullah Al Mamun Resume.pdf`

**Interfaces:**
- Consumes: the exact English evidence content and repository order defined in Task 1.
- Produces: a tagged two-page A4 PDF with three primary evidence links, one PCIU collaborative-contribution link, and explicit collaborative/deployment limitation text.

- [ ] **Step 1: Rewrite résumé evidence expectations**

Replace the private-evidence expectations in `tests/resume.test.js` with:

```js
expect(text).toContain('Developer Evidence');
expect(text).toContain('Emergency Medicine Finder');
expect(text).toContain('Noor Notes');
expect(text).toContain('House Shifting Services');
expect(text).toContain('PCIU CGPA Calculator');
expect(text).toContain('Collaborative work');
expect(text).toContain('Collaborative contribution');
expect(text).toContain('production-grade feature scope');
expect(text).toContain('not presented as deployment-ready');
expect(text).not.toContain('Smart Attendance Tracker');
```

Update the link test to require all four exact GitHub repository URLs and require no attendance URL.

- [ ] **Step 2: Run the résumé test and confirm the red state**

Run:

```bash
npm test -- --runInBand tests/resume.test.js
```

Expected: FAIL because the résumé still contains Technical Support Evidence and Smart Attendance Tracker and lacks the House and PCIU repository links.

- [ ] **Step 3: Replace the résumé evidence section**

Use heading `Developer Evidence` and this order/content:

```text
Noor Notes — Native Linux desktop application
A Rust, GTK4, and libadwaita notes application with a responsive library and editor, rich and source modes, encrypted local storage, autosave and recovery behavior, Linux packaging, and automated verification.

Emergency Medicine Finder — Full-stack web application
A Node.js, Express, EJS, and MySQL application with a production-grade feature scope across user, shopkeeper, and admin roles, including medicine search, inventory, requests, sales, expenses, exports, backups, validation, and tests. Documented remediation remains, so it is not presented as deployment-ready.

House Shifting Services — Collaborative work
A collaborative Node.js, Express, EJS, and MySQL service-booking system with user, worker, and admin flows, authentication, service listings, bookings, verification actions, and file uploads. Individual contribution boundaries are not claimed.

PCIU CGPA Calculator — Collaborative contribution
Collaborative work linked as a public repository; it is not presented as independently built, and no specific individual contribution is claimed.
```

Link each project title or its final `Public repository` phrase to its exact GitHub URL. Do not introduce `<strong>` or `<aside>` elements because Chrome maps them to invalid PDF 1.4 structure roles in this document.

- [ ] **Step 4: Run the résumé test and generate the PDF**

Run:

```bash
npm test -- --runInBand tests/resume.test.js
npm run generate-pdf
```

Expected: résumé tests pass and `public/Abdullah Al Mamun Resume.pdf` is regenerated.

- [ ] **Step 5: Validate PDF structure, pages, text, and links**

Run:

```bash
pdfinfo "public/Abdullah Al Mamun Resume.pdf"
pdfinfo -struct "public/Abdullah Al Mamun Resume.pdf"
pdftotext "public/Abdullah Al Mamun Resume.pdf" -
```

Expected: A4, two pages, tagged PDF, no structure-role warnings, all four project names, `Collaborative work`, `Collaborative contribution`, and `not presented as deployment-ready`. Confirm annotations include all four repository URLs.

- [ ] **Step 6: Commit the résumé update**

```bash
git commit -m "feat: align resume with developer evidence"
```

Stage only `tests/resume.test.js`, `public/resume.html`, and the generated PDF.

---

### Task 3: Align documentation and perform final verification

**Files:**
- Modify: `README.md`
- Verify: all implementation files from Tasks 1–2

**Interfaces:**
- Consumes: final page, locale, asset, résumé, and PDF behavior.
- Produces: accurate public documentation and a verified main-branch-ready implementation.

- [ ] **Step 1: Update README evidence documentation**

Replace the current `Evidence and Attribution` bullets with:

```markdown
- Noor Notes, Emergency Medicine Finder, and House Shifting Services are the three primary developer-evidence cards and link to public source repositories.
- Emergency Medicine Finder describes its feature scope while keeping documented deployment-readiness limitations visible.
- House Shifting Services is labeled collaborative work and is not presented as an independently built project.
- PCIU CGPA Calculator appears separately as a collaborative contribution with no specific individual-contribution claim.
- Smart Attendance Tracker is not included in the public developer-evidence set; no private repository, credentials, employer identity, or personal attendance data is published.
- The portfolio does not use unverified percentages, performance outcomes, or unsupported availability claims.
```

Keep the six-language clarification and all SMTP examples as placeholders. Confirm no credential value appears in README.

- [ ] **Step 2: Run the full automated verification**

Run:

```bash
npm run build:css
npm test -- --runInBand
git diff --check
```

Expected: CSS build exits 0; 9 suites and 78 tests pass; `git diff --check` prints nothing.

- [ ] **Step 3: Audit claims, attribution, and privacy**

Run:

```bash
rg -n -i "technical support evidence|Smart Attendance Tracker|data-private-evidence|private-badge|collaborative-note|Web Developer|Full[- ]Stack Developer|improved [0-9]+%|reduced [0-9]+%|24/7" views locales public/resume.html README.md tests
rg -n "Developer Evidence|Evidence from systems I have worked on|production-grade feature scope|not presented as deployment-ready|Collaborative work|Collaborative contribution|house-shifting-services|pciu-cgpa-calculator" views locales public/resume.html README.md tests
```

Expected: the first command returns no removed evidence labels, private-card markup, developer-first job positioning, or invented outcome claims. The second confirms the required English boundaries. Manually distinguish the allowed project category `Full-stack web application` from the prohibited professional title `Full-Stack Developer`.

- [ ] **Step 4: Verify repository links and responsive layout**

Render English desktop at 1440×900, English mobile at 390×844, Arabic desktop at 1440×900, and Arabic mobile at 390×844. For each viewport verify:

```text
document.documentElement.scrollWidth === document.documentElement.clientWidth
document.querySelectorAll('[data-evidence-card]').length === 3
document.querySelectorAll('[data-evidence-source]').length === 3
document.querySelector('[data-collaborative-evidence]') !== null
document.querySelectorAll('[data-collaborative-contribution]').length === 1
document.querySelector('[data-contribution-source]').href === 'https://github.com/saamaamr/pciu-cgpa-calculator'
document.querySelectorAll('[data-metric]').length === 3
document.querySelector('[data-metric="portfolio-languages"]') === null
```

Scroll the evidence section into view and confirm all three images report `complete === true` and `naturalWidth > 0`. Confirm the Arabic page remains RTL and both the House badge and PCIU contribution note are readable.

- [ ] **Step 5: Commit README and any verification-only corrections**

```bash
git commit -m "docs: document public developer evidence"
```

Stage `README.md` plus only files changed to correct verified defects. Never stage `.env` or `logs/combined.log`.

- [ ] **Step 6: Verify the final repository state**

Run:

```bash
git status --short
git log --oneline -5
git diff --check
```

Expected: only the pre-existing `logs/combined.log` modification remains; the new implementation commits are visible; no whitespace errors exist.
