"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  registerUserService,
  loginUserService,
} from "@/app/data/services/auth-service";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  ...(process.env.NODE_ENV === "development"
    ? {}
    : { domain: process.env.HOST?.replace(/^https?:\/\//, "") }),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "El nombre de usuario debe tener entre 3 y 20 caracteres",
  }),
  password: z.string().min(6).max(100, {
    message: "La contraseña debe tener entre 6 y 100 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce una dirección de correo electrónico válida",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Campos faltantes. Error en el registro.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "¡Ups! Algo salió mal. Inténtalo de nuevo.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  redirect("/dashboard/account");
}

const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "El identificador debe tener al menos 3 o más caracteres",
    })
    .max(25, {
      message:
        "Por favor, introduzca un nombre de usuario o una dirección de correo electrónico válidos",
    }),
  password: z
    .string()
    .min(6, {
      message: "La contraseña debe tener al menos 6 o más caracteres",
    })
    .max(100, {
      message: "La contraseña debe tener entre 6 y 100 caracteres.",
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Campos faltantes. Error al iniciar sesión.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Error al iniciar sesión.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  redirect("/dashboard/account");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}
