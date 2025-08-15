import { CreateFullContentItem } from "@pete_keen/courses-core/validators";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "components/ui";
import { Textarea } from "components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";
import LessonEditor from "./LessonContentEditor";

export const LessonFields = () => {
	const { control } = useFormContext<CreateFullContentItem>();

	// TODO: Decide what input form videoContentId should take
	return (
		<div>
			{/* Video */}
			<FormField
				control={control}
				name="details.videoContentId"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Video Id </FormLabel>
						<FormControl>
							<Input placeholder="Enter Video" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{/* More shared fields... */}
			<FormField
				control={control}
				name="details.excerpt"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Excerpt </FormLabel>
						<FormControl>
							<Textarea
								placeholder="Enter excerpt text"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* content editor */}
			<FormField
				control={control}
				name="details.bodyContent"
				render={() => (
					<FormItem>
						<FormLabel>Content</FormLabel>
						<FormControl>
							<Controller
								control={control}
								name="details.bodyContent"
								render={({ field }) => (
									<LessonEditor
										value={field.value ?? ""}
										onChange={field.onChange}
									/>
								)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};
