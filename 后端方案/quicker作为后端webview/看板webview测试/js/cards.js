//module/cards.js管理卡片功能
let newCardId = null;
const cardTpl = document.getElementById("card-template");
//placeholder
let placeholder = document.createElement("div");
placeholder.className = "placeholder"; // 可以在CSS里设置样式

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
  if (card.isDone) {
    checkbox.checked = true;
  }

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
  // 🔑 更新 isDone 状态
  checkbox.addEventListener("change", (e) => {
    updateCardField(card.id, "isDone", e.target.checked);
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
function moveCardToColumn(cardId, targetColId, targetCardId = null) {
  let moved = null;
  console.log(
    `移动卡片,卡片id:${cardId},target列表id${targetColId},target卡片id:${targetCardId}`
  );
  // 1. 从原列删除卡片
  state.columns.forEach((c) => {
    const idx = c.cards.findIndex((x) => x.id === cardId);
    if (idx > -1) {
      moved = c.cards.splice(idx, 1)[0];
    }
  });

  if (!moved) {
    console.log(`移动卡片1`);
    return;
  } // 没找到要移动的卡片就返回

  // 2. 找到目标列
  const targetCol = state.columns.find((x) => x.id === targetColId);
  if (!targetCol) {
    console.log(`移动卡片2`);
    return;
  } // 没找到目标列就返回

  // 3. 计算插入位置
  if (targetCardId) {
    const targetIdx = targetCol.cards.findIndex((x) => x.id === targetCardId);
    if (targetIdx > -1) {
      // 插入到目标卡片前
      targetCol.cards.splice(targetIdx, 0, moved);
    } else {
      // 如果找不到目标卡片，就添加到末尾
      targetCol.cards.push(moved);
    }
  } else {
    // 如果没有指定目标卡片 ID，就添加到末尾
    targetCol.cards.push(moved);
  }
  console.log(`移动卡片成功`);
  // 4. 渲染页面
  render();
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

//ji1拖拽源
// ji2拖拽开始
document.addEventListener("dragstart", (e) => {
  // 获取当前文档中有焦点的元素
  const activeEl = document.activeElement;

  // 排除 body 或非可编辑元素
  if (activeEl && activeEl !== document.body) {
    activeEl.blur(); // 失去焦点
  }
  const card = e.target.closest(".card");
  if (card) {
    console.log(
      `拖拽开始，存入dataTransfer的id：${card.dataset.id}--拖拽元素添加dragging`
    );
    e.dataTransfer.setData("text/plain", card.dataset.id);
    card.classList.add("dragging");
  }
});
//ji2拖拽结束
document.addEventListener("dragend", (e) => {
  const card = e.target.closest(".card");
  if (card) {
    // console.log(`拖拽结束dragend，删除dragging`);
    card.classList.remove("dragging");
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
      // console.log("全局 dragend，移除了 placeholder");
    }
    save();
  }
});
// ji1拖拽事件--列表作为容器,实现dragover/dragleave/drop的监听
// ji2在容器上悬浮

document.addEventListener("dragenter", (e) => {
  e.preventDefault();
  // console.log(`拖拽进入${e.target.classList}`);
  //拖拽目标为--card时
  const card = e.target.closest(".card");
  if (card) {
    // console.log(`拖拽进入目标为【${card.innerText}】`);
    //给拖拽目标添加dragover

    //给拖拽目标后面添加palceholder
    const next = card.nextElementSibling;
    if (next && next.classList.contains("placeholder")) {
      // console.log(`拖拽目标【${card.innerText}】,后面已经有了placeholder,不添加` );
    } else {
      // console.log(`拖拽目标拖拽目标【${card.innerText}】,后面没有placeholder,添加placeholder`);
      if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
        // console.log("发现已有 placeholder，先删除");
      }
      card.after(placeholder);
    }
  }
  //拖拽目标为--column时(列表没有卡片,只能定位clumn)
  const column = e.target.closest(".column");
  if (column) {
    const cards = column.querySelector(".cards");
    if (cards.children.length === 0) {
      console.log(`拖拽进入空列表`);
      if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
        // console.log("发现已有 placeholder，先删除");
      } else {
        cards.appendChild(placeholder);
      }
    }
  }
});
//ji2离开容器
document.addEventListener("dragleave", (e) => {
  const card = e.target.closest(".card");
  if (card) {
    // console.log(`❌❌拖拽离开目标【${e.target.innerText}】`);
  }
});
document.addEventListener("dragover", (e) => {
  if (e.target.closest(".card") || e.target.closest(".cards")) {
    e.preventDefault(); // 没有这句就不会触发 drop
  }
});
//ji2释放时
document.addEventListener("drop", (e) => {
  console.log(`执行drop`);
  e.preventDefault();
  const card = e.target.closest(".card");
  if (card) {
    console.log(`卡片执行drop`);
    const cardId = e.dataTransfer.getData("text/plain");
    if (!cardId) {
      console.log(`卡片执行drop,没找到id`);
      return;
    }
    const targetCardId = card.dataset.id;
    const col = card.closest(".column");
    const colId = col.dataset.id;
    moveCardToColumn(cardId, colId, targetCardId);
  }
  //拖拽目标为--column时(列表没有卡片,只能定位clumn)
  const column = e.target.closest(".column");
  if (column) {
    console.log(`查找列内的card列表`);
    const cards = column.querySelector(".cards");
    if (!cards.querySelector(".card")) {
      console.log(`列表内没有card`);
      const cardId = e.dataTransfer.getData("text/plain");
      moveCardToColumn(cardId, column.dataset.id);
    }
  }
});
