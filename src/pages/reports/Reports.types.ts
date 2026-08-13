import { CO, randomData } from "../../components/charts/chartHelpers";

export const months = ["Mai","Jun","Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar","Abr"];

export const oeeHist = {
  labels: months,
  datasets: [{ label: "OEE %", data: randomData(12, 83, 5), backgroundColor: CO.blue + "88", borderRadius: 4 }],
};

export const oeeByLine = {
  labels: ["Linha 1","Linha 2","Linha 3"],
  datasets: [{ label: "OEE %", data: [88, 81, 84], backgroundColor: [CO.green+"cc", CO.blue+"cc", CO.purple+"cc"], borderRadius: 4 }],
};

export const pieData = {
  labels: ["Vibração","Temperatura","Corrente","Outros"],
  datasets: [{
    data: [45, 30, 15, 10],
    backgroundColor: [CO.red+"cc", CO.amber+"cc", CO.blue+"cc", CO.text+"cc"],
    borderWidth: 0,
  }],
};

export const failureRanking = [
  { id: "M-07", failures: 4, hours: "12.5h", cost: "R$ 8.400", oee: "amber" as const, oeePct: "76%" },
  { id: "M-03", failures: 2, hours: "6.0h",  cost: "R$ 4.200", oee: "blue"  as const, oeePct: "83%" },
  { id: "M-15", failures: 1, hours: "2.0h",  cost: "R$ 1.400", oee: "green" as const, oeePct: "91%" },
  { id: "M-21", failures: 0, hours: "0h",     cost: "—",        oee: "green" as const, oeePct: "96%" },
];

export const kpis = [
  { num: "84,2%", label: "OEE Médio",       trend: "↑ +1.2% vs mês ant.", color: CO.blue,   trendColor: CO.green },
  { num: "98,7%", label: "Disponibilidade", trend: "↑ +0.3%",             color: CO.green,  trendColor: CO.green },
  { num: "3,2h",  label: "MTTR Médio",      trend: "↓ -0.5h",             color: CO.amber,  trendColor: CO.green },
  { num: "312h",  label: "MTBF Médio",      trend: "↑ +18h",              color: CO.purple, trendColor: CO.green },
];
