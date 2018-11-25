//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    conditionCode: {
      100: "./image/100.svg",
      101: "./image/101.svg",
      102: "./image/104.svg",
      103: "./image/103.svg",
      104: "./image/104.svg",
      200: "./image/200.svg",
      201: "./image/200.svg",
      202: "./image/200.svg",
      203: "./image/200.svg",
      204: "./image/200.svg",
      205: "./image/201.svg",
      206: "./image/201.svg",
      207: "./image/201.svg",
      208: "./image/201.svg",
      209: "./image/201.svg",
      210: "./image/201.svg",
      211: "./image/201.svg",
      212: "./image/201.svg",
      213: "./image/201.svg",
      300: "./image/300.svg",
      301: "./image/301.svg",
      302: "./image/302.svg",
      303: "./image/302.svg",
      304: "./image/304.svg",
      305: "./image/305.svg",
      306: "./image/306.svg",
      307: "./image/301.svg",
      308: "./image/308.svg",
      309: "./image/305.svg",
      310: "./image/310.svg",
      311: "./image/310.svg",
      312: "./image/308.svg",
      313: "./image/304.svg",
      400: "./image/400.svg",
      401: "./image/401.svg",
      402: "./image/402.svg",
      403: "./image/402.svg",
      404: "./image/304.svg",
      405: "./image/304.svg",
      406: "./image/306.svg",
      407: "./image/402.svg",
      500: "./image/500.svg",
      501: "./image/501.svg",
      502: "./image/502.svg",
      503: "./image/503.svg",
      504: "./image/503.svg",
      507: "./image/503.svg",
      508: "./image/503.svg",
      900: "./image/900.svg",
      901: "./image/900.svg",
      999: "./image/900.svg",
    },
    location: "none",
    city: "上地",
    summary: "多云",
    localTemperature: "1",
    days: [],
    suggestion: [],
    suggestionIcon: {
      air: "./image/life/air.svg",
      cw: "./image/life/cw.svg",
      sport: "./image/life/sport.svg",
      drsg: "./image/life/drsg.svg",
      flu: "./image/life/flu.svg",
      uv: "./image/life/uv.svg",
      trav: "./image/life/trav.svg",
      comf: "./image/life/comf.svg",
    },
    detail: {},
    detailIcon: {
      windy: "./image/detail/windy.svg",
      barometer: "./image/detail/barometer.svg",
      temperature: "./image/detail/temperature.svg",
      humidity: "./image/detail/humidity.svg",
    },
    show: true,
    prompt: "Loading ...", // 页面的初始数据
    lodingsrc: "./image/location/umbrella.svg",
    air: {
      aqi: 'AQI',
      co: '一氧化碳',
      no2: '二氧化氮',
      o3: '臭氧',
      pm10: 'PM10',
      pm25: 'PM2.5',
      qlty: '空气质量',
      so2: '二氧化硫',
    }
  },
  getUserLocation() { // 获取用户当前经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.decodingGps(res.longitude, res.latitude)
      },
      fail: () => {
        this.add()
      }
    })
  },
  decodingGps(x, y) { // 解析经纬度到到地址
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        location: x + "," + y,
        key: '6bcab73e18c29692d1678e027e7be25a',
      },
      header: { 'content-type': 'application/json' },
      success: (res) => {
        this.setData({
          location: res.data.regeocode.addressComponent.district
        })
        this.getWeather()
        this.getNowWeather()
        this.getLifestyle()
        // this.getAir()
      },
      fail: () => {
        this.add()
      }
    })
  },
  getNowWeather() { // 实况天气
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/now',
      data: {
        location: this.data.location,
        key: 'e4f463c603ec41628d4d497b5eccbe6a'
      },
      header: { 'content-type': 'application/json' },
      success: (res) => {
        let { basic, now } = res.data.HeWeather6[0]
        this.setData({
          city: basic.parent_city,
          summary: now.cond_txt,
          localTemperature: now.tmp,
          detail: now
        })
      },
      fail: () => {
        this.add()
      }
    })
  },
  getLifestyle() { // 生活指数
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/lifestyle',
      data: {
        location: this.data.location,
        key: 'e4f463c603ec41628d4d497b5eccbe6a'
      },
      header: { 'content-type': 'application/json' },
      success: (res) => {
        let suggestion = res.data.HeWeather6[0].lifestyle
        this.setData({
          suggestion
        })
      },
      fail: () => {
        this.add()
      }
    })
  },
  getAir() { // 空气质量实况
    wx.request({
      url: 'https://free-api.heweather.com/s6/air/now',
      data: {
        location: this.data.location,
        key: 'e4f463c603ec41628d4d497b5eccbe6a'
      },
      header: { 'content-type': 'application/json' },
      success: (res) => {
        let suggestion = res.data.HeWeather6[0].lifestyle
        this.setData({
          suggestion
        })
      },
      fail: () => {
        this.add()
      }
    })
  },
  getWeather: function () { // 3-10天天气预报
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast',
      data: {
        location: this.data.location,
        key: 'e4f463c603ec41628d4d497b5eccbe6a'
      },
      header: { 'content-type': 'application/json' },
      success: (res) => {
        let arrayWeather = res.data.HeWeather6[0].daily_forecast.slice(1, 6)
        let weekDaysMap = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
        let list = arrayWeather.map(it => ({
          time: weekDaysMap[new Date(it.date.split("-").join("/")).getDay()],
          icon: this.data.conditionCode[it.cond_code_d],
          detail: it.cond_txt_d,
          minTemperature: it.tmp_min,
          maxTemperature: it.tmp_max
        }))
        this.setData({
          days: list,
          show: false,
        })
      },
      fail: () => {
        this.add()
      }
    })
  },
  onPullDownRefresh: function () { // 页面相关事件处理函数--监听用户下拉动作
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
    if (!this.data.show) {
      this.getUserLocation()
    }
  },
  onLoad: function () { // 生命周期函数--监听页面加载
    this.getUserLocation()
    wx.showShareMenu({ // 转发
      withShareTicket: true
    })
  },
  onShow: function () { // 生命周期函数--监听页面显示
    let dataFromSearch = wx.getStorageSync('data');
    if (dataFromSearch) {
      this.setData({
        location: dataFromSearch
      })
      wx.removeStorageSync('data')
      if (this.data.location === "auto") {
        this.getUserLocation()
      } else if (this.data.location) {
        this.getWeather()
        this.getNowWeather()
        this.getLifestyle()
        // this.getAir()　
      }
    }
  },
  add: function () { // 转跳到搜索页面
    wx.navigateTo({
      url: '/pages/search/index'
    })
  }
})
