import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface IdleContextType {
    isIdle: boolean;
    lastActivityTime: number;
}

const IdleContext = createContext<IdleContextType>({ isIdle: false, lastActivityTime: Date.now() });

export const IdleProvider: React.FC<{ children: React.ReactNode; timeout?: number }> = ({ children, timeout = 5000 }) => {
    const [isIdle, setIsIdle] = useState(false);
    const [lastActivityTime, setLastActivityTime] = useState(Date.now());
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handleActivity = () => {
            setLastActivityTime(Date.now());
            setIsIdle(false);

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(() => {
                setIsIdle(true);
            }, timeout);
        };

        const events = [
            'mousemove',
            'pointermove',
            'scroll',
            'wheel',
            'keydown',
            'touchstart',
            'touchmove',
            'visibilitychange'
        ];

        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        // Initialize idle timer on mount
        timeoutRef.current = window.setTimeout(() => {
            setIsIdle(true);
        }, timeout);

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [timeout]);

    return (
        <IdleContext.Provider value={{ isIdle, lastActivityTime }}>
            {children}
        </IdleContext.Provider>
    );
};

export const useIdle = () => useContext(IdleContext);
