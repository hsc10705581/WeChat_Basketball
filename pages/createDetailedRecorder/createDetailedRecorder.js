var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["比赛设置", "队伍一队员", "队伍二队员"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    numberList: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    firstTeamName: "队伍一",
    firstTeamSize: 0,
    firstTeamMembers: [],
    secondTeamName: "队伍二",
    secondTeamSize: 0,
    secondTeamMembers: [],
    typeList: ["罚球","三分","篮板","助攻","抢断","盖帽","失误","犯规"],
    typeChosen: [true, true, true, true, true, true, true, true]
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  getFirstName: function (event) {
    var firstName = "tabs[" + 1 + "]"
    this.setData({
      firstTeamName: event.detail.value,
      [firstName]: event.detail.value + "队员"
    })
    if (event.detail.value == "") { //防止初始化消失
      this.setData({
        firstTeamName: "队伍一",
        [firstName]: "队伍一队员",
      })
    }
  },

  getSecondName: function (event) {
    var secondName = "tabs[" + 2 + "]"
    this.setData({
      secondTeamName: event.detail.value,
      [secondName]: event.detail.value + "队员"
    })
    if (event.detail.value == "") { //防止初始化消失
      this.setData({
        secondTeamName: "队伍二",
        [secondName]: "队伍二队员",
      })
    }
  },

  typeChoose: function (event) {
    var typeCho = "typeChosen[" + event.currentTarget.dataset.typeId + "]"
    this.setData({
      [typeCho]: event.detail.value
    })
  },

  firstTeamSize: function (event) {
    var firstTeamPlayers = new Array();
    var i = 0;
    while (i < event.detail.value)
    {
      firstTeamPlayers[i]="队员"+(this.data.numberList[i]+1);
      i++;
    }
    this.setData({
      firstTeamSize: event.detail.value,
      firstTeamMembers: firstTeamPlayers,
    })
  },

  secondTeamSize: function (event) {
    var secondTeamPlayers = new Array();
    var i = 0;
    while (i < event.detail.value) {
      secondTeamPlayers[i] = "队员" + (this.data.numberList[i] + 1);
      i++;
    }
    this.setData({
      secondTeamSize: event.detail.value,
      secondTeamMembers: secondTeamPlayers,
    })
  },

  firstTeamGet: function (event) {
    var teamMember = "firstTeamMembers[" + event.currentTarget.dataset.firstTeamMemberId + "]"
    this.setData({
      [teamMember]: event.detail.value
    })
    if (event.detail.value == "") { //防止初始化消失
      this.setData({
        [teamMember]: "队员" + (event.currentTarget.dataset.firstTeamMemberId + 1)
      })
    }
  },

  secondTeamGet: function (event) {
    console.log(event.currentTarget.dataset)
    var teamMember = "secondTeamMembers[" + event.currentTarget.dataset.secondTeamMemberId + "]"
    this.setData({
      [teamMember]: event.detail.value
    })
    if (event.detail.value == "") { //防止初始化消失
      this.setData({
        [teamMember]: "队员" + (event.currentTarget.dataset.secondTeamMemberId + 1)
      })
    }
  },

  begin: function (event) {
    //处理要传输的typeList 把取false的部分全删去
    var dataList = this.data.typeList.slice()
    var index = -1
    for (var i = 0; i < 8; i++) {
      if (this.data.typeChosen[i] == false) {
        index = dataList.indexOf(this.data.typeList[i])
      }
      if (index != -1) {
        dataList.splice(index, 1)
      }
    }
    for (var i = 0; i < dataList.length; i++) {
      dataList[i] = dataList[i]
    }
    console.log(dataList)
    var passData = {
      firstTeamName: this.data.firstTeamName,
      firstTeamSize: this.data.firstTeamSize,
      firstTeamMembers: this.data.firstTeamMembers,
      secondTeamName: this.data.secondTeamName,
      secondTeamSize: this.data.secondTeamSize,
      secondTeamMembers: this.data.secondTeamMembers,
      typeList: dataList,

      foulShot: this.data.foulShot,
      threePoints: this.data.threePoints,
    }
    console.log(dataList)
    var showWarning = true
    for (var i = 2; i < 8; i++){
      if (dataList.indexOf(this.data.typeList[i]) != -1)
      {
        showWarning = false;
        break;
      }
    }
    if (this.data.firstTeamMembers == false || this.data.secondTeamMembers == false)
    {
      wx.showModal({
        content: '您还没有设置某一队的队员呢！',
        showCancel: false,
      })
    }
    else if (showWarning) 
    {
      wx.showModal({
        content: '您一项其他数据都不统计吗?(这样的话，推荐使用简易记分器哦!)',
        confirmText: '确定',
        cancelText: '返回',     
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
                url: "/pages/controlRecorder/controlRecorder?extra=" + JSON.stringify(passData)
            })
          }
        }
      })
    }
    else
    {
      wx.navigateTo({
        url: "/pages/controlRecorder/controlRecorder?extra=" + JSON.stringify(passData)
      })
    }
  }

})