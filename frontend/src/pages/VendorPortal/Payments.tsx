import { useQuery } from "@tanstack/react-query";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { getExpenses } from "../../services/expenseService";
import { useVendorContext } from "../../context/VendorContext";

const Payments = () => {
  const { vendorId } = useVendorContext();
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: expenses } = useQuery({ queryKey: ["expenses"], queryFn: getExpenses });

  const myEventIds = new Set(assignments?.filter((a) => a.vendor_id === vendorId).map((a) => a.event_id));
  const relatedExpenses = expenses?.filter((e) => myEventIds.has(e.event_id)) ?? [];
  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const total = relatedExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Payments</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Expense records linked to your assigned events.</p>
      </div>

      {!vendorId ? (
        <p className="text-sm text-[var(--text-muted)]">Select a vendor identity from the sidebar.</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
            <p className="text-2xl font-semibold text-slate-900">₹{total.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-muted)]">Total recorded across your events</p>
          </div>

          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h2 className="font-display text-base font-semibold mb-4">Records</h2>
            {relatedExpenses.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No expense records for your events yet.</p>
            ) : (
              <div className="space-y-2">
                {relatedExpenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between border-b border-slate-50 pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{exp.category}</p>
                      <p className="text-xs text-[var(--text-muted)]">{getEventName(exp.event_id)}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-800">₹{exp.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Payments;