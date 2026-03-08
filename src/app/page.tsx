import HomePage from "@/app/components/Home";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
