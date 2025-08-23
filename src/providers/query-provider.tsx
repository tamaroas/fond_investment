
"use client";
import * as React from "react";
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

  interface QueryProviderProps {
    children: React.ReactNode
  }
export function QueryProvider({ children, ...props }: QueryProviderProps) {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )
}
