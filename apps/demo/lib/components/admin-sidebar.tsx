import Link from "next/link";
import {
	LayoutDashboard,
	Users,
	BookOpen,
	Settings,
	LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const navItems = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/users", label: "Users", icon: Users },
	{
		label: "Courses",
		icon: BookOpen,
		children: [
			{ href: "/admin/courses", label: "Courses" },
			{ href: "/admin/courses/content", label: "Content" },
			// { href: "/admin/courses/lessons", label: "Lessons" },
			// { href: "/admin/courses/videos", label: "Videos" },
		],
	},
	{ href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
	return (
		<aside className="h-full w-64 border-r bg-background p-4 flex flex-col justify-between">
			<nav className="space-y-1">
				<Accordion type="multiple" className="w-full">
					{navItems.map((item) => {
						if (item.children) {
							return (
								<AccordionItem
									key={item.label}
									value={item.label}
								>
									<AccordionTrigger className="w-full px-3 py-2 text-sm font-medium flex justify-start gap-2 cursor-pointer">
										{item.icon && (
											<item.icon className="h-4 w-4" />
										)}
										{item.label}
									</AccordionTrigger>
									<AccordionContent className="pl-8 flex flex-col">
										{item.children.map((child) => (
											<Link
												key={child.href}
												href={child.href}
											>
												<Button
													variant="ghost"
													className="w-full justify-start gap-2 px-3 py-2 text-sm font-normal cursor-pointer"
												>
													{child.label}
												</Button>
											</Link>
										))}
									</AccordionContent>
								</AccordionItem>
							);
						} else {
							return (
								<Link key={item.href} href={item.href}>
									<Button
										variant="ghost"
										className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium cursor-pointer"
									>
										{item.icon && (
											<item.icon className="h-4 w-4" />
										)}
										{item.label}
									</Button>
								</Link>
							);
						}
					})}
				</Accordion>
			</nav>

			<form action="/api/thia/signout" method="post">
				<Button
					type="submit"
					variant="ghost"
					className="w-full justify-start gap-2 px-3 py-2 text-sm text-red-600"
				>
					<LogOut className="h-4 w-4" />
					Logout
				</Button>
			</form>
		</aside>
	);
}
