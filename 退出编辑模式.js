document.body.contentEditable = "false";
const toolbar = document.getElementById("floating-toolbar");
if (toolbar) {
  toolbar.remove(); // 或者 toolbar.parentNode.removeChild(toolbar);
  console.log("floating-toolbar 已删除");
} else {
  console.warn("找不到 floating-toolbar 元素");
}
