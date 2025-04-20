import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input, InputProps } from "../input";
import { PhoneInput } from "../phoneInputCustom/phone-input";
import { HTMLInputTypeAttribute } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"


interface Props extends InputProps {
    form: any,
    description?: React.ReactNode,
    label: string,
    placeholder?: string,
    name: string,
    type: HTMLInputTypeAttribute | "PhoneInput" | "select",
    optionsSelect?: { label: string, value: string }[]
}

export function FormFieldCustom(props: Props) {

    const { description, label, placeholder, form, name, type, optionsSelect, ...rest } = props

    return (
        <>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        {
                            type == 'select' ?
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        {
                                            <SelectTrigger>
                                                <SelectValue placeholder={placeholder} {...field} {...rest} />
                                            </SelectTrigger>
                                        }
                                    </FormControl>
                                    {
                                        type == 'select' ?
                                            <SelectContent>
                                                {
                                                    optionsSelect ? optionsSelect.map((item, index) =>
                                                        <SelectItem key={'select_' + item.value + '_' + index} value={item.value}>{item.label}</SelectItem>
                                                    ) : null
                                                }
                                            </SelectContent> : null
                                    }
                                </Select> :
                                <FormControl>
                                    {
                                        type == 'PhoneInput' ?
                                            <PhoneInput {...field} {...rest} />
                                            : <Input placeholder={placeholder} type={type} {...field} {...rest} />
                                    }
                                </FormControl>
                        }
                        {
                            description ?
                                <FormDescription>
                                    {description}
                                </FormDescription>
                                : null
                        }
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}