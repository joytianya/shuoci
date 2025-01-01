// index.js
Page({
  data: {
    inputText: '',
    imageUrl: '',
    loading: false
  },

  handleInput(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  async handleSubmit() {
    if (!this.data.inputText.trim()) {
      wx.showToast({
        title: '请输入文字',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      const response = await this.callCozeAPI(this.data.inputText)
      
      this.setData({
        imageUrl: response.imageUrl,
        loading: false
      })
    } catch (error) {
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  previewImage() {
    if (this.data.imageUrl) {
      wx.previewImage({
        urls: [this.data.imageUrl]
      })
    }
  },

  // TODO: 实现实际的 API 调用
  async callCozeAPI(text) {
    // 这里需要替换为实际的 coze API 实现
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
        })
      }, 1000)
    })
  }
})
