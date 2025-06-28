import React, { useState, useEffect } from 'react';
import { Clock, Calculator, Award, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const TimeConverterTool = () => {
  const [activeTab, setActiveTab] = useState('converter');
  const [seconds, setSeconds] = useState('');
  const [minutes, setMinutes] = useState('');
  const [hours, setHours] = useState('');
  
  // 練習題相關狀態
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // 換算邏輯
  const updateFromSeconds = (value) => {
    const sec = parseFloat(value) || 0;
    setSeconds(value);
    setMinutes((sec / 60).toString());
    setHours((sec / 3600).toString());
  };

  const updateFromMinutes = (value) => {
    const min = parseFloat(value) || 0;
    setMinutes(value);
    setSeconds((min * 60).toString());
    setHours((min / 60).toString());
  };

  const updateFromHours = (value) => {
    const hr = parseFloat(value) || 0;
    setHours(value);
    setSeconds((hr * 3600).toString());
    setMinutes((hr * 60).toString());
  };

  // 練習題生成
  const generateQuestion = () => {
    const types = [
      { from: 'hours', to: 'minutes', multiplier: 60, symbol: '小時 → 分鐘' },
      { from: 'minutes', to: 'seconds', multiplier: 60, symbol: '分鐘 → 秒' },
      { from: 'hours', to: 'seconds', multiplier: 3600, symbol: '小時 → 秒' },
      { from: 'minutes', to: 'hours', multiplier: 1/60, symbol: '分鐘 → 小時' },
      { from: 'seconds', to: 'minutes', multiplier: 1/60, symbol: '秒 → 分鐘' },
      { from: 'seconds', to: 'hours', multiplier: 1/3600, symbol: '秒 → 小時' }
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const baseValue = Math.floor(Math.random() * 10) + 1;
    const answer = baseValue * type.multiplier;
    
    return {
      question: `${baseValue} ${type.symbol.split(' → ')[0]} 等於多少 ${type.symbol.split(' → ')[1]}？`,
      answer: answer,
      type: type.symbol
    };
  };

  const startNewQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentQuestion || !userAnswer) return;
    
    const userNum = parseFloat(userAnswer);
    const isCorrect = Math.abs(userNum - currentQuestion.answer) < 0.01;
    
    setFeedback({
      correct: isCorrect,
      correctAnswer: currentQuestion.answer,
      explanation: `${currentQuestion.type}: ${isCorrect ? '答對了！' : '答錯了'}`
    });
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setQuestionsAnswered(questionsAnswered + 1);
  };

  useEffect(() => {
    if (activeTab === 'practice' && !currentQuestion) {
      startNewQuestion();
    }
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 標題 */}
        <div className="bg-sky-600 text-white p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-8 h-8" />
            <h1 className="text-3xl font-bold">學習時間換算工具</h1>
          </div>
          <p className="text-sky-200">掌握秒、分鐘、小時的換算技巧</p>
        </div>

        {/* 導航標籤 */}
        <div className="flex bg-gray-50 border-b">
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'converter' 
                ? 'bg-white text-sky-600 border-b-2 border-sky-600' 
                : 'text-gray-600 hover:text-sky-600'
            }`}
          >
            <Calculator className="w-5 h-5 inline mr-2" />
            時間換算器
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'knowledge' 
                ? 'bg-white text-sky-600 border-b-2 border-sky-600' 
                : 'text-gray-600 hover:text-sky-600'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            基礎知識
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'practice' 
                ? 'bg-white text-sky-600 border-b-2 border-sky-600' 
                : 'text-gray-600 hover:text-sky-600'
            }`}
          >
            <Award className="w-5 h-5 inline mr-2" />
            互動練習
          </button>
        </div>

        <div className="p-6">
          {/* 時間換算器標籤 */}
          {activeTab === 'converter' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                輸入任一時間，自動換算其他單位
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* 小時輸入 */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    小時 (hours)
                  </label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => updateFromHours(e.target.value)}
                    className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                    placeholder="輸入小時數"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    1小時 = 60分鐘 = 3600秒
                  </div>
                </div>

                {/* 分鐘輸入 */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    分鐘 (minutes)
                  </label>
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => updateFromMinutes(e.target.value)}
                    className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                    placeholder="輸入分鐘數"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    1分鐘 = 60秒
                  </div>
                </div>

                {/* 秒輸入 */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    秒 (seconds)
                  </label>
                  <input
                    type="number"
                    value={seconds}
                    onChange={(e) => updateFromSeconds(e.target.value)}
                    className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                    placeholder="輸入秒數"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    最小時間單位
                  </div>
                </div>
              </div>

              {/* 清除按鈕 */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setSeconds('');
                    setMinutes('');
                    setHours('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  清除所有
                </button>
              </div>
            </div>
          )}

          {/* 基礎知識標籤 */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">時間換算基礎知識</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-sky-50 p-6 rounded-lg border border-sky-200">
                  <h3 className="text-xl font-semibold text-sky-800 mb-4">換算關係</h3>
                  <div className="space-y-3 text-lg">
                    <div className="flex justify-between items-center p-3 bg-white rounded border">
                      <span>1 小時</span>
                      <span>=</span>
                      <span className="font-bold text-sky-600">60 分鐘</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded border">
                      <span>1 分鐘</span>
                      <span>=</span>
                      <span className="font-bold text-gray-600">60 秒</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded border">
                      <span>1 小時</span>
                      <span>=</span>
                      <span className="font-bold text-black">3600 秒</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">記憶口訣</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-300">
                      <div className="text-lg font-medium text-gray-800">
                        "六十六十記心中"
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        1小時60分鐘，1分鐘60秒
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-300">
                      <div className="text-lg font-medium text-gray-800">
                        "三千六百一小時"
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        1小時等於3600秒
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 p-6 rounded-lg border border-sky-200">
                <h3 className="text-xl font-semibold text-sky-800 mb-4">生活實例</h3>
                <div className="grid gap-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <span className="font-medium">一節課：</span> 45分鐘 = 2700秒
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <span className="font-medium">看一部電影：</span> 2小時 = 120分鐘 = 7200秒
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <span className="font-medium">午休時間：</span> 30分鐘 = 1800秒
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 互動練習標籤 */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">互動練習題</h2>
                <div className="mt-2 text-lg">
                  <span className="text-sky-600 font-semibold">答對：{score}</span>
                  <span className="mx-4 text-gray-400">|</span>
                  <span className="text-gray-600 font-semibold">總題數：{questionsAnswered}</span>
                  {questionsAnswered > 0 && (
                    <>
                      <span className="mx-4 text-gray-400">|</span>
                      <span className="text-black font-semibold">
                        正確率：{Math.round((score / questionsAnswered) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {currentQuestion && (
                <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-sky-800 mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full p-3 text-lg border-2 border-sky-300 rounded-lg focus:border-sky-500 focus:outline-none"
                      placeholder="輸入你的答案"
                      disabled={feedback !== null}
                    />
                    
                    <div className="flex gap-4">
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer || feedback !== null}
                        className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        檢查答案
                      </button>
                      
                      <button
                        onClick={startNewQuestion}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        下一題
                      </button>
                    </div>
                  </div>

                  {feedback && (
                    <div className={`mt-4 p-4 rounded-lg border-2 ${
                      feedback.correct 
                        ? 'bg-sky-50 border-sky-300 text-sky-800' 
                        : 'bg-gray-50 border-gray-300 text-gray-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {feedback.correct ? (
                          <CheckCircle className="w-5 h-5 text-sky-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600" />
                        )}
                        <span className="font-semibold">
                          {feedback.correct ? '答對了！' : '答錯了！'}
                        </span>
                      </div>
                      <div>
                        正確答案：<span className="font-bold">{feedback.correctAnswer}</span>
                      </div>
                      <div className="text-sm mt-1 opacity-80">
                        {feedback.explanation}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeConverterTool;