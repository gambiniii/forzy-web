import { useEffect, useRef, useState } from "react";
import type { LeituraSensor } from "../services/leituras.service";

const WS_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000")
  .replace(/^http/, "ws");

const MAX_POINTS = 30;

export interface MlPrediction {
  overall_status: "healthy" | "warning" | "critical";
  health_score: number;
  recommendation: string;
  rul_hours: number;
  maintenance_window_days: number;
  risk_level: "low" | "medium" | "high" | "critical";
  lstm_severity: "normal" | "low" | "medium" | "high" | "critical";
  is_anomaly: boolean;
}

export function useWsLeituras(componenteId: number, historico: LeituraSensor[] = []) {
  const [leituras, setLeituras]     = useState<LeituraSensor[]>(historico);
  const [online, setOnline]         = useState(false);
  const [prediction, setPrediction] = useState<MlPrediction | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (historico.length > 0) setLeituras(historico);
  }, [historico.length]);

  useEffect(() => {
    if (!componenteId) return;

    // Novo endpoint: /sensors/component/{id}/ws
    const url = `${WS_BASE}/sensors/component/${componenteId}/ws`;
    const ws  = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);

        if (msg.type === "status") {
          setOnline(msg.online);
        }

        if (msg.type === "leitura") {
          setLeituras(prev => {
            const next = [...prev, msg as LeituraSensor];
            return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
          });
        }

        if (msg.type === "prediction") {
          setPrediction(msg as MlPrediction);
        }
      } catch (_) {}
    };

    ws.onclose = () => setOnline(false);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [componenteId]);

  return { leituras, online, prediction };
}
