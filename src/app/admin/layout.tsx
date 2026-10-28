import { AdminAuthProvider } from "../../../components/Admin/AdminAuthContext";
import AdminGuard from "../../../components/Admin/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminAuthProvider>
  );
}
