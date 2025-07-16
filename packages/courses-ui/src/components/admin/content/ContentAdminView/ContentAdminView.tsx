// "use client";
import { ContentItemDTO } from "@pete_keen/courses-core/validators";
import { Button } from "../../../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ContentTable } from "./ContentTable";

type ContentViewProps = {
	content: ContentItemDTO[];
	onAddContentHref: string;
	handleDelete: (id: number) => Promise<void>;
};

export function ContentAdminView({
	content,
	onAddContentHref,
	handleDelete,
}: ContentViewProps) {
	return (
		<div className="space-y-4">
			<Button variant="default" size="sm" asChild>
				<Link
					href={onAddContentHref}
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Content
				</Link>
			</Button>
			<ContentTable content={content} handleDelete={handleDelete} />
		</div>
	);
}
