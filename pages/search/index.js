let city = require('json.js')
Page({
  data: {
    hotcity: {
      bj: "北京",
      sh: "上海",
      gz: "广州",
      sz: "深圳",
      hz: "杭州",
      cd: "成都",
      lj: "南京",
      tj: "天津",
      auto: {
        name: "定位",
        val: "auto"
      },
    },
    history: [],
    citydata: [],
    hc: false,
    cityresult: true,
  },
  saveHistory: function(str) { // 保存历史记录
    var searchData = wx.getStorageSync('searchData') || []
    if(str !== "auto") {
      if(searchData.indexOf(str) === -1) {
        if(searchData.length >= 9) {
          searchData.shift()
          searchData.unshift(str)
        }else {
          searchData.unshift(str)
        }
      }
    }
    wx.setStorageSync('searchData', searchData)
    this.setData({
      history: wx.getStorageSync('searchData')
    })
  },
  clearHistory: function() { // 清除历史记录
    wx.removeStorageSync('searchData')
    this.setData({
      history: []
    })
  },
  getValue: function(e) { // 获取用户输入的城市
    let data = e.currentTarget.dataset.text
    this.saveHistory(data)
    if(!data) {
      return false
    }else {
      wx.setStorageSync('data', data);
      wx.navigateBack({
        delta: 1
      })
    }
  },
  search: function(rel) { // 搜索城市
    let val = rel.detail.value
    let result = []
    for(let i = 0; i < city.cityjson.length; i++) {
      let p = city.cityjson[i].provinceZh
      let l = city.cityjson[i].leaderZh
      let c = city.cityjson[i].cityZh
      if(val === p || val === l || val === c) {
        result.push([city.cityjson[i].provinceZh + "/" + city.cityjson[i].leaderZh + "/" +  city.cityjson[i].cityZh,city.cityjson[i].cityZh])
      }
    }
    if(!result.length) {
      result.push(["没有找到符合条件的城市",null])
    }
    if(val) {
      this.setData({
        citydata: result,
        cityresult: false,
        hc: true,
      })
    }else {
      this.setData({
        cityresult: true,
        citydata: result,
        hc: false,
      })
    }
  },
  debounce: function(fn, duration) { // 延迟搜索
    var timerId
    return function(...args) {
      clearTimeout(timerId)
      timerId = setTimeout(function(){
        fn(...args)
      }, duration)
    }
  },
  durationSearch(e) {
    this.debounce(this.search.bind(null,e),200)()
  },
  onPullDownRefresh: function() { // 页面相关事件处理函数--监听用户下拉动作
    setTimeout(function() {
      wx.stopPullDownRefresh()
    },1000)
  },
  onLoad: function () {
    this.setData({
      history: wx.getStorageSync('searchData')
    })
  }
})
