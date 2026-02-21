import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

interface StepperProps {
    steps: string[]
    currentStep: number
    className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
    return (
        <div className={cn("flex items-center justify-between w-full", className)}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isActive = index === currentStep

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center relative z-10">
                            <div
                                className={cn(
                                    "h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                    isCompleted
                                        ? "bg-accent border-accent text-accent-foreground"
                                        : isActive
                                            ? "border-primary text-primary"
                                            : "border-muted text-muted-foreground bg-background"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-6 w-6" />
                                ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={cn(
                                    "absolute -bottom-8 whitespace-nowrap text-xs font-semibold uppercase tracking-wider",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-0.5 mx-4 transition-all duration-500",
                                    index < currentStep ? "bg-accent" : "bg-muted"
                                )}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
