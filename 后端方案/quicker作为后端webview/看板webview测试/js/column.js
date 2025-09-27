//module/column.js管理列表功能
const addColumnBtn = document.getElementById("add-column");
const colTpl = document.getElementById("column-template");

//ji1创建列(参数:传入的数据对象(json))
function createColumnElement(col) {
  //ji2选中模板的列表dom,添加id和标题名
  const el = colTpl.content.cloneNode(true).querySelector(".column");
  el.dataset.id = col.id;
  el.querySelector(".col-title").textContent = col.title;
  //ji3遍历创建cards(如果数据中cards中有数据)
  const cardsEl = el.querySelector(".cards");
  col.cards.forEach((c) => cardsEl.appendChild(createCardElement(c)));

  // ji4添加事件--添加卡片按钮
  el.querySelector(".add-card-btn").addEventListener("click", () => {
    addCard(col.id, "");
  });
  // ji4添加事件--删除列
  el.querySelector(".del-col-btn").addEventListener("click", () => {
    if (!confirm("删除此列及其所有卡片？")) return;
    //筛选,不是这个id的所有列,构成新的列,渲染
    state.columns = state.columns.filter((c) => c.id !== col.id);
    render();
  });

  // ji4添加事件--编辑列名并保存
  const titleEl = el.querySelector(".col-title");
  titleEl.addEventListener("input", () => {
    const v = titleEl.textContent.trim() || "未命名";
    const target = state.columns.find((c) => c.id === col.id);
    if (target) target.title = v;
    save();
  });

  return el;
}

//ji1创建新列--创建一个数据结构,然后添加到state列表中
function addColumn(title = "新列") {
  state.columns.push({ id: uid(), title, cards: [] });
  render();
}

addColumnBtn.addEventListener("click", () => addColumn());
document.addEventListener("keydown", function (e) {
  // ji1Ctrl + l添加心裂
  if (e.altKey && e.key === "0") {
    e.preventDefault(); // 阻止浏览器默认保存行为
    addColumn();
  }
});
