
import { cn } from "@/lib/utils";

interface UndipLogoProps {
  className?: string;
}

const UndipLogo = ({ className }: UndipLogoProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img 
        src="/lovable-uploads/96f2709b-0886-4a35-82a1-0ab5d0f2df12.png" 
        alt="Universitas Diponegoro Logo" 
        className={cn("h-full w-full object-contain", className)}
      />
    </div>
  );
};

export default UndipLogo;
