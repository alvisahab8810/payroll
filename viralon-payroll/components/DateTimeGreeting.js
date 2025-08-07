"use client";

import { useEffect, useState } from "react";

const getGreeting = (hours) => {
  if (hours < 12) return "Good morning";
  if (hours < 17) return "Good afternoon";
  return "Good evening";
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DateTimeGreeting = ({ name = "Admin" }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  const greeting = getGreeting(time.getHours());
  const formattedDate = formatDate(time);
  const formattedTime = formatTime(time);

  return (
    <div className="date-time-bx">
      <div className="mr-5">
        <div className="text-mute fw-light text-dark">{formattedDate}</div>
         <div className="fs-6 fw-bold">{formattedTime}</div>
      </div>
      <h5 class="fw-bold text-dark">{greeting}, {name}! </h5>
    </div>
  );
};

export default DateTimeGreeting;
