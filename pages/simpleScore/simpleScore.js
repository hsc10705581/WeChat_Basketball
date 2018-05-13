Page({
  data: {
    firstTeamName: "",
    secondTeamName: "",
    firstTeamScore: 0,
    secondTeamScore: 0,
  },

  score: function (event) {
    var team = event.currentTarget.dataset.team
    var score = event.currentTarget.dataset.score
    if (team == 0)
    {
      this.setData({
        firstTeamScore: this.data.firstTeamScore + score
      })
    }
    else
    {
      this.setData({
        secondTeamScore: this.data.secondTeamScore + score
      })
    }
  },

  onLoad: function(options){
    var passData = JSON.parse(options.extra)
    this.setData({
      firstTeamName: passData.firstTeamName,
      secondTeamName: passData.secondTeamName,
      foulShot: passData.foulShot || !passData.threePoints,
      threePoints: passData.threePoints,
    })
  }
})