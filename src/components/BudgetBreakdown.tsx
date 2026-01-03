import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/services/costService";
import type { CostBreakdown, TripStopWithActivities } from "@/types/database";

interface BudgetBreakdownProps {
    breakdown: CostBreakdown | null;
    stops: TripStopWithActivities[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const BudgetBreakdown = ({ breakdown, stops }: BudgetBreakdownProps) => {
    const pieData = useMemo(() => {
        if (!breakdown) return [];
        return [
            { name: 'Accommodation', value: parseFloat(breakdown.total_accommodation.toString()) },
            { name: 'Food', value: parseFloat(breakdown.total_food.toString()) },
            { name: 'Transport', value: parseFloat(breakdown.total_transport.toString()) },
            { name: 'Activities', value: parseFloat(breakdown.total_activities.toString()) },
        ].filter(item => item.value > 0);
    }, [breakdown]);

    const barData = useMemo(() => {
        return stops.map(stop => ({
            name: stop.city_name,
            cost: parseFloat(stop.estimated_cost?.toString() || '0'),
        }));
    }, [stops]);

    if (!breakdown || (pieData.length === 0 && barData.length === 0)) {
        return (
            <Card variant="elevated" className="p-8 text-center">
                <p className="text-muted-foreground">Add some cities and activities to see the budget breakdown.</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card variant="elevated">
                <CardHeader>
                    <CardTitle className="text-lg">Cost by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Estimate</span>
                            <span className="font-bold text-foreground">{formatCurrency(breakdown.total_estimated_cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Per Day Average</span>
                            <span className="font-medium text-foreground">{formatCurrency(breakdown.per_day_average)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* City Breakdown */}
            <Card variant="elevated">
                <CardHeader>
                    <CardTitle className="text-lg">Cost by City</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="cost" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BudgetBreakdown;
