import { useRef } from "react";
import { Pencil, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EntityHero({
  title,
  subtitle,
  icon,
  onIconChange,
  onEdit,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  onIconChange?: (dataUrl: string) => void;
  onEdit?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handle = (f: File) => {
    const r = new FileReader();
    r.onload = () => onIconChange?.(r.result as string);
    r.readAsDataURL(f);
  };
  return (
    <div className="relative mb-6 flex items-center gap-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => onIconChange && inputRef.current?.click()}
        className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white"
        title={onIconChange ? "Upload icon" : undefined}
      >
        {icon ? (
          <img src={icon} alt={title} className="h-24 w-24 object-contain" />
        ) : (
          <Cog className="h-20 w-20 text-[oklch(0.3_0.06_260)]" strokeWidth={1.4} />
        )}
      </button>
      {onIconChange && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
        />
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-[oklch(0.3_0.07_260)]">{title}</h1>
        {subtitle && <p className="mt-1 text-base text-muted-foreground">{subtitle}</p>}
      </div>
      {onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit} className="self-end rounded-full">
          Edit <Pencil className="ml-1 h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}