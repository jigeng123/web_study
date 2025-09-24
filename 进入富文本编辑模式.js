// ====== 全局浮动工具栏 JS ======
(function () {
  //遍历所有元素，修改字体为"Microsoft YaHei UI"
  const allElements = document.querySelectorAll("*");
  allElements.forEach((el) => {
    el.style.fontFamily = '"Microsoft YaHei UI"';
  });
  document.body.contentEditable = "true";
  const editorContainer = document.body; // 作用于整个 body

  // 创建浮动工具栏 HTML
  const toolbarHTML = `
    <div id="floating-toolbar">
      <button id="bold-btn" title="Bold"><b>B</b></button>
      <button id="italic-btn" title="Italic"><i>I</i></button>
      <button id="underline-btn" title="Underline"><u>U</u></button>
      <div style="width:1px;height:18px;background:rgba(255,255,255,0.12);margin:0 6px;"></div>
      <button id="link-btn" title="Link">🔗</button>
      <button id="color-btn" title="Color">🎨<div id="color-palette"></div></button>
      <button id="clear-format-btn" title="Clear">Tx</button>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", toolbarHTML);

  const floatingToolbar = document.getElementById("floating-toolbar");
  const colorPalette = document.getElementById("color-palette");
  const colorBtn = document.getElementById("color-btn");

  // 注入样式
  const style = document.createElement("style");
  style.textContent = `
    #floating-toolbar {
      position: absolute;
      display: none;
      background: #222;
      color: #fff;
      padding: 6px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      z-index: 1300;
      display: flex;
      gap: 6px;
      align-items: center;
    }
    #floating-toolbar button {
      background: none;
      border: none;
      color: #fff;
      padding: 6px 8px;
      cursor: pointer;
      border-radius: 6px;
      position: relative;
    }
    #color-palette {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      border-radius: 6px;
      padding: 8px;
      display: none;
      grid-template-columns: repeat(9, 1fr);
      gap: 6px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    #color-palette.visible { display: grid; }
    .color-swatch {
      width: 24px;
      height: 24px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.1s;
    }
    .color-swatch:hover {
      transform: scale(1.1);
      border-color: #fff;
    }
  `;
  document.head.appendChild(style);

  // 调色板颜色
  const PALETTE_COLORS = [
    "#000000",
    "#222222",
    "#444444",
    "#666666",
    "#888888",
    "#999999",
    "#bbbbbb",
    "#cccccc",
    "#eeeeee",
    "#ffffff",
    "#ff4d4f",
    "#ff7875",
    "#ffa39e",
    "#ffc069",
    "#ff9c6e",
    "#faad14",
    "#ffd666",
    "#ffe58f",
    "#52c41a",
    "#73d13d",
    "#95de64",
    "#b7eb8f",
    "#d9f7be",
    "#1890ff",
    "#40a9ff",
    "#69c0ff",
    "#91d5ff",
    "#bae7ff",
    "#722ed1",
    "#9254de",
    "#b37feb",
    "#d3adf7",
    "#efdbff",
    "#eb2f96",
    "#f759ab",
    "#ff85c0",
    "#ffadd2",
    "#ffd6e7",
    "#a0522d",
    "#c08050",
    "#d9a066",
    "#e6c3a0",
    "#f0e0d9",
    "#13c2c2",
    "#36cfc9",
    "#5cdbd3",
    "#87e8de",
    "#b5f5ec",
  ];

  // 初始化调色板
  function initColorPalette() {
    PALETTE_COLORS.forEach((color) => {
      const swatch = document.createElement("button");
      swatch.className = "color-swatch";
      swatch.style.backgroundColor = color;
      swatch.dataset.color = color;
      colorPalette.appendChild(swatch);
    });
  }

  // 富文本选区
  let currentRange = null;

  editorContainer.addEventListener("mouseup", () => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && editorContainer.contains(sel.anchorNode)) {
        // 排除 code 标签
        const invalidElements =
          editorContainer.querySelectorAll("code, code span");
        for (let el of invalidElements) if (el.contains(sel.anchorNode)) return;

        currentRange = sel.getRangeAt(0).cloneRange();
        const rect = currentRange.getBoundingClientRect();

        floatingToolbar.style.left = `${
          rect.left +
          window.scrollX +
          rect.width / 2 -
          floatingToolbar.offsetWidth / 2
        }px`;
        floatingToolbar.style.top = `${
          rect.top + window.scrollY - floatingToolbar.offsetHeight - 8
        }px`;
        floatingToolbar.style.display = "flex";
      } else {
        floatingToolbar.style.display = "none";
        colorPalette.classList.remove("visible");
      }
    }, 10);
  });

  document.addEventListener("mousedown", (e) => {
    if (!floatingToolbar.contains(e.target)) {
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      floatingToolbar.style.display = "none";
      colorPalette.classList.remove("visible");
      currentRange = null;
    }
  });

  function applyFormat(cmd, val = null) {
    if (!currentRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(currentRange);
    document.execCommand(cmd, false, val);
    floatingToolbar.style.display = "none";
    currentRange = null;
  }

  // 按钮事件
  document
    .getElementById("bold-btn")
    .addEventListener("click", () => applyFormat("bold"));
  document
    .getElementById("italic-btn")
    .addEventListener("click", () => applyFormat("italic"));
  document
    .getElementById("underline-btn")
    .addEventListener("click", () => applyFormat("underline"));
  document.getElementById("clear-format-btn").addEventListener("click", () => {
    applyFormat("removeFormat");
    applyFormat("unlink");
  });
  document.getElementById("link-btn").addEventListener("click", () => {
    if (!currentRange) return;
    const url = prompt("输入链接 URL:", "https://");
    if (url) applyFormat("createLink", url);
  });

  colorBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    colorPalette.classList.toggle("visible");
  });

  colorPalette.addEventListener("click", (e) => {
    if (e.target.classList.contains("color-swatch")) {
      e.stopPropagation();
      const color = e.target.dataset.color;
      applyFormat("foreColor", color);
      colorPalette.classList.remove("visible");
    }
  });

  initColorPalette();
})();
