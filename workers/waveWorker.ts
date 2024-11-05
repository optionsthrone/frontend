interface Bar {
  x: number;
  height: number;
  gradient: CanvasGradient;
  speed: number;
}

interface MessageData {
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  type?: string;
}

self.onmessage = (e: MessageEvent<MessageData>) => {
  const { canvas, width, height } = e.data;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bars: Bar[] = [];
  const numBars = 25;
  const barWidth = width > 640 ? width * 0.006 : width * 0.02;
  const maxHeight = width > 640 ? height * 0.03 : height * 0.025;

  for (let i = 0; i < numBars; i++) {
    const gradient = ctx.createLinearGradient(0, 0, 0, maxHeight);
    gradient.addColorStop(0, getRandomColor());
    gradient.addColorStop(1, getRandomColor());

    bars.push({
      x: width > 640 ? (i * barWidth) / 3 : (i * barWidth) / 2,
      height: Math.random() * maxHeight,
      gradient,
      speed: Math.random() * 0.5 + 0.2,
    });
  }

  function getRandomColor() {
    const colors = [
      "#e61875",
      "#622f7c",
      "#187aa1",
      "#86b6ce",
      "#ff0f71",
      "#ff3ea2",
      "#78aecf",
      "#0d4985",
      "#df4e96",
      "#6f5190",
      "#ff3e86",
      "#0f4281",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bars.forEach((bar) => {
      ctx.fillStyle = bar.gradient;
      ctx.fillRect(bar.x, canvas.height - bar.height, barWidth, bar.height);
      ctx.strokeStyle = "#0006"; // 1px border color
      ctx.lineWidth = 0.5;
      ctx.strokeRect(bar.x, canvas.height - bar.height, barWidth, bar.height);
      bar.height += bar.speed;
      if (bar.height > maxHeight || bar.height < 10) {
        bar.speed = -bar.speed;
      }
    });
    requestAnimationFrame(draw);
  }

  draw();
};
