import { AuthShell } from "@/components/auth/auth-shell";
import { PortalLogin } from "@/components/auth/portal-login";

export default function AdminPage() {
  return (
    <AuthShell
      accent="amber"
      badge="Admin portal"
      title={
        <>
          Run the competition,{" "}
          <span className="bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            with full control
          </span>
        </>
      }
      description="Sign in to manage candidates, monitor engagement metrics, and configure competition settings."
      features={[
        { label: "Competition management", icon: "layout-dashboard" },
        { label: "Candidate oversight", icon: "users" },
        { label: "Platform settings", icon: "settings" },
      ]}
    >
      <PortalLogin
        role="admin"
        accent="amber"
        icon="layout-dashboard"
        title="Admin sign in"
        description="Access the management dashboard"
        footer="Restricted to authorized personnel."
        footerHighlight="All actions are logged."
      />
    </AuthShell>
  );
}
