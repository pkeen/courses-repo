"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../../../lib/utils";
import { Button } from "../../../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { VideoContentItem } from "@pete_keen/courses-core/validators";

interface VideoComboBoxProps {
	value: number | null;
	setValue: (value: number | null) => void;
	videos: VideoContentItem[];
}

export function VideoComboBox({ value, setValue, videos }: VideoComboBoxProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value !== null && videos
						? videos.find((video) => video.id === value)?.title ??
						  "Unknown video"
						: "Select video..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search video..." />
					<CommandList>
						<CommandEmpty>No video found.</CommandEmpty>
						<CommandGroup>
							<CommandItem
								value="none"
								onSelect={() => {
									setValue(null);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === null
											? "opacity-100"
											: "opacity-0"
									)}
								/>
								<em>No video</em>
							</CommandItem>
							{videos.map((video) => (
								<CommandItem
									key={video.id}
									value={video.id.toString()}
									onSelect={(currentValue) => {
										const selectedId = Number(currentValue);
										setValue(
											selectedId === value
												? null
												: selectedId
										);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === video.id
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{video.title}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
