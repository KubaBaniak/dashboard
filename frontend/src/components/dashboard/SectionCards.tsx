import { StatCard } from "./StatCard";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value="$1,250.00"
        change="+12.5%"
        direction="up"
        footerMainText="Trending up this month"
        footerSubText="Visitors for the last 6 months"
      />
      <StatCard
        title="New Customers"
        value="1,234"
        change="-20%"
        direction="down"
        footerMainText="Down 20% this period"
        footerSubText="Acquisition needs attention"
      />
      <StatCard
        title="Active Accounts"
        value="45,678"
        change="+12.5%"
        direction="up"
        footerMainText="Strong user retention"
        footerSubText="Engagement exceed targets"
      />
      <StatCard
        title="Growth Rate"
        value="4.5%"
        change="+4.5%"
        direction="up"
        footerMainText="Steady performance increase"
        footerSubText="Meets growth projections"
      />
    </div>
  );
}
