// app/upload-home/components/SidebarTips.tsx

export function SidebarTips() {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 text-sm space-y-3">
        <h2 className="text-base font-semibold">How it works</h2>
        <ol className="list-decimal list-inside space-y-1 text-[rgb(var(--color-muted))]">
          <li>Upload your home details and photos.</li>
          <li>Our team reviews your submission.</li>
          <li>Once approved, your home becomes bookable by members.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 text-sm text-[rgb(var(--color-muted))] space-y-2">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
          Tips for a great listing
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Use bright, clear photos of each room.</li>
          <li>Mention unique features and nearby highlights.</li>
          <li>Be honest about any limitations (stairs, noise, etc.).</li>
        </ul>
      </div>
    </aside>
  );
}