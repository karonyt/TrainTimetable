const config = {
    //対象の駅名
    stationName: "サンプル駅",
    //上りのテキスト
    noboriTitle: "上り方面",
    //下りのテキスト
    kudariTitle: "下り方面",
    //何分まで徒歩で間に合うか
    walkLimit: 10,
    //何分まで走りで間に合うか
    runLimit: 5,
    //時刻表のパス
    timetableFilePath: `sample-timetable.json`,
    //1方向あたり何本の列車を表示するか
    maxTrainAmount: 2
};

module.exports = { config };