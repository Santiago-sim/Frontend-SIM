import { logoutAction } from "@/app/data/actions/auth-actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="cursor-pointer">
        <LogOut className="w-5 h-5 hover:text-blue-700" />
      </button>
    </form>
  );
}