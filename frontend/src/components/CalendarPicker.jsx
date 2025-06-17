// components/CalendarPicker.jsx
import React from 'react';

export default function CalendarPicker({ bookedDates, selectedDate, onDateSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i <= 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  const isBooked = (date) => bookedDates.includes(date.toISOString().slice(0, 10));

  return (
    <div>
      <h4>Sanani tanlang</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 400 }}>
        {days.map(day => {
          const dateStr = day.toISOString().slice(0, 10);
          const bgColor = isBooked(day)
            ? '#ff6961' // band
            : selectedDate === dateStr
              ? '#00bfff' // tanlangan
              : '#77dd77'; // mavjud

          return (
            <div
              key={dateStr}
              onClick={() => !isBooked(day) && onDateSelect(dateStr)}
              style={{
                width: 40,
                height: 40,
                margin: 4,
                lineHeight: '40px',
                textAlign: 'center',
                backgroundColor: bgColor,
                borderRadius: 6,
                cursor: isBooked(day) ? 'not-allowed' : 'pointer',
                color: isBooked(day) ? '#fff' : '#000',
                userSelect: 'none',
              }}
              title={isBooked(day) ? 'Band qilingan' : 'Bo‘sh'}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
