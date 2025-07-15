import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  iconRight?: LucideIcon
  onIconRightClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, iconRight: IconRight, onIconRightClick, ...props }, ref) => {
    return (
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            Icon ? "pl-9" : "pl-3",
            IconRight ? "pr-9" : "pr-3",
            className
          )}
          ref={ref}
          {...props}
        />
        {IconRight && (
            <button type="button" onClick={onIconRightClick} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <IconRight className="h-4 w-4" />
            </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
