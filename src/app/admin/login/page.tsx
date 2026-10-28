import AdminLogin from "../../../../components/Admin/AdminLogin";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <AdminLogin />
    </div>
  );
}
