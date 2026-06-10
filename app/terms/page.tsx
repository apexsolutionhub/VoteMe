import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — voteMe",
  description: "Terms for using the voteMe competition platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-foreground">
      <Link
        href="/"
        className="text-sm text-violet-300 hover:underline"
      >
        ← Back to voteMe
      </Link>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 10, 2026</p>

      <div className="prose prose-invert mt-10 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          These Terms govern your use of voteMe (&quot;the Service&quot;), a platform for
          running social media engagement competitions. By creating an account or using
          the Service, you agree to these Terms.
        </p>

        <section>
          <h2 className="text-lg font-medium text-foreground">Eligibility</h2>
          <p className="mt-3">
            You must be invited or authorized by an organization administrator to use
            voteMe. You are responsible for keeping your login credentials secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Competition rules</h2>
          <p className="mt-3">
            Each organization may set competition-specific rules. Candidates must submit
            eligible content and comply with platform policies (including TikTok&apos;s
            terms) and applicable laws. Organizers are responsible for communicating
            official competition rules to participants.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">TikTok connection</h2>
          <p className="mt-3">
            Connecting a TikTok account is optional but may be required to sync certain
            metrics. You grant voteMe permission to access TikTok data only for the
            scopes you approve during OAuth. You may disconnect at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Acceptable use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Do not attempt to manipulate metrics, scores, or leaderboard results.</li>
            <li>Do not upload malicious content or interfere with the Service.</li>
            <li>Do not misuse other users&apos; or organizations&apos; data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Disclaimer</h2>
          <p className="mt-3">
            The Service is provided &quot;as is&quot;. We strive for accurate metric sync but
            do not guarantee uninterrupted access or error-free third-party API data
            (including TikTok).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Termination</h2>
          <p className="mt-3">
            Organizations or voteMe may suspend or terminate access for violations of
            these Terms or for operational reasons. You may stop using the Service at
            any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Contact</h2>
          <p className="mt-3">
            For questions about these Terms, contact your organization administrator or
            the voteMe team through your competition organizer.
          </p>
        </section>
      </div>
    </div>
  );
}
