// ========== 工具函数 ==========
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId + '-page').classList.add('active');
}

function toggleWordEditor() {
  document.getElementById('word-editor').classList.toggle('hidden');
}

function toggleWordEditorEn() {
  document.getElementById('word-editor-en').classList.toggle('hidden');
}

// 使用 Web Speech API 发音
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // 检测是汉字还是英文，选择合适的语言
    if (/[\u4e00-\u9fa5]/.test(text)) {
      utterance.lang = 'zh-CN';
    } else {
      utterance.lang = 'en-US';
    }
    speechSynthesis.speak(utterance);
  }
}

// ========== 识字模块存储 ==========
const STORAGE_KEY_WORDS = 'kids-literacy-words';

// 默认四五快读第一册核心汉字
const defaultWords = [
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '上', '下', '大', '小', '多', '少', '日', '月', '水', '火',
  '山', '石', '田', '土', '人', '口', '手', '足', '耳', '目',
  '刀', '尺', '寸', '心', '个', '天', '地', '父', '母', '子',
  '女', '男', '开', '关', '来', '去', '出', '入', '大', '中'
];

function getWords() {
  const stored = localStorage.getItem(STORAGE_KEY_WORDS);
  if (stored) {
    return stored.split('\n').filter(w => w.trim());
  }
  return [...defaultWords];
}

function saveWords() {
  const text = document.getElementById('word-textarea').value;
  const words = text.split('\n').filter(w => w.trim());
  localStorage.setItem(STORAGE_KEY_WORDS, words.join('\n'));
  renderCharacters();
  toggleWordEditor();
}

function resetWords() {
  document.getElementById('word-textarea').value = defaultWords.join('\n');
}

function renderCharacters() {
  const grid = document.getElementById('char-grid');
  const words = getWords();
  grid.innerHTML = '';
  words.forEach(word => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.textContent = word.trim();
    card.onclick = () => speak(word.trim());
    grid.appendChild(card);
  });
}

// 初始化识字编辑器
document.getElementById('word-textarea').value = defaultWords.join('\n');

// ========== 英语模块 ==========
const STORAGE_KEY_WORDS_EN = 'kids-english-words';

// 默认英语发音数据
const englishData = {
  'alphabet': [
    {text: 'A', pron: '/eɪ/'}, {text: 'B', pron: '/biː/'}, {text: 'C', pron: '/siː/'},
    {text: 'D', pron: '/diː/'}, {text: 'E', pron: '/iː/'}, {text: 'F', pron: '/ef/'},
    {text: 'G', pron: '/dʒiː/'}, {text: 'H', pron: '/eɪtʃ/'}, {text: 'I', pron: '/aɪ/'},
    {text: 'J', pron: '/dʒeɪ/'}, {text: 'K', pron: '/keɪ/'}, {text: 'L', pron: '/el/'},
    {text: 'M', pron: '/em/'}, {text: 'N', pron: '/en/'}, {text: 'O', pron: '/oʊ/'},
    {text: 'P', pron: '/piː/'}, {text: 'Q', pron: '/kjuː/'}, {text: 'R', pron: '/ɑːr/'},
    {text: 'S', pron: '/es/'}, {text: 'T', pron: '/tiː/'}, {text: 'U', pron: '/juː/'},
    {text: 'V', pron: '/viː/'}, {text: 'W', pron: "'dʌbəljuː/"}, {text: 'X', pron: '/eks/'},
    {text: 'Y', pron: '/waɪ/'}, {text: 'Z', pron: '/ziː/'}
  ],
  'vowel-single': [
    {text: 'a', pron: "短元音/æ/"}, {text: 'e', pron: "短元音/e/"}, {text: 'i', pron: "短元音/ɪ/"},
    {text: 'o', pron: "短元音/ɒ/"}, {text: 'u', pron: "短元音/ʌ/"}, {text: 'a-e', pron: "长元音/ei/"},
    {text: 'e-e', pron: "长元音/i:/"}, {text: 'i-e', pron: "长元音/ai/"}, {text: 'o-e', pron: "长元音/ou/"}
  ],
  'vowel-double': [
    {text: 'ai', pron: "/ei/"}, {text: 'ay', pron: "/ei/"}, {text: 'ee', pron: "/i:/"},
    {text: 'ea', pron: "/i:/"}, {text: 'oa', pron: "/ou/"}, {text: 'ow', pron: "/ou/"},
    {text: 'oo', pron: "/u:/"}, {text: 'ie', pron: "/i:/"}, {text: 'au', pron: "/ɔ:/"},
    {text: 'aw', pron: "/ɔ:/"}, {text: 'oi', pron: "/ɔi/"}, {text: 'ou', pron: "/au/"}
  ],
  'words': []
};

function getEnglishWords() {
  const stored = localStorage.getItem(STORAGE_KEY_WORDS_EN);
  if (stored) {
    const words = stored.split('\n').filter(line => line.trim()).map(line => {
      const parts = line.split(/\s+/);
      return {text: parts[0], pron: parts.slice(1).join(' ')};
    });
    return words;
  }
  // 默认一些简单单词
  return [
    {text: 'cat', pron: '猫 /kæt/'},
    {text: 'dog', pron: '狗 /dɒɡ/'},
    {text: 'apple', pron: '苹果 /ˈæpəl/'},
    {text: 'banana', pron: '香蕉 /bəˈnænə/'},
    {text: 'sun', pron: '太阳 /sʌn/'},
    {text: 'moon', pron: '月亮 /muːn/'}
  ];
}

function saveWordsEn() {
  const text = document.getElementById('word-textarea-en').value;
  localStorage.setItem(STORAGE_KEY_WORDS_EN, text);
  selectCategory('words');
  toggleWordEditorEn();
}

function resetWordsEn() {
  const defaultWords = getEnglishWords();
  document.getElementById('word-textarea-en').value = defaultWords.map(w => `${w.text} ${w.pron}`).join('\n');
}

let currentCategory = 'alphabet';

function selectCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.cat-btn[data-category="${category}"]`).classList.add('active');
  renderEnglish();
}

function renderEnglish() {
  const grid = document.getElementById('english-grid');
  grid.innerHTML = '';
  
  let data;
  if (currentCategory === 'words') {
    data = getEnglishWords();
  } else {
    data = englishData[currentCategory];
  }
  
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'en-card';
    card.innerHTML = `
      <div class="en-word">${item.text}</div>
      <div class="en-pron">${item.pron}</div>
    `;
    card.onclick = () => speak(item.text);
    grid.appendChild(card);
  });
}

// 初始化英语编辑器
document.getElementById('word-textarea-en').value =
  getEnglishWords().map(w => `${w.text} ${w.pron}`).join('\n');

// ========== 算术模块 ==========
let mathConfig = {
  operations: ['+', '-'],
  range: 20,
  type: 'choice',
  questionsPerRound: 20,
  pointsPerQuestion: 10
};

let currentAnswer = 0;
let currentScore = 0;
let questionsAnswered = 0;

function updateMathSettings() {
  // 获取选中的运算符
  mathConfig.operations = Array.from(
    document.querySelectorAll('input[type="checkbox"][value]:checked')
  ).map(cb => cb.value);
  
  // 获取范围
  mathConfig.range = parseInt(
    document.querySelector('input[name="range"]:checked').value
  );
  
  // 获取题型
  mathConfig.type = document.querySelector('input[name="type"]:checked').value;
  
  generateMathQuestion();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMathQuestion() {
  const container = document.getElementById('math-question');
  const feedback = document.getElementById('math-feedback');
  feedback.textContent = '';
  feedback.className = 'math-feedback';
  
  const op = mathConfig.operations[randomInt(0, mathConfig.operations.length - 1)];
  let a, b, answer;
  const max = mathConfig.range;
  
  switch(op) {
    case '+':
      a = randomInt(1, max - 1);
      b = randomInt(1, max - a);
      answer = a + b;
      break;
    case '-':
      a = randomInt(2, max);
      b = randomInt(1, a - 1);
      answer = a - b;
      break;
    case '×':
      a = randomInt(2, Math.floor(Math.sqrt(max)) + 2);
      b = randomInt(2, Math.floor(max / a));
      answer = a * b;
      break;
    case '÷':
      b = randomInt(2, 12);
      answer = randomInt(1, Math.floor(max / b));
      a = answer * b;
      answer = a / b;
      break;
  }
  
  currentAnswer = answer;
  
  if (mathConfig.type === 'choice') {
    // 生成选择题
    const choices = [answer];
    while (choices.length < 4) {
      let wrong = answer + randomInt(-10, 10);
      if (wrong <= 0 || wrong > max * 2) continue;
      if (!choices.includes(wrong)) {
        choices.push(wrong);
      }
    }
    // 打乱顺序
    choices.sort(() => Math.random() - 0.5);
    
    let html = `<div class="question-text">${a} ${op} ${b} = ?</div>`;
    html += '<div class="choices">';
    choices.forEach(c => {
      html += `<button class="choice-btn" onclick="checkAnswer(${c})">${c}</button>`;
    });
    html += '</div>';
    container.innerHTML = html;
  } else {
    // 填空题
    const html = `
      <div class="question-text">
        ${a} ${op} ${b} = 
        <input type="number" id="fill-answer" class="fill-input" autofocus>
      </div>
      <button class="submit-btn" onclick="checkFillAnswer()">提交</button>
    `;
    container.innerHTML = html;
  }
}

function checkAnswer(userAnswer) {
  const feedback = document.getElementById('math-feedback');
  const buttons = document.querySelectorAll('.choice-btn');
  
  buttons.forEach(btn => {
    const val = parseInt(btn.textContent);
    if (val === currentAnswer) {
      btn.classList.add('correct');
    } else if (val === userAnswer) {
      btn.classList.add('wrong');
    }
  });
  
  questionsAnswered++;
  if (userAnswer === currentAnswer) {
    currentScore += mathConfig.pointsPerQuestion;
    feedback.textContent = `🎉 Correct! Current score: ${currentScore}/${questionsAnswered * mathConfig.pointsPerQuestion}`;
    feedback.className = 'math-feedback correct';
    speak('Great job! Correct!');
    
    // 检查是否已经答完20题
    if (questionsAnswered >= mathConfig.questionsPerRound) {
      // 总分结算
      setTimeout(() => {
        showResult();
      }, 1000);
    } else {
      setTimeout(() => {
        generateMathQuestion();
      }, 1500);
    }
  } else {
    feedback.textContent = `❌ Try again! Current score: ${currentScore}/${questionsAnswered * mathConfig.pointsPerQuestion}`;
    feedback.className = 'math-feedback wrong';
    speak('Try again! Think it over');
  }
}

function showResult() {
  const container = document.getElementById('math-question');
  const percentage = Math.round((currentScore / (mathConfig.questionsPerRound * mathConfig.pointsPerQuestion)) * 100);
  const html = `
    <div class="result-page">
      <h2>🎉 Game Complete!</h2>
      <div class="result-score">
        Total Score: <strong>${currentScore}</strong> / ${mathConfig.questionsPerRound * mathConfig.pointsPerQuestion}
      </div>
      <div class="result-percentage">Accuracy: ${percentage}%</div>
      <button class="restart-btn" onclick="startNewRound()">Play Again</button>
    </div>
  `;
  container.innerHTML = html;
}

function startNewRound() {
  currentScore = 0;
  questionsAnswered = 0;
  generateMathQuestion();
}

function checkFillAnswer() {
  const input = document.getElementById('fill-answer');
  const userAnswer = parseInt(input.value);
  checkAnswer(userAnswer);
}

// 回车键提交填空题
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && mathConfig.type === 'fill') {
    checkFillAnswer();
  }
});

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
  renderCharacters();
  renderEnglish();
  generateMathQuestion();
});
