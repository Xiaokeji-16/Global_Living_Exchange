// app/contact/components/ContactHelpList.tsx
"use client";

export function ContactHelpList() {
  return (
    <div className="mt-4 space-y-2 text-sm">
      <h2 className="font-medium mb-1">What we can help with</h2>
      <ul className="space-y-1 text-[rgb(var(--color-muted))]">
        <li>• Questions about how the platform works</li>
        <li>• Interested in a specific property exchange</li>
        <li>• Support with verification or documents</li>
        <li>• Reporting an issue or safety concern</li>
      </ul>
    </div>
  );
}