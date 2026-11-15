from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Model3DSubPart(BaseModel):
    day: int = Field(..., ge=1, le=7, description="Ngày tương ứng (1-7)")
    part_name: str = Field(..., description="Tên bộ phận mô hình 3D")
    description: str = Field(..., description="Mô tả chi tiết bộ phận")
    color: str = Field(..., description="Mã màu chủ đạo của bộ phận")
    is_revealed: bool = Field(False, description="Đã mở khóa màu sắc chưa")


class Model3DMetadata(BaseModel):
    model_id: str
    month: int = Field(..., ge=1, le=12)
    name: str = Field(..., description="Tên mô hình 3D sự kiện của tháng")
    event_name: str = Field(..., description="Sự kiện/ngày lễ đặc trưng")
    description: str = Field(..., description="Mô tả ý nghĩa mô hình")
    theme_color: str
    asset_file: str = Field(..., description="Đường dẫn file .gltf/.glb hoặc mã định danh procedural")
    sub_parts: List[Model3DSubPart]


class SavingsCheckInRequest(BaseModel):
    amount: float = Field(default=50000, ge=1000, description="Số tiền tiết kiệm trong ngày (VNĐ)")
    note: Optional[str] = Field(None, description="Ghi chú mục tiêu tiết kiệm (ví dụ: bớt ly trà sữa)")
    simulated_date: Optional[str] = Field(None, description="Giả lập ngày (YYYY-MM-DD)")


class ResistTemptationRequest(BaseModel):
    item_name: str = Field(default="Ly trà sữa trân châu", description="Tên món đồ / chi tiêu vừa nhịn được")
    amount: float = Field(default=35000, ge=1000, description="Số tiền kiềm chế không tiêu (VNĐ)")


class SavingsStatusResponse(BaseModel):
    current_streak: int = Field(..., ge=0, le=7, description="Số ngày điểm danh liên tiếp trong tuần (0-7)")
    week_in_month: int = Field(..., ge=1, le=5, description="Tuần thứ mấy trong tháng (1-5)")
    tier_level: int = Field(1, ge=1, le=4, description="Cấp độ tiến hóa theo tuần của mô hình 3D (Tier 1-4)")
    tier_name: str = Field("Tier 1: Mô hình nguyên bản", description="Tên cấp độ tiến hóa")
    tier_description: str = Field("Mô hình 3D chủ đề cơ bản của tháng", description="Mô tả phụ kiện hoặc hiệu ứng đặc biệt")
    streak_freeze_count: int = Field(1, description="Số lượng khiên bảo vệ chuỗi (Streak Freeze) sẵn có")
    glow_energy: int = Field(0, description="Năng lượng phát sáng từ việc kiềm chế cám dỗ")
    temptation_saved: float = Field(0.0, description="Tổng số tiền tiết kiệm được từ việc kiềm chế cám dỗ")
    total_cycles_completed: int = Field(0, description="Tổng số chu kỳ 7 ngày đã hoàn tất")
    total_money_saved: float = Field(0, description="Tổng số tiền đã tiết kiệm từ trước đến nay (VNĐ)")
    monthly_money_saved: float = Field(0, description="Số tiền đã tiết kiệm trong tháng hiện tại (VNĐ)")
    weekly_money_saved: float = Field(0, description="Số tiền đã tiết kiệm trong chu kỳ 7 ngày hiện tại (VNĐ)")
    last_check_in: Optional[str] = Field(None, description="Ngày điểm danh gần nhất (YYYY-MM-DD)")
    today: str = Field(..., description="Ngày hiện tại theo hệ thống (YYYY-MM-DD)")
    can_check_in: bool = Field(..., description="Hôm nay có thể điểm danh tiết kiệm không")
    is_week_completed: bool = Field(..., description="Đã hoàn thành đủ 7 ngày liên tục chưa")
    model_3d: Model3DMetadata = Field(..., description="Mô hình 3D của tháng hiện tại")
    render_progress: float = Field(..., ge=0.0, le=1.0, description="Tiến độ render màu sắc mô hình 3D (0.0 đến 1.0)")
    message: str


class MonthlyTheme(BaseModel):
    month: int = Field(..., ge=1, le=12)
    month_name: str
    title: str
    description: str
    quote: str
    accent_color: str
    gradient: str
    image_url: str
    icon: str
    puzzle_tiles: List[str]
