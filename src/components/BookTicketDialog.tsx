
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

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

// 5 rows x 5 seats (A1-E5)
const ROWS = 5, COLS = 5;
const ROW_LETTERS = Array.from({ length: ROWS }, (_, i) => String.fromCharCode(65 + i));
const COL_NUMBERS = Array.from({ length: COLS }, (_, i) => i + 1);
const SEAT_NUMBERS: string[] = [];
for (const row of ROW_LETTERS) {
  for (const col of COL_NUMBERS) {
    SEAT_NUMBERS.push(row + col);
  }
}

const LANGUAGES = [
  { label: "English", value: "english" },
  { label: "Hindi", value: "hindi" },
  { label: "French", value: "french" },
  { label: "Spanish", value: "spanish" },
];

export interface BookTicketDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (seat: string, showTime: string, language: string) => Promise<void>;
  loading: boolean;
}

export default function BookTicketDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: BookTicketDialogProps) {
  const [seat, setSeat] = useState(SEAT_NUMBERS[0]);
  const [showTime, setShowTime] = useState(SHOW_TIMES[0].value);
  const [language, setLanguage] = useState(LANGUAGES[0].value);

  const handleConfirm = async () => {
    await onConfirm(seat, showTime, language);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Seat, Show Time & Language</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {/* Show Time */}
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
          {/* Seat Grid */}
          <div>
            <label className="font-semibold block mb-2">Select your seat</label>
            <div className="flex flex-col items-center gap-2">
              {ROW_LETTERS.map((row, rowIdx) => (
                <div key={row} className="flex gap-2">
                  {COL_NUMBERS.map((col) => {
                    const seatId = `${row}${col}`;
                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={loading}
                        className={clsx(
                          "w-10 h-10 border rounded-md flex items-center justify-center transition-colors",
                          seat === seatId
                            ? "bg-primary text-primary-foreground font-bold shadow"
                            : "bg-background hover:bg-accent"
                        )}
                        onClick={() => setSeat(seatId)}
                        aria-label={`Seat ${seatId}`}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-2">Click a seat to select</div>
            </div>
          </div>
          {/* Language Picker */}
          <div>
            <label className="font-semibold block mb-2">Language</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              disabled={loading}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
