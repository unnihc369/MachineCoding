"use client";

import { useMemo, useState } from "react";
import "./Calendar.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
}

function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = useMemo(() => buildCalendarDays(year, month), [year, month]);

  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const goToPreviousMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="calendar">
      <header className="calendar__header">
        <button
          type="button"
          className="calendar__nav-btn"
          aria-label="Previous month"
          onClick={goToPreviousMonth}
        >
          ‹
        </button>

        <div className="calendar__title-wrap">
          <h3 className="calendar__title">
            {MONTH_NAMES[month]} {year}
          </h3>
          {isCurrentMonth && (
            <span className="calendar__current-badge">Current month</span>
          )}
        </div>

        <button
          type="button"
          className="calendar__nav-btn"
          aria-label="Next month"
          onClick={goToNextMonth}
        >
          ›
        </button>
      </header>

      <button
        type="button"
        className="calendar__today-btn"
        onClick={goToToday}
      >
        Today
      </button>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day} className="calendar__weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="calendar__grid" role="grid" aria-label={`${MONTH_NAMES[month]} ${year}`}>
        {days.map((date, index) => {
          if (!date) {
            return (
              <span
                key={`empty-${index}`}
                className="calendar__day calendar__day--empty"
                aria-hidden="true"
              />
            );
          }

          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              role="gridcell"
              className={`calendar__day ${
                isToday ? "calendar__day--today" : ""
              }`}
              aria-label={date.toDateString()}
              aria-current={isToday ? "date" : undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarDemo() {
  return (
    <div className="calendar-demo">
      <header className="calendar-demo__header">
        <h2 className="calendar-demo__title">Calendar</h2>
        <p className="calendar-demo__subtitle">
          Navigate months with prev/next — today is highlighted; current month
          shows a badge.
        </p>
      </header>

      <Calendar />
    </div>
  );
}
