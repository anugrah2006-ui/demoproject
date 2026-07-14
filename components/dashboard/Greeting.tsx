import { User } from "@supabase/supabase-js";

interface GreetingProps {
  user: User | null;
}

export default function Greeting({ user }: GreetingProps) {
  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  
  return (
    <div className="text-center mt-0 mb-7">
      <h2 className="font-heading text-4xl md:text-5xl font-medium tracking-tight text-[#1D1D1F] mb-3">
        Good evening, {name}
      </h2>
      <p className="text-[#6E6E73] text-xl font-light">
        How can Belle help you today?
      </p>
    </div>
  );
}
