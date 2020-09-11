'use strict';
// モジュールを読み込んで使えるようにする
const fs = require('fs');
const readline = require('readline');
// popu-pref.csv をファイルとして読み込める状態に準備する
const rs = fs.createReadStream('./popu-pref.csv');
// readline モジュールに rs を設定する
const rl = readline.createInterface({input: rs, output: {}});
// popu-pref.csvのデータを1行ずつ読み込んで設定された関数を実行する
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
    // データを配列化　
    const columns = lineString.split(',');
    const year = parseInt(columns[0]); // 年
    const prefecture = columns[1]; // 都道府県
    const popu = parseInt(columns[3]); // 人口
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
        
        
    }
    
});
rl.on('close', () => {
    // 2010年と2015年の人口を比較して変化量を出す
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    // 並べ替えを行う処理
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) =>{
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value])=> {
        return(
            key +
            ': ' +
            value.popu10 +
            '=>' +
            value.popu15 +
            '変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);
});