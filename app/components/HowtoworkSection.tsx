import { CheckCircle2, Home, Coins, MapPin } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Apply and get verified",
    description:
      "Pass our identity and home-ownership verification process to join our trusted community.",
    icon: CheckCircle2,
  },
  {
    number: "2",
    title: "Upload your home",
    description:
      "Create a detailed listing with photos, amenities, and availability for your property.",
    icon: Home,
  },
  {
    number: "3",
    title: "Earn points",
    description:
      "Receive points when members stay at your home. Build your exchange credit over time.",
    icon: Coins,
  },
  {
    number: "4",
    title: "Use points to travel",
    description:
      "Spend your points to stay in other verified members’ homes around the world.",
    icon: MapPin,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 lg:py-24 bg-[rgb(var(--color-background))]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 & 副标题 */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-foreground))]">
            How it works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[rgb(var(--color-muted))]">
            Join our curated community in four simple steps and start
            experiencing authentic living around the world.
          </p>
        </div>

        {/* 4 步卡片 */}
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="flex flex-col h-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-6 shadow-sm"
              >
                {/* 顶部数字：卡片内部左上角正方圆形 */}
                <div className="self-start mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-sm font-medium">
                  {step.number}
                </div>

                {/* 图标 */}
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(79,70,229,0.06)]">
                  <Icon className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                </div>

                {/* 文案 */}
                <h3 className="text-sm sm:text-base font-semibold text-[rgb(var(--color-foreground))] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}