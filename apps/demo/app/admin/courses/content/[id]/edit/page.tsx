import { courses } from "@/courses";
import { ContentEditForm } from "@pete_keen/courses-ui";

export default async function ContentEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const contentItem = await courses.content.get(parseInt(id));
	const videos = await courses.content.list({ type: "video" });
	return contentItem ? (
		<ContentEditForm
			contentItem={contentItem}
			videos={videos}
			updateContent={async (values) => {
				"use server";
				await courses.content.update(values);
			}}
			deleteContent={async (id) => {
				"use server";
				await courses.content.destroy(id);
			}}
		/>
	) : (
		<div>Content item not found</div>
	);
}
