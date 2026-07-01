'use client';

import { useEffect, useState } from 'react';

export default function LeadSearch({ value }: { value: string }) {
  const [localValue, setLocalValue] = useState(value);

  // safe sync when external value changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value, localValue]);

  return (
    <input
      className="border p-2"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
}