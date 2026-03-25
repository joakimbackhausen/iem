import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Machines from "@/pages/Machines";
import MachineDetail from "@/pages/MachineDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/maskiner/:kategori?" component={Machines} />
      <Route path="/maskine/:id" component={MachineDetail} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
