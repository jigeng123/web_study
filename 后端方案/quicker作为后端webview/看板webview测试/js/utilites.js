//module/utilites.js实用工具:构建唯一id

//ji1构建唯一ID
function uid() {
  return Math.random().toString(36).slice(2, 9);
}
