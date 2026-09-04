import { useQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
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
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Payments <Wallet size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Expense records linked to your assigned events.</p>
      </div>

      {!vendorId ? (
        <p className="text-sm text-[var(--text-muted)]">Select a vendor identity from the sidebar.</p>
      ) : (
        <>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-2xl font-bold text-[var(--text)]">₹{total.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Total recorded across your events</p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Records</h2>
            {relatedExpenses.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No expense records for your events yet.</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {relatedExpenses.map((exp) => (
                  <div key={exp.id} className="py-3 first:pt-0 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{exp.category}</p>
                      <p className="text-xs text-[var(--text-muted)]">{getEventName(exp.event_id)}</p>
                    </div>
                    <span className="text-sm font-medium text-[var(--text)]">₹{exp.amount.toLocaleString()}</span>
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