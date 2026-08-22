import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Anomalia } from "../../services/anomalias.service";
import {
  TimelineList, TimelineGroupLabel, TimelineItem,
  TimelineContent, TimelineTag, TimelineTitle, TimelineTime, TimelineEmpty,
} from "./MachineDetail.styles";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Alert {
  id: number;
  type?: string;
  message?: string;
  severity?: string;
  timestamp: string;
  resolved?: boolean;
}

interface Maintenance {
  id: number;
  type?: string;
  description?: string;
  scheduled_date?: string;
  completed_date?: string;
  technician?: string;
  status?: string;
}

type EvType = "alert" | "maintenance" | "diagnostic";

interface TimelineEvent {
  id: string;
  type: EvType;
  timestamp: string;
  tag: string;
  title: string;
  sub?: string;
  color: string;
}

const TYPE_META: Record<EvType, { color: string; tag: string }> = {
  alert:       { color: "var(--red)",     tag: "Alerta"      },
  maintenance: { color: "#3b82f6",        tag: "Manutenção"  },
  diagnostic:  { color: "var(--purple)",  tag: "Diagnóstico" },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "var(--red)",
  high:     "var(--red)",
  warning:  "#ffb833",
  medium:   "#ffb833",
  low:      "var(--success)",
  info:     "var(--text2)",
};

const STATUS_LABELS: Record<string, string> = {
  critical:        "Crítico",
  warning:         "Atenção",
  healthy:         "Normal",
  motor_desligado: "Desligado",
};

/* ── Helpers ────────────────────────────────────────────────────────── */

const FMT_TS: Intl.DateTimeFormatOptions = {
  day: "2-digit", month: "2-digit",
  hour: "2-digit", minute: "2-digit",
};
const FMT_GROUP: Intl.DateTimeFormatOptions = {
  day: "2-digit", month: "long", year: "numeric",
};

function formatTs(ts: string) {
  try { return new Date(ts).toLocaleString("pt-BR", FMT_TS); }
  catch { return ts; }
}

function groupKey(ts: string) {
  try { return new Date(ts).toLocaleDateString("pt-BR", FMT_GROUP); }
  catch { return ts.slice(0, 10); }
}

function buildAlertEvent(a: Alert): TimelineEvent {
  const sevColor = SEVERITY_COLORS[a.severity ?? ""] ?? "var(--red)";
  return {
    id: `alert-${a.id}`,
    type: "alert",
    timestamp: a.timestamp,
    tag: "Alerta",
    title: a.message ?? `Alerta ${a.type ?? ""}`,
    sub: a.severity ? `Severidade: ${a.severity}` : undefined,
    color: sevColor,
  };
}

function buildMaintenanceEvent(m: Maintenance): TimelineEvent {
  const ts = m.completed_date ?? m.scheduled_date ?? "";
  return {
    id: `maint-${m.id}`,
    type: "maintenance",
    timestamp: ts,
    tag: "Manutenção",
    title: m.description ?? `Manutenção ${m.type ?? ""}`,
    sub: m.technician ? `Técnico: ${m.technician}` : m.status,
    color: "#3b82f6",
  };
}

function buildDiagEvent(a: Anomalia): TimelineEvent {
  const label = STATUS_LABELS[a.overall_status] ?? a.overall_status;
  const sevColor = a.overall_status === "critical" ? "var(--red)"
    : a.overall_status === "warning" ? "#ffb833"
    : "var(--purple)";
  return {
    id: `diag-${a.id}`,
    type: "diagnostic",
    timestamp: a.timestamp,
    tag: "Diagnóstico ML",
    title: `${label}${a.lstm_severity && a.lstm_severity !== "n/a" ? ` · ${a.lstm_severity}` : ""}`,
    sub: [
      a.health_index != null ? `Saúde ${a.health_index}%` : null,
      a.rul_hours != null ? `RUL ${a.rul_hours}h` : null,
    ].filter(Boolean).join(" · ") || undefined,
    color: sevColor,
  };
}

/* ── Component ─────────────────────────────────────────────────────── */

interface Props {
  motorId: number;
  anomalias: Anomalia[];
}

export function EventTimeline({ motorId, anomalias }: Props) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!motorId) return;
    setLoading(true);

    Promise.allSettled([
      api.get<Alert[]>(`/alerts/?motor_id=${motorId}&limit=50`),
      api.get<Maintenance[]>(`/maintenance/?motor_id=${motorId}`),
    ]).then(([alertsRes, maintRes]) => {
      const alertEvents: TimelineEvent[] = alertsRes.status === "fulfilled"
        ? (alertsRes.value ?? []).filter((a) => a.timestamp).map(buildAlertEvent)
        : [];

      const maintEvents: TimelineEvent[] = maintRes.status === "fulfilled"
        ? (maintRes.value ?? []).filter((m) => m.scheduled_date || m.completed_date).map(buildMaintenanceEvent)
        : [];

      const diagEvents: TimelineEvent[] = anomalias
        .filter((a) => a.timestamp)
        .map(buildDiagEvent);

      const all = [...alertEvents, ...maintEvents, ...diagEvents]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setEvents(all);
    }).finally(() => setLoading(false));
  }, [motorId, anomalias.length]);

  if (loading) {
    return (
      <TimelineEmpty>
        <span style={{ fontSize: 11 }}>Carregando eventos...</span>
      </TimelineEmpty>
    );
  }

  if (events.length === 0) {
    return (
      <TimelineEmpty>
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Nenhum evento registrado
      </TimelineEmpty>
    );
  }

  /* group by date */
  const groups: { label: string; items: TimelineEvent[] }[] = [];
  for (const ev of events) {
    const gl = groupKey(ev.timestamp);
    const grp = groups.find((g) => g.label === gl);
    if (grp) grp.items.push(ev);
    else groups.push({ label: gl, items: [ev] });
  }

  return (
    <TimelineList>
      {groups.map((g) => (
        <div key={g.label}>
          <TimelineGroupLabel>{g.label}</TimelineGroupLabel>
          {g.items.map((ev) => (
            <TimelineItem key={ev.id} $color={ev.color}>
              <TimelineContent>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <TimelineTag $color={TYPE_META[ev.type].color}>{ev.tag}</TimelineTag>
                </div>
                <TimelineTitle title={ev.title}>{ev.title}</TimelineTitle>
                <TimelineTime>
                  {formatTs(ev.timestamp)}
                  {ev.sub ? ` · ${ev.sub}` : ""}
                </TimelineTime>
              </TimelineContent>
            </TimelineItem>
          ))}
        </div>
      ))}
    </TimelineList>
  );
}
