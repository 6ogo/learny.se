
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-learny-purple mb-6">404</h1>
        <p className="text-2xl font-medium text-gray-800 mb-4">Sidan hittades inte</p>
        <p className="text-lg text-gray-600 mb-8">
          Vi kunde inte hitta sidan du letade efter. Den kan ha flyttats eller tagits bort.
        </p>
        <Button asChild size="lg">
          <Link to="/" className="px-6">
            <Home className="mr-2 h-5 w-5" />
            Tillbaka till startsidan
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
