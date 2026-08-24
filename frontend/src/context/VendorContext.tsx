import { createContext, useContext, useState, type ReactNode } from "react";

interface VendorContextType {
  vendorId: number | null;
  setVendorId: (id: number | null) => void;
}

const VendorContext = createContext<VendorContextType>({
  vendorId: null,
  setVendorId: () => {},
});

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [vendorId, setVendorId] = useState<number | null>(null);
  return (
    <VendorContext.Provider value={{ vendorId, setVendorId }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendorContext = () => useContext(VendorContext);