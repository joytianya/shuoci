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
          messages: [
            {
              role: 'user',
              content: text
            }
          ]
        },
        success: function(res) {
          console.log('API响应:', res.data); // 添加日志
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
