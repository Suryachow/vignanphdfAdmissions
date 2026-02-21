import { MessageSquare, Bell } from "lucide-react"

export default function Messages() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Messages</h1>
        <p className="text-slate-500 text-sm mt-1">Counsellor messages and system notifications.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Counsellor Messages</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 shadow-sm">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No messages yet.</p>
          <p className="text-sm mt-1">Your counsellor will appear here when assigned.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">System Notifications</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 shadow-sm">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No notifications.</p>
        </div>
      </section>
    </div>
  )
}
