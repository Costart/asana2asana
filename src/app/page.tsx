import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <span className="text-xl font-bold text-gray-900">Asana2Asana</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-sm font-medium text-white mb-8">
            AI-powered task migration
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Move tasks between Asana boards with AI&nbsp;drafts
          </h1>
          <p className="mt-6 text-lg text-blue-100 max-w-2xl leading-relaxed">
            Pull tasks from one Asana project, let AI fill in the details and
            create polished drafts, then push them to another board for your
            team to review.
          </p>
          <div className="flex gap-4 mt-10">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
              >
                Start for free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 border"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <p className="text-sm font-semibold text-blue-600 text-center mb-2 uppercase tracking-wide">
          Simple workflow
        </p>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          How it works
        </h2>
        <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
          Three steps to move tasks between boards with AI-generated drafts your
          team can review.
        </p>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/25">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Connect your Asana
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Link your Asana account and choose a source board to pull tasks
              from.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/25">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI creates drafts
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI reads each task, fills in missing details, and generates
              complete drafts ready for review.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/25">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Push to destination
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Review the AI drafts, make any tweaks, and push them to your
              destination board in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-blue-600 text-center mb-2 uppercase tracking-wide">
            Features
          </p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Built for teams that move fast
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            Everything you need to migrate tasks between Asana projects
            efficiently.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
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
              <h3 className="font-semibold text-gray-900 mb-1">
                Board-to-board migration
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Select any two Asana projects and move tasks between them
                without manual copy-paste.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
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
              <h3 className="font-semibold text-gray-900 mb-1">
                AI-generated drafts
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                AI reads the context of each task and fills in descriptions,
                subtasks, and fields so nothing gets lost.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
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
              <h3 className="font-semibold text-gray-900 mb-1">
                Team review workflow
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Drafts land in a review queue so your team can approve, edit, or
                reject before anything goes live.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
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
              <h3 className="font-semibold text-gray-900 mb-1">
                Secure Asana OAuth
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We use Asana's official OAuth flow. Your credentials are never
                stored — just a secure token.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Stop copying tasks manually</h2>
          <p className="text-gray-400 leading-relaxed">
            Let AI do the heavy lifting. Connect your Asana account and start
            moving tasks in minutes.
          </p>
          <div className="pt-2">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-6 text-center text-sm text-gray-400">
        Asana2Asana
      </footer>
    </div>
  );
}
