import { useRef } from "react";
import { Building2, Upload, Trash2, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Company {
  id: string;
  name: string;
  location: string;
  icon?: string;
}

interface Props {
  company: Company;
  onIconChange: (id: string, dataUrl: string) => void;
  onRemove: (id: string) => void;
}

export function CompanyCard({ company, onIconChange, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onIconChange(company.id, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      <div className="flex">
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center bg-[image:var(--gradient-card)]">
          {company.icon ? (
            <img src={company.icon} alt={company.name} className="h-20 w-20 rounded-lg bg-white object-contain p-2" />
          ) : (
            <Building2 className="h-12 w-12 text-white/90" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight text-foreground">{company.name}</h3>
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{company.location}</span>
            </div>
          </div>
          <div className="mt-3 flex gap-1.5">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => inputRef.current?.click()}
              title="Upload icon"
            >
              <Upload className="h-3.5 w-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full hover:bg-destructive hover:text-destructive-foreground" title="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove {company.name}?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onRemove(company.id)}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}