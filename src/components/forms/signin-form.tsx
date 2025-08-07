"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { loginUserAction } from "@/app/data/actions/auth-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from "@/components/custom/submit-button";
import  Virgula  from "@/components/ui/maya";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

export function SigninForm() {
  const [formState, formAction] = useActionState(
    loginUserAction,
    INITIAL_STATE
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-white pt-12">
      <section className="w-full py-24 h-screen">
        <h1 className="text-2xl text-gray-800 text-center mb-2">Acceder</h1>
        <Virgula />
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="identifier"
                  className="block text-left text-gray-600 text-sm font-semibold"
                >
                  Email:
                </Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email"
                />
                <ZodErrors error={formState?.zodErrors?.identifier} />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="block text-left text-gray-600 text-sm font-semibold"
                >
                  Contraseña:
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contraseña"
                />
                <ZodErrors error={formState?.zodErrors?.password} />
              </div>

              <div>
                <SubmitButton
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  text="Acceder"
                  loadingText="Cargando..."
                />
              </div>

              <StrapiErrors error={formState?.strapiErrors} />

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/signup"
                  className="block w-full text-center text-blue-500 border border-blue-500 rounded-md py-2 hover:bg-blue-50 transition-colors"
                >
                  Registrarse
                </Link>

                <Link
                  href="/retrieve-password"
                  className="block w-full text-center text-blue-500 hover:underline text-sm"
                >
                  ¿Olvidó la contraseña?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SigninForm;
