
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getPhoneData, PhoneInput } from "./phone-input";

const phoneSchema = z.object({
	phone: z.string(),
});

export function PhoneInputForm() {
	const form = useForm<z.infer<typeof phoneSchema>>({
		mode: "onBlur",
		resolver: zodResolver(phoneSchema),
		defaultValues: {
			phone: "",
		},
	});

	function onSubmit(data: z.infer<typeof phoneSchema>) {
		const phoneData = getPhoneData(data.phone);

		if (!phoneData.isValid) {
			form.setError("phone", {
				type: "manual",
				message: "Invalid phone number",
			});
			return;
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<PhoneInput {...field} />
							</FormControl>
							<FormDescription>
								Enter a valid phone number with country
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
