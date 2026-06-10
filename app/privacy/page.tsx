import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — voteMe",
  description: "How voteMe collects and uses data, including TikTok OAuth.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-foreground">
      <Link
        href="/"
        className="text-sm text-violet-300 hover:underline"
      >
        ← Back to voteMe
      </Link>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 10, 2026</p>

      <div className="prose prose-invert mt-10 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          voteMe (&quot;we&quot;, &quot;us&quot;) is a competition management platform that
          helps organizations run social media engagement contests. This policy describes
          how we handle personal information when you use our website and services.
        </p>

        <section>
          <h2 className="text-lg font-medium text-foreground">Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Account details you provide (name, email, phone, profile information).</li>
            <li>Organization and competition data entered by admins.</li>
            <li>TikTok video URLs and public engagement metrics (views, likes, comments).</li>
            <li>
              If you connect TikTok via Login Kit: OAuth tokens and basic profile identifiers
              needed to sync your videos. We do not post on your behalf.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">How we use information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Operate competition dashboards, leaderboards, and candidate profiles.</li>
            <li>Sync video performance metrics for scoring and reporting.</li>
            <li>Authenticate users and secure access to organization workspaces.</li>
            <li>Improve reliability and support of the platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">TikTok data</h2>
          <p className="mt-3">
            When you authorize voteMe through TikTok, we receive access tokens and
            permitted API data according to the scopes you approve (such as basic profile
            information and video metrics). You may disconnect TikTok at any time from
            your dashboard, which removes stored tokens for your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Sharing</h2>
          <p className="mt-3">
            We do not sell personal data. Information is shared only with your organization&apos;s
            admins for competition purposes, with service providers that help us run the
            platform (hosting, storage), or when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Security & retention</h2>
          <p className="mt-3">
            We use industry-standard measures to protect data in transit and at rest.
            OAuth tokens are stored on our backend servers, not in the browser. We retain
            data while your account is active and as needed to operate competitions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Your rights</h2>
          <p className="mt-3">
            You may request access, correction, or deletion of your account data by
            contacting your competition organizer or voteMe support.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Contact</h2>
          <p className="mt-3">
            Questions about this policy: contact your organization administrator or the
            voteMe team through your competition organizer.
          </p>
        </section>
      </div>
    </div>
  );
}
