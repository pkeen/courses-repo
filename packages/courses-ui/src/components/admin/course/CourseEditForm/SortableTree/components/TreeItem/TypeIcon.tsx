import {
	Folder,
	Book,
	FileDown,
	FileQuestion,
	Presentation,
	SquarePlay,
} from "lucide-react";
import { ContentType } from "@pete_keen/courses-core/validators";

export const TypeIcon = ({ type }: { type: ContentType }) => {
	switch (type) {
		case "module":
			return <Folder />;
		case "lesson":
			return <Presentation />;
		case "quiz":
			return <FileQuestion />;
		case "file":
			return <FileDown />;
		case "video":
			return <SquarePlay />;
		default:
			return null;
	}
};
