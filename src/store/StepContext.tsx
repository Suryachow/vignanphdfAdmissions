import React, { createContext, useContext, useState, useEffect } from 'react'

export type StepStatus = 'locked' | 'current' | 'completed'

interface StepState {
    registration: StepStatus
    login: StepStatus
    otpVerified: boolean
    payment: StepStatus | 'failed' | 'pending' | 'success'
    application: StepStatus
}

interface StepContextType {
    steps: StepState
    setOtpVerified: (val: boolean) => void
    setPaymentStatus: (status: 'failed' | 'pending' | 'success') => void
    completeRegistration: () => void
    completeLogin: () => void
    completeApplication: () => void
    canAccess: (route: string) => boolean
    logout: () => void
}

const StepContext = createContext<StepContextType | undefined>(undefined)

const defaultSteps: StepState = {
    registration: 'current',
    login: 'locked',
    otpVerified: false,
    payment: 'locked',
    application: 'locked',
}

export const StepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [steps, setSteps] = useState<StepState>(() => {
        try {
            const saved = localStorage.getItem('vignan_student_steps')
            if (saved) {
                const parsed = JSON.parse(saved)
                // Ensure login exists for backwards compatibility
                if (parsed.login === undefined) parsed.login = parsed.registration === 'completed' ? 'current' : 'locked'
                return parsed
            }
        } catch {
            /* ignore */
        }
        return defaultSteps
    })

    useEffect(() => {
        localStorage.setItem('vignan_student_steps', JSON.stringify(steps))
    }, [steps])

    const setOtpVerified = (val: boolean) => {
        setSteps(prev => ({ ...prev, otpVerified: val }))
    }

    const setPaymentStatus = (status: 'failed' | 'pending' | 'success') => {
        setSteps(prev => ({
            ...prev,
            payment: status,
            application: status === 'success' || status === 'failed' ? 'current' : 'locked',
        }))
    }

    const completeRegistration = () => {
        setSteps(prev => ({ ...prev, registration: 'completed', login: 'current' }))
    }

    const completeLogin = () => {
        setSteps(prev => ({ ...prev, login: 'completed', payment: 'current' }))
    }

    const completeApplication = () => {
        setSteps(prev => ({ ...prev, application: 'completed' }))
    }

    const logout = () => {
        setSteps({ ...defaultSteps })
        localStorage.removeItem('vignan_student_steps')
    }

    const canAccess = (_route: string) => {
        // Bypassed: always allow access
        return true
    }

    return (
        <StepContext.Provider
            value={{
                steps,
                setOtpVerified,
                setPaymentStatus,
                completeRegistration,
                completeLogin,
                completeApplication,
                canAccess,
                logout,
            }}
        >
            {children}
        </StepContext.Provider>
    )
}

export const useSteps = () => {
    const context = useContext(StepContext)
    if (!context) throw new Error('useSteps must be used within a StepProvider')
    return context
}
