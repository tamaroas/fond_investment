'use client'


import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "../ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
const formSchema = z.object({ "email": z.string().email().min(1).max(255) })


interface Props {
    dictionary: DictionaryType,
}

export default function LoginForm(props: Props) {
    const { dictionary } = props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "string",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <Card className="max-w-sm min-w-80">
            <CardHeader>
                <CardTitle>{dictionary.tologin} </CardTitle>
                <CardDescription> {dictionary.welcomelogin}</CardDescription>
            </CardHeader>
            <CardContent>


                <Form {...form}>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        df
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>

            </CardContent>
            <CardFooter className="flex justify-center gap-2">
                <Button>{dictionary.connection}</Button>
                {dictionary.or}
                <Button variant="outline">{dictionary.registration}</Button>
            </CardFooter>
        </Card>
    )
}
