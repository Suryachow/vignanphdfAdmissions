import type { lazy, Suspense, Component } from "react"
import type { ReactNode } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "./contexts/AuthContext"
import { SnackbarProvider } from "./contexts/SnackbarContext"
import { StepProvider } from "./store/StepContext"
import { RouteGuard } from "./components/guards/RouteGuard"

// ─── Lazy-load heavy pages (code splitting → faster first paint) ──────────
const Registration = lazy(() => import("./pages/Registration").then(m => ({ default: m.Registration })))
const StudentLogin = lazy(() => import("./pages/StudentLogin").then(m => ({ default: m.StudentLogin })))
const ApplicationForm = lazy(() => import("./pages/ApplicationForm"))
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"))
const StudentProfile = lazy(() => import("./pages/StudentProfile"))
const Messages = lazy(() => import("./pages/Messages"))
const StudentLayout = lazy(() => import("./layouts/StudentLayout").then(m => ({ default: m.StudentLayout })))

// ─── Page-level loading spinner ──────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Loading…</p>
    </div>
  )
}

// ─── Error Boundary (catches render errors in production) ─────────────────
interface EBState { hasError: boolean; message: string }
class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: "" }
  }
  static getDerivedStateFromError(error: unknown): EBState {
    return { hasError: true, message: (error as Error)?.message ?? "Unknown error" }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">⚠️</div>
          <div className="text-center max-w-md">
            <h1 className="text-xl font-black text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-500 text-sm mb-6">
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Route guard for authenticated pages ─────────────────────────────────
function RequireAuth({ children }: { children: ReactNode }) {
  // Bypassed: always allow access
  return <>{children}</>
}

// ─── App ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SnackbarProvider>
            <StepProvider>
              {/* Toaster: stacked, top-right, rich colours */}
              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
                toastOptions={{ style: { fontFamily: "Inter, sans-serif" } }}
              />

              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public */}
                  <Route path="/register" element={<Registration />} />
                  <Route path="/login" element={<StudentLogin />} />

                  {/* Protected – inside shared layout */}
                  <Route element={
                    <Suspense fallback={<PageLoader />}>
                      <StudentLayout />
                    </Suspense>
                  }>
                    <Route path="/application" element={
                      <RouteGuard>
                        <Suspense fallback={<PageLoader />}>
                          <ApplicationForm onSubmit={() => { }} />
                        </Suspense>
                      </RouteGuard>
                    } />

                    <Route path="/dashboard" element={
                      <RequireAuth>
                        <Suspense fallback={<PageLoader />}>
                          <StudentDashboard />
                        </Suspense>
                      </RequireAuth>
                    } />

                    <Route path="/profile" element={
                      <RequireAuth>
                        <Suspense fallback={<PageLoader />}>
                          <StudentProfile />
                        </Suspense>
                      </RequireAuth>
                    } />

                    <Route path="/messages" element={
                      <RequireAuth>
                        <Suspense fallback={<PageLoader />}>
                          <Messages />
                        </Suspense>
                      </RequireAuth>
                    } />
                  </Route>

                  {/* Root fallback */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </StepProvider>
          </SnackbarProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
