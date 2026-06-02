import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Cog, Pencil, Trash2, Upload, CheckCircle2, Map } from "lucide-react";
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

interface Props {
  title: string;
  subtitle?: string;
  to?: string;
  icon?: string;
  onIconChange?: (dataUrl: string) => void;
  onEdit?: () => void;
  onRemove?: () => void;
  showMap?: boolean;
  showCheck?: boolean;
}

export function ResourceCard({
  title,
  subtitle,
  to,
  icon,
  onIconChange,
  onEdit,
  onRemove,
  showMap,
  showCheck = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => onIconChange?.(r.result as string);
    r.readAsDataURL(f);
  };

  const Wrapper: any = to ? Link : "div";
  const wrapperProps: any = to ? { to } : {};

  return (
    <div className="group flex overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <Wrapper
        {...wrapperProps}
        className="relative flex h-32 w-32 shrink-0 items-center justify-center bg-[image:var(--gradient-card)]"
      >
        {icon ? (
          <img src={icon} alt="" className="h-20 w-20 rounded-lg bg-white object-contain p-2" />
        ) : (
          <Cog className="h-14 w-14 text-[oklch(0.3_0.06_260)]" strokeWidth={1.6} />
        )}
      </Wrapper>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <Wrapper {...wrapperProps} className="flex-1">
            <h3 className="font-bold leading-tight text-[oklch(0.3_0.07_260)] uppercase tracking-tight">
              {title}
            </h3>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </Wrapper>
          {showCheck && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          )}
        </div>
        <div className="mt-3 flex gap-1.5">
          {onIconChange && (
            <>
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
                onClick={(e) => {
                  e.preventDefault();
                  inputRef.current?.click();
                }}
                title="Upload icon"
              >
                <Upload className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {showMap && (
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" title="View map">
              <Map className="h-3.5 w-3.5" />
            </Button>
          )}
          {onEdit && (
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                onEdit();
              }}
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onRemove && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => e.preventDefault()}
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove {title}?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}