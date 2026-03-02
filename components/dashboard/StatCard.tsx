import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 flex gap-4 items-start ${accent ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'}`}>
      <div className={`rounded-lg p-2.5 ${accent ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
