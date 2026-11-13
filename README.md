# 🌸 Daily Habit / Streak Tracker - Bức Tranh Mộng Mơ (Kawaii & Soft Pastel UI)

> Ứng dụng web theo dõi thói quen điểm danh hàng ngày với phong cách thiết kế **Kawaii, Soft Pastel & Marshmallow UI**, mang lại cảm giác ngọt ngào, thư thái và bình yên cho người dùng!

---

## 🎨 1. Bảng Màu Pastel & Phong Cách Thiết Kế (Design System)

### Bảng màu chủ đạo (Color Palette):
- **Soft Pink (Hồng phấn kẹo ngọt):** `#FFD1DC`, `#FFB7C5`, `#FF8E9E` (dùng cho nút chính, viền ảnh, điểm nhấn trái tim).
- **Mint Green (Xanh mint dịu mát):** `#D8F3DC`, `#95D5B2`, `#2D6A4F` (dùng cho trạng thái đã hoàn thành, mầm cây nở hoa).
- **Butter Yellow (Vàng bơ ấm áp):** `#FFF3B0`, `#FFE494`, `#FFD166` (dùng cho ngày hôm nay, ngôi sao lấp lánh).
- **Baby Blue (Xanh da trời mềm mại):** `#D0E8FF`, `#A0C4FF` (dùng cho huy hiệu chu kỳ).
- **Soft Lavender (Tím hoa cà êm dịu):** `#E8D7F1`, `#D8B4E2` (dùng cho nút âm thanh).
- **Cream / Warm White (Nền trắng kem):** `#FFFDF9`, `#FFF8F4` với họa tiết chấm bi pastel li ti (`radial-gradient`).
- **Cozy Cocoa (Màu chữ nâu cacao ấm):** `#5C4B47`, `#8C7A75` (thay thế màu đen thô cứng, dịu mắt tuyệt đối).

### Phông chữ (Typography):
- **Google Fonts:** `Quicksand` & `Nunito` - Tròn trịa, nét dày vừa phải, thân thiện và ấm áp.

### Khối hình & Tương tác (Soft Shapes & Interactions):
- **Bo góc tối đa:** `rounded-2xl`, `rounded-3xl`, `rounded-[2.5rem]`.
- **Hiệu ứng nút thạch nhún nhảy (Squishy Marshmallow Button):** `active:scale-94 transition-all duration-200` tạo cảm giác đàn hồi mềm mại khi bấm.
- **Biểu tượng cảm xúc:** Chibi bé mèo ngủ say `🐱`, chú thỏ mơ mộng `🐰`, mầm hoa hé nở `🌱 -> 🌸`, cánh hoa đào, ngôi sao nhỏ và hạt lấp lánh.
- **Pháo hoa Pastel:** Khi hoàn thành 7 ngày, màn hình bắn ra các cánh hoa đào sakura, trái tim hồng và ngôi sao vàng pastel thay vì pháo hoa thông thường.

---

## 🚀 2. Hướng Dẫn Chạy Nhanh

### Cách 1: Chạy file `.bat` (Windows)
1. Double-click file `run_backend.bat` -> Mở API tại `http://127.0.0.1:8000`.
2. Double-click file `run_frontend.bat` -> Mở giao diện tại `http://localhost:5173`.

### Cách 2: Chạy qua dòng lệnh (Terminal)
```bash
# Khởi động Backend
cd backend
python run.py

# Khởi động Frontend
cd frontend
npm run dev
```

---

## 📱 3. Trải Nghiệm Các Tính Năng
- Bấm **"💖 Điểm danh ngay hôm nay"** để đánh thức mảnh ghép tiếp theo kèm tiếng chuông ngân trong trẻo.
- Bấm **"⏩ Tua nhanh +1 ngày"** để xem nhanh hành trình 7 ngày nở hoa.
- Khi đạt đủ 7 ngày: Xuất hiện mưa hoa đào, trái tim pastel, âm thanh khúc ca chiến thắng và nút **"💌 Lưu bưu thiếp kỷ niệm (PNG)"** để tải về máy!
