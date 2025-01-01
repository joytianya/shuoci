import os
from openai import OpenAI
# 从环境变量中读取您的方舟API Key
client = OpenAI(
    api_key="1d9346d5-fb30-40af-9158-350f630645fc", 
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    )
completion = client.chat.completions.create(
    # 替换 <YOUR_ENDPOINT_ID> 为您的方舟推理接入点 ID
    model="ep-20250101121109-gk765",
    messages=[
        {"role": "user", "content": "你好"}
    ]
)
print(completion.choices[0].message)

'''
curl https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1d9346d5-fb30-40af-9158-350f630645fc" \
  -d '{
    "model": "ep-20250101121109-gk765",
    "messages": [
        {
            "role": "user",
            "content": "你好"
        }
    ]
  }'
'''
