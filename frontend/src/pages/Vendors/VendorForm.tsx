import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVendor } from "../../services/vendorService";

const VendorForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setName("");
      setServiceType("");
      setPhone("");
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      service_type: serviceType,
      phone,
      email,
      availability: "Available",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 h-fit">
      <h2 className="font-display text-lg font-semibold mb-1">Add Vendor</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Register a service provider.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Vendor name</label>
          <input
            type="text"
            placeholder="ABC Catering"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Service type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          >
            <option value="">Select service</option>
            <option value="Catering">Catering</option>
            <option value="Photography">Photography</option>
            <option value="Decoration">Decoration</option>
            <option value="Sound System">Sound System</option>
            <option value="Transport">Transport</option>
            <option value="Printing">Printing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="vendor@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
        >
          {mutation.isPending ? "Adding…" : "Add vendor"}
        </button>
      </form>
    </div>
  );
};

export default VendorForm;