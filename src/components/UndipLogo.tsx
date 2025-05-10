
import { cn } from "@/lib/utils";

interface UndipLogoProps {
  className?: string;
}

const UndipLogo = ({ className }: UndipLogoProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {/* This is a simplified representation of Undip logo */}
      <div className="relative">
        <div className="w-full h-full rounded-full border-4 border-undip-orange flex items-center justify-center bg-undip-blue text-white font-bold">
          <div className="text-xs">UNDIP</div>
        </div>
      </div>
    </div>
  );
};

export default UndipLogo;
