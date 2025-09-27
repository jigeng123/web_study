//JIGENG简单的看板实现：支持列与卡片的增删、拖拽、列名/卡片内容编辑、本地存储、导入导出
//main.js管理初始化，加载，保存

//ji1全局变量
const boardEl = document.getElementById("board");

let state = { columns: [] };
const STORAGE_KEY = "simple_kanban_v1";
// ji1初始化+加载+保存
// 初始化：尝试从 localStorage 读取，否则创建默认列
async function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  // quicker替换成:const raw =await $quicker.getVar("kanbanDate");
  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch (e) {
      state = { columns: [] };
    }
  }
  if (!state.columns.length) {
    state.columns = [
      {
        id: uid(),
        title: "TODO",
        cards: [{ id: uid(), title: "示例任务", desc: "可以编辑或删除" }],
      },
      { id: uid(), title: "进行中", cards: [] },
      { id: uid(), title: "已完成", cards: [] },
    ];
  }
  render();
}
async function save() {
  const content = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, content);
  // quicker替换成:chrome.webview.hostObjects.sync.v.setVar("kanbanDate", content);
}

// ji1渲染
function render() {
  boardEl.innerHTML = "";
  state.columns.forEach((col) => boardEl.appendChild(createColumnElement(col)));
  save();
  if (newCardId) {
    setTimeout(() => {
      const cardEl = document.querySelector(`.card[data-id="${newCardId}"]`);
      if (cardEl) cardEl.querySelector(".card-title")?.focus();
      newCardId = null;
    }, 300);
  }
}

// ji1启动
load();
