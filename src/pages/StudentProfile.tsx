import { User, Mail, Phone } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function StudentProfile() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Personal details and contact information.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Personal Details</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Name</p>
              <p className="font-semibold text-slate-900">{user?.name ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email</p>
              <p className="font-medium text-slate-900">{user?.email ?? "—"}</p>
            </div>
          </div>
          {user?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Phone</p>
                <p className="font-medium text-slate-900">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Contact Information</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm">Update contact details from the application form or contact support.</p>
        </div>
      </section>
    </div>
  )
}
