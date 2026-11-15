const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function fetchSavingsStatus(month = null) {
  const url = month ? `${API_BASE}/api/status?month=${month}` : `${API_BASE}/api/status`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải trạng thái tiết kiệm 3D');
  return res.json();
}

export async function performSavingsCheckIn(amount = 50000, note = null, simulatedDate = null) {
  const res = await fetch(`${API_BASE}/api/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, note, simulated_date: simulatedDate }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Lỗi khi điểm danh tiết kiệm');
  }
  return data;
}

export async function resistTemptation(itemName = 'Ly trà sữa trân châu', amount = 35000) {
  const res = await fetch(`${API_BASE}/api/savings/resist-temptation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_name: itemName, amount }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Lỗi khi ghi nhận kiềm chế cám dỗ');
  }
  return data;
}

export async function fetchTemptations() {
  const res = await fetch(`${API_BASE}/api/savings/temptations?limit=10`);
  if (!res.ok) throw new Error('Không thể tải nhật ký cám dỗ');
  return res.json();
}

export async function fetchMonthlyThemeAndModel(month = null) {
  const url = month ? `${API_BASE}/api/monthly-theme?month=${month}` : `${API_BASE}/api/monthly-theme`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải cấu hình 3D theo tháng');
  return res.json();
}

export async function resetSavingsStreak() {
  const res = await fetch(`${API_BASE}/api/savings/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Không thể reset dữ liệu');
  return res.json();
}

export async function simulateSavingsDay(amount = 50000) {
  const res = await fetch(`${API_BASE}/api/savings/simulate-day?amount=${amount}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Không thể giả lập ngày tiếp theo');
  return res.json();
}

export async function fetchSavingsHistory() {
  const res = await fetch(`${API_BASE}/api/savings/history?limit=10`);
  if (!res.ok) throw new Error('Không thể tải lịch sử');
  return res.json();
}

export async function fetchTheme(month = null) {
  const url = month ? `${API_BASE}/api/theme?month=${month}` : `${API_BASE}/api/theme`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải chủ đề tháng');
  return res.json();
}

export async function fetchAllThemes() {
  const res = await fetch(`${API_BASE}/api/themes`);
  if (!res.ok) throw new Error('Không thể tải danh sách chủ đề');
  return res.json();
}
