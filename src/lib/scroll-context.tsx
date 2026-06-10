"use client";

import { createContext, useContext } from "react";

export const ScrollReadyContext = createContext(false);

export function useScrollReady() {
  return useContext(ScrollReadyContext);
}
