import { useQuery } from "@tanstack/react-query";
import { ClipboardList, CheckCircle2, Clock } from "lucide-react";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import VendorAssignmentForm from "./VendorAssignmentForm";
import VendorAssignmentList from "./VendorAssignmentList";

const StatModule = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ size?: number }> }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <Icon size={16} />
    </div>
    <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
  </div>
);

const AssignmentsPage = () => {
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });

  const total = assignments?.length ?? 0;
  const confirmed = assignments?.filter((a) => a.status === "Confirmed").length ?? 0;
  const pending = assignments?.filter((a) => a.status !== "Confirmed").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatModule label="Total Assignments" value={String(total)} icon={ClipboardList} />
        <StatModule label="Confirmed" value={String(confirmed)} icon={CheckCircle2} />
        <StatModule label="Pending" value={String(pending)} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VendorAssignmentForm />
        <VendorAssignmentList />
      </div>
    </div>
  );
};

export default AssignmentsPage;