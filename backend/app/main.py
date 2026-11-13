import os
from typing import Optional
from fastapi import FastAPI, Query, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import urllib.request

from .database import init_db, get_history_logs
from .models import (
    SavingsStatusResponse,
    SavingsCheckInRequest,
    Model3DMetadata,
    MonthlyTheme,
)
from .streak_service import (
    get_savings_status,
    execute_savings_check_in,
    reset_savings_streak,
    simulate_next_savings_day,
)
from .models_3d_service import get_3d_model_metadata
from .theme_service import get_theme_for_month, get_all_themes

app = FastAPI(
    title="Gamified 3D Daily Savings & Streak Tracker API",
    description="Backend API phục vụ điểm danh tiết kiệm hàng ngày trực quan hóa mô hình 3D sự kiện theo tháng.",
    version="2.0.0",
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", tags=["General"])
def root():
    return {
        "app": "Gamified 3D Daily Savings Tracker API",
        "status": "online",
        "docs_url": "/docs",
        "version": "2.0.0"
    }


# ==========================================
# SAVINGS & 3D STREAK ENDPOINTS (CLIENT-SERVER REST API)
# ==========================================

@app.get("/api/status", response_model=SavingsStatusResponse, tags=["Savings & 3D"])
@app.get("/api/savings/status", response_model=SavingsStatusResponse, tags=["Savings & 3D"])
def get_status(month: Optional[int] = Query(None, ge=1, le=12, description="Xem trước theo tháng (1-12)")):
    """Lấy trạng thái chuỗi điểm danh, số tiền tiết kiệm và tiến trình render mô hình 3D."""
    month_val = month if isinstance(month, int) else None
    return get_savings_status(theme_month=month_val)


@app.post("/api/checkin", tags=["Savings & 3D"])
@app.post("/api/savings/check-in", tags=["Savings & 3D"])
def check_in_savings(payload: Optional[SavingsCheckInRequest] = None):
    """Điểm danh tiết kiệm ngày hôm nay (+tiền, mở thêm 1/7 màu sắc mô hình 3D)."""
    amount = payload.amount if (payload and payload.amount) else 50000
    note = payload.note if payload else None
    simulated_date = payload.simulated_date if payload else None

    success, message, new_status = execute_savings_check_in(
        amount=amount,
        note=note,
        custom_date=simulated_date
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    return {
        "success": True,
        "amount_saved": amount,
        "current_streak": new_status.current_streak,
        "render_progress": new_status.render_progress,
        "is_week_completed": new_status.is_week_completed,
        "message": message,
        "status": new_status
    }


@app.get("/api/monthly-theme", tags=["Savings & 3D"])
def get_monthly_theme_and_model(month: Optional[int] = Query(None, ge=1, le=12)):
    """Trả về cấu hình chủ đề tháng và metadata mô hình 3D tương ứng theo tháng."""
    month_val = month if isinstance(month, int) else None
    status_data = get_savings_status(theme_month=month_val)
    theme_data = get_theme_for_month(month_val)
    return {
        "month": status_data.model_3d.month,
        "theme": theme_data,
        "model_3d": status_data.model_3d
    }


@app.post("/api/savings/reset", response_model=SavingsStatusResponse, tags=["Savings & 3D"])
def reset_savings():
    """Reset chuỗi streak hiện tại về 0 để thử nghiệm lại."""
    return reset_savings_streak()


@app.post("/api/savings/simulate-day", response_model=SavingsStatusResponse, tags=["Savings & 3D"])
def simulate_savings_day(amount: float = Query(50000, ge=1000, description="Số tiền giả lập tiết kiệm")):
    """Giả lập tiến thêm 1 ngày và tự động check-in tiết kiệm (phục vụ demo 3D nhanh)."""
    return simulate_next_savings_day(amount=amount)


@app.get("/api/savings/model-3d", response_model=Model3DMetadata, tags=["Savings & 3D"])
def get_current_model(month: Optional[int] = Query(None, ge=1, le=12)):
    """Lấy metadata và danh sách 7 bộ phận của mô hình 3D theo tháng."""
    month_val = month if isinstance(month, int) else None
    status_data = get_savings_status(theme_month=month_val)
    return status_data.model_3d


@app.get("/api/savings/history", tags=["Savings & 3D"])
def get_savings_history(limit: int = Query(14, ge=1, le=100)):
    """Lấy danh sách nhật ký các lần điểm danh tiết kiệm gần nhất."""
    return {"logs": get_history_logs(limit=limit)}


# ==========================================
# COMPATIBILITY & THEME ENDPOINTS
# ==========================================

@app.get("/api/streak", tags=["Compatibility"])
def get_legacy_streak(month: Optional[int] = Query(None, ge=1, le=12)):
    """Hỗ trợ tương thích ngược với API streak cũ."""
    month_val = month if isinstance(month, int) else None
    return get_savings_status(theme_month=month_val)


@app.post("/api/streak/check-in", tags=["Compatibility"])
def legacy_check_in():
    return check_in_savings()


@app.post("/api/streak/reset", tags=["Compatibility"])
def legacy_reset():
    return reset_savings_streak()


@app.post("/api/streak/simulate-day", tags=["Compatibility"])
def legacy_simulate():
    return simulate_next_savings_day()


@app.get("/api/theme", response_model=MonthlyTheme, tags=["Theme"])
def get_monthly_theme(month: Optional[int] = Query(None, ge=1, le=12)):
    month_val = month if isinstance(month, int) else None
    return get_theme_for_month(month_val)


@app.get("/api/themes", tags=["Theme"])
def list_themes():
    return {"themes": get_all_themes()}


@app.get("/api/proxy-image", tags=["Theme"])
def proxy_image(url: str = Query(..., description="URL ảnh cần proxy")):
    """Proxy ảnh ngoài để khắc phục triệt để lỗi CORS khi xuất bưu thiếp qua Canvas."""
    if url.startswith("/static/") or url.startswith("static/"):
        rel_path = url.lstrip("/")
        full_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), rel_path)
        if os.path.exists(full_path):
            with open(full_path, "rb") as f:
                data = f.read()
            return Response(
                content=data,
                media_type="image/jpeg",
                headers={"Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=86400"}
            )

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=10) as response:
            content_type = response.headers.get_content_type() or "image/jpeg"
            data = response.read()
            return Response(
                content=data,
                media_type=content_type,
                headers={"Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=86400"}
            )
    except Exception:
        fallback_path = os.path.join(STATIC_DIR, "images", "download.jpg")
        if os.path.exists(fallback_path):
            with open(fallback_path, "rb") as f:
                data = f.read()
            return Response(content=data, media_type="image/jpeg", headers={"Access-Control-Allow-Origin": "*"})
        raise HTTPException(status_code=500, detail="Lỗi proxy ảnh")
