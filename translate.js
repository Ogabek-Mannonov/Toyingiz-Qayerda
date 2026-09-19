const fs = require('fs');
const path = require('path');

// Target directories
const targetDirs = [
  path.join(__dirname, 'frontend', 'src'),
  path.join(__dirname, 'backend', 'controllers'),
  path.join(__dirname, 'backend', 'middlewares'),
  path.join(__dirname, 'backend', 'routes')
];

// Comprehensive Dictionary (Uzbek -> English)
// Tartib muhim: uzun jumlalar oldinroq turishi kerak (Qisman mos tushib qolmasligi uchun)
const dictionary = {
  "To’yxona va Egalar Qo'shish": "Add Venue & Owner",
  "To'yxona Va Egalar Qo'shish": "Add Venue & Owner",
  "Yaqinlashayotgan bronlar": "Upcoming Bookings",
  "Tasdiqlanmagan to'yxonalar": "Pending Venues",
  "Tasdiqlangan To’yxonalar": "Approved Venues",
  "Tasdiqlangan to'yxonalar": "Approved Venues",
  "Barcha majburiy maydonlarni to'ldiring!": "Please fill all required fields!",
  "Foydalanuvchi topilmadi yoki parol noto'g'ri": "User not found or incorrect password",
  "Serverda xatolik yuz berdi": "An error occurred on the server",
  "Server xatosi": "Server Error",
  "To’yxonalarni olishda xatolik yuz berdi": "Error fetching venues",
  "Bronlarni olishda xatolik yuz berdi": "Error fetching bookings",
  "Egalarning ro‘yxatini olishda xatolik yuz berdi": "Error fetching owners",
  "Statistika olishda xatolik": "Error fetching statistics",
  "Bronni bekor qilmoqchimisiz?": "Are you sure you want to cancel this booking?",
  "Bron muvaffaqiyatli bekor qilindi": "Booking successfully cancelled",
  "Bronni bekor qilishda xatolik yuz berdi": "Error cancelling booking",
  "Bu sana allaqachon band qilingan.": "This date is already booked.",
  "Avval tizimga kiring": "Please login first",
  "Rostdan ham chiqmoqchimisiz?": "Are you sure you want to log out?",
  "Hech narsa topilmadi": "Nothing found",
  "Yuklanmoqda...": "Loading...",
  "Odamlar soni": "Number of Guests",
  "Mijoz ismi": "Client Name",
  "Mijoz raqami": "Client Phone",
  "Qo‘shilgan sana": "Date Added",
  "Telefon raqam": "Phone Number",
  "To’yxona nomi": "Venue Name",
  "Umumiy to'yxonalar": "Total Venues",
  "O'tgan bronlar": "Past Bookings",
  "To'yxona egalari": "Venue Owners",
  "To’yxona Egalari": "Venue Owners",
  "Bronlar Ro’yxati": "Bookings List",
  "To'yxonalar": "Venues",
  "To’yxonalar": "Venues",
  "Bronlar": "Bookings",
  "Egalari": "Owners",
  "Admin Panel": "Admin Panel",
  "Dashboard": "Dashboard",
  "Bekor qilish": "Cancel",
  "Ha, chiqaman": "Yes, log out",
  "Barchasi": "All",
  "Yaqinlashayotgan": "Upcoming",
  "Bekor qilingan": "Cancelled",
  "O‘tilgan": "Completed",
  "Yakunlandi": "Completed",
  "Kutilmoqda": "Pending",
  "To’yxona tanlash": "Select Venue",
  "Sana bo‘yicha": "By Date",
  "To’yxona bo‘yicha": "By Venue",
  "Status bo‘yicha": "By Status",
  "O‘sish": "Ascending",
  "Kamayish": "Descending",
  "Ism bo‘yicha": "By First Name",
  "Familiya bo‘yicha": "By Last Name",
  "Qidiruv (ism, familiya, username)...": "Search (first name, last name, username)...",
  "Qidiruv...": "Search...",
  "Familiya": "Last Name",
  "Ism": "First Name",
  "Username": "Username",
  "Amallar": "Actions",
  "Sana": "Date",
  "Status": "Status",
  "Chiqish": "Logout",
  "Barcha rayonlar": "All Districts",
  "Narx": "Price",
  "so'm / o'rindiq": "UZS / seat",
  "Sig'im": "Capacity",
  "Manzil": "Address",
  "Telefon": "Phone",
  "To’yxona topilmadi": "Venue not found",
  "Tasdiqlangan": "Approved"
};

function translateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let hasChanges = false;

  for (const [uzbekWord, englishWord] of Object.entries(dictionary)) {
    // Regex orqali barcha mosliklarni almashtirish
    const regex = new RegExp(uzbekWord, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, englishWord);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Tarjima qilindi: ${filePath}`);
    return 1;
  }
  return 0;
}

function traverseDirectory(dir) {
  if (!fs.existsSync(dir)) return 0;
  
  const files = fs.readdirSync(dir);
  let updatedCount = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    // Ignore unneeded dirs
    if (file === 'node_modules' || file === '.git') continue;

    if (fs.statSync(fullPath).isDirectory()) {
      updatedCount += traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
      updatedCount += translateFile(fullPath);
    }
  }
  return updatedCount;
}

console.log("🚀 Tarjima jarayoni boshlandi...");

let totalUpdated = 0;
for (const dir of targetDirs) {
  console.log(`\nPapka tekshirilmoqda: ${dir}`);
  totalUpdated += traverseDirectory(dir);
}

console.log(`\n🎉 Barchasi yakunlandi! Jami ${totalUpdated} ta fayl muvaffaqiyatli ingliz tiliga o'girildi.`);
