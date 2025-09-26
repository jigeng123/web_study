(function (selector) {
  // 找到目标元素
  const target = document.querySelector(selector);
  if (!target) {
    console.warn("找不到指定元素:", selector);
    return;
  }

  // 清空 body
  document.body.innerHTML = "";

  // 设置 body 内边距
  document.body.style.padding = "100px 80px 0px 80px";

  // 创建 editorContainer
  const editorContainer = document.createElement("div");
  editorContainer.id = "editorContainer";
  editorContainer.style.padding = "30px"; // 可根据需要调整样式
  editorContainer.style.width = "100%";
  editorContainer.style.height = "100vh";
  editorContainer.style.overflowY = "auto";
  editorContainer.style.boxSizing = "border-box";

  // 创建 editor
  const editor = document.createElement("div");
  editor.id = "editor";

  // 递归克隆 target 并去除没有 innerText 的节点
  function cloneWithText(node) {
    const alwaysKeepTags = [
      "P",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "A",
      "IMG",
      "UL",
      "OL",
      "LI",
      "BR",
    ];

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim() === "") return null;
      return document.createTextNode(node.textContent);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    // 如果是需要总是保留的标签，则直接克隆
    const tagName = node.tagName.toUpperCase();
    const clone = node.cloneNode(false);

    // 遍历子节点
    node.childNodes.forEach((child) => {
      const childClone = cloneWithText(child);
      if (childClone) clone.appendChild(childClone);
    });

    // 如果不是 alwaysKeep 标签，且克隆后没有文字内容，则删除
    if (
      !alwaysKeepTags.includes(tagName) &&
      clone.childNodes.length === 0 &&
      clone.innerText.trim() === ""
    ) {
      return null;
    }

    return clone;
  }

  const cleanedContent = cloneWithText(target);
  if (cleanedContent) editor.appendChild(cleanedContent);

  // 添加 editor 到 editorContainer
  editorContainer.appendChild(editor);

  // 添加到 body
  document.body.appendChild(editorContainer);
})("selector");
