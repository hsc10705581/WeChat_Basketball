Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstTeamName: "队伍1",
    secondTeamName: "队伍2",
    foulShot: false,
    threePoints: false,
  },

  getFirstName: function(event) {
    this.setData({
      firstTeamName: event.detail.value
    })
    if (event.detail.value == ""){ //防止初始化消失
      this.setData({
        firstTeamName: "队伍1"
      })
    }
  },

  getSecondName: function (event) {
    this.setData({
      secondTeamName: event.detail.value
    })
    if (event.detail.value == "") { //防止初始化消失
      this.setData({
        secondTeamName: "队伍2"
      })
    }
  },

  foulShot: function(event) {
    this.setData({
      foulShot: event.detail.value
    })
  },

  threePoints: function(event) {
    this.setData({
      threePoints: event.detail.value
    })
  }, 

  begin: function(event) {
    var passData = {
      firstTeamName: this.data.firstTeamName,
      secondTeamName: this.data.secondTeamName,
      foulShot: this.data.foulShot,
      threePoints: this.data.threePoints,
    }
    wx.navigateTo({
      url: '/pages/simpleScore/simpleScore?extra=' + JSON.stringify(passData)
    })
  }
})