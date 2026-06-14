"use client";

import { useEffect, useState } from "react";
import { getSavedTools } from "@/lib/saved-tools";

export function SavedToolsCount() {
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(getSavedTools().length); }, []);
  return <>{count}</>;
}
