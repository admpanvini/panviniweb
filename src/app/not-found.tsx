import { AlertCircle, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center mt-[15vh]">
      <AlertTriangle size={100} color={"var(--baseClara)"}></AlertTriangle>
      <h1 className="text-4xl font-bold text-[var(--baseOscura)]">404 - Page Not Found</h1>
      <p className="mt-2 text-lg text-[var(--baseClara)]">
        Sorry, the page you are looking for doesn’t exist.111
      </p>
    </div>
  );
}
