/**
 * 查找或创建一个子元素。
 * @param {HTMLElement} parent - 父元素。
 * @param {string} selector - 用于查找父元素中是否包含这个子元素。
 * @param {string} tagName - 如果找不到，要创建的元素的标签名（例如 'div'）。
 * @param {string} className - 如果找不到，要创建的元素的类名。
 * @returns {HTMLElement} - 找到或创建的子元素。
 */
const findOrCreateElement = (parent, selector, tagName, className) => {
  let element = parent.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    parent.appendChild(element);
  }
  return element;
};

// ===================================================================
// 属性处理器：每个函数负责处理数据对象中的一个特定属性。
// 这就是“判断data其他属性,如果有[....],则执行指定函数”的实现。
// ===================================================================

const propertyHandlers = {
  /**
   * 处理 'content' 属性
   * @param {HTMLElement} element - 节点的主元素
   * @param {string} content - 文本内容
   */
  content: (element, content) => {
    const contentEl = findOrCreateElement(element, ".content", "p", "content");
    contentEl.textContent = content;
  },

  /**
   * 处理 'tags' 属性 (这是一个数组)
   * @param {HTMLElement} element - 节点的主元素
   * @param {string[]} tags - 标签数组
   */
  tags: (element, tags) => {
    if (!Array.isArray(tags)) return; // 安全检查

    const tagsContainer = findOrCreateElement(
      element,
      ".tags-container",
      "div",
      "tags-container"
    );
    const ul = findOrCreateElement(tagsContainer, "ul", "ul", "");

    // 清空现有标签以反映更新
    ul.innerHTML = "";

    tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      ul.appendChild(li);
    });
  },

  /**
   * 处理 'metadata' 属性 (这是一个对象)
   * @param {HTMLElement} element - 节点的主元素
   * @param {Object} metadata - 元数据对象
   */
  metadata: (element, metadata) => {
    const metadataContainer = findOrCreateElement(
      element,
      ".metadata-container",
      "div",
      "metadata-container"
    );
    metadataContainer.innerHTML = ""; // 清空

    for (const key in metadata) {
      const span = document.createElement("span");
      // 将键名首字母大写，使其更易读 (e.g., author -> Author)
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      span.textContent = `${formattedKey}: ${metadata[key]}`;
      metadataContainer.appendChild(span);
    }
  },

  /**
   * 处理 'children' 属性 (递归调用渲染)
   * @param {HTMLElement} element - 节点的主元素
   * @param {Object[]} childrenData - 子节点数据数组
   */
  children: (element, childrenData) => {
    if (!Array.isArray(childrenData)) return;

    const childrenContainer = findOrCreateElement(
      element,
      ".children-container",
      "div",
      "children-container"
    );
    // 递归调用 renderData 来处理子节点
    renderData(childrenData, childrenContainer);
  },
};

/**
 * 核心处理函数：处理单个数据节点（创建或更新）
 * @param {Object} data - 单个数据对象
 * @param {HTMLElement} parentElement - 该节点应被添加到的父元素
 */
function processNode(data, parentElement) {
  if (!data || !data.id) {
    console.error("数据项必须有一个 'id' 属性。", data);
    return;
  }

  // 1. 获取data的id,判断html中是否存在
  let nodeElement = document.getElementById(data.id);

  if (nodeElement) {
    // 存在则更新
    console.log(`更新元素: #${data.id}`);
  } else {
    // 不存在则创建
    console.log(`创建元素: #${data.id}`);
    nodeElement = document.createElement("div");
    nodeElement.id = data.id;
    nodeElement.className = "node";
    parentElement.appendChild(nodeElement);
  }

  // 2. 遍历数据对象的属性，并使用对应的处理器进行渲染
  for (const key in data) {
    if (key !== "id" && propertyHandlers[key]) {
      propertyHandlers[key](nodeElement, data[key]);
    }
  }
}

/**
 * 遍历数据数组，并为每个数据项调用 processNode
 * @param {Object[]} datas - 数据对象数组
 * @param {HTMLElement} parentElement - 渲染的父容器
 */
function renderData(datas, parentElement) {
  if (Array.isArray(datas)) {
    // 数组 → 保持原样
  } else if (datas && typeof datas === "object") {
    // 对象 → 用数组包裹
    console.warn("提供的 JSON 是对象，已用数组包裹。");
    datas = [datas];
  } else {
    // 其他类型 → 空数组
    console.warn("提供的 JSON 类型不支持，结束renderData。");
    return;
  }
  datas.forEach((data) => processNode(data, parentElement));
}

/**
 * 公开的入口函数
 * @param {Object[]} datas - 要渲染的数据对象数组
 * @param {string} containerId - 渲染的目标容器元素的ID
 */
function renderHtml(datas, containerId = "app-container") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`ID为 "${containerId}" 的容器未找到。`);
    container = document.getElementById("app-container");
  }
  renderData(datas, container);
}
