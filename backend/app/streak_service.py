from datetime import datetime, date, timedelta
from typing import Tuple, Optional
from . import database
from .models import SavingsStatusResponse
from .models_3d_service import get_3d_model_metadata


def parse_date(date_str: str) -> date:
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def get_tier_info(week_in_month: int) -> Tuple[int, str, str]:
    """
    Quy định cấp độ tiến hóa của mô hình 3D trong tháng (Tier 1 -> Tier 4).
    Tái sử dụng mô hình sự kiện của tháng nhưng nâng cấp qua từng tuần.
    """
    if week_in_month <= 1:
        return 1, "Tier 1: Mô hình nguyên bản", "Mô hình 3D chủ đề sự kiện cơ bản thuần khiết của tháng."
    elif week_in_month == 2:
        return 2, "Tier 2: Phụ kiện nơ & hoa xinh", "Mô hình được trang hoàng thêm dải nơ lụa và vương miện hoa nhỏ đáng yêu."
    elif week_in_month == 3:
        return 3, "Tier 3: Hào quang tinh tú lung linh", "Vòng tròn hào quang thiên thần phát sáng pastel mềm mại xoay quanh mô hình."
    else:
        return 4, "Tier 4: Ánh kim thần thoại & Tinh tú", "Cấp độ tiến hóa tối thượng: Mô hình tỏa hào quang đa sắc cùng bão hạt ma thuật."


def get_savings_status(custom_today: Optional[str] = None, theme_month: Optional[int] = None) -> SavingsStatusResponse:
    state = database.get_streak_state()
    current_streak = state.get("current_streak", 0)
    last_check_in = state.get("last_check_in")
    total_cycles = state.get("total_cycles_completed", 0)
    total_money = state.get("total_money_saved", 0.0)
    monthly_money = state.get("monthly_money_saved", 0.0)
    weekly_money = state.get("weekly_money_saved", 0.0)
    streak_freeze = state.get("streak_freeze_count", 1)
    glow_energy = state.get("glow_energy", 0)
    temptation_saved = state.get("temptation_saved", 0.0)

    today = parse_date(custom_today) if custom_today else date.today()
    today_str = today.strftime("%Y-%m-%d")

    # Xác định tuần trong tháng (Tuần 1, 2, 3, 4, 5)
    week_in_month = (today.day - 1) // 7 + 1
    tier_level, tier_name, tier_desc = get_tier_info(week_in_month)

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
        message = f"Chào tuần #{week_in_month} ({tier_name})! Hãy điểm danh tiết kiệm hôm nay để bắt đầu mở khóa màu sắc cho {model_3d.name}."
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
        tier_level=tier_level,
        tier_name=tier_name,
        tier_description=tier_desc,
        streak_freeze_count=streak_freeze,
        glow_energy=glow_energy,
        temptation_saved=temptation_saved,
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
    current_streak = state.get("current_streak", 0)
    last_check_in = state.get("last_check_in")
    total_cycles = state.get("total_cycles_completed", 0)
    total_check_ins = state.get("total_check_ins", 0)
    total_money = state.get("total_money_saved", 0.0)
    monthly_money = state.get("monthly_money_saved", 0.0)
    weekly_money = state.get("weekly_money_saved", 0.0)
    streak_freeze = state.get("streak_freeze_count", 1)
    glow_energy = state.get("glow_energy", 0)
    temptation_saved = state.get("temptation_saved", 0.0)

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

    # 2. Xử lý logic chuỗi streak 7 ngày & Khiên bảo vệ chuỗi (Streak Freeze)
    freeze_used = False
    if not last_check_in:
        new_streak = 1
        weekly_money = amount
    else:
        last_date = parse_date(last_check_in)
        days_diff = (target_date - last_date).days

        if days_diff == 1:
            if current_streak >= 7:
                # Đã xong tuần cũ -> sang tuần mới (reset về ngày 1 của tuần mới)
                new_streak = 1
                weekly_money = amount
            else:
                new_streak = current_streak + 1
                weekly_money += amount
        else:
            # Quên điểm danh >= 1 ngày
            if streak_freeze > 0:
                # Tự động kích hoạt khiên bảo vệ chuỗi!
                streak_freeze -= 1
                freeze_used = True
                if current_streak >= 7:
                    new_streak = 1
                    weekly_money = amount
                else:
                    new_streak = current_streak + 1
                    weekly_money += amount
            else:
                # Đứt chuỗi không có khiên -> reset về ngày 1
                new_streak = 1
                weekly_money = amount

    # Thưởng khiên bảo vệ nếu tiết kiệm vượt định mức (>= 100,000 đ)
    freeze_rewarded = False
    if amount >= 100000:
        streak_freeze += 1
        freeze_rewarded = True

    # Tích lũy tài chính
    total_money += amount
    monthly_money += amount
    total_check_ins += 1

    if new_streak == 7:
        total_cycles += 1

    # Cập nhật DB
    database.update_streak_state(
        current_streak=new_streak,
        last_check_in=target_date_str,
        total_cycles_completed=total_cycles,
        total_check_ins=total_check_ins,
        total_money_saved=total_money,
        monthly_money_saved=monthly_money,
        weekly_money_saved=weekly_money,
        week_in_month=week_in_month,
        streak_freeze_count=streak_freeze,
        glow_energy=glow_energy,
        temptation_saved=temptation_saved
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

    msg_parts = []
    if freeze_used:
        msg_parts.append("🛡️ Khiên bảo vệ chuỗi (Streak Freeze) đã tự động cứu chuỗi tiết kiệm của bạn!")
    if new_streak == 7:
        msg_parts.append(f"CHÚC MỪNG BẠN! Đã hoàn thành trọn vẹn 7 ngày tiết kiệm (+{amount:,.0f} đ). Mô hình {new_status.model_3d.name} đã lên màu 100%!")
    else:
        msg_parts.append(f"Tiết kiệm thành công +{amount:,.0f} đ! Đã mở khóa màu sắc cho '{part_name}' ({new_streak}/7 ngày).")
    if freeze_rewarded:
        msg_parts.append("✨ Bạn được thưởng thêm 1 Khiên bảo vệ chuỗi 🛡️ vì đã tiết kiệm vượt định mức!")

    return True, " ".join(msg_parts), new_status


def execute_resist_temptation(item_name: str, amount: float) -> Tuple[bool, str, SavingsStatusResponse]:
    """
    Ghi nhận hành động 'Kiềm chế cám dỗ' khi nhịn mua sắm/ăn vặt.
    Cộng tiền vào quỹ tiết kiệm và tăng năng lượng phát sáng (glow_energy) cho mô hình 3D.
    """
    state = database.get_streak_state()
    total_money = state.get("total_money_saved", 0.0) + amount
    monthly_money = state.get("monthly_money_saved", 0.0) + amount
    weekly_money = state.get("weekly_money_saved", 0.0) + amount
    glow_energy = state.get("glow_energy", 0) + 15
    temptation_saved = state.get("temptation_saved", 0.0) + amount

    database.update_streak_state(
        current_streak=state.get("current_streak", 0),
        last_check_in=state.get("last_check_in"),
        total_cycles_completed=state.get("total_cycles_completed", 0),
        total_check_ins=state.get("total_check_ins", 0),
        total_money_saved=total_money,
        monthly_money_saved=monthly_money,
        weekly_money_saved=weekly_money,
        week_in_month=state.get("week_in_month", 1),
        streak_freeze_count=state.get("streak_freeze_count", 1),
        glow_energy=glow_energy,
        temptation_saved=temptation_saved
    )

    database.add_temptation_log(item_name=item_name, amount=amount)

    new_status = get_savings_status()
    msg = f"Tuyệt vời quá! Bé đã kiềm chế thành công món '{item_name}', tiết kiệm thêm +{amount:,.0f} đ và nạp +15 Năng lượng phát sáng 🌟 cho mô hình 3D!"
    return True, msg, new_status


def reset_savings_streak() -> SavingsStatusResponse:
    database.reset_streak_state()
    return get_savings_status()


def simulate_next_savings_day(amount: float = 50000) -> SavingsStatusResponse:
    state = database.get_streak_state()
    last_check_in = state.get("last_check_in")

    if not last_check_in:
        next_date = date.today()
    else:
        last_date = parse_date(last_check_in)
        next_date = last_date + timedelta(days=1)

    next_date_str = next_date.strftime("%Y-%m-%d")
    execute_savings_check_in(amount=amount, note="Simulated Demo Day", custom_date=next_date_str)
    return get_savings_status(next_date_str)
