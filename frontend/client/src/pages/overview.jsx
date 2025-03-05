import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Overview() {
  const user = useSelector((state) => state.auth.user);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date();
    const hours = date.getHours();

    // Determine the appropriate greeting based on the time of day
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    console.log(`Time Zone: ${timeZone}`); // To confirm the user's time zone
  }, []);

  return (
    <div>
      <div className="p-4 text-lg bg-white dark:bg-darkCard shadow-sm rounded-md">
        {greeting}, {user?.username}!
      </div>
      {/* <DashboardAnalytics /> */}
    </div>
  );
}
