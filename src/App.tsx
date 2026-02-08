import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuizSetup from "./pages/QuizSetup";
import StudyMaterial from "./pages/StudyMaterial";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import CustomMode from "./pages/CustomMode";
import CustomQuiz from "./pages/CustomQuiz";
import CustomResults from "./pages/CustomResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/setup" element={<QuizSetup />} />
          <Route path="/study" element={<StudyMaterial />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/custom" element={<CustomMode />} />
          <Route path="/custom-quiz" element={<CustomQuiz />} />
          <Route path="/custom-results" element={<CustomResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
