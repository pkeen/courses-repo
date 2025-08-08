// import type { UserPublic as User } from "@pete_keen/authentication-core";
import Link from "next/link";
// import { Logo, GradientLogo } from "./logo";
// import { GradientLogoButton } from "./logo-button";
// import { AvatarOrSignin } from "./avatar";
// import { ColorModeToggle } from "./color-mode-toggle";

type User = {
	id: string;
	email: string;
};

export function MinimalHeader({ user }: { user: User | null }) {
	return (
		<div className="flex justify-between items-center pr-4 pl-4">
			<Link href="/">{/* <GradientLogoButton /> */}</Link>
			<div className="flex gap-2 items-center">
				{/* <ColorModeToggle />
				<AvatarOrSignin user={user} /> */}
			</div>
		</div>
	);
}
