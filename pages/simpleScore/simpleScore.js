var timer;

function countDown(that, time) {
  if (time[1] != 59) time[1]++;
  else {
    time[0]++;
    time[1] = 0;
  }
  that.setData({
    currentTime: time,
  })
  timer = setTimeout(function () {
    countDown(that, time);
  }, 1000);
};

Page({
  data: {
    teamName: ["队伍1", "队伍2"],
    teamScore: [0, 0],
    currentTime: [0, 0],
    counting: false,
    logger: ['00:00 比赛就绪']
  },

  score: function (event) {
    console.log(event.currentTarget.dataset)
    var team = event.currentTarget.dataset.team
    var score = event.currentTarget.dataset.score
    var teamScore = this.data.teamScore.slice()
    teamScore[team] = teamScore[team] + score

    if (score == -1) bottomText = (this.data.currentTime[0] < 10 ? '0' + this.data.currentTime[0] : this.data.currentTime[0]) + ':' + (this.data.currentTime[1] < 10 ? '0' + this.data.currentTime[1] : this.data.currentTime[1]) + ' ' + this.data.teamName[team] + '调整分数'
    else var bottomText = (this.data.currentTime[0] < 10 ? '0' + this.data.currentTime[0] : this.data.currentTime[0]) + ':' + (this.data.currentTime[1] < 10 ? '0' + this.data.currentTime[1] : this.data.currentTime[1]) + ' ' + this.data.teamName[team] + '得' + score + '分'
    var logger = this.data.logger
    logger.unshift(bottomText)
 
    this.setData({
      teamScore: teamScore,
      logger: logger,
    })
  },

  onLoad: function(options){
    var passData = JSON.parse(options.extra)
    this.setData({
      teamName: passData.teamName,
      foulShot: passData.foulShot || !passData.threePoints,
      threePoints: passData.threePoints,
    })
    var that = this

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          restHeight: res.windowHeight - res.windowWidth / 750 * 904
        })
      }
    })
  },

  count: function(event){
    var that = this
    this.setData({
      counting: !this.data.counting
    })
    if (that.data.counting) {
      countDown(that, that.data.currentTime);
    }
    else {
      clearTimeout(timer);
      var bottomText = (that.data.currentTime[0] < 10 ? '0' + that.data.currentTime[0] : that.data.currentTime[0]) + ':' + (that.data.currentTime[1] < 10 ? '0' + that.data.currentTime[1] : that.data.currentTime[1]) + ' ' + "暂停"
      var logger = that.data.logger
      logger.unshift(bottomText)
      that.setData({
        logger: logger,
      })
      console.log(that.data.logger)
    }
  }

})