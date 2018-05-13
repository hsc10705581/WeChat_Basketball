var timer;

function countDown(that, time) {
  if (time[1] != 59) time[1]++;
  else{
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

  /**
   * 页面的初始数据
   */
  data: {
    bottomText: "00:00   比赛就绪",
    teamPause: [0, 0],
    teamFoul: [0, 0],
    currentTime: [0, 0],
    counting: false,
    teamName: ["队伍一", "队伍二"],
    teamMembers: [
      ["队员一", "队员二", "56", "78", "213"],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    ],
    typeList: ["篮板", "助攻", "抢断", "盖帽", "失误", "犯规"],
    teamScore: [0, 0],
    teamPlayersScore:[  //注意传递的时候不要全部传递啊
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    teamPlayersData:[
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var passData = JSON.parse(options.extra)
    var point = [] //记录所有得分可能
    /*
      passData = {
      firstTeamName: this.data.firstTeamName,
      firstTeamSize: this.data.firstTeamSize,
      firstTeamMembers: this.data.firstTeamMembers,
      secondTeamName: this.data.secondTeamName,
      secondTeamSize: this.data.secondTeamSize,
      secondTeamMembers: this.data.secondTeamMembers,
      typeList: ["罚球", "三分", "篮板", "助攻", "抢断", "盖帽", "失误", "犯规"],

      foulShot: this.data.foulShot,
      threePoints: this.data.threePoints,
      }
    */
    //逻辑判断球员所有的得分可能
    var threePoint = passData.typeList.indexOf("三分")
    var foulShot = passData.typeList.indexOf("罚球")
    if (threePoint != -1)
    {
      if (foulShot != -1) {
        point = ['+1', '+2', '+3'];
        passData.typeList.splice(foulShot, 1)
      }
      else point = ['+2', '+3'];
      threePoint = passData.typeList.indexOf("三分")
      passData.typeList.splice(threePoint, 1)
    }
    else point = ['+1', '+2']
    //
    this.setData({
      teamName: [passData.firstTeamName, passData.secondTeamName],
      teamMembers: [passData.firstTeamMembers, passData.secondTeamMembers],
      typeList: passData.typeList,
      point: point,
    })
  },

  //tap不同球员以后弹出对话框
  open: function(event){
    var that=this;
    wx.showActionSheet({
      itemList: ['得分', '其他统计'],
      success: function (res) {
        var formalRes = res

        if (res.tapIndex == 0){
          //弹出得分相关数据的对话框，需要将得分情况分别记录到球员对应数据，和球队数据（球队数据需要渲染到当前页面）
          wx.showActionSheet({
            itemList: that.data.point,
            success: function (res){
              var teamScore = that.data.teamScore.slice()
              var teamPlayersScore = that.data.teamPlayersScore.slice()
              teamScore[event.currentTarget.dataset.teamId] = teamScore[event.currentTarget.dataset.teamId] + parseInt(that.data.point[res.tapIndex][1])
              teamPlayersScore[event.currentTarget.dataset.teamId][event.currentTarget.dataset.playerId] = teamPlayersScore[event.currentTarget.dataset.teamId][event.currentTarget.dataset.playerId] + parseInt((that.data.point[res.tapIndex][1]))
              var bottomText = (that.data.currentTime[0] < 10 ? '0' + that.data.currentTime[0] : that.data.currentTime[0]) + ':' + (that.data.currentTime[1] < 10 ? '0' + that.data.currentTime[1] : that.data.currentTime[1]) + ' ' + that.data.teamName[event.currentTarget.dataset.teamId] + that.data.teamMembers[event.currentTarget.dataset.teamId][event.currentTarget.dataset.playerId] + that.data.point[res.tapIndex][1] + "分命中"
              that.setData({
                teamScore: teamScore,
                teamPlayersScore: teamPlayersScore,
                bottomText: bottomText,
              })
            }
          })
        }
        if (res.tapIndex == 1){
          if (that.data.typeList == false)
          {
            //如果没有设置其他数据，就会弹出一个说明对话框
            wx.showModal({
              content: '您没有设置统计其他数据！',
              showCancel: false,
            })
          }
          else{
            //弹出其他统计的对话框
            wx.showActionSheet({
              itemList: that.data.typeList,
              success: function (res) {
                var teamPlayersData = that.data.teamPlayersData.slice();
                teamPlayersData[event.currentTarget.dataset.teamId][event.currentTarget.dataset.playerId][res.tapIndex] = teamPlayersData[event.currentTarget.dataset.teamId][event.currentTarget.dataset.playerId][res.tapIndex] + 1;
                var bottomText = (that.data.currentTime[0] < 10 ? '0' + that.data.currentTime[0] : that.data.currentTime[0]) + ':' + (that.data.currentTime[1] < 10 ? '0' + that.data.currentTime[1] : that.data.currentTime[1]) + ' ' + that.data.teamName[event.currentTarget.dataset.teamId] + that.data.teamMembers[event.currentTarget.dataset.teamId][event.currentTarget.dataset.playerId] + that.data.typeList[res.tapIndex] + '+1'
                var text = bottomText
                that.setData({
                  teamPlayersData: teamPlayersData,
                  bottomText: text,
                })
                //判断是否记录犯规，是的话，球队犯规+1
                if (that.data.typeList[res.tapIndex] == "犯规") {
                  var teamFoul = that.data.teamFoul.slice()
                  teamFoul[event.currentTarget.dataset.teamId] = teamFoul[event.currentTarget.dataset.teamId] + 1
                  that.setData({
                    teamFoul : teamFoul
                  })
                  //犯规的同时暂停
                  clearTimeout(timer);
                  that.setData({
                    counting: !that.data.counting
                  })
                }
              }
            })
          }
        }
      }
    });
  },

  //时间组件的相关操作（实际上是一个button）
  count: function(event) {
    var that = this;
    this.setData({
      counting: !this.data.counting
    })
    if (that.data.counting) {
      countDown(that, that.data.currentTime);
    }
    else {
      clearTimeout(timer);
      wx.showActionSheet({
        itemList: [that.data.teamName[0] + "暂停", that.data.teamName[1] + "暂停"],
        success: function(res) {
          var teamPause = that.data.teamPause
          teamPause[res.tapIndex] = teamPause[res.tapIndex] + 1
          var bottomText = (that.data.currentTime[0] < 10 ? '0' + that.data.currentTime[0] : that.data.currentTime[0]) + ':' + (that.data.currentTime[1] < 10 ? '0' + that.data.currentTime[1] : that.data.currentTime[1]) + ' ' + that.data.teamName[res.tapIndex] + "暂停"
          that.setData({
            teamPause : teamPause,
            bottomText : bottomText,
          })
        }
      })
      
      var bottomText = (that.data.currentTime[0] < 10 ? '0' + that.data.currentTime[0] : that.data.currentTime[0]) + ':' + (that.data.currentTime[1] < 10 ? '0' + that.data.currentTime[1] : that.data.currentTime[1]) + ' ' + "比赛暂停"
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})