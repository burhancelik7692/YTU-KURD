import * as React from "react"

export const useToast = () => {
  return {
    toast: ({ title, description }) => {
      console.log("Toast:", title, description);
      alert(`${title}\n${description}`); // Geçici olarak ekrana uyarı versin
    },
  };
};