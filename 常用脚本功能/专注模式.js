(function (selector) {
  // 根据选择器找到元素
  const target = document.querySelector(selector);
  if (!target) {
    console.warn("找不到指定元素:", selector);
    return;
  }

  // 清空 body
  document.body.innerHTML = "";

  // 设置 body 内边距
  document.body.style.padding = "100px 80px 0px 80px";

  // 将目标元素添加回 body
  document.body.appendChild(target);
})("你的选择器");
