"use client";
import { useState } from "react";
import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { countries } from "@/constants/countries";

export default function DashboardPage() {
  const [nationality, setNationality] = useState("México");
  const [membershipType, setMembershipType] = useState("cliente");
  const [receiveInfo, setReceiveInfo] = useState(true);

  return (
    <div className="flex-1 bg-white md:ml-6 shadow-sm">
      {/* Botón que redirige a /dashboard/account */}
      <Link href="/dashboard/account">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
          Ir a Mi Cuenta
        </button>
      </Link>
    </div>
  );
}