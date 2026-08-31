import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Package, Wallet } from "lucide-react";
import { getAttendanceForecast, getResourceForecast, getBudgetForecast } from "../../services/forecastService";

const Forecast = () => {
  const { data: attendance } = useQuery({ queryKey: ["forecastAttendance"], queryFn: getAttendanceForecast });
  const { data: resources } = useQuery({ queryKey: ["forecastResources"], queryFn: getResourceForecast });
  const { data: budget } = useQuery({ queryKey: ["forecastBudget"], queryFn: getBudgetForecast });

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Forecasting</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Estimates based on historical event data, to help plan upcoming events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[var(--accent)] flex items-center justify-center mb-3">
            <TrendingUp size={18} />
          </div>
          <h3 className="font-display text-base font-semibold mb-1">Attendance Forecast</h3>
          {attendance && (
            <>
              <p className="text-2xl font-semibold text-slate-900 mt-2">{attendance.forecast}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">{attendance.note}</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Wallet size={18} />
          </div>
          <h3 className="font-display text-base font-semibold mb-1">Budget Forecast</h3>
          {budget && (
            <>
              <p className="text-2xl font-semibold text-slate-900 mt-2">
                {budget.forecast > 0 ? `₹${budget.forecast.toLocaleString()}` : "—"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">{budget.note}</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Package size={18} />
          </div>
          <h3 className="font-display text-base font-semibold mb-1">Resource Forecast</h3>
          {resources && resources.items.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] mt-2">Not enough allocation history yet.</p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {resources?.items.map((item) => (
                <div key={item.resource_name} className="flex justify-between text-xs">
                  <span className="text-slate-700">{item.resource_name}</span>
                  <span className="font-medium text-slate-800">{item.forecast_needed}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecast;