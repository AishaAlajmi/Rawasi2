import React, { useState } from "react";

export function OtpModal({ open, email, onClose, onVerify }) {
  const [code, setCode] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white">
        <div className="border-b px-4 py-3 font-semibold">Verify your email</div>
        <div className="space-y-3 p-4">
          <p className="text-sm text-neutral-600">
            We sent a 6-digit code to <span className="font-medium">{email}</span>. Any 6 digits work in this demo.
          </p>
          <input
            className="w-full rounded-xl border px-3 py-2 text-center tracking-widest"
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex items-center justify-end gap-2">
            <button className="rounded-xl border px-3 py-1.5" onClick={onClose}>Cancel</button>
            <button className="rounded-xl bg-indigo-600 px-3 py-1.5 text-white" onClick={() => onVerify(code)}>Verify</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForgotModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white">
        <div className="border-b px-4 py-3 font-semibold">Forgot Password</div>
        <div className="space-y-3 p-4">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center justify-end gap-2">
            <button className="rounded-xl border px-3 py-1.5" onClick={onClose}>Close</button>
            <button className="rounded-xl bg-indigo-600 px-3 py-1.5 text-white" onClick={onClose}>Send Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}
