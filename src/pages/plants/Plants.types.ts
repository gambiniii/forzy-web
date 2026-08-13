export interface PlantData {
  name: string;
  location: string;
  machines: number;
  alerts: number;
  oee: number;
  status: "green" | "amber";
}

export const plants: PlantData[] = [
  { name: "Planta A", location: "São Paulo, SP", machines: 27, alerts: 3, oee: 84, status: "green" },
  { name: "Planta B", location: "Campinas, SP", machines: 18, alerts: 0, oee: 91, status: "green" },
  { name: "Planta C", location: "Manaus, AM",   machines: 12, alerts: 1, oee: 77, status: "amber" },
];
