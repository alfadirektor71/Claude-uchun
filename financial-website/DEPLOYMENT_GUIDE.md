# 🚀 Deployment Guide - Serverga Joylashtirish Qo'llanmasi

Bu professional moliyaviy boshqaruv veb-saytini turli hosting provayderlariga qanday joylashtirish bo'yicha to'liq qo'llanma.

## 📋 Umumiy Ma'lumot

Bu statik veb-sayt bo'lib, hech qanday server yoki database talab qilmaydi. Barcha ma'lumotlar brauzerda localStorage'da saqlanadi.

**Texnologiyalar:**
- HTML5
- CSS3 (Tailwind-style custom CSS)
- Vanilla JavaScript
- Chart.js (grafiklar uchun)
- jsPDF & xlsx (export uchun)

---

## 🌐 1. NETLIFY orqali Deploy qilish (ENG OSON)

### Bosqichma-bosqich:

1. **Netlify'ga ro'yxatdan o'ting**
   - https://netlify.com saytiga kiring
   - GitHub, GitLab yoki email orqali ro'yxatdan o'ting

2. **Fayllarni tayyorlang**
   - `financial-website` papkasidagi barcha fayllarni zip formatiga siqing
   - Yoki GitHub'ga yuklab, Netlify'ga bog'lang

3. **Deploy qiling**
   - Netlify dashboard'ga kiring
   - "Add new site" > "Deploy manually" bosing
   - Zip faylni drag & drop qiling
   - 1-2 daqiqada saytingiz tayyor!

4. **Custom domen ulang (ixtiyoriy)**
   - Site settings > Domain management
   - "Add custom domain" bosing
   - DNS sozlamalarini ko'rsatmaga binoan o'zgartiring

**URL misoli:** `https://moliyaviy-tizim.netlify.app`

---

## 📦 2. VERCEL orqali Deploy qilish

### Qadamlar:

1. **Vercel'ga kiring**
   - https://vercel.com
   - GitHub orqali tizimga kiring

2. **Yangi proekt yarating**
   - "Add New" > "Project" bosing
   - GitHub repositoriyangizni import qiling
   - Yoki fayllarni manual yuklab, CLI bilan deploy qiling

3. **Deploy**
   ```bash
   # Vercel CLI'ni o'rnatish
   npm install -g vercel
   
   # Deploy qilish
   cd financial-website
   vercel
   ```

4. **Tayyor!**
   - Avtomatik HTTPS
   - CDN bilan tez yuklash
   - Custom domen bepul

---

## 🖥️ 3. cPanel/Shared Hosting orqali Deploy qilish

Ko'pchilik hosting provayderlar (Beget, Hostinger, Bluehost, va boshqalar) cPanel'dan foydalanadi.

### Qadamlar:

1. **Hosting sotib oling**
   - Istalgan hosting provayder (Hostinger, Namecheap, va h.k.)
   - Eng arzon tarif kifoya (statik sayt uchun)

2. **cPanel'ga kiring**
   - Hosting provayder bergan linkdan (odatda: `https://yourdomain.com:2083`)
   - Login va parolni kiriting

3. **File Manager'ga kiring**
   - cPanel'da "File Manager" ni toping
   - `public_html` papkasiga kiring

4. **Fayllarni yuklang**
   - "Upload" tugmasini bosing
   - `financial-website` papkasidagi BARCHA fayllarni yuklang:
     ```
     index.html
     login.html
     income.html
     expense.html
     customers.html
     debts.html
     reports.html
     categories.html
     settings.html
     css/
     js/
     ```

5. **Saytingizni oching**
   - `http://yourdomain.com/login.html`

### cPanel bilan Video Tutorial:
1. File Manager > Upload Files
2. Barcha HTML, CSS, JS fayllarni yuklang
3. `index.html` ni root direktoriyaga qo'ying

---

## 💻 4. GitHub Pages orqali Deploy qilish (BEPUL)

### Qadamlar:

1. **GitHub repositoriyasi yarating**
   ```bash
   cd financial-website
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/financial-management.git
   git push -u origin main
   ```

2. **GitHub Pages'ni yoqing**
   - Repository > Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / folder: "/ (root)"
   - Save

3. **Tayyor!**
   - 2-3 daqiqada sayt tayyor bo'ladi
   - URL: `https://YOUR_USERNAME.github.io/financial-management/`

---

## ☁️ 5. Firebase Hosting orqali Deploy

### Qadamlar:

1. **Firebase'ga ro'yxatdan o'ting**
   - https://firebase.google.com
   - Google akkaunt bilan kiring

2. **Firebase CLI'ni o'rnatish**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

3. **Proektni sozlash**
   ```bash
   cd financial-website
   firebase init hosting
   
   # Savollar:
   # Public directory? Enter: . (current folder)
   # Single-page app? No
   # GitHub automatic builds? No
   ```

4. **Deploy qiling**
   ```bash
   firebase deploy
   ```

5. **URL olasiz:**
   - `https://your-project.web.app`

---

## 🔒 6. Cloudflare Pages orqali Deploy

### Qadamlar:

1. **Cloudflare'ga kiring**
   - https://pages.cloudflare.com
   - Email bilan ro'yxatdan o'ting

2. **Git'ni ulang**
   - GitHub/GitLab repositoriyangizni ulang
   - Yoki "Direct Upload" orqali fayllarni yuklang

3. **Build sozlamalari**
   - Framework preset: None
   - Build command: (bo'sh qoldiring)
   - Build output directory: `/`

4. **Deploy!**
   - Avtomatik SSL
   - Global CDN
   - Bepul

---

## 📱 7. Telefon orqali Deploy (Android)

### Acode ilovasi bilan:

1. **Acode Editor'ni o'rnating** (Play Store'dan)
2. Barcha fayllarni telefon storage'ga ko'chiring
3. **Netlify Drop** yoki **GitHub Mobile** orqali yuklang

---

## 🛠️ 8. O'z Server'ingizga (VPS/VDS) Deploy

### Nginx bilan:

```bash
# Server'ga ulanish
ssh root@your-server-ip

# Nginx o'rnatish (Ubuntu/Debian)
sudo apt update
sudo apt install nginx -y

# Fayllarni yuklash
cd /var/www/html
sudo git clone https://github.com/YOUR_USERNAME/financial-management.git
cd financial-management

# Nginx'ni sozlash
sudo nano /etc/nginx/sites-available/default

# Quyidagi konfiguratsiyani qo'shing:
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/financial-management;
    index login.html index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# Nginx'ni restart qiling
sudo systemctl restart nginx
```

---

## ✅ Deploy'dan keyin Tekshirish

1. **Saytni oching:** `yourdomain.com/login.html`
2. **Funksiyalarni sinab ko'ring:**
   - ✅ Login sahifasi ochilishi
   - ✅ Dashboard grafiklari ko'rinishi
   - ✅ Daromad/Xarajat qo'shish
   - ✅ Mijoz qo'shish
   - ✅ Hisobotlarni export qilish
   - ✅ Dark/Light mode ishlashi
   - ✅ Mobile'da to'g'ri ko'rinishi

---

## 🔧 Troubleshooting (Muammolarni Hal Qilish)

### Problem 1: 404 Not Found
**Sabab:** Fayllar to'g'ri joyga yuklanmagan
**Hal:**
- `index.html` root direktoriyada ekanligini tekshiring
- Barcha fayl nomlari kichik harfda bo'lishi kerak

### Problem 2: CSS yuklanmayapti
**Sabab:** Path noto'g'ri
**Hal:**
- `css/styles.css` papka strukturasi to'g'ri ekanligini tekshiring
- Browser console'ni oching (F12) va xatolarni ko'ring

### Problem 3: JavaScript ishlamayapti
**Sabab:** CDN'lar bloklangan
**Hal:**
- Internet ulanishini tekshiring
- Ad-blocker o'chirib ko'ring

### Problem 4: Ma'lumotlar saqlanmayapti
**Sabab:** localStorage mavjud emas
**Hal:**
- Browser'da cookies va JavaScript yoqilgan bo'lishi kerak
- Private/Incognito mode'da ishlamaydi

---

## 📊 Hosting Narxlari (2024)

| Provider | Narx/oy | Xususiyatlar |
|----------|---------|-------------|
| **Netlify** | BEPUL | 100GB bandwidth, SSL, CDN |
| **Vercel** | BEPUL | Cheksiz bandwidth, SSL, CDN |
| **GitHub Pages** | BEPUL | 1GB, Public repo kerak |
| **Firebase** | BEPUL | 10GB storage, SSL |
| **Cloudflare Pages** | BEPUL | Cheksiz bandwidth |
| **Hostinger** | $2.99/oy | Shared hosting, cPanel |
| **Beget** | ~500₽/oy | Rus hosting, cPanel |

---

## 🎯 Tavsiyalar

### Eng yaxshi variantlar:

1. **Yangi boshlovchilar uchun:** Netlify (drag & drop!)
2. **Dasturchilar uchun:** Vercel yoki GitHub Pages
3. **Professional biznes uchun:** cPanel hosting + custom domain
4. **O'zbek mijozlar uchun:** Beget.uz yoki Uztelecom

---

## 🔐 Xavfsizlik Maslahatlari

1. **HTTPS** - Hamma zamonaviy hostinglar bepul SSL beradi
2. **Backup** - Har haftada Settings > Backup Ma'lumotlarni yuklab oling
3. **Password** - Login sahifasiga parol qo'yish uchun ichki kod qo'shing
4. **Private hosting** - Maxfiy moliyaviy ma'lumotlar uchun

---

## 📞 Yordam

Agar deploy qilishda muammo bo'lsa:

1. **GitHub Issues:** Muammolarni yozing
2. **Telegram:** O'zbek dasturchilar guruhi
3. **Documentation:** Hosting provayder'ning qo'llanmasini o'qing

---

## ✨ Qo'shimcha Sozlamalar

### Custom Domain ulash:
1. Domain sotib oling (Hostinger, Namecheap)
2. DNS sozlamalarini o'zgartiring:
   ```
   A Record: @ -> hosting IP
   CNAME: www -> yourdomain.com
   ```
3. 24 soat kuting (DNS propagation)

### Google Analytics qo'shish:
```html
<!-- index.html'ga qo'shing (</head> dan oldin) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

**Muvaffaqiyatli Deploy! 🎉**

Savol bo'lsa, muammo bo'lsa - izoh qoldiring!
