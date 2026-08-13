import { useState, useRef, useEffect } from "react";
import {
  Wrapper,
  TriggerButton,
  TriggerValue,
  TriggerIcon,
  Popover,
  CalHeader,
  NavButton,
  MonthLabel,
  WeekRow,
  WeekDay,
  DaysGrid,
  DayCell,
  ErrorText,
  FieldGroup,
  FieldLabel,
} from "./DatePicker.styles";

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(
  year: number,
  month: number,
): { date: Date; outside: boolean }[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: { date: Date; outside: boolean }[] = [];

  for (let i = 0; i < first.getDay(); i++) {
    days.push({
      date: new Date(year, month, -first.getDay() + 1 + i),
      outside: true,
    });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: new Date(year, month, d), outside: false });
  }
  while (days.length % 7 !== 0) {
    days.push({
      date: new Date(
        year,
        month + 1,
        days.length - last.getDate() - first.getDay() + 1,
      ),
      outside: true,
    });
  }
  return days;
}

// ===== SINGLE DATE PICKER =====

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Selecionar data",
  error,
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    value?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value?.getMonth() ?? today.getMonth(),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function selectDay(date: Date) {
    onChange(date);
    setOpen(false);
  }

  const days = buildCalendarDays(viewYear, viewMonth);

  const picker = (
    <Wrapper ref={ref}>
      <TriggerButton
        type="button"
        $hasError={!!error}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        <TriggerValue $placeholder={!value}>
          {value ? formatDate(value) : placeholder}
        </TriggerValue>
        <TriggerIcon>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 1v3M11 1v3M1 7h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </TriggerIcon>
      </TriggerButton>

      {open && (
        <Popover>
          <CalHeader>
            <NavButton type="button" onClick={prevMonth}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L6 8l4 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavButton>
            <MonthLabel>
              {MONTHS[viewMonth]} {viewYear}
            </MonthLabel>
            <NavButton type="button" onClick={nextMonth}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3l4 5-4 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavButton>
          </CalHeader>

          <WeekRow>
            {WEEK_DAYS.map((d) => (
              <WeekDay key={d}>{d}</WeekDay>
            ))}
          </WeekRow>

          <DaysGrid>
            {days.map(({ date, outside }, i) => {
              const isToday = isSameDay(date, today);
              const isSelected = value ? isSameDay(date, value) : false;
              const isDisabled =
                (minDate && date < minDate) || (maxDate && date > maxDate);

              return (
                <DayCell
                  key={i}
                  type="button"
                  $today={isToday}
                  $selected={isSelected}
                  $outside={outside}
                  disabled={!!isDisabled}
                  onClick={() => selectDay(date)}
                >
                  {date.getDate()}
                </DayCell>
              );
            })}
          </DaysGrid>
        </Popover>
      )}
    </Wrapper>
  );

  if (!label && !error) return picker;
  return (
    <FieldGroup>
      {label && <FieldLabel>{label}</FieldLabel>}
      {picker}
      {error && <ErrorText>{error}</ErrorText>}
    </FieldGroup>
  );
}

// ===== DATE RANGE PICKER =====

interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value?: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  value = { start: null, end: null },
  onChange,
  label,
  placeholder = "Selecionar período",
  error,
  disabled,
}: DateRangePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSelecting("start");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function selectDay(date: Date) {
    if (selecting === "start") {
      onChange({ start: date, end: null });
      setSelecting("end");
    } else {
      if (value.start && date < value.start) {
        onChange({ start: date, end: value.start });
      } else {
        onChange({ start: value.start, end: date });
      }
      setSelecting("start");
      setOpen(false);
    }
  }

  function isInRange(date: Date) {
    if (!value.start || !value.end) return false;
    return date > value.start && date < value.end;
  }

  const triggerLabel =
    value.start && value.end
      ? `${formatDate(value.start)} – ${formatDate(value.end)}`
      : value.start
        ? `${formatDate(value.start)} – ...`
        : placeholder;

  const days = buildCalendarDays(viewYear, viewMonth);

  const picker = (
    <Wrapper ref={ref}>
      <TriggerButton
        type="button"
        $hasError={!!error}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        <TriggerValue $placeholder={!value.start}>{triggerLabel}</TriggerValue>
        <TriggerIcon>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5 1v3M11 1v3M1 7h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </TriggerIcon>
      </TriggerButton>

      {open && (
        <Popover>
          <CalHeader>
            <NavButton type="button" onClick={prevMonth}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L6 8l4 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavButton>
            <MonthLabel>
              {MONTHS[viewMonth]} {viewYear}
            </MonthLabel>
            <NavButton type="button" onClick={nextMonth}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3l4 5-4 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavButton>
          </CalHeader>

          <WeekRow>
            {WEEK_DAYS.map((d) => (
              <WeekDay key={d}>{d}</WeekDay>
            ))}
          </WeekRow>

          <DaysGrid>
            {days.map(({ date, outside }, i) => {
              const isToday = isSameDay(date, today);
              const isStart = value.start
                ? isSameDay(date, value.start)
                : false;
              const isEnd = value.end ? isSameDay(date, value.end) : false;
              const inRange = isInRange(date);

              return (
                <DayCell
                  key={i}
                  type="button"
                  $today={isToday}
                  $rangeStart={isStart}
                  $rangeEnd={isEnd}
                  $inRange={inRange}
                  $outside={outside}
                  onClick={() => selectDay(date)}
                >
                  {date.getDate()}
                </DayCell>
              );
            })}
          </DaysGrid>
        </Popover>
      )}
    </Wrapper>
  );

  if (!label && !error) return picker;
  return (
    <FieldGroup>
      {label && <FieldLabel>{label}</FieldLabel>}
      {picker}
      {error && <ErrorText>{error}</ErrorText>}
    </FieldGroup>
  );
}
