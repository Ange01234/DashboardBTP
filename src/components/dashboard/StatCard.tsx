import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className
}: StatCardProps) {
    return (
        <div className={cn("glass p-6 rounded-2xl card-hover", className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Icon className="text-primary-600" size={24} />
                </div>
                
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                {description && (
                    <p className="text-xs text-slate-400 mt-2">{description}</p>
                )}
            </div>
        </div>
    );
}
