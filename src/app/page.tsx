import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold">Asana2Asana</span>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
          AI-powered task migration
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
          Move tasks between Asana boards with AI drafts
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Pull tasks from one Asana project, let AI fill in the details and
          create polished drafts, then push them to another board for your team
          to review.
        </p>
        <div className="flex gap-4 mt-8">
          <Link href="/signup">
            <Button size="lg">Start for free</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
              1
            </div>
            <h3 className="text-lg font-semibold">Connect your Asana</h3>
            <p className="text-sm text-gray-600">
              Link your Asana account and choose a source board to pull tasks
              from.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
              2
            </div>
            <h3 className="text-lg font-semibold">AI creates drafts</h3>
            <p className="text-sm text-gray-600">
              AI reads each task, fills in missing details, and generates
              complete drafts ready for review.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
              3
            </div>
            <h3 className="text-lg font-semibold">Push to destination</h3>
            <p className="text-sm text-gray-600">
              Review the AI drafts, make any tweaks, and push them to your
              destination board in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for teams that move fast
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-2">Board-to-board migration</h3>
              <p className="text-sm text-gray-600">
                Select any two Asana projects and move tasks between them
                without manual copy-paste.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-2">AI-generated drafts</h3>
              <p className="text-sm text-gray-600">
                AI reads the context of each task and fills in descriptions,
                subtasks, and fields so nothing gets lost.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-2">Team review workflow</h3>
              <p className="text-sm text-gray-600">
                Drafts land in a review queue so your team can approve, edit, or
                reject before anything goes live.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-2">Secure Asana OAuth</h3>
              <p className="text-sm text-gray-600">
                We use Asana's official OAuth flow. Your credentials are never
                stored — just a secure token.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Stop copying tasks manually</h2>
          <p className="text-gray-600">
            Let AI do the heavy lifting. Connect your Asana account and start
            moving tasks in minutes.
          </p>
          <Link href="/signup">
            <Button size="lg">Get started</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-6 text-center text-sm text-gray-500">
        Asana2Asana
      </footer>
    </div>
  );
}
