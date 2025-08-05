import { LoadingSpinner } from "@/components/utils/Loader";

export default function CenteredSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size={40} className="text-gray-500" />
    </div>
  );
}
