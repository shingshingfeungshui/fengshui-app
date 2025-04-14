import React, { useState } from 'react';
import { getGPTResponse } from './gpt';
import { Lunar } from 'lunar-javascript';
import './App.css';

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
  const [gptText, setGptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGptText('');
    setIsLoading(true);

    const { name, birthDate, birthTime, location, unknownTime } = formData;

    if (!name || !birthDate || (!birthTime && !unknownTime) || !location) {
      setError('請填寫所有欄位，或選擇「唔知道出世時間」。');
      setIsLoading(false);
      return;
    }

    let time = unknownTime ? '12:00' : birthTime;
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const lunar = Lunar.fromDate(new Date(year, month - 1, day, hour, minute));
    const eightChar = lunar.getEightChar();

    const baziData = {
      year: eightChar.getYear(),
      month: eightChar.getMonth(),
      day: eightChar.getDay(),
      time: eightChar.getTime(),
      name: name,
    };

    setBazi(baziData);

    // 構造 prompt 字串，注意可以自訂系統設定後續 GPT 分析角度（奇門遁甲）
    const prompt = `姓名：${name}\n八字：${baziData.year}年 ${baziData.month}月 ${baziData.day}日 ${baziData.time}時\n請根據以上八字，用奇門遁甲角度，簡單分析性格特質，請用中文回答，大概200-300字。`;


    try {
      const gptResult = await getGPTResponse(prompt);
      setGptText(gptResult);
    } catch (err) {
      console.error('GPT 分析失敗', err);
      setError('系統分析失敗，請稍後再試。');
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1>丞丞用奇門遁甲幫你分析（免費版）</h1>
      <p className="description">
        本頁丞丞會使用「奇門遁甲」幫你做一個命理簡單性格分析，準確度僅供參考。
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>姓名：</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" />
        </div>

        <div className="form-group">
          <label>出生日期 (YYYY-MM-DD)：</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="input" />
        </div>

        <div className="form-group">
          <label>出生時間 (HH:mm)：</label>
          <input type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} disabled={formData.unknownTime} className="input" />
          <label className="checkbox-label">
            <input type="checkbox" name="unknownTime" checked={formData.unknownTime} onChange={handleChange} />
            唔知道出生時間（系統會預設為中午12:00，準確度約 70%）
          </label>
        </div>

        <div className="form-group">
          <label>出生地點：</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="input" />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button">提交</button>
      </form>

      {isLoading && (
        <div className="result">
          <p>分析中，請稍候…</p>
        </div>
      )}

      {bazi && !isLoading && (
        <div className="result">
          <h3>🧭 產生八字：</h3>
          <p>出生年柱：{bazi.year}</p>
          <p>出生月柱：{bazi.month}</p>
          <p>出生日柱：{bazi.day}</p>
          <p>出生時柱：{bazi.time}</p>

          <h3>🧠 性格模擬分析：</h3>
          {gptText ? <p>{gptText}</p> : <p>{bazi.name} 嘅八字性格偏向理性、有責任感、做事有原則。</p>}
          <p>此分析為奇門遁甲模擬版本，如想深入了解事業、感情、健康、財運，可選擇進一步分析。</p>
        </div>
      )}
    </div>
  );
}

export default App;
