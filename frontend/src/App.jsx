import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MonthSelector from './components/MonthSelector';
import StreakTracker from './components/StreakTracker';
import Savings3DViewer from './components/Savings3DViewer';
import PictureReveal from './components/PictureReveal';
import CheckInButton from './components/CheckInButton';
import FinancialDashboard from './components/FinancialDashboard';
import AchievementBadges from './components/AchievementBadges';
import SavingsGoalsSelector from './components/SavingsGoalsSelector';
import ConfettiEffect from './components/ConfettiEffect';
import FloatingBalloons from './components/FloatingBalloons';
import ChibiCompanion from './components/ChibiCompanion';
import GardenCalendar from './components/GardenCalendar';
import { playVictoryFanfare } from './utils/audio';
import {
  fetchSavingsStatus,
  performSavingsCheckIn,
  resetSavingsStreak,
  simulateSavingsDay,
  fetchTheme,
  fetchAllThemes,
  fetchSavingsHistory,
} from './api';

export default function App() {
  const [status, setStatus] = useState(null);
  const [theme, setTheme] = useState(null);
  const [allThemes, setAllThemes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentRealMonth] = useState(new Date().getMonth() + 1);
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [activeTab, setActiveTab] = useState('3d'); // '3d', 'dashboard', 'badges', 'picture'
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [coinActive, setCoinActive] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);

  // Load initial data
  const loadData = async (month = selectedMonth) => {
    try {
      setLoading(true);
      const [savingsData, themeData, themesList, historyData] = await Promise.all([
        fetchSavingsStatus(month),
        fetchTheme(month),
        fetchAllThemes(),
        fetchSavingsHistory().catch(() => ({ logs: [] })),
      ]);

      setStatus(savingsData);
      setTheme(themeData);
      setAllThemes(themesList.themes || []);
      setHistoryLogs(historyData.logs || []);

      if (savingsData.is_week_completed) {
        setShowConfetti(true);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Lỗi kết nối tới máy chủ nè' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedMonth);
  }, [selectedMonth]);

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
  };

  const handleCheckIn = async (amount, note) => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await performSavingsCheckIn(amount, note);

      setStatus(res.status);
      setFeedback({ type: 'success', message: res.message });

      // Kích hoạt đồng xu 3D rơi
      setCoinActive(true);
      setTimeout(() => setCoinActive(false), 2000);

      if (res.is_week_completed) {
        playVictoryFanfare();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 9000);
      }

      const historyData = await fetchSavingsHistory().catch(() => ({ logs: [] }));
      setHistoryLogs(historyData.logs || []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const newStatus = await resetSavingsStreak();
      setStatus(newStatus);
      setShowConfetti(false);
      setFeedback({ type: 'success', message: 'Đã reset tuần tiết kiệm về ngày 0. Bạn có thể điểm danh lại!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateDay = async () => {
    try {
      setLoading(true);
      const newStatus = await simulateSavingsDay(50000);
      setStatus(newStatus);
      setFeedback({
        type: 'success',
        message: `Đã tiến sang ngày tiếp theo (+50k)! Tiến độ tô màu 3D: ${newStatus.current_streak}/7 ngày ✨`,
      });

      // Kích hoạt đồng xu 3D rơi
      setCoinActive(true);
      setTimeout(() => setCoinActive(false), 2000);

      if (newStatus.is_week_completed) {
        playVictoryFanfare();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 9000);
      }

      const historyData = await fetchSavingsHistory().catch(() => ({ logs: [] }));
      setHistoryLogs(historyData.logs || []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#FFD1DC] selection:text-[#5C4B47] relative">
      {/* Dreamy Ambient Floating Clouds & Bubbles */}
      <FloatingBalloons />

      {/* Pastel Stars, Sakura & Hearts Confetti */}
      <ConfettiEffect active={showConfetti} />

      {/* Top Navbar */}
      <Header status={status} theme={theme} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Month Selector */}
        <MonthSelector
          currentMonth={currentRealMonth}
          selectedMonth={selectedMonth}
          onSelectMonth={handleSelectMonth}
          allThemes={allThemes}
          theme={theme}
          useCustomImage={useCustomImage}
          setUseCustomImage={setUseCustomImage}
        />

        {/* 7-Days Blooming Tracker */}
        <StreakTracker status={status} />

        {/* ============================================================== */}
        {/* THANH ĐIỀU HƯỚNG TÍNH NĂNG (FEATURE NAVIGATION TABS) */}
        {/* ============================================================== */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 overflow-x-auto py-1">
          <div className="bg-white/95 p-1.5 rounded-full border-2 border-[#FFD1DC] shadow-sm flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('3d')}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeTab === '3d'
                  ? 'bg-gradient-to-r from-[#FF94B8] to-[#FF8E9E] text-white shadow-sm'
                  : 'text-[#8C7A75] hover:text-[#5C4B47]'
              }`}
            >
              <span>🎮</span>
              <span>Mô Hình 3D</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#FF94B8] to-[#FF8E9E] text-white shadow-sm'
                  : 'text-[#8C7A75] hover:text-[#5C4B47]'
              }`}
            >
              <span>📊</span>
              <span>Thống Kê Quỹ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('badges')}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeTab === 'badges'
                  ? 'bg-gradient-to-r from-[#FF94B8] to-[#FF8E9E] text-white shadow-sm'
                  : 'text-[#8C7A75] hover:text-[#5C4B47]'
              }`}
            >
              <span>🏅</span>
              <span>Huy Hiệu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('picture')}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                activeTab === 'picture'
                  ? 'bg-gradient-to-r from-[#FF94B8] to-[#FF8E9E] text-white shadow-sm'
                  : 'text-[#8C7A75] hover:text-[#5C4B47]'
              }`}
            >
              <span>🖼️</span>
              <span>Tranh Mảnh Ghép</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Mô Hình 3D & Bỏ Heo */}
        {activeTab === '3d' && (
          <>
            {/* Bộ Chọn Mục Tiêu Tiết Kiệm (Savings Goals) */}
            <SavingsGoalsSelector />

            {/* Mô Hình 3D Tương Tác Canvas */}
            <Savings3DViewer status={status} coinActive={coinActive} />

            {/* Check-In Marshmallow Button & Controls */}
            <CheckInButton
              status={status}
              onCheckIn={handleCheckIn}
              onReset={handleReset}
              onSimulateDay={handleSimulateDay}
              loading={loading}
              feedback={feedback}
            />
          </>
        )}

        {/* Tab 2: Thống Kê Tài Chính & Cấp Độ Heo Đất */}
        {activeTab === 'dashboard' && (
          <FinancialDashboard status={status} historyLogs={historyLogs} />
        )}

        {/* Tab 3: Phòng Truyền Thống & Huy Hiệu */}
        {activeTab === 'badges' && (
          <AchievementBadges status={status} />
        )}

        {/* Tab 4: Bức Tranh 2D & Lưu Bưu Thiếp */}
        {activeTab === 'picture' && (
          <PictureReveal
            status={status}
            theme={theme}
            useCustomImage={useCustomImage}
          />
        )}

        {/* Khu vườn thói quen 30 ngày trong tháng */}
        <GardenCalendar status={status} historyLogs={historyLogs} />

        {/* Sổ tay heo đất - Lịch sử điểm danh tiết kiệm */}
        {historyLogs.length > 0 && (
          <div className="kawaii-card p-5 mb-8">
            <h3 className="text-sm font-extrabold text-[#5C4B47] mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>📖</span>
                <span>Nhật ký tiết kiệm gần đây</span>
              </span>
              <span className="text-xs text-[#2D6A4F] bg-[#D8F3DC] px-2.5 py-0.5 rounded-full font-bold">
                +{status?.total_money_saved?.toLocaleString('vi-VN')} đ tích lũy
              </span>
            </h3>
            <div className="space-y-2">
              {historyLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9FA] border border-[#FFE5EC] text-xs font-semibold"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF8E9E]" />
                    <span className="font-extrabold text-[#5C4B47]">
                      Ngày #{log.day_in_cycle}
                    </span>
                    <span className="text-[#C2B5B0]">|</span>
                    <span className="text-[#8C7A75]">{log.check_in_date}</span>
                    <span className="text-[#2D6A4F] font-bold bg-[#D8F3DC] px-2 py-0.5 rounded-md">
                      +{(log.amount || 50000).toLocaleString('vi-VN')} đ
                    </span>
                    {log.note && (
                      <span className="text-[#E76F51] italic truncate max-w-[200px]">
                        "{log.note}"
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3B0] text-[#705800] font-bold">
                    Tuần chu kỳ #{log.cycle_number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Chibi Mascot Companion (Bé Thỏ Bông cổ vũ góc màn hình) */}
      <ChibiCompanion />

      {/* Footer */}
      <footer className="border-t-2 border-[#FFE5EC] bg-white/70 py-6 text-center text-xs font-bold text-[#8C7A75] relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>🎮 Daily Savings Tracker 3D • Nghiên cứu Gamification Thay Đổi Hành Vi Tài Chính 💖</p>
          <div className="flex items-center gap-1.5">
            <span>Tích lũy nhỏ, tương lai to! ✨</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
