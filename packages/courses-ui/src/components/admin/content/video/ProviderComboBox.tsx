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
import { videoProviderLabels } from "@pete_keen/courses-core/validators";

const providers = Object.entries(videoProviderLabels).map(([value, label]) => ({
	value,
	label,
}));

interface ProviderComboBoxProps {
	value: string;
	setValue: (value: string) => void;
}

export function ProviderComboBox({ value, setValue }: ProviderComboBoxProps) {
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
					{value
						? providers.find((provider) => provider.value === value)
								?.label
						: "Select provider..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search provider..." />
					<CommandList>
						<CommandEmpty>No provider found.</CommandEmpty>
						<CommandGroup>
							{providers.map((provider) => (
								<CommandItem
									key={provider.value}
									value={provider.value}
									onSelect={(currentValue) => {
										setValue(
											currentValue === value
												? ""
												: currentValue
										);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === provider.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{provider.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
