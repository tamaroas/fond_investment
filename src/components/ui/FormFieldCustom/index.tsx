import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input, InputProps } from "../input";
import { PhoneInput } from "../phoneInputCustom/phone-input";
import { HTMLInputTypeAttribute, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { Eye, EyeOff } from "lucide-react";


interface Props extends InputProps {
    form: any,
    description?: React.ReactNode,
    label?: string,
    placeholder?: string,
    name: string,
    type: HTMLInputTypeAttribute | "PhoneInput" | "select",
    optionsSelect?: { label: string, value: string }[],
    icon?: React.ReactNode
}

export function FormFieldCustom(props: Props) {

    const { description, label, placeholder, form, name, type, optionsSelect, icon, ...rest } = props
    
    // État pour gérer la visibilité du mot de passe
    const [showPassword, setShowPassword] = useState(false);
    
    // Déterminer le type d'input à afficher
    const inputType = type === "password" 
        ? (showPassword ? "text" : "password") 
        : type;
    
    // Ensure we don't pass the icon prop to the Input component
    const inputProps = { ...rest }

    // Fonction pour basculer la visibilité du mot de passe
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem >
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
                                    <>
                                    
                                
                                    {
                                        type == 'PhoneInput' ?
                                            <PhoneInput {...field} {...inputProps} />
                                            : <div className="relative">
                                                {icon && (
                                                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                    {icon}
                                                  </div>
                                                )}
                                                <Input 
                                                  placeholder={placeholder} 
                                                  type={inputType} 
                                                  className={icon ? "pl-10" : ""}
                                                  {...field} 
                                                  {...inputProps} 
                                                />
                                                {type === "password" && (
                                                  <button 
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                  >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                  </button>
                                                )}
                                              </div>
                                    }
                                    </>
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
