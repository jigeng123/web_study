// ===================================================================
// 示例数据和调用
// ===================================================================

const initialData = [
  {
    id: "unique-id-1",
    type: "column",
    title: "TODO",
    tags: [
      {
        id: "unitagid-1",
        name: "代办",
        color: "#030303ff",
        backgroundColor: "#e5efbbff",
      },
      {
        id: "unitagid-2",
        name: "测试",
        color: "#030303ff",
        backgroundColor: "#f7c2efff",
      },
    ],
    style: {
      color: "#51e60cff",
      backgroundColor: "#3f19d8ff",
    },
    tasks: [
      {
        id: "child-1",
        type: "task",
        title: "具体事项",
        content: "custom content",
        tags: [
          {
            id: "unitagid-3",
            name: "study",
            color: "#030303ff",
            backgroundColor: "#e5efbbff",
          },
          {
            id: "unitagid-4",
            name: "eat",
            color: "#030303ff",
            backgroundColor: "#e5efbbff",
          },
        ],
        metadata: {
          createdate: "2023-10-02",
          deadline: "2025-11-02",
        },
        style: {
          color: "#030303ff",
          backgroundColor: "#e5efbbff",
        },
      },
      {
        id: "child-2",
        type: "task",
        title: "具体事项2",
        content: "custom content2",
        tags: [
          {
            id: "unitagid-5",
            name: "sport",
            color: "#030303ff",
            backgroundColor: "#e5efbbff",
          },
        ],
        metadata: {
          createdate: "2023-12-02",
          deadline: "2025-10-03",
        },
        style: {
          color: "#030303ff",
          backgroundColor: "#e5efbbff",
        },
      },
    ],
  },
  {
    id: "unique-id-10",
    type: "column",
    title: "DOING",
    tags: [
      {
        id: "unitagid-6",
        name: "hhh",
        color: "#030303ff",
        backgroundColor: "#e5efbbff",
      },
      {
        id: "unitagid-7",
        name: "测试",
        color: "#030303ff",
        backgroundColor: "#e5efbbff",
      },
    ],
    style: {
      color: "#030303ff",
      backgroundColor: "#e5efbbff",
    },
    tasks: [],
  },
  {
    id: "unique-id-12",
    type: "finishColumn",
    title: "FINISH",
    tags: [
      {
        id: "unitagid-8",
        name: "测试",
        color: "#030303ff",
        backgroundColor: "#e5efbbff",
      },
    ],
    style: {
      color: "#030303ff",
      backgroundColor: "#e5efbbff",
    },
    tasks: [
      {
        id: "child-12",
        type: "task",
        title: "具体事项3",
        content: "custom content1",
        tags: [
          {
            id: "unitagid-9",
            name: "study",
            color: "#030303ff",
            backgroundColor: "#e5efbbff",
          },
          {
            id: "unitagid-10",
            name: "eat",
            color: "#030303ff",
            backgroundColor: "#e5efbbff",
          },
        ],
        metadata: {
          createdate: "2023-10-02",
          deadline: "2025-11-02",
        },
        style: {
          color: "#030303ff",
          backgroundColor: "#e5efbbff",
        },
      },
    ],
  },
];

// 更新后的数据--根据id只更改颜色
const updatedData = [
  {
    id: "unique-id-1",
    style: {
      color: "#e65050ff",
      "background-color": "#d4e2a3ff",
    },
    children: [
      {
        id: "child-2",
        tags: [
          {
            name: "sport",
            color: "#d49898ff",
            "background-color": "#c6ed27ff",
          },
        ],
        style: {
          color: "#bbee94ff",
          "background-color": "#2174f0ff",
        },
      },
    ],
  },
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
