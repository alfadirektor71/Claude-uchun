# 💼 Professional Moliyaviy Boshqaruv Tizimi

Modern va professional veb-based moliyaviy boshqaruv tizimi. Biznesingizni to'liq nazorat qilish uchun barcha kerakli funksiyalar bir joyda!

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Language](https://img.shields.io/badge/language-O'zbekcha-red.svg)

## 🌟 Asosiy Funksiyalar

### 📊 Dashboard
- **Real-time statistika**: Bugungi, haftalik, oylik daromad/xarajat
- **Animatsiyali grafiklar**: Chart.js bilan professional charts
- **Hisob-kitoblar**: Avtomatik balans, foyda, foyda foizi
- **So'nggi tranzaksiyalar**: Barcha moliyaviy harakatlarni bir joyda

### 💰 Daromad Moduli
- Cheksiz daromad qo'shish
- Kategoriyalar bo'yicha guruhlash
- Mijozlarga bog'lash
- To'lov usuli, sana, izoh
- Filter, qidiruv, saralash

### 💸 Xarajat Moduli
- Barcha xarajatlarni boshqarish
- Yetkazib beruvchilar bilan ishlash
- Kategoriyalar va sub-kategoriyalar
- Detallı izohlar

### 👥 Mijozlar (CRM)
- To'liq mijozlar bazasi
- Telefon, Telegram, eslatmalar
- Har bir mijoz uchun to'lov tarixi
- Jami to'lovlar va qarzlar
- Mijoz profili

### 💳 Qarz Boshqaruvi
- Menga qarz (receivables)
- Menda qarz (payables)
- Muddat va eslatmalar
- Status: To'langan/Kutilmoqda
- Muddati o'tgan qarzlarni belgilash

### 📈 Hisobotlar
- Kunlik, haftalik, oylik, yillik hisobotlar
- **PDF Export** - jsPDF bilan
- **Excel Export** - xlsx bilan
- **Print** - chop etish uchun optimizatsiya
- Detallı kategoriya bo'yicha tahlil

### 🏷️ Kategoriyalar
- Custom kategoriyalar yaratish
- Daromad va xarajat kategoriyalari
- Kategoriyalarni tahrirlash/o'chirish

### ⚙️ Sozlamalar
- 🌓 **Dark/Light Mode** - Ko'z uchun qulay
- 💾 **Backup/Restore** - Ma'lumotlarni himoyalash
- 📊 **Statistika** - Umumiy ko'rsatkichlar
- 🗑️ **Data Management** - To'liq nazorat

## 🎨 Dizayn Xususiyatlari

- ✨ **Modern UI/UX** - Stripe, Linear, Notion'dan ilhom olgan
- 📱 **Fully Responsive** - Desktop, tablet, mobile
- 🎭 **Glassmorphism** - Zamonaviy blur effektlar
- 🚀 **Fast Animations** - CSS va Framer Motion
- 🎨 **Professional Colors** - Ergonomik rang palitrasi
- 🔔 **Toast Notifications** - Foydalanuvchiga xabarlar

## 🛠️ Texnologiyalar

```
Frontend:
├── HTML5
├── CSS3 (Custom Tailwind-style)
├── Vanilla JavaScript (ES6+)
├── Chart.js (Grafiklar)
├── jsPDF & jsPDF-AutoTable (PDF)
└── SheetJS/xlsx (Excel)

Storage:
└── Browser LocalStorage

Icons & Fonts:
├── Font Awesome 6
└── Google Fonts (Inter)
```

## 📦 O'rnatish

### 1. Fayllarni Yuklab Olish

```bash
git clone https://github.com/YOUR_USERNAME/financial-management.git
cd financial-management
```

### 2. Ochish

Shunchaki `login.html` faylini brauzerda oching:

```bash
# Windows
start login.html

# macOS
open login.html

# Linux
xdg-open login.html
```

Yoki local server bilan:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code Live Server extension
```

Keyin: `http://localhost:8000/login.html`

## 🚀 Deploy Qilish

To'liq qo'llanma: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Tez deploy:**

### Netlify (1 daqiqa):
1. https://netlify.com ga kiring
2. Fayllarni drag & drop qiling
3. Tayyor! ✅

### GitHub Pages:
```bash
git add .
git commit -m "Deploy"
git push
```
Settings > Pages > Enable

## 📖 Foydalanish

### Birinchi Kirish
1. `login.html` ni oching
2. "Tizimga Kirish" tugmasini bosing
3. Dashboard ochiladi

### Daromad Qo'shish
1. Sidebar > **Daromad**
2. **Yangi daromad** tugmasini bosing
3. Ma'lumotlarni kiriting:
   - Miqdor (so'mda)
   - Kategoriya
   - Mijoz (ixtiyoriy)
   - To'lov usuli
   - Sana
4. **Saqlash**

### Xarajat Qo'shish
1. Sidebar > **Xarajat**
2. **Yangi xarajat** tugmasini bosing
3. Barcha maydonlarni to'ldiring
4. **Saqlash**

### Mijoz Qo'shish
1. Sidebar > **Mijozlar**
2. **Yangi mijoz**
3. Ism, telefon, Telegram
4. **Saqlash**

### Hisobot Yaratish
1. Sidebar > **Hisobotlar**
2. Sana oralig'ini tanlang
3. **Hisobot yaratish**
4. PDF/Excel yuklab olish yoki print qiling

### Backup Olish
1. Sidebar > **Sozlamalar**
2. **Ma'lumotlarni Yuklab Olish**
3. JSON fayl yuklanadi
4. Xavfsiz joyda saqlang!

## 📊 Ma'lumotlar Strukturasi

Ma'lumotlar brauzerning `localStorage`'da saqlanadi:

```javascript
{
  "incomes": [...],      // Barcha daromadlar
  "expenses": [...],     // Barcha xarajatlar
  "customers": [...],    // Mijozlar bazasi
  "debts": [...],        // Qarzlar ro'yxati
  "categories": {...}    // Custom kategoriyalar
}
```

### Xavfsizlik
- ✅ Ma'lumotlar faqat sizning brauzeringizda
- ✅ Hech qanday serverga yuklanmaydi
- ✅ Offline ishlaydi
- ⚠️ Cache/cookies tozalaganda o'chishi mumkin
- 💡 Har haftada backup oling!

## 🎯 Funksiya To'liq Ro'yxati

- [x] Dashboard real-time statistika
- [x] Daromad CRUD (Create, Read, Update, Delete)
- [x] Xarajat CRUD
- [x] Mijozlar CRM
- [x] Qarz boshqaruvi
- [x] Kategoriyalar management
- [x] Hisobotlar (kunlik, haftalik, oylik, yillik)
- [x] PDF eksport
- [x] Excel eksport
- [x] Chop etish
- [x] Global qidiruv
- [x] Filter va saralash
- [x] Dark/Light mode
- [x] Mobile responsive
- [x] Data backup/restore
- [x] Chart.js grafiklar
- [x] Toast notifications
- [x] Animatsiyalar
- [x] LocalStorage persist

## 🌐 Brauzer Qo'llab-quvvatlash

| Brauzer | Versiya | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ To'liq |
| Firefox | 88+ | ✅ To'liq |
| Safari | 14+ | ✅ To'liq |
| Edge | 90+ | ✅ To'liq |
| Opera | 76+ | ✅ To'liq |
| Mobile Safari | iOS 14+ | ✅ To'liq |
| Chrome Android | 90+ | ✅ To'liq |

## 📱 Mobile Optimizatsiya

- ✅ Touch-friendly interface
- ✅ Swipe gestures
- ✅ Responsive tables
- ✅ Collapsible sidebar
- ✅ Mobile-first design
- ✅ Fast loading

## 🐛 Bug Report

Agar xatolik topsangiz:

1. GitHub Issues'ga xabar bering
2. Xato screenshotini qo'shing
3. Brauzer va versiyani yozing

## 🤝 Hissa Qo'shish

Pull request'lar xush kelibsiz!

```bash
# Fork qiling
# Branch yarating
git checkout -b feature/AmazingFeature

# Commit qiling
git commit -m 'Add some AmazingFeature'

# Push qiling
git push origin feature/AmazingFeature

# Pull Request oching
```

## 📝 License

MIT License - [LICENSE](LICENSE) faylini o'qing

## 👨‍💻 Muallif

**Professional Financial Management System**

Yaratilgan ❤️ bilan O'zbekiston uchun

## 🙏 Minnatdorchilik

- [Chart.js](https://www.chartjs.org/) - Grafiklar
- [Font Awesome](https://fontawesome.com/) - Ikonlar
- [jsPDF](https://github.com/parallax/jsPDF) - PDF
- [SheetJS](https://sheetjs.com/) - Excel

## 📞 Qo'llab-quvvatlash

- 📧 Email: support@example.com
- 💬 Telegram: @yourusername
- 🌐 Website: https://yourwebsite.com

---

⭐ **Agar sizga yoqsa, GitHub'da star bering!** ⭐

**Moliyangizni professional boshqaring! 💼📊💰**
