import os
import sqlite3
from typing import Dict, Any, List, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "habits.db")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Bảng lưu trạng thái chuỗi điểm danh và tài chính tích lũy
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS streak_state (
            id INTEGER PRIMARY KEY,
            current_streak INTEGER NOT NULL DEFAULT 0,
            last_check_in TEXT,
            total_cycles_completed INTEGER NOT NULL DEFAULT 0,
            total_check_ins INTEGER NOT NULL DEFAULT 0,
            total_money_saved REAL NOT NULL DEFAULT 0,
            monthly_money_saved REAL NOT NULL DEFAULT 0,
            weekly_money_saved REAL NOT NULL DEFAULT 0,
            week_in_month INTEGER NOT NULL DEFAULT 1,
            updated_at TEXT NOT NULL
        )
    """)

    # Bổ sung các cột mới nếu bảng đã tồn tại từ trước (safe migration)
    cursor.execute("PRAGMA table_info(streak_state)")
    columns = [row[1] for row in cursor.fetchall()]
    if "total_money_saved" not in columns:
        cursor.execute("ALTER TABLE streak_state ADD COLUMN total_money_saved REAL NOT NULL DEFAULT 0")
    if "monthly_money_saved" not in columns:
        cursor.execute("ALTER TABLE streak_state ADD COLUMN monthly_money_saved REAL NOT NULL DEFAULT 0")
    if "weekly_money_saved" not in columns:
        cursor.execute("ALTER TABLE streak_state ADD COLUMN weekly_money_saved REAL NOT NULL DEFAULT 0")
    if "week_in_month" not in columns:
        cursor.execute("ALTER TABLE streak_state ADD COLUMN week_in_month INTEGER NOT NULL DEFAULT 1")

    # Bảng lưu nhật ký từng ngày điểm danh kèm số tiền tiết kiệm
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS check_in_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            check_in_date TEXT NOT NULL,
            cycle_number INTEGER NOT NULL,
            day_in_cycle INTEGER NOT NULL,
            amount REAL NOT NULL DEFAULT 50000,
            note TEXT,
            created_at TEXT NOT NULL
        )
    """)

    # Safe migration cho check_in_history
    cursor.execute("PRAGMA table_info(check_in_history)")
    hist_cols = [row[1] for row in cursor.fetchall()]
    if "amount" not in hist_cols:
        cursor.execute("ALTER TABLE check_in_history ADD COLUMN amount REAL NOT NULL DEFAULT 50000")

    # Khởi tạo bản ghi mặc định nếu chưa tồn tại
    cursor.execute("SELECT COUNT(*) FROM streak_state WHERE id = 1")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO streak_state (
                id, current_streak, last_check_in, total_cycles_completed, total_check_ins,
                total_money_saved, monthly_money_saved, weekly_money_saved, week_in_month, updated_at
            )
            VALUES (1, 0, NULL, 0, 0, 0, 0, 0, 1, ?)
        """, (datetime.now().isoformat(),))

    conn.commit()
    conn.close()


def get_streak_state() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM streak_state WHERE id = 1")
    row = cursor.fetchone()
    conn.close()

    if row:
        return dict(row)
    return {
        "id": 1,
        "current_streak": 0,
        "last_check_in": None,
        "total_cycles_completed": 0,
        "total_check_ins": 0,
        "total_money_saved": 0.0,
        "monthly_money_saved": 0.0,
        "weekly_money_saved": 0.0,
        "week_in_month": 1,
        "updated_at": datetime.now().isoformat(),
    }


def update_streak_state(
    current_streak: int,
    last_check_in: str,
    total_cycles_completed: int,
    total_check_ins: int,
    total_money_saved: float,
    monthly_money_saved: float,
    weekly_money_saved: float,
    week_in_month: int,
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE streak_state
        SET current_streak = ?,
            last_check_in = ?,
            total_cycles_completed = ?,
            total_check_ins = ?,
            total_money_saved = ?,
            monthly_money_saved = ?,
            weekly_money_saved = ?,
            week_in_month = ?,
            updated_at = ?
        WHERE id = 1
    """, (
        current_streak,
        last_check_in,
        total_cycles_completed,
        total_check_ins,
        total_money_saved,
        monthly_money_saved,
        weekly_money_saved,
        week_in_month,
        datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()


def add_check_in_log(check_in_date: str, cycle_number: int, day_in_cycle: int, amount: float = 50000, note: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO check_in_history (check_in_date, cycle_number, day_in_cycle, amount, note, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        check_in_date,
        cycle_number,
        day_in_cycle,
        amount,
        note,
        datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()


def get_history_logs(limit: int = 14) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM check_in_history
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def reset_streak_state():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE streak_state
        SET current_streak = 0,
            last_check_in = NULL,
            weekly_money_saved = 0,
            updated_at = ?
        WHERE id = 1
    """, (datetime.now().isoformat(),))
    conn.commit()
    conn.close()
