// index.js
Page({
  data: {
    inputText: '',
    answer: '',
    loading: false,
    cardColor: ''
  },

  handleInput(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  // 生成随机浅色
  generatePastelColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 25 + Math.floor(Math.random() * 20); // 30-50%
    const lightness = 85 + Math.floor(Math.random() * 10); // 85-95%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  },

  async handleSubmit() {
    if (!this.data.inputText.trim()) {
      wx.showToast({
        title: '请输入问题',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      const response = await this.callCozeAPI(this.data.inputText)
      
      // 生成新的随机浅色背景
      const newColor = this.generatePastelColor();
      
      this.setData({
        answer: response.content,
        cardColor: newColor,
        loading: false
      })
    } catch (error) {
      wx.showToast({
        title: '获取答案失败，请重试',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  async callCozeAPI(text) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1d9346d5-fb30-40af-9158-350f630645fc'
        },
        data: {
          model: 'ep-20250101121109-gk765',
          stream: true,
          messages: [
            {
              role: 'user',
              content: text
            }
          ]
        },
        success: function(res) {
          console.log('API响应:', res.data); // 添加日志
          // 检查响应数据是否为字符串
          if (typeof res.data === 'string') {
            // 分割响应数据为多行
            const lines = res.data.split('\n');
            let fullContent = '';
            
            // 处理每一行数据
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.substring(6); // 移除 "data: " 前缀
                
                // 跳过 [DONE] 标记
                if (jsonStr.trim() === '[DONE]') continue;
                
                try {
                  const jsonData = JSON.parse(jsonStr);
                  if (jsonData.choices && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                    fullContent += jsonData.choices[0].delta.content;
                  }
                } catch (e) {
                  console.error('JSON解析错误:', e);
                }
              }
            }
            
            if (fullContent) {
              return resolve({ content: fullContent });
            }
          }
          if (res.data && res.data.choices && res.data.choices[0]) {
            const content = res.data.choices[0].message.content;
            resolve({ content });
          } else {
            reject(new Error('API 返回数据格式错误'));
          }
        },
        fail: function(error) {
          console.error('请求失败:', error); // 添加日志
          reject(error);
        }
      });
    });
  }
})
