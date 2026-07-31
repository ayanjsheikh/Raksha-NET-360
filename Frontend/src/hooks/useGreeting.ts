import { useMemo } from "react";

export function useGreeting(name?: string) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let period: string;
    if (hour < 12) period = "Good Morning";
    else if (hour < 17) period = "Good Afternoon";
    else period = "Good Evening";
    return name ? `${period}, ${name}` : period;
  }, [name]);

  return greeting;
}
