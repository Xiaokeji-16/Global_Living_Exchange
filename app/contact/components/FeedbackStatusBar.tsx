// app/dashboard/contact/components/FeedbackStatusBar.tsx
"use client";

type Props = {
  error: string | null;
  success: string | null;
};

export default function FeedbackStatusBar({ error, success }: Props) {
  if (!error && !success) return null;

  return (
    <div className="space-y-1">
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-500" role="status">
          {success}
        </p>
      )}
    </div>
  );
}