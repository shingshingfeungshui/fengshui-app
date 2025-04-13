import React, { useState } from 'react';
import { Lunar } from 'lunar-javascript';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    location: '',
    unknownTime: false
  });

  const [bazi, setBazi] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { name, birthDate, birthTime, location, unknownTime } = formData;

    // 檢查表單完整性
    if (!name || !birthDate || (!birthTime && !unknownTime) || !location) {
      setError('請填寫所有欄位，或選擇「唔知道出世時間」。');
      return;
    }

    // 處理時間
    let time = birthTime;
    if (unknownTime) {
      time = '12:00'; // 中午12點為預設時間
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const lunar = Lunar.fromDate(new Date(year, month - 1, day, hour, minute));
    const eightChar = lunar.getEightChar();

    setBazi({
      year: eightChar.getYear(),
      month: eightChar.getMonth(),
      day: eightChar.getDay(),
      time: eightChar.getTime(),
      name: name,
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', textAlign: 'center' }}>
        丞丞用奇門遁甲幫你分析（免費版）
      </h1>
      <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem' }}>
        本頁丞丞會使用「奇門遁甲」幫你做一個命理簡單性格分析，準確度僅供參考。
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>姓名：</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>出生日期 (YYYY-MM-DD)：</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>出生時間 (HH:mm)：</label>
          <input type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} disabled={formData.unknownTime} style={inputStyle} />
          <div>
            <label>
              <input type="checkbox" name="unknownTime" checked={formData.unknownTime} onChange={handleChange} /> 唔知道出生時間（系統會預設為中午12:00，準確度約 70%）
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>出生地點：</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button type="submit" style={buttonStyle}>提交</button>
      </form>

      {bazi && (
        <div style={{ marginTop: '2rem', backgroundColor: '#333', padding: '1rem 2rem', borderRadius: '8px', textAlign: 'left' }}>
          <h3>🧭 產生八字：</h3>
          <p>出生年柱：{bazi.year}</p>
          <p>出生月柱：{bazi.month}</p>
          <p>出生日柱：{bazi.day}</p>
          <p>出生時柱：{bazi.time}</p>

          <h3 style={{ marginTop: '1rem' }}>🧠 性格模擬分析：</h3>
          <p>{bazi.name} 嘅八字性格偏向理性、有責任感、做事有原則。</p>
          <p>此分析為奇門遁甲模擬版本，如想深入了解事業、感情、健康、財運，可選擇進一步分析。</p>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginTop: '0.25rem'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default App;
