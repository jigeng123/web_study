let allData = null;

function jsonToObject() {
  fetch("data.json") // 相对路径，根目录同级
    .then((res) => res.json())
    .then((data) => {
      allData = data; // 保存到全局变量
      console.log("加载到的 JSON 数据：", data);
    })
    .catch((err) => console.error("加载失败：", err));
}

// 这里改成调用 filetoJSON
window.activeFileToJson = () => {
  jsonToObject();
};
