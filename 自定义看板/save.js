// 新增：数据导出功能
// ===================================================================

/**
 * 从HTML元素中提取内容
 */
function extractContent(element) {
  const contentEl = element.querySelector(".content");
  return contentEl ? contentEl.textContent : null;
}

/**
 * 从HTML元素中提取标签
 */
function extractTags(element) {
  const tagsContainer = element.querySelector(".tags-container ul");
  if (!tagsContainer) return null;

  const tagItems = tagsContainer.querySelectorAll("li");
  const tags = [];
  tagItems.forEach((li) => {
    tags.push(li.textContent);
  });
  return tags.length > 0 ? tags : null;
}

/**
 * 从HTML元素中提取元数据
 */
function extractMetadata(element) {
  const metadataContainer = element.querySelector(".metadata-container");
  if (!metadataContainer) return null;

  const spans = metadataContainer.querySelectorAll("span");
  const metadata = {};

  spans.forEach((span) => {
    const text = span.textContent;
    const colonIndex = text.indexOf(":");
    if (colonIndex > 0) {
      const key = text.substring(0, colonIndex).toLowerCase();
      const value = text.substring(colonIndex + 1).trim();
      metadata[key] = value;
    }
  });

  return Object.keys(metadata).length > 0 ? metadata : null;
}

/**
 * 从HTML元素中提取子节点数据（递归）
 */
function extractChildren(element) {
  const childrenContainer = element.querySelector(".children-container");
  if (!childrenContainer) return null;

  const childNodes = childrenContainer.querySelectorAll(":scope > .node");
  if (childNodes.length === 0) return null;

  const children = [];
  childNodes.forEach((childNode) => {
    const childData = extractNodeData(childNode);
    if (childData) {
      children.push(childData);
    }
  });

  return children.length > 0 ? children : null;
}

/**
 * 从单个HTML节点元素中提取完整的数据对象
 */
function extractNodeData(element) {
  if (!element.id) return null;

  const data = { id: element.id };

  // 提取内容
  const content = extractContent(element);
  if (content !== null) data.content = content;

  // 提取标签
  const tags = extractTags(element);
  if (tags !== null) data.tags = tags;

  // 提取元数据
  const metadata = extractMetadata(element);
  if (metadata !== null) data.metadata = metadata;

  // 提取子节点（递归）
  const children = extractChildren(element);
  if (children !== null) data.children = children;

  return data;
}

/**
 * 导出当前渲染的数据结构
 */
function saveDataStructure(containerId = "app-container") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`ID为 "${containerId}" 的容器未找到。`);
    return null;
  }

  // 获取容器下的顶级数据节点（不包括嵌套的子节点）
  const topLevelNodes = container.querySelectorAll(":scope > .node");
  const exportedData = [];

  topLevelNodes.forEach((node) => {
    const nodeData = extractNodeData(node);
    if (nodeData) {
      exportedData.push(nodeData);
    }
  });

  console.log("=== 导出的数据结构: ===");
  console.log(JSON.stringify(exportedData, null, 2));
}

window.saveData = () => {
  console.log("--- 开始导出数据 ---");
  saveDataStructure();
};

window.clearRender = () => {
  console.log("--- 清空渲染 ---");
  document.getElementById("app-container").innerHTML = "";
};
