function openQuarterRightWindow() {
  const w = Math.floor(screen.availWidth / 3); // 屏幕宽度的 1/4
  const h = screen.availHeight; // 屏幕可用高度
  const left = screen.availWidth - w; // 右侧对齐

  window.open(
    "https://example.com",
    "quarterWin",
    `width=${w},height=${h},left=${left},top=0,resizable=yes,scrollbars=yes`
  );
}

openQuarterRightWindow();
