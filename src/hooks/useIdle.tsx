import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface IdleContextType {
    isIdle: boolean;
}

const IdleContext = createContext<IdleContextType>({ isIdle: false });

export const IdleProvider: React.FC<{ children: React.ReactNode; timeout?: number }> = ({ children, timeout = 5000 }) => {
    const [isIdle, setIsIdle] = useState(false);
    // Track current idle state in a ref so the event handler never reads stale closure state
    // and—critically—never calls setState unless the value is actually changing.
    const isIdleRef = useRef(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const scheduleIdle = () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                if (!isIdleRef.current) {
                    isIdleRef.current = true;
                    setIsIdle(true);          // only triggers a re-render ONCE when user goes idle
                }
            }, timeout);
        };

        const handleActivity = () => {
            // Only update React state when the value is actually changing (idle → active).
            // This prevents the cascading re-renders on every mousemove/scroll event.
            if (isIdleRef.current) {
                isIdleRef.current = false;
                setIsIdle(false);
            }
            scheduleIdle();
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

        // Start the idle timer immediately on mount
        scheduleIdle();

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
        <IdleContext.Provider value={{ isIdle }}>
            {children}
        </IdleContext.Provider>
    );
};

export const useIdle = () => useContext(IdleContext);
