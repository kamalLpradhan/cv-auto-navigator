import { useState, useEffect } from "react";

const LiveApplicationCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Get initial count
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");
    setCount(applications.length);

    // Listen for updates
    const handleUpdate = () => {
      const apps = JSON.parse(localStorage.getItem("applications") || "[]");
      setCount(apps.length);
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("applicationAdded", handleUpdate);
    window.addEventListener("applicationsRefresh", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("applicationAdded", handleUpdate);
      window.removeEventListener("applicationsRefresh", handleUpdate);
    };
  }, []);

  return (
    <span>
      {count > 0 ? `${count} applications tracked` : "Start tracking applications"}
    </span>
  );
};

export default LiveApplicationCounter;
