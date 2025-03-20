// history.js

// 定义一个数组来存储历史记录
let historyArray = [
    "first dialog",
    "second dialog",
    "third dialog",
    "first dialog",
    "second dialog",
    "third dialog",
    "first dialog",
    "second dialog",
    "third dialog",
    "first dialog",
    "second dialog",
    "third dialog",
    "first dialog",
    "second dialog",
    "third dialog",
];

// 增加一条历史记录
function addHistory(text) {
    historyArray.push(text);
}

// 修改某条历史记录
function updateHistory(index, text) {
    if (index >= 0 && index < historyArray.length) {
        historyArray[index] = text;
    }
}

// 删除某条历史记录
function deleteHistory(index) {
    if (index >= 0 && index < historyArray.length) {
        historyArray.splice(index, 1);
    } else {
        console.warn('Invalid index:', index); // 可选的：如果索引无效，输出警告信息
    }
}

// 获取历史记录数组
function getHistory() {
    return historyArray;
}

module.exports = {
    addHistory,
    updateHistory,
    getHistory
};