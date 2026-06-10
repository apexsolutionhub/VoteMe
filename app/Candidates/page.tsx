import { AuthShell } from "@/components/auth/auth-shell";
import { PortalLogin } from "@/components/auth/portal-login";

export default function CandidatesPage() {
  return (
    <AuthShell
      accent="violet"
      badge="Candidate portal"
      title={
        <>
          Grow your reach,{" "}
          <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            win on engagement
          </span>
        </>
      }
      description="Sign in to manage your candidate profile, track views, likes, and comments, and climb the engagement leaderboard."
      features={[
        { label: "Profile management", icon: "megaphone" },
        { label: "Audience insights", icon: "users" },
        { label: "Live engagement stats", icon: "bar-chart" },
      ]}
    >
      <PortalLogin
        role="candidate"
        accent="violet"
        icon="megaphone"
        title="Candidate sign in"
        description="Access your dashboard and engagement metrics"
        footer="Your profile data is secure."
        footerHighlight="Only you can manage your account."
      />
    </AuthShell>
  );
}
