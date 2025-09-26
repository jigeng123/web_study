function extractJiData(datacontainer) {
  const data = {};
  //ji2找到id
  data.id = datacontainer.id;
  if (!datacontainer.id) {
    console.log("没找到id,结束extractJiData");
    return;
  }
  //ji2找到初始化元素,获得type和text(不一定有)
  const initEL = datacontainer.querySelector(".type");
  data.type = initEL.localName;
  if (initEL.textContent) {
    data.text = initEL.textContent;
  }
  //ji2特殊数据提取--字符串类型
  //提取str
  datacontainer.querySelector(".str");
  const strEl = datacontainer.querySelector(".str");
  if (strEl) {
    data.str = strEl.textContent;
  }

  //ji2特殊数据提取--列表

  const listContainer = datacontainer.querySelector(".list-container");
  if (listContainer) {
    data.list = Array.from(listContainer.children).map((child) =>
      child.textContent.trim()
    );
  }
  //ji2特殊数据提取--字典(object)

  const dicContainer = datacontainer.querySelector(".dic-container");
  if (dicContainer) {
    data.dic = {}; // 初始化字典

    Array.from(dicContainer.children).forEach((child) => {
      const key = child.localName; // 子元素标签名作为 key
      const value = child.textContent.trim(); // 子元素文本作为 value
      data.dic[key] = value;
    });
  }
  //ji2特殊数据提取--children
  const childrenContainer = datacontainer.querySelector(".children-container");

  if (childrenContainer) {
    data.children = findObejctToJson(childrenContainer, ".ji");
  }

  return data;
}

// 给一个容器,找到容器内所有的指定slector,将其构成对象
function findObejctToJson(container, selector) {
  const currentLevelObjects = container.querySelectorAll(
    `:scope > ${selector}`
  );
  const exportDatas = [];

  currentLevelObjects.forEach((object) => {
    const data = extractJiData(object);
    if (data) {
      exportDatas.push(data);
    }
  });
  return exportDatas;
}

window.saveJson = () => {
  let saveData = findObejctToJson(appContainer, ".ji");
  saveData = JSON.stringify(saveData, null, 2);
  console.log(`已将对象转换成json数据:${saveData}`);
};
