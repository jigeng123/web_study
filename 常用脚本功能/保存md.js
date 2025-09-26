(async function saveWholePageAsMD() {
  // Turndown 和 GFM 插件 CDN
  const turndownUrl = "https://cdn.jsdelivr.net/npm/turndown/dist/turndown.js";
  const gfmUrl =
    "https://cdn.jsdelivr.net/npm/turndown-plugin-gfm/dist/turndown-plugin-gfm.js";

  // 动态加载 Turndown
  await new Promise((res, rej) => {
    if (window.TurndownService) return res();
    const s = document.createElement("script");
    s.src = turndownUrl;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });

  // 动态加载 GFM 插件
  await new Promise((res, rej) => {
    if (window.turndownPluginGfm) return res();
    const s = document.createElement("script");
    s.src = gfmUrl;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });

  // 克隆整个 body
  const clone = document.body.cloneNode(true);

  // 移除无用元素
  clone
    .querySelectorAll(
      'script, noscript, style, link[rel="stylesheet"], iframe, svg'
    )
    .forEach((n) => n.remove());

  // 创建 TurndownService 并使用 GFM 插件
  const turndownService = new TurndownService({
    codeBlockStyle: "fenced",
    headingStyle: "atx",
    emDelimiter: "*",
  });
  turndownService.use(turndownPluginGfm.gfm);

  // 转换为 Markdown
  const md =
    `# ${document.title.replace(/[\\/:*?"<>|]/g, "")}\n\n` +
    turndownService.turndown(clone);

  // 查找是否已经存在 id 为 mdcontent 的元素
  let pre = document.getElementById("mdcontent");

  if (!pre) {
    // 不存在则创建
    pre = document.createElement("pre");
    pre.id = "mdcontent";
    pre.style.display = "none"; // 设置不可见
    document.body.appendChild(pre);
  }

  // 更新内容
  pre.innerText = md;

  console.log("已保存整个网页为md在id为mdcontent的元素内，不可见");
})();
