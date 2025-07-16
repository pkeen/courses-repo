"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../../../ui/card";
import { Progress } from "../../../ui/progress";
import { Button } from "../../../ui/button";

export function FileDropzone({
	uploadUrl,
	accept,
	// maxFiles,
	
	}: {
		uploadUrl: string;
		accept: string;
		// maxFiles: number;
	}) {
	const [uploadPct, setUploadPct] = useState(0);
	const onDrop = useCallback(async (accepted: File[]) => {
		if (!accepted.length) return;
		const file = accepted[0];

		// naive demo upload
		const res = await fetch(uploadUrl, {
			method: "POST",
			body: file,
		});

		// fake progress for demo purposes
		setUploadPct(100);
		setTimeout(() => setUploadPct(0), 800);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [], "application/pdf": [] },
		maxFiles: 1,
	});

	return (
		<Card className="p-6 w-full max-w-md">
			<CardContent
				{...getRootProps()}
				className={`border-dashed border-2 rounded-2xl flex flex-col items-center justify-center gap-2 py-10 transition-colors
          ${isDragActive ? "border-primary" : "border-muted"}`}
			>
				<input {...getInputProps()} />
				<span className="text-sm font-medium">
					{isDragActive
						? "Drop to upload"
						: "Drag files here or click"}
				</span>

				{uploadPct > 0 && (
					<Progress value={uploadPct} className="w-full mt-4" />
				)}
			</CardContent>

			<Button variant="secondary" className="mt-4" onClick={() => {}}>
				Choose file
			</Button>
		</Card>
	);
}
