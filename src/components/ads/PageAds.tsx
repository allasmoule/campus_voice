import AdSlot from "./AdSlot";

export function AdTop({ page }: { page: string }) {
  return <AdSlot format="leaderboard" className="py-5 max-w-7xl mx-auto px-4" slot={`${page}-top`} />;
}

export function AdMid({ page }: { page: string }) {
  return <AdSlot format="rectangle" className="py-6 max-w-7xl mx-auto px-4" slot={`${page}-mid`} />;
}

export function AdBottom({ page }: { page: string }) {
  return <AdSlot format="banner" className="py-5 max-w-7xl mx-auto px-4" slot={`${page}-bottom`} />;
}
