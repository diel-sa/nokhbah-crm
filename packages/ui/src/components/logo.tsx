import type * as React from "react";

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={512}
		height={512}
		viewBox="0 0 512 512"
		fill="none"
		aria-label="NOKHBAH Logo"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M123 127H506V268L389 386H6V244L123 127ZM78 187H436V313H78V187Z"
			fill="currentColor"
		/>
	</svg>
);
export default Logo;
