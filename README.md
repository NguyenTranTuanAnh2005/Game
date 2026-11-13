# 🌸 Daily Savings Tracker 3D - Gamification Tài Chính Cá Nhân

> Ứng dụng web điểm danh tiết kiệm tiền hàng ngày kết hợp **trực quan hóa 3D (React Three Fiber / WebGL)** và phong cách thiết kế **Kawaii Soft Pastel**, biến việc tích lũy tài chính khô khan thành trải nghiệm nuôi heo đất 3D đầy cảm hứng!

---

## 🏛️ 1. Kiến Trúc Hệ Thống Chuẩn (Client-Server Architecture)

- **Frontend (Client-side):** HTML5, Tailwind CSS, JavaScript (React.js), Three.js (`@react-three/fiber` & `@react-three/drei`). Chạy hoàn toàn trên trình duyệt, không phụ thuộc vào framework UI Python.
- **Backend (Server-side):** Python FastAPI RESTful API. Chỉ đóng vai trò xử lý logic tài chính, chuỗi streak và cung cấp dữ liệu qua JSON.
- **Cơ sở dữ liệu:** SQLite persistence (`habits.db`), lưu trữ lịch sử nạp tiền, chu kỳ tuần và số dư tích lũy.

---

## 🎮 2. Các Tính Năng Frontend Vừa Được Bổ Sung & Mở Rộng

### 1. 🎮 Sân Khấu 3D Tương Tác & Rơi Đồng Xu Vàng ([Savings3DViewer.jsx](file:///c:/Users/acer/OneDrive/Desktop/Game/frontend/src/components/Savings3DViewer.jsx))
- **3D Coin Drop Animation:** Mỗi khi người dùng bấm "Bỏ Heo Điểm Danh", một đồng xu vàng 3D xoay tít và rơi từ trên không xuống bệ đỡ kèm âm thanh tiền xu leng keng.
- **Đổi Bầu Không Khí Studio 3D (Environment Presets):**
  - 🌸 **Khu Vườn Mùa Xuân:** Ánh dương vàng ấm áp và gió xuân.
  - 🌌 **Đêm Ngân Hà:** Ánh sáng tím xanh huyền bí của dải thiên hà.
  - 🌇 **Phòng Trà Hoàng Hôn:** Sắc cam ấm cúng của ánh lửa chiều tà.
- **Soi Chi Tiết Bộ Phận 3D (Interactive Inspector):** Bấm trực tiếp vào bất kỳ bộ phận 3D nào trên vật thể để mở thẻ thông tin giải mã ý nghĩa tài chính và tiến độ mở khóa.

### 2. 📊 Bảng Thống Kê Tài Chính & Cấp Độ Heo Đất ([FinancialDashboard.jsx](file:///c:/Users/acer/OneDrive/Desktop/Game/frontend/src/components/FinancialDashboard.jsx))
- **Hệ thống Cấp Độ Heo Đất (XP & Level System):**
  - Cấp 1: 🐷 Heo Đất Nhí (0 - 200k)
  - Cấp 2: 🥈 Heo Đất Chăm Chỉ (200k - 500k)
  - Cấp 3: 🥇 Heo Đất Thông Thái (500k - 1,000k)
  - Cấp 4: 💎 Heo Đất Triệu Phú (1,000k - 2,500k)
  - Cấp 5: 👑 Heo Vàng Vĩ Đại (> 2,500k)
- **Mục Tiêu Tháng (Customizable Monthly Target):** Đặt mục tiêu số tiền mong muốn (VD: 1.500.000đ), tự động tính toán tỷ lệ % hoàn thành và số tiền còn thiếu.
- **Biểu Đồ Tích Lũy 7 Ngày:** Biểu đồ cột trực quan thể hiện dòng tiền nạp vào heo đất theo từng ngày trong tuần.

### 3. 🎯 Quản Lý Nhiều Hũ Tiết Kiệm Theo Mục Tiêu ([SavingsGoalsSelector.jsx](file:///c:/Users/acer/OneDrive/Desktop/Game/frontend/src/components/SavingsGoalsSelector.jsx))
- Người dùng có thể phân loại tiền tiết kiệm vào các hũ mục tiêu cụ thể:
  - 🏝️ Quỹ Du Lịch Hè
  - 💻 Đổi Laptop / Thiết Bị Mới
  - 🎁 Món Quà Tặng Người Thân
  - 🛡️ Quỹ An Tâm Khẩn Cấp
- Hỗ trợ tạo thêm hũ mục tiêu mới với emoji và số tiền tự chọn.

### 4. 🏅 Phòng Truyền Thống & Bộ Sưu Tập 8 Huy Hiệu ([AchievementBadges.jsx](file:///c:/Users/acer/OneDrive/Desktop/Game/frontend/src/components/AchievementBadges.jsx))
- 8 Huy hiệu vinh danh kiên trì:
  1. 🌱 **Hạt Mầm Đầu Tiên:** Điểm danh ngày 1.
  2. 🔥 **Ý Chí Kiên Định:** Đạt streak 3 ngày.
  3. 👑 **Bậc Thầy 7 Ngày:** Hoàn thành 100% mô hình 3D tuần.
  4. 💰 **Heo Đất Căng Tròn:** Tích lũy vượt mốc 200.000 đ.
  5. 💎 **Triệu Phú Tí Hon:** Tích lũy vượt mốc 1.000.000 đ.
  6. 🌟 **Kỷ Luật Vàng:** Hoàn thành 2 chu kỳ tuần liên tục.
  7. 🌸 **Bảo Mẫu Vườn Hoa:** Tích lũy đủ 10 ngày điểm danh.
  8. 🏆 **Huyền Thoại 3D:** Hoàn thành trọn vẹn cả 4 tuần trong tháng.
- Bấm vào từng huy hiệu để mở Modal soi chi tiết huân chương và lời chúc mừng.

### 5. 🗂️ Thanh Điều Hướng 4 Tab Tính Năng ([App.jsx](file:///c:/Users/acer/OneDrive/Desktop/Game/frontend/src/App.jsx))
- **`[🎮 Mô Hình 3D]`**: Sân khấu 3D chính, nút bỏ heo và chọn hũ mục tiêu.
- **`[📊 Thống Kê Quỹ]`**: Dashboard tài chính, cấp độ Heo Đất và biểu đồ cột.
- **`[🏅 Huy Hiệu]`**: Phòng sưu tập 8 huy hiệu thành tích.
- **`[🖼️ Tranh Mảnh Ghép]`**: Chế độ 2D bí ẩn và công cụ xuất bưu thiếp kỷ niệm High-DPI.

---

## 🚀 3. Hướng Dẫn Khởi Động

1. **Khởi động Backend:** Double-click file `run_backend.bat` (Port: `8000`).
2. **Khởi động Frontend:** Double-click file `run_frontend.bat` (Port: `5173`).
3. Truy cập trình duyệt tại **`http://localhost:5173`** để trải nghiệm đầy đủ các tính năng mới!
