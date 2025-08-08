import { ContentAdminView } from "@pete_keen/courses-ui";
import { courses } from "@/courses";

export default async function ContentPage() {
	const content = await courses.content.list();
	return (
		<ContentAdminView
			content={content}
			onAddContentHref="/admin/courses/content/new"
			handleDelete={async (id) => {
				"use server";
				await courses.content.destroy(id);
			}}
		/>
	);
}
