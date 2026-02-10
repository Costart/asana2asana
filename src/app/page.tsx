import Link from "next/link";

export default function Home() {
  const btnBase =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 active:scale-[0.98]";
  const btnFilled =
    "bg-primary text-on-primary hover:bg-primary-hover shadow-elevation-1 hover:shadow-elevation-2";
  const btnSm = "h-9 px-3 text-sm";
  const btnLg = "h-11 px-8";

  return (
    <div className="min-h-screen bg-white text-on-surface">
      {/* Nav */}
      <nav className="border-b border-outline-variant/30 bg-white">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display rounded-lg bg-primary px-2.5 py-1 text-sm font-extrabold tracking-wide text-on-primary shadow-lg shadow-primary/20">
              A2A
            </span>
            <span className="font-display text-xl font-extrabold text-on-surface">
              Asana2Asana
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`${btnBase} text-primary hover:bg-primary/5 ${btnSm}`}
            >
              Sign In
            </Link>
            <Link href="/signup" className={`${btnBase} ${btnFilled} ${btnSm}`}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-sm font-medium text-white mb-8">
            AI-powered task migration
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Move tasks between Asana boards with AI&nbsp;drafts
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
            Pull tasks from one Asana project, let AI fill in the details and
            create polished drafts, then push them to another board for your
            team to review.
          </p>
          <div className="flex gap-4 mt-10">
            <Link
              href="/signup"
              className={`${btnBase} ${btnLg} bg-white text-primary hover:bg-white/90 font-semibold shadow-elevation-2`}
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className={`${btnBase} ${btnLg} border-white/30 bg-transparent text-white hover:bg-white/10 border`}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <p className="text-sm font-semibold text-primary text-center mb-2 uppercase tracking-wide">
          Simple workflow
        </p>
        <h2 className="font-display text-3xl font-extrabold text-center text-on-surface mb-4">
          How it works
        </h2>
        <p className="text-center text-on-surface-variant mb-14 max-w-xl mx-auto">
          Three steps to move tasks between boards with AI-generated drafts your
          team can review.
        </p>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary font-bold text-lg shadow-lg shadow-primary/25">
              1
            </div>
            <h3 className="text-lg font-semibold text-on-surface">
              Connect your Asana
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Link your Asana account and choose a source board to pull tasks
              from.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary font-bold text-lg shadow-lg shadow-primary/25">
              2
            </div>
            <h3 className="text-lg font-semibold text-on-surface">
              AI creates drafts
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              AI reads each task, fills in missing details, and generates
              complete drafts ready for review.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary font-bold text-lg shadow-lg shadow-primary/25">
              3
            </div>
            <h3 className="text-lg font-semibold text-on-surface">
              Push to destination
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Review the AI drafts, make any tweaks, and push them to your
              destination board in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-surface-container border-y border-outline-variant/30">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-primary text-center mb-2 uppercase tracking-wide">
            Features
          </p>
          <h2 className="font-display text-3xl font-extrabold text-center text-on-surface mb-4">
            Built for teams that move fast
          </h2>
          <p className="text-center text-on-surface-variant mb-14 max-w-xl mx-auto">
            Everything you need to migrate tasks between Asana projects
            efficiently.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-outline-variant/50 bg-white p-6 shadow-elevation-1 transition-all duration-200 hover:shadow-elevation-2 hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container mb-4">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-on-surface mb-1">
                Board-to-board migration
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Select any two Asana projects and move tasks between them
                without manual copy-paste.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant/50 bg-white p-6 shadow-elevation-1 transition-all duration-200 hover:shadow-elevation-2 hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container mb-4">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-on-surface mb-1">
                AI-generated drafts
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                AI reads the context of each task and fills in descriptions,
                subtasks, and fields so nothing gets lost.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant/50 bg-white p-6 shadow-elevation-1 transition-all duration-200 hover:shadow-elevation-2 hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container mb-4">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-on-surface mb-1">
                Team review workflow
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Drafts land in a review queue so your team can approve, edit, or
                reject before anything goes live.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant/50 bg-white p-6 shadow-elevation-1 transition-all duration-200 hover:shadow-elevation-2 hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container mb-4">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-on-surface mb-1">
                Secure Asana OAuth
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We use Asana's official OAuth flow. Your credentials are never
                stored — just a secure token.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-inverse-surface text-inverse-on-surface">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl font-extrabold">
            Stop copying tasks manually
          </h2>
          <p className="text-inverse-on-surface/60 leading-relaxed">
            Let AI do the heavy lifting. Connect your Asana account and start
            moving tasks in minutes.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className={`${btnBase} ${btnLg} bg-primary text-on-primary hover:bg-primary-hover font-semibold shadow-elevation-2`}
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant/30 bg-white px-6 py-6 text-center text-sm text-on-surface-variant">
        Asana2Asana
      </footer>
    </div>
  );
}
