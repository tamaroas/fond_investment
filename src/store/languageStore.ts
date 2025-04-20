import { create } from "zustand";

interface LanguageStore {
    language: string;
    setLanguage: (lang: string) => void;
}

const useLanguageStore = create<LanguageStore>((set) => ({
    language: "fr",
    setLanguage: (lang) => set({language: lang}),
}));

export default useLanguageStore;