import { ViaziCustomer } from "@/utils/type/otherType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
    user: ViaziCustomer | null;
    setUser: (user: ViaziCustomer | null) => void;
    clearUser: () => void;
}

const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'user-store',
            getStorage: () => localStorage,
        })
)

export { useUserStore };