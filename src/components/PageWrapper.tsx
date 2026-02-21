import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface PageWrapperProps {
    children: ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {children}
        </motion.div>
    )
}
