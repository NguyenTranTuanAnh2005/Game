from datetime import datetime, date, timedelta
from typing import Tuple, Optional
from . import database
from .models import SavingsStatusResponse, SavingsCheckInRequest
from .models_3d_service import get_3d_model_metadata


def parse_date(date_str: str) -> date:
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def get_savings_status(custom_today: Optional[str] = None, theme_month: Optional[int] = None) -> SavingsStatusResponse:
    state = database.get_streak_state()
    current_streak = state["current_streak"]
    last_check_in = state["last_check_in"]
    total_cycles = state["total_cycles_completed"]
    total_money = state.get("total_money_saved", 0.0)
    monthly_money = state.get("monthly_money_saved", 0.0)
    weekly_money = state.get("weekly_money_saved", 0.0)

    today = parse_date(custom_today) if custom_today else date.today()
    today_str = today.strftime("%Y-%m-%d")

    # Xác định tuần trong tháng (Tuần 1, 2, 3, 4, 5)
    week_in_month = (today.day - 1) // 7 + 1

    # Kiểm tra xem hôm nay đã điểm danh tiết kiệm chưa
    can_check_in = True
    if last_check_in:
        last_date = parse_date(last_check_in)
        if last_date == today:
            can_check_in = False

    # Lấy metadata mô hình 3D của tháng hiện tại (hoặc tháng preview)
    effective_month = theme_month if (theme_month and 1 <= theme_month <= 12) else today.month
    model_3d = get_3d_model_metadata(month=effective_month, current_streak=current_streak)

    # Tiến độ render màu sắc mô hình 3D (0.0 đến 1.0)
    render_progress = min(1.0, current_streak / 7.0)
    is_week_completed = current_streak == 7

    # Lời nhắn truyền động lực tài chính
    if current_streak == 0:
        message = f"Chào tuần mới! Hãy điểm danh tiết kiệm hôm nay để bắt đầu mở khóa màu sắc cho {model_3d.name}."
    elif current_streak < 7:
        remaining = 7 - current_streak
        if can_check_in:
            message = f"Bé còn {remaining} ngày nữa để hoàn thiện 100% kết cấu {model_3d.name}. Điểm danh ngay nhé!"
        else:
            message = f"Tuyệt vời! Bé đã mở được {current_streak}/7 bộ phận màu sắc của {model_3d.name}. Tuần này đã tích lũy {weekly_money:,.0f} đ!"
    else:
        message = f"XUẤT SẮC! {model_3d.name} đã hoàn thiện 100% Full 3D! Bạn đã hoàn thành trọn vẹn tuần tiết kiệm với {weekly_money:,.0f} đ!"

    return SavingsStatusResponse(
        current_streak=current_streak,
        week_in_month=week_in_month,
        total_cycles_completed=total_cycles,
        total_money_saved=total_money,
        monthly_money_saved=monthly_money,
        weekly_money_saved=weekly_money,
        last_check_in=last_check_in,
        today=today_str,
        can_check_in=can_check_in,
        is_week_completed=is_week_completed,
        model_3d=model_3d,
        render_progress=render_progress,
        message=message
    )


def execute_savings_check_in(amount: float = 50000, note: Optional[str] = None, custom_date: Optional[str] = None) -> Tuple[bool, str, SavingsStatusResponse]:
    state = database.get_streak_state()
    current_streak = state["current_streak"]
    last_check_in = state["last_check_in"]
    total_cycles = state["total_cycles_completed"]
    total_check_ins = state["total_check_ins"]
    total_money = state.get("total_money_saved", 0.0)
    monthly_money = state.get("monthly_money_saved", 0.0)
    weekly_money = state.get("weekly_money_saved", 0.0)

    target_date = parse_date(custom_date) if custom_date else date.today()
    target_date_str = target_date.strftime("%Y-%m-%d")
    week_in_month = (target_date.day - 1) // 7 + 1

    # 1. Chặn điểm danh trùng ngày
    if last_check_in:
        last_date = parse_date(last_check_in)
        if last_date == target_date:
            return False, "Hôm nay bạn đã hoàn thành điểm danh tiết kiệm rồi!", get_savings_status(target_date_str)
        elif target_date < last_date:
            return False, "Không thể điểm danh cho một ngày trong quá khứ!", get_savings_status(target_date_str)

    # 2. Tính toán chuỗi streak 7 ngày
    if not last_check_in:
        new_streak = 1
        weekly_money = amount
    else:
        last_date = parse_date(last_check_in)
        days_diff = (target_date - last_date).days

        if days_diff == 1:
            if current_streak >= 7:
                # Hoàn thành tuần cũ -> Bắt đầu tuần mới (vẫn cùng model tháng đó, reset về ngày 1)
                new_streak = 1
                weekly_money = amount
            else:
                new_streak = current_streak + 1
                weekly_money += amount
        else:
            # Bị đứt chuỗi -> reset về ngày 1 của tuần mới
            new_streak = 1
            weekly_money = amount

    # Tích lũy tiền
    total_money += amount
    monthly_money += amount
    total_check_ins += 1

    if new_streak == 7:
        total_cycles += 1

    # Cập nhật cơ sở dữ liệu
    database.update_streak_state(
        current_streak=new_streak,
        last_check_in=target_date_str,
        total_cycles_completed=total_cycles,
        total_check_ins=total_check_ins,
        total_money_saved=total_money,
        monthly_money_saved=monthly_money,
        weekly_money_saved=weekly_money,
        week_in_month=week_in_month
    )

    database.add_check_in_log(
        check_in_date=target_date_str,
        cycle_number=total_cycles,
        day_in_cycle=new_streak,
        amount=amount,
        note=note
    )

    new_status = get_savings_status(target_date_str)
    part_name = new_status.model_3d.sub_parts[new_streak - 1].part_name

    if new_streak == 7:
        msg = f"CHÚC MỪNG BẠN! Đã hoàn thành 7 ngày tiết kiệm tuần này (+{amount:,.0f} đ). Mô hình {new_status.model_3d.name} đã lên màu 100%!"
    else:
        msg = f"Tiết kiệm thành công +{amount:,.0f} đ! Đã mở khóa màu sắc cho '{part_name}' ({new_streak}/7 ngày)."

    return True, msg, new_status


def reset_savings_streak() -> SavingsStatusResponse:
    database.reset_streak_state()
    return get_savings_status()


def simulate_next_savings_day(amount: float = 50000) -> SavingsStatusResponse:
    state = database.get_streak_state()
    last_check_in = state["last_check_in"]
    if not last_check_in:
        next_day = date.today()
    else:
        next_day = parse_date(last_check_in) + timedelta(days=1)

    execute_savings_check_in(
        amount=amount,
        note="Điểm danh tự động (Demo)",
        custom_date=next_day.strftime("%Y-%m-%d")
    )
    return get_savings_status(next_day.strftime("%Y-%m-%d"))
