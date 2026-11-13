from typing import Dict, List, Optional
from datetime import datetime
from .models import Model3DMetadata, Model3DSubPart

# Danh mục 12 mô hình 3D sự kiện đại diện cho 12 tháng trong năm
MODELS_3D_CATALOG: Dict[int, Dict] = {
    1: {
        "model_id": "tet_apricot_tree",
        "month": 1,
        "name": "Cây Mai Vàng Ngày Tết 3D",
        "event_name": "Tết Nguyên Đán & Khởi Đầu Mới",
        "description": "Cây mai vàng truyền thống nở rộ đón xuân tài lộc và phú quý.",
        "theme_color": "#EAB308",
        "asset_file": "/static/models/tet_apricot.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Chậu sứ & Gốc rễ cổ thụ", "description": "Nền tảng tài chính vững chắc", "color": "#78350F"},
            {"day": 2, "part_name": "Thân cây mai uốn lượn", "description": "Khung xương kiên định của thói quen", "color": "#92400E"},
            {"day": 3, "part_name": "Các nhánh cành vươn cao", "description": "Mở rộng nguồn thu nhập và cơ hội", "color": "#B45309"},
            {"day": 4, "part_name": "Tán lá non xanh biếc", "description": "Sức sống và sự tươi mới của đồng tiền tích lũy", "color": "#16A34A"},
            {"day": 5, "part_name": "Các chùm nụ mai chúm chím", "description": "Giai đoạn ươm mầm tài lộc", "color": "#FDE047"},
            {"day": 6, "part_name": "Những đóa hoa mai vàng rực rỡ", "description": "Sắc vàng thịnh vượng bung nở", "color": "#EAB308"},
            {"day": 7, "part_name": "Bao lì xì đỏ & Ngôi sao lấp lánh", "description": "Trọn vẹn tuần tiết kiệm đại cát đại lợi", "color": "#EF4444"},
        ]
    },
    2: {
        "model_id": "valentine_rose_heart",
        "month": 2,
        "name": "Trái Tim Hoa Hồng Tình Yêu 3D",
        "event_name": "Mùa Yêu Thương & Lễ Tình Nhân",
        "description": "Trái tim hoa hồng kết tinh từ tình yêu thương và sự kỷ luật tài chính.",
        "theme_color": "#EC4899",
        "asset_file": "/static/models/valentine_heart.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Bệ ngọc cẩm thạch trắng", "description": "Tình yêu bản thân bắt đầu từ nền tảng vững vàng", "color": "#F8FAFC"},
            {"day": 2, "part_name": "Khối lõi trái tim pha lê", "description": "Trái tim kiên định với mục tiêu tương lai", "color": "#FBCFE8"},
            {"day": 3, "part_name": "Lớp cánh hoa hồng nhung thứ nhất", "description": "Sự dịu dàng và ấm áp", "color": "#F472B6"},
            {"day": 4, "part_name": "Lớp cánh hoa hồng nở bung thứ hai", "description": "Lan tỏa sự yêu thương", "color": "#EC4899"},
            {"day": 5, "part_name": "Dải ruy băng lụa vàng ánh kim", "description": "Gắn kết những thói quen tốt", "color": "#FBBF24"},
            {"day": 6, "part_name": "Đôi cánh thiên thần mềm mại", "description": "Tự do tài chính nâng cánh ước mơ", "color": "#E0E7FF"},
            {"day": 7, "part_name": "Vương miện kim cương & Hạt lấp lánh", "description": "Hoàn tất tuần lễ kỷ luật đầy tự hào", "color": "#F43F5E"},
        ]
    },
    3: {
        "model_id": "spring_tulip_garden",
        "month": 3,
        "name": "Khu Vườn Hoa Tulip Nắng Xuân 3D",
        "event_name": "Quốc Tế Phụ Nữ & Mùa Xuân",
        "description": "Những đóa hoa tulip căng tràn sức sống tôn vinh nét đẹp phái nữ.",
        "theme_color": "#10B981",
        "asset_file": "/static/models/tulip_garden.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Thảm cỏ xanh mướt", "description": "Mảnh đất màu mỡ cho thói quen", "color": "#4ADE80"},
            {"day": 2, "part_name": "Các mầm xanh vươn lên", "description": "Mỗi đồng tiết kiệm là một hạt mầm", "color": "#22C55E"},
            {"day": 3, "part_name": "Thân lá tulip thanh mảnh", "description": "Sự dẻo dai và kiên trì", "color": "#16A34A"},
            {"day": 4, "part_name": "Nụ hoa hồng phấn chúm chím", "description": "Nét duyên dáng đầu tiên", "color": "#F472B6"},
            {"day": 5, "part_name": "Bông hoa tulip vàng rực", "description": "Ánh dương rạng ngời", "color": "#FACC15"},
            {"day": 6, "part_name": "Bông hoa tulip đỏ rực rỡ", "description": "Sức mạnh tự tin tỏa sáng", "color": "#EF4444"},
            {"day": 7, "part_name": "Đàn bướm bay lượn & Giọt sương mai", "description": "Khu vườn xuân trọn vẹn sung túc", "color": "#38BDF8"},
        ]
    },
    4: {
        "model_id": "earth_globe_forest",
        "month": 4,
        "name": "Mầm Sống Địa Cầu Xanh 3D",
        "event_name": "Ngày Trái Đất & Thiên Nhiên",
        "description": "Quả địa cầu được ôm trọn bởi rừng cây xanh ngát bảo vệ tương lai.",
        "theme_color": "#059669",
        "asset_file": "/static/models/earth_forest.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Đại dương xanh thẳm", "description": "Nguồn cội của mọi sự sống", "color": "#0284C7"},
            {"day": 2, "part_name": "Các châu lục xanh biếc", "description": "Mảnh đất kiến tạo ước mơ", "color": "#16A34A"},
            {"day": 3, "part_name": "Rừng rậm nguyên sinh", "description": "Hơi thở thanh lọc âu lo", "color": "#15803D"},
            {"day": 4, "part_name": "Dãy núi phủ tuyết trắng", "description": "Ý chí kiên định không lay chuyển", "color": "#E2E8F0"},
            {"day": 5, "part_name": "Những tầng mây trắng trôi êm", "description": "Bình yên trong tâm trí", "color": "#F8FAFC"},
            {"day": 6, "part_name": "Vầng hào quang sinh thái", "description": "Bảo vệ tài chính bền vững", "color": "#34D399"},
            {"day": 7, "part_name": "Ngôi sao hy vọng & Vệ tinh tương lai", "description": "Trọn vẹn tuần lễ xanh thịnh vượng", "color": "#FBBF24"},
        ]
    },
    5: {
        "model_id": "summer_island_treasure",
        "month": 5,
        "name": "Ốc Đảo Nhiệt Đới & Hòm Báu 3D",
        "event_name": "Chào Hè & Biển Xanh Cát Vàng",
        "description": "Bãi biển nhiệt đới với cây dừa xanh mát và rương kho báu vàng bạc.",
        "theme_color": "#0EA5E9",
        "asset_file": "/static/models/summer_island.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Bãi cát vàng óng ả", "description": "Từng hạt cát tạo nên bờ biển lớn", "color": "#FDE047"},
            {"day": 2, "part_name": "Làn sóng biển trong veo", "description": "Dòng chảy tích lũy liên tục", "color": "#38BDF8"},
            {"day": 3, "part_name": "Thân cây dừa nghiêng bóng", "description": "Chống chọi mọi cơn bão tài chính", "color": "#854D0E"},
            {"day": 4, "part_name": "Tán lá dừa nhiệt đới", "description": "Bóng mát an toàn cho gia đình", "color": "#22C55E"},
            {"day": 5, "part_name": "Chiếc rương gỗ cổ điển", "description": "Nơi cất giữ thành quả", "color": "#78350F"},
            {"day": 6, "part_name": "Những đồng tiền vàng lấp lánh", "description": "Thành quả tiết kiệm hiện hình", "color": "#EAB308"},
            {"day": 7, "part_name": "Ánh hoàng hôn biển & Ngôi sao biển", "description": "Chinh phục kỳ nghỉ hè thảnh thơi", "color": "#F97316"},
        ]
    },
    6: {
        "model_id": "galaxy_camp_stars",
        "month": 6,
        "name": "Lều Trại Dưới Dải Ngân Hà 3D",
        "event_name": "Mùa Phiêu Lưu & Khám Phá Vũ Trụ",
        "description": "Chiếc lều cắm trại ấm cúng dưới bầu trời đêm ngàn sao rực rỡ.",
        "theme_color": "#8B5CF6",
        "asset_file": "/static/models/galaxy_camp.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Mặt đất đêm huyền bí", "description": "Bước chân đầu tiên vào hành trình", "color": "#1E1B4B"},
            {"day": 2, "part_name": "Bộ khung lều dã ngoại", "description": "Cấu trúc vững chãi của kế hoạch", "color": "#475569"},
            {"day": 3, "part_name": "Vải bạt lều sắc màu ấm áp", "description": "Mái ấm bình yên tự chủ", "color": "#F43F5E"},
            {"day": 4, "part_name": "Ngọn lửa trại bập bùng", "description": "Thắp sáng ngọn lửa nhiệt huyết", "color": "#EA580C"},
            {"day": 5, "part_name": "Kính thiên văn ngắm sao", "description": "Tầm nhìn xa trông rộng", "color": "#0284C7"},
            {"day": 6, "part_name": "Dải mây ngân hà màu tím mộng mơ", "description": "Vô hạn tiềm năng phát triển", "color": "#A855F7"},
            {"day": 7, "part_name": "Sao băng bay qua & Trăng lưỡi liềm", "description": "Ước mơ tài chính trở thành hiện thực", "color": "#FEF08A"},
        ]
    },
    7: {
        "model_id": "cozy_coffee_rain",
        "month": 7,
        "name": "Góc Tách Cà Phê Mưa Hạ 3D",
        "event_name": "Cơn Mưa Hạ & Khoảnh Khắc Bình Yên",
        "description": "Tách cà phê bốc khói bên khung cửa sổ ngắm mưa thanh thản.",
        "theme_color": "#6366F1",
        "asset_file": "/static/models/cozy_coffee.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Mặt bàn gỗ sồi ấm cúng", "description": "Khoảng không gian tĩnh lặng", "color": "#78350F"},
            {"day": 2, "part_name": "Khung cửa sổ kính", "description": "Góc nhìn thấu suốt cuộc sống", "color": "#94A3B8"},
            {"day": 3, "part_name": "Những giọt mưa long lanh trên kính", "description": "Rửa trôi những thói quen xấu", "color": "#60A5FA"},
            {"day": 4, "part_name": "Chiếc đĩa lót sứ trắng", "description": "Sự nâng niu từng đồng tích góp", "color": "#F8FAFC"},
            {"day": 5, "part_name": "Tách cà phê gốm màu caramel", "description": "Hương vị đậm đà của kỷ luật", "color": "#B45309"},
            {"day": 6, "part_name": "Làn khói thơm bốc lên dịu dàng", "description": "Niềm hạnh phúc giản đơn", "color": "#CBD5E1"},
            {"day": 7, "part_name": "Cuốn sách mở & Cầu vồng sau mưa", "description": "Tri thức và thành quả trọn vẹn", "color": "#EC4899"},
        ]
    },
    8: {
        "model_id": "autumn_maple_tree",
        "month": 8,
        "name": "Cây Phong Lá Đỏ Mùa Thu 3D",
        "event_name": "Mùa Thu Vàng & Khởi Đầu Năm Học Mới",
        "description": "Cây phong đỏ rực giữa gió thu mang lại sự chín muồi và thu hoạch.",
        "theme_color": "#F59E0B",
        "asset_file": "/static/models/maple_tree.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Gốc cây phong cổ kính", "description": "Bền bỉ theo năm tháng", "color": "#451A03"},
            {"day": 2, "part_name": "Thân cây tán rộng", "description": "Che chở ước mơ học tập", "color": "#78350F"},
            {"day": 3, "part_name": "Những cành cây màu hổ phách", "description": "Cột mốc từng ngày tích lũy", "color": "#D97706"},
            {"day": 4, "part_name": "Lớp lá phong vàng ươm", "description": "Sắc màu của trí tuệ", "color": "#FBBF24"},
            {"day": 5, "part_name": "Lớp lá phong đỏ rực rỡ", "description": "Sự trưởng thành và nhiệt huyết", "color": "#DC2626"},
            {"day": 6, "part_name": "Thảm lá phong rơi trên mặt cỏ", "description": "Mùa vàng bội thu", "color": "#B45309"},
            {"day": 7, "part_name": "Chiếc chuông gió ngân vang & Đèn lồng thu", "description": "Tuần tiết kiệm hoàn hảo mùa tựu trường", "color": "#F59E0B"},
        ]
    },
    9: {
        "model_id": "mid_autumn_lantern",
        "month": 9,
        "name": "Đèn Lồng Ngôi Sao & Trăng Rằm 3D",
        "event_name": "Tết Trung Thu & Sum Họp Gia Đình",
        "description": "Chiếc đèn ông sao phát sáng lung linh bên vầng trăng rằm tròn vành vạnh.",
        "theme_color": "#EAB308",
        "asset_file": "/static/models/mid_autumn.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Bệ mây bồng bềnh đêm rằm", "description": "Nền tảng hạnh phúc sum vầy", "color": "#E2E8F0"},
            {"day": 2, "part_name": "Vầng trăng rằm vàng rực tròn trịa", "description": "Sự đủ đầy trọn vẹn trong tâm", "color": "#FEF08A"},
            {"day": 3, "part_name": "Khung tre lồng đèn ông sao", "description": "Kỷ niệm tuổi thơ nuôi dưỡng ý chí", "color": "#CA8A04"},
            {"day": 4, "part_name": "Giấy kiếng đỏ bọc 5 cánh sao", "description": "Ánh lửa niềm tin bừng sáng", "color": "#EF4444"},
            {"day": 5, "part_name": "Vòng tròn tua rua giấy lấp lánh", "description": "Niềm vui rộn ràng", "color": "#38BDF8"},
            {"day": 6, "part_name": "Ngọn nến lung linh phát sáng bên trong", "description": "Soi tỏ tương lai tài chính", "color": "#F59E0B"},
            {"day": 7, "part_name": "Đĩa bánh trung thu & Thỏ ngọc cung trăng", "description": "Viên mãn trọn vẹn cả tuần lễ", "color": "#F472B6"},
        ]
    },
    10: {
        "model_id": "halloween_magic_pumpkin",
        "month": 10,
        "name": "Bí Ngô Ma Thuật Mỉm Cười 3D",
        "event_name": "Lễ Hội Halloween & Điều Kỳ Bí",
        "description": "Chú bí ngô tròn xoe đội mũ phù thủy phát ra ánh sáng vàng thần kỳ.",
        "theme_color": "#EA580C",
        "asset_file": "/static/models/halloween_pumpkin.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Ụ đất huyền bí phủ lá khô", "description": "Đối diện nỗi sợ, bắt đầu tiết kiệm", "color": "#451A03"},
            {"day": 2, "part_name": "Khối quả bí ngô cam mọng tròn xoe", "description": "Thân hình mũm mĩm đáng yêu", "color": "#F97316"},
            {"day": 3, "part_name": "Các đường rãnh múi bí ngô rõ nét", "description": "Từng bước kỷ luật rõ ràng", "color": "#C2410C"},
            {"day": 4, "part_name": "Cuống bí ngô màu xanh lục uốn lượn", "description": "Sức sống bền bỉ", "color": "#15803D"},
            {"day": 5, "part_name": "Nụ cười rạng rỡ khoét hình tam giác", "description": "Mỉm cười trước mọi thử thách", "color": "#FEF08A"},
            {"day": 6, "part_name": "Chiếc mũ phù thủy màu tím phép thuật", "description": "Biến giấc mơ thành hiện thực", "color": "#7C3AED"},
            {"day": 7, "part_name": "Ngọn lửa ma thuật ấm áp & Đom đóm bay", "description": "Hoàn tất tuần lễ bí ngô diệu kỳ", "color": "#FBBF24"},
        ]
    },
    11: {
        "model_id": "warm_fireplace_hearth",
        "month": 11,
        "name": "Lò Sưởi Hoàng Hôn & Lòng Biết Ơn 3D",
        "event_name": "Mùa Tri Ân & Hoàng Hôn Ấm Áp",
        "description": "Lò sưởi gạch ấm cúng tỏa ánh sáng êm dịu sưởi ấm những ngày đầu đông.",
        "theme_color": "#D97706",
        "asset_file": "/static/models/warm_hearth.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Nền sàn gạch nung ấm áp", "description": "Biết ơn từng đồng tiền mồ hôi công sức", "color": "#9A3412"},
            {"day": 2, "part_name": "Vòm lò sưởi đá vững chãi", "description": "Bức tường bảo vệ tổ ấm", "color": "#78716C"},
            {"day": 3, "part_name": "Các thanh củi thông khô xếp ngay ngắn", "description": "Chuẩn bị chu đáo cho tương lai", "color": "#451A03"},
            {"day": 4, "part_name": "Ngọn lửa vàng cam bập bùng", "description": "Hơi ấm của sự kiên trì", "color": "#EA580C"},
            {"day": 5, "part_name": "Chiếc ấm đồng đun nước thơm", "description": "Bình yên bên gia đình", "color": "#D97706"},
            {"day": 6, "part_name": "Bó hoa cúc vàng đặt trên kệ lò", "description": "Tấm lòng tri ân sâu sắc", "color": "#FACC15"},
            {"day": 7, "part_name": "Ánh sáng tỏa rạng & Những tia lửa lấp lánh", "description": "Trọn vẹn tuần lễ biết ơn đủ đầy", "color": "#FDE047"},
        ]
    },
    12: {
        "model_id": "christmas_pine_tree",
        "month": 12,
        "name": "Cây Thông Noel Kỳ Diệu 3D",
        "event_name": "Giáng Sinh Kỳ Diệu & Năm Mới",
        "description": "Cây thông tuyết trắng đính đầy quả châu, chuông vàng và hộp quà rực rỡ.",
        "theme_color": "#15803D",
        "asset_file": "/static/models/christmas_tree.glb",
        "sub_parts": [
            {"day": 1, "part_name": "Gốc cây & Chậu gỗ mộc mạc", "description": "Gốc rễ vững vàng đón chờ phép màu", "color": "#78350F"},
            {"day": 2, "part_name": "Tầng tán lá thông xanh thứ nhất", "description": "Tầng nền tảng tiết kiệm vững chắc", "color": "#166534"},
            {"day": 3, "part_name": "Tầng tán lá thông xanh thứ hai", "description": "Tích lũy từng ngày vươn cao", "color": "#15803D"},
            {"day": 4, "part_name": "Tầng tán lá thông phủ tuyết trắng", "description": "Sự tinh khôi và tự hào", "color": "#F8FAFC"},
            {"day": 5, "part_name": "Dây đèn LED lấp lánh nhiều màu", "description": "Tỏa sáng hy vọng tương lai", "color": "#FBBF24"},
            {"day": 6, "part_name": "Quả châu đỏ, chuông vàng & Hộp quà", "description": "Món quà xứng đáng cho bản thân", "color": "#EF4444"},
            {"day": 7, "part_name": "Ngôi sao Noel đỉnh tháp & Bông tuyết rơi", "description": "Chinh phục đỉnh cao chu kỳ tiết kiệm", "color": "#FDE047"},
        ]
    },
}


def get_3d_model_metadata(month: Optional[int] = None, current_streak: int = 0) -> Model3DMetadata:
    if month is None or month < 1 or month > 12:
        month = datetime.now().month

    raw_data = MODELS_3D_CATALOG.get(month, MODELS_3D_CATALOG[11])

    # Gán cờ is_revealed cho từng sub_part tương ứng theo streak
    sub_parts = []
    for part in raw_data["sub_parts"]:
        is_revealed = part["day"] <= current_streak
        sub_parts.append(Model3DSubPart(
            day=part["day"],
            part_name=part["part_name"],
            description=part["description"],
            color=part["color"],
            is_revealed=is_revealed
        ))

    return Model3DMetadata(
        model_id=raw_data["model_id"],
        month=raw_data["month"],
        name=raw_data["name"],
        event_name=raw_data["event_name"],
        description=raw_data["description"],
        theme_color=raw_data["theme_color"],
        asset_file=raw_data["asset_file"],
        sub_parts=sub_parts
    )

