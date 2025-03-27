const mongoose = require("mongoose");
require('dotenv').config();
console.log("🛠 Đang kiểm tra biến môi trường...");
console.log("MONGO_URI từ .env:", process.env.MONGO_URI);


// Kiểm tra xem biến môi trường có được load không
if (!process.env.MONGO_URI) {
  console.error("❌ Lỗi: MONGO_URI không được định nghĩa trong file .env");
  process.exit(1); // Dừng chương trình
}

const uri = process.env.MONGO_URI; // Lấy từ .env

// Kết nối đến MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Kiểm tra kết nối
const db = mongoose.connection;

// Khi kết nối thành công
db.on("connected", () => {
  console.log("✅ Kết nối MongoDB thành công!");
});

// Khi có lỗi xảy ra
db.on("error", (err) => {
  console.error("❌ Lỗi kết nối MongoDB:", err);
});

// Khi mất kết nối
db.on("disconnected", () => {
  console.log("⚠️ Kết nối MongoDB đã đóng!");
});
