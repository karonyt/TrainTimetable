# TrainTimetable

## これは何に使うの？
学校などで最寄り駅に来る電車の時刻表を設定することで簡単に時刻表サイトを作ることができるものです
Node.jsで動かします

## どうやって使うの？
① [Node.js](https://nodejs.org/en/download/package-manager)をダウンロード
② このリポジトリをzipでダウンロードしたあと解凍

③ここからはOSによって変わります
### Windowsの場合
preparation.cmdを1回だけ実行
start.cmdを起動
localhost:3000で開くはずです
※初回のみpreparation.cmdを実行すれば次からはstart.cmdのみ実行でいけるようになります

### Linux系の場合
preparation.shを1回だけ実行
start.shを起動
localhost:3000で開くはずです
※初回のみpreparation.shを実行すれば次からはstart.shのみ実行でいけるようになります

## カスタマイズするには？
config.jsを編集してください

### 独自の時刻表を導入したい
sample-timetable.jsonを参考にして時刻表を作成してください
