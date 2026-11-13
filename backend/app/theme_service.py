from typing import Dict, List, Optional
from datetime import datetime
from .models import MonthlyTheme

# Danh mục 12 chủ đề theo từng tháng trong năm
THEMES_CATALOG: Dict[int, MonthlyTheme] = {
    1: MonthlyTheme(
        month=1,
        month_name="Tháng 1 - Khởi Đầu Mới & Tết Nguyên Đán",
        title="Xuân Vạn Phúc - Nắng Khởi Sắc",
        description="Chào đón năm mới với nguồn năng lượng tươi mới, hoa mai vàng rực rỡ và những mục tiêu đột phá.",
        quote="Mỗi ngày thức dậy là một trang sách mới toanh đang chờ bạn đặt nét bút kiên trì đầu tiên.",
        accent_color="#EF4444",
        gradient="from-amber-500 via-rose-500 to-red-600",
        image_url="https://images.unsplash.com/photo-1548625361-16a7f9202579?auto=format&fit=crop&w=1200&q=80",
        icon="Sparkles",
        puzzle_tiles=[
            "1. Lên dây cót tinh thần",
            "2. Gieo mầm thói quen",
            "3. Vững bước kiên định",
            "4. Thổi bùng ngọn lửa",
            "5. Đón nhận cơ hội",
            "6. Bứt phá giới hạn",
            "7. Hái quả ngọt đầu xuân"
        ]
    ),
    2: MonthlyTheme(
        month=2,
        month_name="Tháng 2 - Mùa Yêu Thương & Valentine",
        title="Tình Yêu Lan Tỏa & Ấm Áp Trái Tim",
        description="Nuôi dưỡng tình yêu thương bản thân và kết nối sâu sắc với những người thân yêu xung quanh.",
        quote="Kỷ luật với chính mình là hình thức yêu thương bản thân cao đẹp và bền vững nhất.",
        accent_color="#EC4899",
        gradient="from-pink-500 via-rose-400 to-red-500",
        image_url="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
        icon="Heart",
        puzzle_tiles=[
            "1. Yêu lấy chính mình",
            "2. Lời cảm ơn chân thành",
            "3. Lắng nghe nhịp tim",
            "4. Chia sẻ yêu thương",
            "5. Khoảnh khắc dịu êm",
            "6. Sự gắn kết kỳ diệu",
            "7. Trái tim trọn vẹn"
        ]
    ),
    3: MonthlyTheme(
        month=3,
        month_name="Tháng 3 - Nét Đẹp Phái Đẹp & Nắng Xuân",
        title="Sức Sống Cỏ Cây & Ngát Hương Hoa",
        description="Tôn vinh sự duyên dáng, sức mạnh nội tâm và vẻ đẹp căng tràn sức sống của mùa xuân thức giấc.",
        quote="Hãy bung nở rực rỡ theo cách của riêng bạn, như đóa hoa kiêu hãnh giữa nắng ban mai.",
        accent_color="#10B981",
        gradient="from-emerald-400 via-teal-500 to-cyan-600",
        image_url="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80",
        icon="Flower2",
        puzzle_tiles=[
            "1. Thức giấc trong lành",
            "2. Hít thở hương hoa",
            "3. Nụ cười rạng rỡ",
            "4. Vẻ đẹp tự tin",
            "5. Nuôi dưỡng tâm hồn",
            "6. Lan tỏa dịu dàng",
            "7. Vườn hoa nở rộ"
        ]
    ),
    4: MonthlyTheme(
        month=4,
        month_name="Tháng 4 - Mẹ Thiên Nhiên & Ngày Trái Đất",
        title="Mầm Sống Xanh & Hơi Thở Đại Ngàn",
        description="Sống hài hòa cùng tự nhiên, gìn giữ màu xanh và cảm nhận sự thanh thản trong tâm hồn.",
        quote="Chỉ khi bạn hòa mình vào thiên nhiên, bạn mới thấy tâm trí lắng dịu và sức mạnh tái sinh.",
        accent_color="#22C55E",
        gradient="from-emerald-500 via-green-600 to-teal-700",
        image_url="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
        icon="Leaf",
        puzzle_tiles=[
            "1. Mầm xanh hy vọng",
            "2. Hạt sương ban mai",
            "3. Rễ sâu bám chắc",
            "4. Rừng cây tỏa bóng",
            "5. Nguồn nước tinh khôi",
            "6. Gió lành đại ngàn",
            "7. Bức tranh xanh biếc"
        ]
    ),
    5: MonthlyTheme(
        month=5,
        month_name="Tháng 5 - Nắng Vàng Biển Xanh Chào Hè",
        title="Sóng Biển Nhiệt Đới & Chân Trời Tự Do",
        description="Đón ánh nắng hè chói lọi, làn gió biển mát lành và nguồn năng lượng dồi dào phiêu lưu.",
        quote="Hãy để những mục tiêu của bạn bao la như biển cả và rực rỡ tựa ánh mặt trời hè.",
        accent_color="#0EA5E9",
        gradient="from-cyan-400 via-sky-500 to-blue-600",
        image_url="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        icon="Sun",
        puzzle_tiles=[
            "1. Chạm làn nước mát",
            "2. Nắng sớm chan hòa",
            "3. Cánh buồm lộng gió",
            "4. Vỏ sò lấp lánh",
            "5. Vượt ngọn sóng cả",
            "6. Hoàng hôn rực vàng",
            "7. Biển khơi rộng mở"
        ]
    ),
    6: MonthlyTheme(
        month=6,
        month_name="Tháng 6 - Khám Phá & Đêm Trại Kỳ Ảo",
        title="Dải Ngân Hà & Ngọn Lửa Trại Phiêu Lưu",
        description="Thắp lên ngọn lửa tò mò, khám phá những vùng đất mới và ngắm nhìn dải ngân hà kỳ vĩ.",
        quote="Những cuộc phiêu lưu vĩ đại nhất luôn bắt đầu từ bước chân quyết tâm nhỏ nhất.",
        accent_color="#8B5CF6",
        gradient="from-indigo-500 via-purple-600 to-violet-800",
        image_url="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
        icon="Compass",
        puzzle_tiles=[
            "1. Chuẩn bị hành trang",
            "2. Cột mốc đầu tiên",
            "3. Nhóm lửa bập bùng",
            "4. Nhìn lên bầu trời",
            "5. Vì sao dẫn lối",
            "6. Khám phá vô tận",
            "7. Đỉnh cao chinh phục"
        ]
    ),
    7: MonthlyTheme(
        month=7,
        month_name="Tháng 7 - Cơn Mưa Hạ & Tĩnh Lặng",
        title="Mưa Êm Đềm & Góc Bình Yên Bên Tách Trà",
        description="Những giọt mưa tưới mát ngày hè, thời gian để đọc một cuốn sách hay và nhìn lại chính mình.",
        quote="Tĩnh lặng là nơi tâm hồn tìm lại sức mạnh sau những ngày bận rộn.",
        accent_color="#6366F1",
        gradient="from-blue-500 via-indigo-600 to-slate-700",
        image_url="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
        icon="CloudRain",
        puzzle_tiles=[
            "1. Tiếng mưa rơi êm",
            "2. Tách trà ấm nóng",
            "3. Mở trang sách hay",
            "4. Thấu hiểu bản thân",
            "5. Rửa trôi âu lo",
            "6. Bình yên trở lại",
            "7. Cầu vồng sau mưa"
        ]
    ),
    8: MonthlyTheme(
        month=8,
        month_name="Tháng 8 - Thu Vàng Gõ Cửa & Tựu Trường",
        title="Lá Phong Vàng & Bước Chân Mới",
        description="Gió heo may chớm lạnh, sắc vàng lãng mạn phủ kín những con đường và khởi đầu kỳ học tập mới.",
        quote="Học hỏi và nâng cấp bản thân là hành trình không bao giờ có điểm dừng.",
        accent_color="#F59E0B",
        gradient="from-amber-400 via-orange-500 to-yellow-600",
        image_url="https://images.unsplash.com/photo-1507783548227-544c3b8fc065?auto=format&fit=crop&w=1200&q=80",
        icon="BookOpen",
        puzzle_tiles=[
            "1. Trang vở thơm tho",
            "2. Tri thức mới mẻ",
            "3. Rèn luyện tư duy",
            "4. Gió thu dịu mát",
            "5. Bước chân tự tin",
            "6. Nâng tầm kỹ năng",
            "7. Mùa vàng trĩu hạt"
        ]
    ),
    9: MonthlyTheme(
        month=9,
        month_name="Tháng 9 - Hội Trăng Rằm & Trung Thu",
        title="Ánh Trăng Vàng & Lồng Đèn Sum Họp",
        description="Vầng trăng tròn vành vạnh, tiếng cười ấm áp của ngày tết đoàn viên và sự đủ đầy trong tâm.",
        quote="Hãy tỏa sáng êm dịu và kiên định như ánh trăng rằm soi tỏ đêm sâu.",
        accent_color="#EAB308",
        gradient="from-yellow-400 via-amber-500 to-orange-600",
        image_url="https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=1200&q=80",
        icon="Moon",
        puzzle_tiles=[
            "1. Ánh trăng soi sáng",
            "2. Đèn lồng đỏ rực",
            "3. Bánh ngọt sum vầy",
            "4. Gắn kết gia đình",
            "5. Niềm vui trẻ thơ",
            "6. An yên tròn đầy",
            "7. Đêm hội tỏa rạng"
        ]
    ),
    10: MonthlyTheme(
        month=10,
        month_name="Tháng 10 - Lễ Hội Halloween & Huyền Bí",
        title="Bí Ngô Ma Thuật & Điều Kỳ Diệu",
        description="Hóa giải những nỗi sợ trong bạn, biến sự bí ẩn thành cơ hội bứt phá phi thường.",
        quote="Dũng cảm không phải là không biết sợ, mà là đối diện với nỗi sợ và vượt qua nó mỗi ngày.",
        accent_color="#F97316",
        gradient="from-orange-500 via-amber-600 to-purple-900",
        image_url="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
        icon="Ghost",
        puzzle_tiles=[
            "1. Đối diện bóng tối",
            "2. Thắp sáng bí ngô",
            "3. Phá tan nghi ngờ",
            "4. Bí thuật kiên trì",
            "5. Đánh thức tiềm năng",
            "6. Biến hóa diệu kỳ",
            "7. Trở thành người hùng"
        ]
    ),
    11: MonthlyTheme(
        month=11,
        month_name="Tháng 11 - Mùa Tri Ân & Hoàng Hôn Ấm Áp",
        title="Lòng Biết Ơn & Lửa Ấm Chiều Đông",
        description="Gửi lời tri ân sâu sắc đến những người thầy, người bạn và ghi nhận hành trình đã qua của chính mình.",
        quote="Lòng biết ớn biến những gì chúng ta đang có thành điều kỳ diệu và đủ đầy.",
        accent_color="#D97706",
        gradient="from-amber-600 via-orange-600 to-rose-700",
        image_url="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        icon="Flame",
        puzzle_tiles=[
            "1. Tri ân người dẫn dắt",
            "2. Lửa ấm trong tim",
            "3. Trân trọng từng phút",
            "4. Tấm lòng rộng mở",
            "5. Bữa cơm sum vầy",
            "6. Nhìn lại chặng đường",
            "7. Trọn vẹn biết ơn"
        ]
    ),
    12: MonthlyTheme(
        month=12,
        month_name="Tháng 12 - Giáng Sinh Kỳ Diệu & Tuyết Trắng",
        title="Cây Thông Noel & Phép Màu Lễ Hội",
        description="Khép lại một năm đầy tự hào với những hộp quà hy vọng, tiếng chuông ngân vang và tuyết đầu mùa.",
        quote="Thành quả lớn nhất cuối năm không phải là bạn đã đi xa bao nhiêu, mà là bạn đã trở thành người kiên trì thế nào.",
        accent_color="#15803D",
        gradient="from-emerald-600 via-red-600 to-amber-500",
        image_url="https://images.unsplash.com/photo-1543258103-a62bd9669e7b?auto=format&fit=crop&w=1200&q=80",
        icon="Gift",
        puzzle_tiles=[
            "1. Ngôi sao đỉnh tháp",
            "2. Chuông ngân vang vọng",
            "3. Hộp quà bí mật",
            "4. Bông tuyết tinh khôi",
            "5. Lò sưởi thắp sáng",
            "6. Tình thân sum họp",
            "7. Khúc ca khải hoàn"
        ]
    ),
}


def get_theme_for_month(month: Optional[int] = None) -> MonthlyTheme:
    if not isinstance(month, int) or month < 1 or month > 12:
        month = datetime.now().month
    return THEMES_CATALOG.get(month, THEMES_CATALOG[11])


def get_current_theme() -> MonthlyTheme:
    current_month = datetime.now().month
    return get_theme_for_month(current_month)


def get_all_themes() -> List[MonthlyTheme]:
    return list(THEMES_CATALOG.values())

