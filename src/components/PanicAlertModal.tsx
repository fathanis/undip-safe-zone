
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface PanicAlertModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const PanicAlertModal = ({ onConfirm, onCancel }: PanicAlertModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-500">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Konfirmasi Panic Alert
          </DialogTitle>
          <DialogDescription>
            Anda akan mengirim sinyal panic ke unit keamanan kampus. Gunakan fitur ini hanya pada situasi darurat.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-red-50 rounded-md text-red-800 text-sm">
          <p className="font-bold">Harap perhatikan:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Sinyal panic akan mengirimkan lokasi Anda saat ini</li>
            <li>Unit keamanan kampus akan segera dihubungi</li>
            <li>Tetap berada di lokasi jika memungkinkan dan aman</li>
            <li>Penyalahgunaan sinyal panic dapat dikenakan sanksi</li>
          </ul>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
          >
            Ya, Kirim Sinyal Panic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PanicAlertModal;
