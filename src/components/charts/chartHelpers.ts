export const CO = {
  green: "#ffa300",   // primária
  amber: "#ffcc55",
  red: "#ff4f6a",
  blue: "#38b6ff",
  purple: "#7421eb",  // secundária
  cyan: "#00d4d4",
  grid: "rgba(160,148,136,0.18)",
  text: "#a09488",   // equivale a ~--text2, legível nos eixos
};

export function baseOptions(yMin?: number, yMax?: number) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1c1c1c",
        borderColor: "rgba(255,255,255,0.14)",
        borderWidth: 1,
        titleColor: "#b8b0a6",
        bodyColor: "#f0ede6",
        padding: 10,
        cornerRadius: 7,
      },
    },
    scales: {
      x: {
        grid: { color: CO.grid, drawBorder: false },
        ticks: { color: CO.text, font: { size: 10 }, maxTicksLimit: 6, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        min: yMin,
        max: yMax,
        grid: { color: CO.grid, drawBorder: false },
        ticks: { color: CO.text, font: { size: 10 } },
        border: { display: false },
      },
    },
  };
}

export function makeLabels(count: number, _unit = "h") {
  return Array.from({ length: count }, (_, i) => `${i * Math.floor(24 / count)}:00`);
}

export function randomData(count: number, base: number, variance: number) {
  return Array.from({ length: count }, () =>
    +(base + (Math.random() - 0.5) * variance * 2).toFixed(1)
  );
}

export function lineDataset(data: number[], color: string, label = "") {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color + "30",
    borderWidth: 1.5,
    pointRadius: 0,
    tension: 0.4,
    fill: true,
  };
}
