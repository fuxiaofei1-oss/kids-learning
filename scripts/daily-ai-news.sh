#!/bin/bash
# Daily AI technology news search using Tavily
# Created for Simon by 小Ark
# Workflow: English search → get all results → translate with LLM → send to WeChat

# Output directory for daily news
OUTPUT_DIR="/root/.openclaw/daily-ai-news"
mkdir -p "$OUTPUT_DIR"

# Current date
DATE=$(date +%Y-%m-%d)
OUTPUT_FILE="$OUTPUT_DIR/ai-news-$DATE.json"
FINAL_OUTPUT="$OUTPUT_DIR/ai-news-$DATE.md"

# Search query: English for better international coverage
QUERY="latest AI technology news in the past 24 hours, covering both China and global developments, focus on technical advancements: large models, AI agents, machine learning, new research breakthroughs"

echo "[$(date)] Starting daily AI news search..."
echo "Query (English): $QUERY"
echo "Output: $OUTPUT_FILE"

# Run tavily search
/root/.local/bin/tvly search "$QUERY" \
  --time-range day \
  --topic news \
  --max-results 10 \
  --depth basic \
  --include-answer basic \
  --json > "$OUTPUT_FILE"

if [ $? -ne 0 ]; then
  echo "[$(date)] Search failed"
  exit 1
fi

echo "[$(date)] Search completed successfully"
RESULT_COUNT=$(python3 -c "import json; data=json.load(open('$OUTPUT_FILE')); print(len(data.get('results', [])))" 2>/dev/null || echo 0)
echo "Found $RESULT_COUNT results"

# Use Python script to handle translation and formatting
echo "[$(date)] Translating and formatting..."

export DATE OUTPUT_FILE FINAL_OUTPUT OUTPUT_DIR

python3 << 'END_PYTHON'
import json
import subprocess
import tempfile
import os
import sys

DATE = os.environ['DATE']
OUTPUT_FILE = os.environ['OUTPUT_FILE']
FINAL_OUTPUT = os.environ['FINAL_OUTPUT']
OUTPUT_DIR = os.environ['OUTPUT_DIR']

# Read the JSON data
with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Build the translation prompt
prompt = """请将以下英文AI新闻搜索结果翻译成中文：
1. 将摘要总结翻译成中文
2. 将每条新闻的标题和内容简介翻译成中文
3. 保持以下格式，方便微信阅读：

📰 **每日AI技术动态** - {date}

**摘要总结：**
[翻译后的摘要]

**今日热点：**
1. **[翻译后的标题]**
📅 [日期]
[翻译后的内容简介]

---
🔍 搜索方式：英文搜索全网 → 整理翻译为中文
💾 完整JSON存档：{output_file}

要求：只输出最终翻译结果，不要额外解释。保持信息准确简洁。

原始JSON数据：
""".format(date=DATE, output_file=OUTPUT_FILE)

prompt += json.dumps(data, indent=2, ensure_ascii=False)

# Write to temp file
with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt', encoding='utf-8') as f:
    f.write(prompt)
    temp_file = f.name

try:
    # Call openclaw and capture output
    result = subprocess.run(
        ['openclaw', 'agent', '--message-file', temp_file, '--output', 'text'],
        capture_output=True,
        text=True,
        timeout=180
    )
    
    # Filter out plugin logs and get only the actual response
    lines = result.stdout.split('\n')
    response_lines = []
    in_response = False
    
    for line in lines:
        # Skip plugin initialization lines
        if '[plugins]' in line or 'Error: send requires text' in line or 'Message sent to' in line:
            continue
        # Skip empty lines at the start
        if not in_response and line.strip() == '':
            continue
        in_response = True
        response_lines.append(line)
    
    final_message = '\n'.join(response_lines).strip()
    
    if not final_message:
        final_message = f"""📰 **每日AI技术动态** - {DATE}

搜索已完成，但翻译输出为空。原始数据保存在：
{OUTPUT_FILE}"""
    
except Exception as e:
    final_message = f"""📰 **每日AI技术动态** - {DATE}

搜索已完成，但翻译出错：{str(e)}

原始数据保存在：{OUTPUT_FILE}"""
finally:
    os.unlink(temp_file)

# Save the final markdown
with open(FINAL_OUTPUT, 'w', encoding='utf-8') as f:
    f.write(final_message)

# Print for capture
print(final_message)
END_PYTHON
