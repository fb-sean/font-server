# 📁 Font Server

A blazing fast, minimal font server built with raw `node:http` and `axios`.  
Includes a smart TypeScript **Google Fonts Proxy** with caching and support for **Hetzner Storage Box** (currently WIP).

---

## ✨ Features

- ⚡️ Pure Node.js – no frameworks, just `node:http`
- 🧠 Google Fonts Proxy – downloads fonts on-demand and caches them locally
- 💾 File Cache – serve files instantly if already cached
- ☁️ Hetzner Storage Box integration (planned, currently not working)
- 🛠 Built with TypeScript

---

## 🔧 Setup

### Build
```bash
npm run build
```

### Run
```bash
npm run start
```

### Replace
```css
src: url(https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2) format('woff2');
```

**=>**

```css
src: url(https://example.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2) format('woff2');
```

### OR
```html
<link type="text/css" href="https://fonts.googleapis.com/css?family=Tangerine" rel="stylesheet">
```

**=>**

```html
<link type="text/css" href="https://example.com/css?family=Tangerine" rel="stylesheet">
```

---

## 🌐 Google Fonts Proxy

Send a request like:

```
GET /s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2
```

The server will:
1. Check if the font is cached
2. If not, download it from Google Fonts
3. Store it locally
4. Serve it from the local cache next time 🚀

---

## 📦 Hetzner Storage Box (WIP)

There's built-in code to store files in a Hetzner Storage Box.  
Currently **not active** due to connection/auth issues, contributions welcome!

---

## 🤝 Contributions

Contributions are welcome!  
Feel free to open issues, suggest features or submit PRs.

---

## 💬 Contact
Have questions or ideas?  
Open an issue or ping me!