# 🌸 HƯỚNG DẪN KHỞI ĐỘNG ỨNG DỤNG TIẾT KIỆM 3D (DAILY SAVINGS TRACKER) 🌸

Hệ thống được thiết kế theo kiến trúc **tách biệt Client - Server (FastAPI + React Vite + Three.js)**, phong cách **Kawaii / Pastel Soft UI**.

---

## ⚡ CÁCH 1: KHỞI ĐỘNG NHANH 1-CLICK (KHUYÊN DÙNG TRÊN WINDOWS)

Trong thư mục gốc `Game`, bạn chỉ cần nhấp đúp chuột vào 2 file kịch bản sau:

1. **Khởi động Backend (FastAPI):**
   - Click đúp vào file [`run_backend.bat`](file:///c:/Users/acer/OneDrive/Desktop/Game/run_backend.bat)
   - Cửa sổ terminal hiện: `Uvicorn running on http://0.0.0.0:8000` là thành công.

2. **Khởi động Frontend (React Vite):**
   - Click đúp vào file [`run_frontend.bat`](file:///c:/Users/acer/OneDrive/Desktop/Game/run_frontend.bat)
   - Cửa sổ terminal hiện: `Local: http://localhost:5173/` là hoàn tất.

3. **Mở trình duyệt:**
   - Truy cập vào: **[http://localhost:5173/](http://localhost:5173/)** để trải nghiệm ứng dụng.
   - Tài liệu API Swagger: **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## 💻 CÁCH 2: KHỞI ĐỘNG BẰNG DÒNG LỆNH (TERMINAL / POWERSHELL)

Nếu bạn muốn chạy trực tiếp bằng dòng lệnh:

### 1. Khởi động Backend (FastAPI)
Mở một cửa sổ Terminal (PowerShell hoặc Command Prompt) tại thư mục `Game`:
```powershell
cd backend

# Nếu đã có môi trường ảo venv (mặc định đã tạo sẵn):
venv\Scripts\python run.py

# (Nếu chưa có venv, khởi tạo lần đầu):
# python -m venv venv
# venv\Scripts\pip install -r requirements.txt
# venv\Scripts\python run.py
```
> Backend sẽ chạy tại cổng: `http://localhost:8000`

---

### 2. Khởi động Frontend (React Vite + Three.js)
Mở thêm một cửa sổ Terminal thứ hai tại thư mục `Game`:
```powershell
cd frontend

# Chạy server phát triển (Vite Dev Server):
npm run dev

# (Nếu lần đầu chạy hoặc tải code về máy mới):
# npm install
# npm run dev
```
> Frontend sẽ chạy tại cổng: `http://localhost:5173`

---

## 🎮 TÍNH NĂNG VÀ CÁC BƯỚC TRẢI NGHIỆM

| Tính Năng | Mô Tả & Cách Sử Dụng |
| :--- | :--- |
| **🐷 Bỏ heo tiết kiệm hàng ngày** | Nhập số tiền (20k, 50k, 100k, 200k) + lý do (ví dụ: *Nhịn trà sữa*) rồi bấm nút kẹo dẻo để tô màu 1/7 mô hình 3D. |
| **🛡️ Khiên bảo vệ chuỗi (Streak Freeze)** | Tự động kích hoạt cứu chuỗi nếu bạn quên điểm danh 1 ngày. Tiết kiệm $\ge$ 100,000 đ sẽ được thưởng thêm 1 Khiên bảo vệ! |
| **🍭 Nút "Kiềm chế cám dỗ"** | Bấm vào nút `Kiềm chế cám dỗ` khi vừa nhịn mua sắm (ly trà sữa 35k, Shopee 100k,...). Tiền sẽ được cộng dồn và nạp **Aura phát sáng** cho vật thể 3D! |
| **⭐ Nâng cấp Tier 1 - 4 theo Tuần** | Mỗi tuần trong tháng mô hình sẽ tự động tiến hóa: **Tuần 1** (Gốc), **Tuần 2** (Thêm nơ & hoa xinh), **Tuần 3** (Hào quang Celestial Halo), **Tuần 4** (Ánh kim & bão hạt tinh tú). |
| **💌 Xuất bưu thiếp kỷ niệm** | Vào tab `Tranh Mảnh Ghép` hoặc sau khi đủ 7 ngày, bấm `Tải Bưu Thiếp Về Máy` để xuất ảnh PNG 2400x1600 siêu nét không lỗi font. |
| **⏩ Công cụ tua nhanh (Demo)** | Bấm `Tua nhanh +1 ngày (50k)` để thử nghiệm nhanh tiến trình lên màu 3D qua 7 ngày mà không cần đợi sang ngày hôm sau. |
| **🔄 Nút Reset** | Bấm `Reset tuần này` để đưa chuỗi về 0 và thử nghiệm lại từ đầu bất cứ lúc nào. |

---

## 🛠️ XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

1. **Cổng 8000 hoặc 5173 báo bị trùng (Port already in use):**
   - Đóng các tiến trình Python hoặc Node.js đang chạy ngầm trong Task Manager.
   - Hoặc gõ lệnh tắt cổng trong PowerShell:
     ```powershell
     # Tìm và tắt process chiếm port 8000
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
     ```

2. **Hình ảnh bưu thiếp xuất ra bị trắng:**
   - Ứng dụng đã tích hợp sẵn proxy `/api/proxy-image` để vượt lỗi CORS của trình duyệt. Hãy chắc chắn rằng Backend đang bật để proxy hoạt động tốt.

3. **Mô hình 3D xoay bị chậm trên máy yếu:**
   - Bấm nút `⏸️ Tạm dừng` ở góc trên bên phải khung 3D để tắt chế độ tự động xoay.

