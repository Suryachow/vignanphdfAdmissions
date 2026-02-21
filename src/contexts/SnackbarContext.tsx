import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface SnackbarContextType {
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const showError = (message: string) => {
        alert(`Error: ${message}`);
        // In a real app, use a toast/snackbar library here
    };

    const showSuccess = (message: string) => {
        alert(`Success: ${message}`);
        // In a real app, use a toast/snackbar library here
    };

    return (
        <SnackbarContext.Provider value={{ showError, showSuccess }}>
            {children}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
