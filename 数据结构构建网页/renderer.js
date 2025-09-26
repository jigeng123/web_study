const appContainer = document.getElementById("app-container");
//构建uid
function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//JIGENG渲染domtree

function renderDOM(datas, container) {
  if (Array.isArray(datas)) {
    // OK
  } else if (datas && typeof datas === "object") {
    console.warn("提供的 JSON 是对象，已用数组包裹。");
    datas = [datas];
  } else {
    console.warn("必须得是数组或者单个对象，结束 renderHtml。");
    return;
  }

  datas.forEach((data) => {
    //JIGENG每个数据构建一个数据容器,tagname为type,
    let dataContainer;

    if (data.id) {
      dataContainer = document.getElementById(data.id);

      if (!dataContainer) {
        dataContainer = document.createElement("div");
        dataContainer.classList.add("ji");
        dataContainer.id = data.id; // 使用 data.id
      }
    } else {
      dataContainer = document.createElement("div");
      dataContainer.classList.add("ji");
      dataContainer.id = createUUID(); // 没有 data.id 时生成唯一 id
    }
    //ji1构建初始数据type(必须),text
    creatInitdata(data.type, data.text, dataContainer);
    //ji1构建特殊数据
    //ji2特殊数据字符串---str
    if (data.str) {
      createStr(data.str, dataContainer);
    }
    //ji2特殊数据list,创建一个list-container,在把listContainer)加到dataContainer
    if (data.list) {
      const listContainer = document.createElement("div");
      listContainer.classList = "list-container";
      //可自定义tagname
      createList(data.list, "jiLi", listContainer);
      dataContainer.appendChild(listContainer);
    }
    //ji2特殊数据dic
    if (data.dic) {
      const dicContainer = document.createElement("div");
      dicContainer.classList = "dic-container";
      //可自定义tagname
      createDic(data.dic, dicContainer);
      dataContainer.appendChild(dicContainer);
    }
    //ji2特殊数据children-递归调用renderDOM()
    if (data.children) {
      const childrenContainer = document.createElement("div");
      childrenContainer.classList = "children-container";
      dataContainer.appendChild(childrenContainer);
      renderDOM(data.children, childrenContainer);
    }
    container.appendChild(dataContainer);
  });
}
//ji5构建初始元素
function creatInitdata(tagname, text, container) {
  let el;
  if (tagname) {
    el = document.createElement(tagname);
  } else {
    el = document.createElement("notype");
  }
  el.classList.add("type");
  el.textContent = text;

  container.appendChild(el);
}
//ji5构建特殊数据函数a
function createStr(content, container) {
  const el = document.createElement("div");
  el.classList = "str";
  el.textContent = content;
  container.appendChild(el);
}

//ji5构建特殊数据函数list
function createList(list, tagname, container) {
  if (!Array.isArray(list)) {
    console.warn("传入的不是数组，结束 createList。");
    return;
  }

  list.forEach((item) => {
    const li = document.createElement(tagname);
    li.textContent = item;
    container.appendChild(li);
  });
}
//ji5构建特殊数据函数dic
function createDic(dic, container) {
  if (typeof dic !== "object") {
    console.warn("传入的不是字典数据(object)，结束 createDic。");
    return;
  }
  for (const key in dic) {
    const item = document.createElement(key);
    const value = dic[key];
    item.textContent = value;
    container.appendChild(item);
  }
}

window.activeRenderHtml = () => {
  renderDOM(allData, appContainer);
};
