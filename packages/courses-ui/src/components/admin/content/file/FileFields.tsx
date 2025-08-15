import { CreateFullContentItem } from "@pete_keen/courses-core/validators";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "components/ui";
import { useFormContext } from "react-hook-form";

function ReadonlyInput({
	label,
	value,
}: {
	label: string;
	value?: string | number;
}) {
	return (
		<div className="grid gap-1">
			<span className="text-sm text-muted-foreground">{label}</span>
			<Input value={value ?? ""} readOnly disabled />
		</div>
	);
}

export const FileFields = () => {
	const { control, watch, setValue } =
		useFormContext<CreateFullContentItem>();
	const fileUrl = watch("details.fileUrl");
	const mimeType = watch("details.mimeType");
	const size = watch("details.size");

	const handleFileSelected = async (file: File) => {
		// instant client prefill
		// prefillFromClient(file, setValue);

		// authoritative server upload + probe
		const { url, meta } = await uploadFile(file);
		setValue("details.fileUrl", url, { shouldDirty: true });
		if (meta) {
			for (const [k, v] of Object.entries(meta)) {
				setValue(k as keyof FileItem, v as any, {
					shouldDirty: true,
				});
			}
		}
	};

	return <div>File Fields</div>;
};
