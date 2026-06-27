# 🚀 Netlify Deploy Ko'rsatmasi

Bu qo'llanma SeenSMS saytini Netlify ga deploy qilish uchun.

## ⚡ Tezkor Deploy (3 daqiqa)

### 1. Netlify hisobini yarating
1. [Netlify](https://app.netlify.com/signup) ga o'ting
2. GitHub akkaunt bilan kirish (**Login with GitHub**)
3. Netlify ga GitHub dan ruxsat bering

### 2. Yangi sayt qo'shing
1. Netlify dashboardda **"Add new site"** tugmasini bosing
2. **"Import an existing project"** ni tanlang
3. **"Deploy with GitHub"** ni tanlang

### 3. Repository tanlang
1. **"alfadirektor71/Claude-uchun"** repository ni toping
2. Repository ni tanlang
3. Agar ko'rinmasa: **"Configure the Netlify app on GitHub"** > ruxsat bering

### 4. Deploy sozlamalarini kiriting

```
Base directory: smm-website
Build command: (bo'sh qoldiring)
Publish directory: .
```

**Yoki oddiy yo'l:**
- Branch to deploy: `main`
- Base directory: `smm-website`
- Build command: bo'sh
- Publish directory: `.` (nuqta)

### 5. Deploy qiling
1. **"Deploy site"** tugmasini bosing
2. 1-2 daqiqa kutings
3. Tayyor! 🎉

---

## 🌐 Netlify orqali test qilish

Deploy tugagach, sizga quyidagi ko'rinishda URL beriladi:
```
https://random-name-12345.netlify.app
```

Bu URL orqali saytingizni ochib test qilishingiz mumkin!

---

## 🎨 Custom Domain (anorsmm.uz)

Keyinchalik o'z domeningizni ulash uchun:

### 1. Netlify Dashboardda
1. Sayt sozlamalariga o'ting: **Site settings**
2. **Domain management** bo'limiga o'ting
3. **Add custom domain** ni bosing
4. `anorsmm.uz` ni kiriting

### 2. DNS sozlamalari
Domeningiz provayderida (registrar) quyidagi DNS record'larni qo'shing:

#### A Record
```
Type: A
Name: @ (yoki bo'sh)
Value: 75.2.60.5
```

#### CNAME Record (www uchun)
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

**Netlify IP manzillari:**
- `75.2.60.5`
- `99.83.190.102`
- `13.248.212.111`
- `13.33.88.20`

### 3. SSL/HTTPS
Netlify avtomatik ravishda bepul SSL sertifikat beradi (Let's Encrypt).
- 1-2 soat ichida faollashadi
- Hech narsa qilish shart emas!

---

## 📋 Netlify Sozlamalari

### Build Settings
```toml
[build]
  publish = "."
  command = ""
```

### Environment Variables (kerak bo'lsa)
Agar backend API kerak bo'lsa:
```
API_URL=https://api.anorsmm.uz
API_KEY=your-secret-key
```

Settings > Environment variables > Add variable

---

## 🔧 Muammolarni Hal Qilish

### 404 Error
- `netlify.toml` fayli mavjudligini tekshiring
- Redirects to'g'ri sozlanganligini tekshiring

### CSS/JS yuklanmaydi
- Fayl yo'llari to'g'riligini tekshiring
- Browser cache ni tozalang (Ctrl+Shift+R)

### Deploy muvaffaqiyatsiz
1. Base directory to'g'ri ekanligini tekshiring: `smm-website`
2. Publish directory: `.` bo'lishi kerak
3. Deploy logs ni tekshiring

---

## 📱 Test Qilish

Deploy tugagach test qilish:

### 1. Bosh sahifa
- ✅ Hero section ko'rinishi
- ✅ Xizmatlar bo'limi
- ✅ Narxlar jadvali
- ✅ Contact forma

### 2. Login sahifasi
- ✅ `/login.html` ochilishi
- ✅ Demo kirish ishlashi
- ✅ Password toggle

### 3. Dashboard
- ✅ Login qilgandan keyin dashboard ochilishi
- ✅ Stats ko'rinishi
- ✅ Sidebar navigation

### 4. Responsive
- ✅ Mobile qurilmada
- ✅ Tablet da
- ✅ Desktop da

---

## 🎯 Demo Ma'lumotlar

Saytni test qilish uchun:
```
Email: demo@seensms.uz
Parol: demo123
```

Demo user avtomatik yaratiladi (LocalStorage).

---

## 📊 Netlify Features

### Bepul Plan
- ✅ 100 GB bandwidth/oy
- ✅ 300 build daqiqalar/oy
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Form submissions
- ✅ Custom domain

### Pro Plan ($19/oy)
- 400 GB bandwidth
- 1000 build daqiqalar
- Background functions
- Analytics

---

## 🔄 Yangilanishlar

Har safar GitHub ga push qilganingizda:
1. Netlify avtomatik deploy qiladi
2. 1-2 daqiqada yangi versiya live bo'ladi
3. Email orqali xabar keladi

---

## 📞 Yordam

Muammo bo'lsa:
1. [Netlify Docs](https://docs.netlify.com/)
2. [Netlify Community](https://answers.netlify.com/)
3. [Netlify Status](https://netlifystatus.com/)

---

## ✅ Deploy Checklist

- [ ] Netlify hisobi yaratildi
- [ ] GitHub ulandi
- [ ] Repository import qilindi
- [ ] Base directory: `smm-website`
- [ ] Deploy muvaffaqiyatli
- [ ] URL ochildi
- [ ] Login ishlaydi
- [ ] Dashboard ochiladi
- [ ] Mobile da test qilindi
- [ ] Custom domain sozlandi (agar kerak bo'lsa)

---

**Muvaffaqiyat! 🎉**

Saytingiz: `https://your-site.netlify.app`

Keyinchalik: `https://anorsmm.uz`
