import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'motion/react';

type TextShimmerProps = MotionProps & {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    duration?: number;
    spread?: number;
};

export function TextShimmer({
    children,
    as: Component = 'p',
    className,
    duration = 2,
    spread = 2,
    ...props
}: TextShimmerProps) {
    const MotionComponent = useMemo(() => motion(Component as React.ComponentType<any>), [Component]);

    return (
        <MotionComponent
            className={cn(
                'relative inline-block bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.8)_50%,transparent_75%)] bg-[length:250%_100%] bg-clip-text text-transparent',
                className
            )}
            initial={{ backgroundPosition: '100% center' }}
            animate={{ backgroundPosition: '0% center' }}
            transition={{
                repeat: Infinity,
                duration,
                ease: 'linear',
            }}
            {...props}
        >
            {children}
        </MotionComponent>
    );
}
