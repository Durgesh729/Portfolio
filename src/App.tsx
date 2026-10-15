import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import SmoothScroll from "@/components/SmoothScroll";
import { IdleProvider } from "@/hooks/useIdle";
import TargetCursor from "@/components/TargetCursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <IdleProvider timeout={5000}>
      <TooltipProvider>
        <TargetCursor
          spinDuration={3}
          hoverDuration={0.2}
          parallaxOn={true}
          cursorColor="#ffffff"
          cursorColorOnTarget="#B497CF"
        />
        <Toaster />
        <Sonner />
        <GlobalErrorBoundary>
          <SmoothScroll>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SmoothScroll>
      </GlobalErrorBoundary>
      </TooltipProvider>
    </IdleProvider>
  </QueryClientProvider>
);

export default App;
