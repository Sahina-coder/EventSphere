import { createContext, useContext, useState, type ReactNode } from "react";

interface AttendeeContextType {
  attendeeId: number | null;
  setAttendeeId: (id: number | null) => void;
}

const AttendeeContext = createContext<AttendeeContextType>({
  attendeeId: null,
  setAttendeeId: () => {},
});

export const AttendeeProvider = ({ children }: { children: ReactNode }) => {
  const [attendeeId, setAttendeeId] = useState<number | null>(null);
  return (
    <AttendeeContext.Provider value={{ attendeeId, setAttendeeId }}>
      {children}
    </AttendeeContext.Provider>
  );
};

export const useAttendeeContext = () => useContext(AttendeeContext);