import React, { Component, ErrorInfo, ReactNode } from "react";
import FuzzyText from "./FuzzyText";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
                    <FuzzyText
                        baseIntensity={0.2}
                        hoverIntensity={0.5}
                        enableHover={true}
                    >
                        ERROR
                    </FuzzyText>
                    <p className="mt-8 text-lg text-muted-foreground text-center max-w-md">
                        Something went wrong. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
