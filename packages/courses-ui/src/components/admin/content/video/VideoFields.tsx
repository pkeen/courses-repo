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
import { useFormContext } from "react-hook-form";
import { ProviderComboBox } from "./ProviderComboBox";

export const VideoFields = () => {
	const { control } = useFormContext<CreateFullContentItem>();

	return (
		<div>
			{/* Video Provider */}
			<FormField
				control={control}
				name="details.fileName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Provider</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="details.fileUrl"
				render={({ field }) => (
					<FormItem>
						<FormLabel>URL</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="details.mimeType"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Thumbnail URL</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};
