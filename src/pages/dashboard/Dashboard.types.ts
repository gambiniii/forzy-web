import { makeLabels, randomData, lineDataset, CO } from "../../components/charts/chartHelpers";

export const labels = makeLabels(12);
export const tempData = { labels, datasets: [lineDataset(randomData(12, 74, 5), CO.purple, "°C")] };
export const vibData  = { labels, datasets: [lineDataset(randomData(12, 7.5, 1.5), CO.purple, "mm/s")] };
