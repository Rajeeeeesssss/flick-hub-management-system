
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ShowTimeOption = {
  label: string;
  value: string;
};

const SHOW_TIMES: ShowTimeOption[] = [
  { label: "10:00 AM", value: "10:00" },
  { label: "2:00 PM", value: "14:00" },
  { label: "6:00 PM", value: "18:00" },
  { label: "9:00 PM", value: "21:00" },
];

// For demo: A1-E5 (5 rows x 5 seats)
const SEAT_NUMBERS: string[] = [];
for (let row = 0; row < 5; row++) {
  for (let col = 1; col <= 5; col++) {
    SEAT_NUMBERS.push(String.fromCharCode(65 + row) + col);
  }
}

export interface BookTicketDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (seat: string, showTime: string) => Promise<void>;
  loading: boolean;
}

export default function BookTicketDialog({ open, onOpenChange, onConfirm, loading }: BookTicketDialogProps) {
  const [seat, setSeat] = useState(SEAT_NUMBERS[0]);
  const [showTime, setShowTime] = useState(SHOW_TIMES[0].value);

  const handleConfirm = async () => {
    await onConfirm(seat, showTime);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Seat & Show Time</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div>
            <label className="font-semibold block mb-2">Show Time</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={showTime}
              onChange={e => setShowTime(e.target.value)}
              disabled={loading}
            >
              {SHOW_TIMES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-2">Seat</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={seat}
              onChange={e => setSeat(e.target.value)}
              disabled={loading}
            >
              {SEAT_NUMBERS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={loading}>{loading ? "Booking..." : "Confirm Booking"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
