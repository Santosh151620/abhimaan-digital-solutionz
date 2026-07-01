'use client';

import { useState } from 'react';
import { createLead } from '../api/lead.api';

export function LeadCreateForm() {
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const onSubmit = async () => {
    await createLead({
      entityId: crypto.randomUUID(),
      title,
      email,
      phone,
    });

    setTitle('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-2 border p-4 rounded-md">
      <input
        className="border p-2 w-full"
        placeholder="Lead Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={onSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create Lead
      </button>
    </div>
  );
}