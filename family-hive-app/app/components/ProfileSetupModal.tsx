"use client";

import { useState } from "react";

export default function ProfileSetupModal({
  defaultOpen = false,
}: {
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600"
      >
        Open Profile Setup
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(19,23,28,0.2)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Profile Setup</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-zinc-400"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="relative h-28 rounded-2xl bg-zinc-100">
                <div className="absolute left-6 top-16 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-zinc-200 text-xl font-semibold text-zinc-500">
                  A
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                Status: Ready to personalize your profile.
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Name
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Set Passcode (PIN)
                  <input
                    type="password"
                    placeholder="4-digit PIN"
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Upload Profile Picture
                  <button
                    type="button"
                    className="rounded-xl border border-dashed border-zinc-200 px-3 py-2 text-left text-sm text-zinc-400"
                  >
                    TODO: Upload image
                  </button>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Choose Background Theme
                  <button
                    type="button"
                    className="rounded-xl border border-dashed border-zinc-200 px-3 py-2 text-left text-sm text-zinc-400"
                  >
                    TODO: Select theme
                  </button>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
