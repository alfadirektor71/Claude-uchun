# 🚀 Tez Boshlash - Quick Start Guide

## 1️⃣ Local'da Ishga Tushirish (5 soniya)

### Variant 1: Oddiy ochish
```bash
# Shunchaki login.html faylini ikki marta bosing
# Yoki browserda oching:
```
📂 `login.html` → o'ng tugma → "Open with" → Browser tanlang

### Variant 2: Local Server (tavsiya etiladi)
```bash
# Python bilan:
python -m http.server 8000

# Keyin brauzerda oching:
http://localhost:8000/login.html
```

---

## 2️⃣ Netlify'ga Deploy (1 daqiqa) - ENG OSON!

### Bosqichlar:
1. **https://netlify.com** ga kiring (GitHub bilan)
2. **"Add new site"** → **"Deploy manually"** bosing
3. **financial-website** papkasini drag & drop qiling
4. **Tayyor!** Sizning URL: `https://your-site.netlify.app`

**Video:** https://youtu.be/netlify-deploy

---

## 3️⃣ GitHub Pages (BEPUL hosting)

```bash
# 1. GitHub'ga yuklash (agar hali yuklamagan bo'lsangiz)
cd financial-website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/financial-site.git
git push -u origin main

# 2. GitHub'da:
# Settings > Pages > Source: main branch > Save

# 3. Tayyor!
# https://YOUR_USERNAME.github.io/financial-site/login.html
```

---

## 4️⃣ cPanel Hosting (Shared Hosting)

### Fayllarni Yuklash:
1. **cPanel'ga kiring** (hosting provayderingizdan)
2. **File Manager** ni oching
3. **public_html** papkasiga kiring
4. **Upload** tugmasini bosing
5. **Barcha fayllarni** yuklang (index.html, login.html, css, js, ...)
6. **Tayyor!** → `http://yourdomain.com/login.html`

### Video Tutorial:
- **Hostinger:** https://youtu.be/hostinger-upload
- **cPanel:** https://youtu.be/cpanel-tutorial

---

## 📱 Birinchi Foydalanish

### 1. Tizimga Kirish
- `login.html` ni oching
- **"Tizimga Kirish"** tugmasini bosing

### 2. Dashboard
- Statistikalarni ko'ring
- Grafiklarni tekshiring

### 3. Birinchi Daromadni Qo'shing
- Sidebar → **Daromad**
- **Yangi daromad** tugmasini bosing
- Formani to'ldiring:
  ```
  Miqdor: 100000
  Kategoriya: Sotuv
  Sana: Bugun
  ```
- **Saqlash**

### 4. Xarajat Qo'shing
- Sidebar → **Xarajat**
- **Yangi xarajat**
- Ma'lumotlarni kiriting
- **Saqlash**

### 5. Hisobot Yarating
- Sidebar → **Hisobotlar**
- Sana oralig'ini tanlang
- **Hisobot yaratish**
- PDF yoki Excel yuklab oling

---

## 🔧 Sozlamalar

### Dark Mode Yoqish:
- Top bar → 🌙 tugma

### Backup Olish (MUHIM!):
- Sidebar → **Sozlamalar**
- **Ma'lumotlarni Yuklab Olish**
- JSON faylni xavfsiz joyda saqlang

### Kategoriya Qo'shish:
- Sidebar → **Kategoriyalar**
- **Qo'shish** tugmasini bosing
- Kategoriya nomini kiriting

---

## ❓ Tez-tez So'raladigan Savollar

### **Q: Ma'lumotlar qayerda saqlanadi?**
A: Brauzerning localStorage'ida. Faqat sizning kompyuteringizda.

### **Q: Internetga muhtojmi?**
A: Yo'q! Butunlay offline ishlaydi. Faqat CDN'lar uchun internet kerak (fontlar, ikonlar).

### **Q: Xavfsizmi?**
A: Ha! Hech qanday ma'lumot serverga yuklanmaydi. Barchasi local.

### **Q: Backup qanday olish kerak?**
A: Har haftada Settings > Backup Ma'lumotlarni yuklab oling.

### **Q: Ma'lumotlar o'chadimi?**
A: Browser cache/cookies tozalaganda o'chishi mumkin. SHU SABABLI BACKUP oling!

### **Q: Mobile'da ishlaydimi?**
A: Ha! To'liq responsive va mobile-friendly.

### **Q: Boshqa odamlar ko'ra oladimi?**
A: Yo'q, faqat siz. Agar serverga deploy qilsangiz, URL bilan har kim kirishi mumkin.

### **Q: Parol qo'yish mumkinmi?**
A: Hozircha yo'q. Lekin code'ga password authentication qo'shish mumkin.

---

## 📊 Fayl Strukturasi

```
financial-website/
├── 📄 login.html              # Kirish sahifasi
├── 📄 index.html              # Dashboard
├── 📄 income.html             # Daromadlar
├── 📄 expense.html            # Xarajatlar
├── 📄 customers.html          # Mijozlar
├── 📄 debts.html              # Qarzlar
├── 📄 reports.html            # Hisobotlar
├── 📄 categories.html         # Kategoriyalar
├── 📄 settings.html           # Sozlamalar
├── 📁 css/
│   └── styles.css             # Barcha stillar
├── 📁 js/
│   ├── storage.js             # LocalStorage boshqaruv
│   ├── utils.js               # Helper funksiyalar
│   ├── dashboard.js           # Dashboard logikasi
│   ├── income.js              # Daromad funksiyalari
│   ├── expense.js             # Xarajat funksiyalari
│   ├── customers.js           # Mijozlar CRM
│   ├── debts.js               # Qarz boshqaruvi
│   ├── reports.js             # Hisobotlar
│   ├── categories.js          # Kategoriyalar
│   └── settings.js            # Sozlamalar
├── 📖 README.md               # To'liq dokumentatsiya
├── 🚀 DEPLOYMENT_GUIDE.md     # Deploy qo'llanmasi
└── ⚡ QUICK_START.md          # Bu fayl
```

---

## 🎯 Keyingi Qadamlar

1. ✅ Ma'lumotlar kiriting (daromad, xarajat, mijozlar)
2. ✅ Haftalik hisobot yarating
3. ✅ Dark mode'ni sinab ko'ring
4. ✅ Mobile'da ochib ko'ring
5. ✅ Backup oling!
6. ✅ Serverga deploy qiling
7. ✅ O'z domeningizni ulang

---

## 🆘 Yordam Kerakmi?

### Agar muammo bo'lsa:
1. **F12** bosing (Browser Console)
2. **Console** tabni oching
3. Xatolarni screenshot qiling
4. GitHub Issues'ga yuboring

### Video Qo'llanmalar:
- YouTube: "Financial Management System Setup"
- Telegram: @YourChannel

### Aloqa:
- 📧 Email: support@example.com
- 💬 Telegram: @yourusername

---

## 🎉 Muvaffaqiyatli Ishlatish!

**Moliyangizni professional boshqaring!** 💼📊💰

**Eslatma:** Har haftada BACKUP oling! 💾
