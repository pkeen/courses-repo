import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

export default function LessonEditor({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<MdEditor
			value={value}
			style={{ height: "500px" }}
			renderHTML={(text) => mdParser.render(text)}
			onChange={({ text }) => onChange(text)}
		/>
	);
}
