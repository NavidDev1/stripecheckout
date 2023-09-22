import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Confirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4 animate-pulse">
        Thanx for youre purchase!
      </h1>
      <p className="text-xl mb-8">We hope you enjoy your purchase.</p>
      <div className="animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-20 w-20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <p className="mt-8 text-sm">Have a great day!</p>
    </div>
  );
}

export default Confirmation;
