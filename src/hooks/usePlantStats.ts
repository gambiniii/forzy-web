import { useState, useEffect } from "react";
import { maquinasService, type Maquina } from "../services/maquinas.service";
import { api } from "../services/api";

interface AnalysisReport {
  motor_id: number;
  health_score: number;
  health_label: string;
  iso_zone: string;
  narrative: string;
  recent_alerts: { id: number; severity?: string; timestamp?: string }[];
  recent_maintenances: unknown[];
  last_reading?: { timestamp?: string };
}

export interface MotorSummary extends Maquina {
  health: number | null;
  healthLabel: string | null;
  isoZone: string | null;
  alertCount: number;
  lastReadingAt: string | null;
}

export interface PlantStats {
  motors: MotorSummary[];
  totalAlerts: number;
  avgHealth: number | null;
  isoZone: string | null;
  lastReadingAt: string | null;
}

export function usePlantStats(plantaId: number) {
  const [stats, setStats] = useState<PlantStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plantaId) return;
    setLoading(true);

    (async () => {
      try {
        const allMotors = await maquinasService.list();
        const motors = allMotors.filter((m) => m.planta_id === plantaId);

        if (motors.length === 0) {
          setStats({ motors: [], totalAlerts: 0, avgHealth: null, isoZone: null, lastReadingAt: null });
          return;
        }

        const summaries = await Promise.all(
          motors.map(async (motor): Promise<MotorSummary> => {
            try {
              const report = await api.get<AnalysisReport>(`/analysis/${motor.id}/report`);
              const hs = report.health_score > 1 ? report.health_score : report.health_score * 100;
              return {
                ...motor,
                health: hs,
                healthLabel: report.health_label ?? null,
                isoZone: report.iso_zone ?? null,
                alertCount: (report.recent_alerts ?? []).length,
                lastReadingAt: report.last_reading?.timestamp ?? null,
              };
            } catch {
              return { ...motor, health: null, healthLabel: null, isoZone: null, alertCount: 0, lastReadingAt: null };
            }
          })
        );

        const healthValues = summaries.filter((m) => m.health !== null).map((m) => m.health!);
        const avgHealth = healthValues.length > 0
          ? healthValues.reduce((a, b) => a + b, 0) / healthValues.length
          : null;

        setStats({
          motors: summaries,
          totalAlerts: summaries.reduce((sum, m) => sum + m.alertCount, 0),
          avgHealth,
          isoZone: summaries.find((m) => m.isoZone)?.isoZone ?? null,
          lastReadingAt: summaries.find((m) => m.lastReadingAt)?.lastReadingAt ?? null,
        });
      } catch {
        setStats({ motors: [], totalAlerts: 0, avgHealth: null, isoZone: null, lastReadingAt: null });
      } finally {
        setLoading(false);
      }
    })();
  }, [plantaId]);

  return { stats, loading };
}
