import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function Clock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const h = String(time.getHours()).padStart(2, '0');
  const m = String(time.getMinutes()).padStart(2, '0');
  const s = String(time.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const el = document.getElementById('fixedClock');
if (el) createRoot(el).render(<Clock />);
