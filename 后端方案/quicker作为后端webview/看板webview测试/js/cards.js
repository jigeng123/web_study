//module/cards.js管理卡片功能
let newCardId = null;
const cardTpl = document.getElementById("card-template");
//ji1创建card
function createCardElement(card) {
  const el = cardTpl.content.cloneNode(true).querySelector(".card");
  el.dataset.id = card.id;
  el.querySelector(".card-title").textContent = card.title;
  el.querySelector(".card-desc").textContent = card.desc || "";
  //checkbox
  // 绑定 checkbox
  const checkbox = el.querySelector(".card-checkbox");
  checkbox.id = uid();
  // 删除卡片
  el.querySelector(".del-card-btn").addEventListener("click", () => {
    if (!confirm("删除此卡片？")) return;
    state.columns.forEach(
      (c) => (c.cards = c.cards.filter((x) => x.id !== card.id))
    );
    render();
  });

  // 编辑卡片：同步到 state
  el.querySelector(".card-title").addEventListener("input", (e) => {
    updateCardField(card.id, "title", e.target.textContent);
  });
  el.querySelector(".card-desc").addEventListener("input", (e) => {
    updateCardField(card.id, "desc", e.target.textContent);
  });
  //TODO拖拽事件全局监听,不要在构建时添加事件
  // j21拖拽开始
  el.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.setData("text/plain", card.id);
    el.classList.add("dragging");
  });
  //ji2拖拽结束
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
    save();
  });

  return el;
}

//ji1创建新card,参数(列表id,title)
function addCard(colId, title = "") {
  const c = { id: uid(), title, desc: "" };
  newCardId = c.id;
  const col = state.columns.find((x) => x.id === colId);
  if (col) col.cards.push(c);
  render();
}
//ji1更新card
function updateCardField(cardId, field, value) {
  for (const col of state.columns) {
    const card = col.cards.find((c) => c.id === cardId);
    if (card) {
      card[field] = value;
      save();
      return;
    }
  }
}
//ji1移动到其他列表,删除原有卡片,重新渲染
function moveCardToColumn(cardId, targetColId) {
  let moved = null;
  state.columns.forEach((c) => {
    const idx = c.cards.findIndex((x) => x.id === cardId);
    if (idx > -1) {
      moved = c.cards.splice(idx, 1)[0];
    }
  });
  if (moved) {
    const target = state.columns.find((x) => x.id === targetColId);
    if (target) target.cards.push(moved);
    render();
  }
}

// 监听全局键盘事件
document.addEventListener("keydown", (e) => {
  if (!e.altKey) return; // 只处理按下 Ctrl 的情况
  e.preventDefault();
  // 获取按下的数字键 1~9
  const key = e.key;
  if (key >= "1" && key <= "9") {
    const columnslist = document.querySelectorAll(".column");
    const index = parseInt(key, 10) - 1; // 转换成数组索引
    if (index < columnslist.length) {
      //添加cards
      const id = columnslist[index].dataset.id;
      addCard(id, "");
    }
  }
});
