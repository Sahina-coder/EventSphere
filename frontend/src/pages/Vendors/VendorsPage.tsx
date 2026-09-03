import { useQuery } from "@tanstack/react-query";
import { Building2, CheckCircle2, Clock, Briefcase } from "lucide-react";
import { getVendors } from "../../services/vendorService";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import VendorForm from "./VendorForm";
import VendorList from "./VendorList";

const StatModule = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ size?: number }> }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <Icon size={16} />
    </div>
    <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
  </div>
);

const VendorsPage = () => {
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });

  const total = vendors?.length ?? 0;
  const active = vendors?.filter((v) => v.availability === "Available").length ?? 0;
  const pending = assignments?.filter((a) => a.status !== "Confirmed").length ?? 0;
  const assignedIds = new Set(assignments?.map((a) => a.vendor_id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule label="Total Vendors" value={String(total)} icon={Building2} />
        <StatModule label="Active" value={String(active)} icon={CheckCircle2} />
        <StatModule label="Pending Confirmation" value={String(pending)} icon={Clock} />
        <StatModule label="Currently Assigned" value={String(assignedIds.size)} icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VendorForm />
        <VendorList />
      </div>
    </div>
  );
};

export default VendorsPage;