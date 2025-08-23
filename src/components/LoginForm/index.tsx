"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { FormFieldCustom } from "../ui/FormFieldCustom";
import { useState, useEffect } from "react";
import { userServiceLogin } from "@/utils/services/userServices";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/zustandStores";
import { useLogin } from "@/hooks/use-auth";
import { LoginformType, LoginformSchema } from "@/schemas/auth-schema";
// import { ViaziCustomer } from "@/utils/type/globalType"
import Image from "next/image";
import { Lock, User } from "lucide-react";

interface Props {
  dictionary: DictionaryType;
}

export default function LoginForm(props: Props) {
  const { dictionary } = props;
  const { mutate } = useLogin();
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof LoginformSchema>>({
    resolver: zodResolver(LoginformSchema),
    defaultValues: {
      login: "",
      mot2passe: "",
    },
  });

  function onSubmit(values: LoginformType) {

    setIsLoader(true);
    mutate(values);
    setIsLoader(false);
  }

  return (
    <Card className="max-w-sm min-w-80">
      <CardHeader>
        <div className="flex justify-center items-center gap-3">
          <div className="relative h-[70px] w-[100px]">
            <div className=" absolute w-[70px] h-[70px] p-0.5 rounded-full inset-1"></div>
            <Image
              src="/assets/images/logo.png"
              alt="Latrust Logo"
              width={100}
              height={100}
              className="mb-4 z-20 inset-0 absolute"
            />
          </div>
        </div>
        {/* <CardDescription> {dictionary.welcomelogin}</CardDescription> */}
      </CardHeader>
      <CardTitle className="text-xl px-6 text-primary">Connexion </CardTitle>
      <Form {...form}>
        <CardContent>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormFieldCustom
              placeholder={"Nom d'utilisateur "}
              form={form}
              icon={<User size={20} />}
              type="text"
              name="login"
            />
            <FormFieldCustom
              placeholder={"Mot de passe"}
              icon={<Lock size={20} />}
              form={form}
              name="mot2passe"
              type="password"
            />
            <div className="my-0.5">
              {"Mot de passe oublié"}
            </div>
            <div className="w-full">
              <Button type="submit" isLoader={isLoader} className=" w-full">
                {"Se connecter"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Form>
      <Toaster />
    </Card>
  );
}
