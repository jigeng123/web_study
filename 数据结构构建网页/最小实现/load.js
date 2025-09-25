// ===================================================================
// 示例数据和调用
// ===================================================================

const initialData = [
  {
    id: "unique-id-1",
    content: "这是示例内容。",
    tags: ["示例", "样本"],
    metadata: {
      author: "张三",
      date: "2023-10-01",
    },
    children: [
      {
        id: "child-1",
        content: "这是子节点1的内容。",
        tags: ["子节点", "样本"],
        metadata: {
          author: "李四",
          date: "2023-10-02",
        },
      },
    ],
  },
  {
    id: "unique-id-2",
    content: "这是第二个顶级节点。",
    tags: ["顶级", "独立"],
    metadata: {
      author: "王五",
      date: "2023-10-03",
    },
  },
];

// 更新后的数据
const updatedData = [
  {
    id: "unique-id-1", // ID相同，会更新
    content: "这是更新后的内容！",
    tags: ["示例", "已更新", "新标签"], // 标签已改变
    metadata: {
      author: "张三",
      date: "2023-10-27", // 日期已更新
      status: "已审核", // 新增元数据
    },
    children: [
      {
        id: "child-1", // ID相同，会更新
        content: "子节点1的内容也更新了。",
        tags: ["子节点", "样本"],
        metadata: {
          author: "李四",
          date: "2023-10-27",
        },
      },
      {
        id: "child-2", // 新增的子节点
        content: "这是一个全新的子节点！",
        tags: ["新增"],
        metadata: {
          author: "赵六",
          date: "2023-10-27",
        },
      },
    ],
  },
  // unique-id-2 不在更新数据中，理论上应该被移除。
  // （注意：当前实现不会自动移除不存在的节点，如需此功能，需要额外逻辑）
];

// 将函数附加到 window 对象，以便 HTML 中的 onclick 可以调用它们
window.initialRender = () => {
  console.log("--- 首次渲染 ---");
  renderHtml(initialData);
};

window.updateRender = () => {
  console.log("--- 更新渲染 ---");
  renderHtml(updatedData);
};
