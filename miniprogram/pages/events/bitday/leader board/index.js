const db = wx.cloud.database();
const app = getApp();

// miniprogram/pages/bitday/leader board/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    users:[],
    user: null,
    rank:0,
    totalRanking:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getUsers();
    this.getRanking();
  },

  getUsers(){
    let that = this;
    db.collection('userInfo')
    //.orderBy('totalCorrect', 'desc') // descending order of 'totalCorrect' data of user
    .limit(20)
    .where({bitdayVerified: true})
    .get({
      success: function (res) {
        console.log(res.data[0].userRealName);
        that.setData({
          users:res.data
        })
      }
    })

    db.collection('userInfo')
    .where({_openid: app.globalData.openid})
    .get({
      success: function (res) {
        that.setData({
          user:res.data[0]
        })
      }
    })
  },

  getRanking() {
    let that = this;
    // wx.cloud.callFunction({
    //   name: 'getRanking',
    //   success: res => {
    //     var arr = res.result
    //     console.log(res.result);
    //     arr.sort((a, b) => b.bitdayPoints - a.bitdayPoints)
    //     that.setData({ totalRanking: arr })
    //     var totalRank = arr.map((a) => a._openid).indexOf(app.globalData.openid) + 1
    //     that.setData({ rank: totalRank })
        
    //   },
    // })
    
    db.collection('bitday')
    .where({type:"trivia-1"})
    .get({
      success: function (res){
        let trivia1 = res.data;
        db.collection('bitday')
        .where({type:"trivia-2"})
        .get({
          success: function (res){
            let trivia2 = res.data;
            db.collection('bitday')
            .where({type:"trivia-3"})
            .get({
              success: function (res){
                let trivia3 = res.data;  
                db.collection('bitday')
                .where({type:"scavenger hunt"})
                .get({
                  success: function (res){
                  let scavenger = res.data;
                  db.collection('bitday')
                  .where({type:"scavenger hunt"})
                  .skip(20)
                  .get({
                    success: function (res){
                    scavenger = scavenger.concat(res.data);
                    db.collection('bitday')
                  .where({type:"programming"})
                  .get({
                    success: function (res){
                      let programmingQuestions = res.data;
                      let arr = [];
                      for (let i=1; i<=49; i++){
                        db.collection('userInfo')
                        .where({bitdayVerified:true})
                        .skip(i*20)
                        .get({
                          success: function (res){
                            arr = arr.concat(res.data);
                            if (i == 49){
                              console.log(arr);
                              let newArr = [];
                              for (let j=0; j<arr.length;j++){
                                if (arr[j].bitdayAnswers!=null){
                                  console.log(j);
                                  for (const key in arr[j]["bitdayAnswers"]) {
                                    if (key == "trivia-1"){
                                      for (let k = 0; k<10; k++){
                                        if (arr[j]["bitdayAnswers"][key][k] == trivia1[k].answer)
                                          arr[j].bitdayPoints +=100;
                                      }
                                    }
                                    else if (key == "trivia-2"){
                                      for (let k = 0; k<10; k++){
                                        if (arr[j]["bitdayAnswers"][key][k] == trivia2[k].answer)
                                          arr[j].bitdayPoints +=100;
                                      }
                                    }
                                    else if (key == "trivia-3"){
                                      for (let k = 0; k<10; k++){
                                        if (arr[j]["bitdayAnswers"][key][k] == trivia3[k].answer)
                                          arr[j].bitdayPoints +=100;
                                      }
                                    }
                                }
                                for (let k =1; k<=9;k++){
                                  if (arr[j]["bitdayAnswers"]["programmingQuestion-" + k.toString()] != null){
                                    let correct = true;
                                    for (let l = 0; l<arr[j]["bitdayAnswers"]["programmingQuestion-" + k.toString()]; l++){
                                      if (arr[j]["bitdayAnswers"]["programmingQuestion-" + k.toString()][l] != programmingQuestions[k-1].order[l] )
                                        correct = false;
                                    }
                                    console.log("programming");
                                    if (correct)
                                      arr[j].bitdayPoints +=200;
                                  }
                                }
                                for (let k=1; k<=30; k++){
                                  if (arr[j]["bitdayAnswers"]["scav-" + k.toString()] != null){
                                    if (arr[j]["bitdayAnswers"]["scav-" + k.toString()] == scavenger[k-1].answer){
                                      console.log("scav");

                                      arr[j].bitdayPoints +=150;
                                    }
                                  }
                                }
                                
                                newArr.push(arr[j]);
                              }
                              
                              }
                              newArr.sort((a,b) => b.bitdayPoints - a.bitdayPoints);
                              that.setData({
                                totalRanking:newArr
                              });
                              console.log(newArr);
                            }

                          }
                        })
                      }
                    }
                  })
                    }
                  })
                  }
                })
              }
            })
          }
        })
      }
    })
    
    
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})