import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from "react";

type LayoutProps = {
	header: ReactNode;
	sidebar: ReactNode;
	footer: ReactNode;
	children: ReactNode;
};

export function AdminLayout({
	header,
	sidebar,
	footer,
	children,
}: LayoutProps) {
	return (
		<div className="flex flex-col h-screen overflow-hidden">
			{/* Header */}
			<header className="border-b shrink-0">{header}</header>

			{/* Main Area */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 border-r shrink-0 overflow-y-auto">
					{sidebar}
				</aside>

				{/* Scrollable Page Content */}
				<ScrollArea className="flex-1">
					<div className="p-6">{children}</div>
				</ScrollArea>
			</div>

			{/* Footer */}
			<footer className="border-t shrink-0">{footer}</footer>
		</div>
	);
}
