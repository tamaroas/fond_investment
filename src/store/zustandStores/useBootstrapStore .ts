import { create } from "zustand";
import { persist } from "zustand/middleware";




type BootstrapStore = {
    bootstrap: BootstrapUserInfo | null;
    setBootstrap: (bootstrap: BootstrapUserInfo | null) => void;
    clearBootstrap: () => void;

}

const useBootstrapStore  = create<BootstrapStore>()(
    persist(
        (set) => ({
            bootstrap: null,
            setBootstrap: (bootstrap) => set({bootstrap}),
            clearBootstrap: () => set({bootstrap: null}),
        }),
        {
            name: 'bootstrap-store',
            getStorage: () => localStorage,
        }
    )
)

export { useBootstrapStore };