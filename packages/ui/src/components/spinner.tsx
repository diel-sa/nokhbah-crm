import { cn } from "@crm/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const SILHOUETTE = "M123 127H506V268L389 386H6V244L123 127Z";

const MARK =
	"M123 127H506V268L389 386H6V244L123 127ZM78 187H436V313H78V187Z";

const spinnerVariants = cva("shrink-0", {
	variants: {
		size: {
			default: "size-4",
			lg: "size-10",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

function Spinner({
	className,
	size,
	...props
}: React.ComponentProps<"svg"> & VariantProps<typeof spinnerVariants>) {
	return (
		<svg
			data-slot="spinner"
			role="status"
			aria-label="Loading"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="-68 -68 648 648"
			fill="none"
			className={cn(spinnerVariants({ size }), className)}
			{...props}
		>
			<path d={MARK} fill="currentColor" fillOpacity={0.85} fillRule="evenodd" clipRule="evenodd" />
			<path
				d={SILHOUETTE}
				transform="translate(256 256) scale(1.16) translate(-256 -256)"
				stroke="var(--ring)"
				strokeWidth={32}
				strokeLinejoin="round"
				strokeLinecap="round"
				pathLength={100}
				strokeDasharray="40 60"
				className="animate-spinner-trace"
			/>
		</svg>
	);
}

export { Spinner };
