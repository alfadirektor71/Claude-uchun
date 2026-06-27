# SeenSMS - SMM Xizmatlari Platformasi 🚀

Zamonaviy SMM (Social Media Marketing) xizmatlari uchun to'liq funksional veb-platforma. Telegram, SMS, Instagram, YouTube va boshqa ijtimoiy tarmoqlar uchun professional xizmatlar.

![SeenSMS Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=SeenSMS+SMM+Platform)

## 🌟 Xususiyatlar

### ✨ Asosiy Funksiyalar
- 🎨 **Zamonaviy Dizayn** - Gradient ranglar, animatsiyalar, responsive layout
- 🔐 **To'liq Autentifikatsiya** - Login, Register, Password Reset
- 📊 **Dashboard** - Real-time statistika va hisobotlar
- 💳 **To'lov Tizimi** - Ko'p to'lov usullari bilan integratsiya
- 📱 **Responsive** - Barcha qurilmalarda mukammal ishlaydi
- 🌙 **Dark Mode** - Qorong'i va yorug' mavzular

### 🛍️ Xizmatlar
- **Telegram** - Obunachiler, ko'rishlar, reaksiyalar
- **SMS** - Virtual raqamlar, verifikatsiya kodlari
- **Instagram** - Obunachilar, layklar, ko'rishlar
- **YouTube** - Ko'rishlar, layklar, obunachiler
- **Facebook** - Layklar, followers, ko'rishlar
- **TikTok** - Ko'rishlar, layklar, followers

## 🚀 Tezkor Boshlash

### 1. Fayllarni yuklab oling
```bash
git clone https://github.com/alfadirektor71/Claude-uchun.git
cd Claude-uchun/smm-website
```

### 2. Brauzerda ochish
Faqat `index.html` faylini brauzerda oching. Hech qanday server talab qilinmaydi!

```bash
# yoki oddiy HTTP server ishga tushiring
python -m http.server 8000
# yoki
npx serve
```

### 3. Demo Kirish
Saytni sinab ko'rish uchun:
- **Email:** demo@seensms.uz
- **Parol:** demo123

## 📁 Fayl Strukturasi

```
smm-website/
├── index.html              # Bosh sahifa
├── login.html              # Kirish sahifasi
├── register.html           # Ro'yxatdan o'tish
├── dashboard.html          # Foydalanuvchi kabineti
├── css/
│   ├── styles.css         # Asosiy stillar
│   ├── auth.css           # Autentifikatsiya stillari
│   └── dashboard.css      # Dashboard stillari
├── js/
│   ├── storage.js         # LocalStorage management
│   ├── auth.js            # Autentifikatsiya logikasi
│   ├── dashboard.js       # Dashboard funksiyalari
│   └── main.js            # Asosiy JavaScript
└── README.md              # Bu fayl
```

## 💡 Texnologiyalar

- **HTML5** - Semantik markup
- **CSS3** - Flexbox, Grid, Animations
- **JavaScript (ES6+)** - Zamonaviy JS
- **LocalStorage** - Ma'lumotlarni saqlash
- **Font Awesome** - Ikonkalar
- **Google Fonts** - Typography

## 🎨 Dizayn Xususiyatlari

### Ranglar
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#ec4899` (Pink)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Danger: `#ef4444` (Red)

### Gradientlar
- Gradient 1: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`
- Gradient 2: `linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)`
- Gradient 3: `linear-gradient(135deg, #10b981 0%, #6366f1 100%)`

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (max-width: 1024px) { }

/* Large Desktop */
@media (max-width: 1200px) { }
```

## 🔧 Funksiyalar

### LocalStorage API
```javascript
// Foydalanuvchi yaratish
userManager.register(userData);

// Kirish
userManager.login(email, password);

// Buyurtma yaratish
orderManager.createOrder(orderData);

// Balans to'ldirish
transactionManager.addTransaction(transactionData);
```

### Ma'lumotlar Strukturasi

#### User Object
```javascript
{
    id: "unique-id",
    firstName: "Ism",
    lastName: "Familiya",
    email: "email@example.com",
    phone: "+998901234567",
    password: "hashed-password",
    plan: "basic|professional|enterprise",
    balance: 100.00,
    createdAt: "2024-01-01T00:00:00.000Z",
    verified: true
}
```

#### Order Object
```javascript
{
    id: "unique-id",
    userId: "user-id",
    service: "Service Name",
    category: "telegram|sms|instagram|youtube",
    quantity: 1000,
    link: "@channel or URL",
    price: 25.00,
    status: "pending|in-progress|completed|cancelled",
    progress: 65,
    createdAt: "2024-01-01T00:00:00.000Z",
    completedAt: null
}
```

## 🎯 Xizmatlar Ro'yxati

### Telegram Xizmatlari
- **Members (Real)** - $0.02/dona - 100-50,000
- **Members (Fast)** - $0.01/dona - 100-100,000
- **Post Views** - $0.003/ko'rish - 500-1,000,000
- **Reactions** - $0.005/dona - 100-50,000

### SMS Xizmatlari
- **USA** - $0.50/SMS
- **UK** - $0.45/SMS
- **Russia** - $0.30/SMS
- **100+ davlatlar**

### Instagram Xizmatlari
- **Followers** - $0.01/dona - 100-50,000
- **Likes** - $0.008/dona - 50-100,000
- **Video Views** - $0.005/ko'rish - 500-1,000,000

### YouTube Xizmatlari
- **Views** - $0.005/ko'rish - 1,000-1,000,000
- **Likes** - $0.02/dona - 50-10,000
- **Subscribers** - $0.03/dona - 100-50,000

## 📊 Tariflar

### Boshlang'ich - $10/oy
- 1,000 SMS
- 500 Telegram obuna
- Asosiy statistika
- Email qo'llab-quvvatlash

### Professional - $50/oy ⭐ (Tavsiya etiladi)
- 10,000 SMS
- 5,000 Telegram obuna
- To'liq statistika
- 24/7 qo'llab-quvvatlash
- API kirish

### Korporativ - $200/oy
- Cheksiz SMS
- Cheksiz Telegram
- Ilg'or statistika
- Shaxsiy menejer
- API + Webhooks
- Maxsus integratsiya

## 🔐 Xavfsizlik

- ✅ Client-side ma'lumotlar shifrlangan
- ✅ LocalStorage xavfsiz saqlash
- ✅ HTTPS tavsiya etiladi (production)
- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection (agar server ishlatilsa)

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📝 To Do

- [ ] Backend API integratsiya
- [ ] Real to'lov gateway (Stripe, PayPal)
- [ ] Email verification
- [ ] SMS verification
- [ ] Social login (Google, Telegram)
- [ ] Multi-language support
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] WebSocket real-time updates
- [ ] PWA support

## 🤝 Contributing

Pull request'lar xush kelibsiz! Katta o'zgarishlar uchun avval issue oching.

## 📄 License

MIT License - batafsil ma'lumot uchun [LICENSE](LICENSE) faylini ko'ring.

## 👨‍💻 Muallif

**Alfa Direktor**
- GitHub: [@alfadirektor71](https://github.com/alfadirektor71)
- Repository: [Claude-uchun](https://github.com/alfadirektor71/Claude-uchun)

## 🙏 Minnatdorchilik

- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Typography
- [Unsplash](https://unsplash.com/) - Images (agar ishlatilgan bo'lsa)

## 📞 Aloqa

- **Email:** support@seensms.uz
- **Telegram:** [@SeenSMS](https://t.me/SeenSMS)
- **Phone:** +998 90 123 45 67

---

<p align="center">
  <strong>SeenSMS</strong> bilan SMM xizmatlarini avtomatlashtiring! 🚀
</p>

<p align="center">
  ⭐ Loyihani yoqtirdingizmi? Star bering!
</p>
