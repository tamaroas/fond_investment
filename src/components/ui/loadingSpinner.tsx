import * as React from "react";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

const spinnerVariants = "w-5 h-5 mr-1 rounded-full animate-spin";

interface LoadingSpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
    className?: string;
}

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
    (props, ref) => {
        const { className, ...rest } = props;
        return (
            <LoaderIcon
                ref={ref}
                className={cn(spinnerVariants, className)}
                {...rest}
            />
        );
    },
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };