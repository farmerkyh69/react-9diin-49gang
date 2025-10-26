import supabase from "@/lib/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// const useStore = create((set) => ({
//     bears: 0,
//     increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//     removeAllBears: () => set({ bears: 0 }),
//     updateBears: (newBears) => set({ bears: newBears }),
// }));

interface User {
    id: string;
    email: string;
    role: string; 
}

interface AuthStore {
    user: User | null;
    setUser: (newUser: User | null) => void;
    reset: () => Promise<void>;  //Promise<void> : 비동기 타입
    // id: string;
    // email: string;
    // role: string;
    // setId: (id:string) => void;
    // setEmail: (id:string) => void;
    // setRole: (id:string) => void;
}

// export const useAuthStore = create<AuthStore>((set) => ({
//     id: "",
//     email: "",
//     role: "",
//     setId: (newId) => set({ id:newId }),
//     setEmail: (email) => set({ email }),
//     setRole: (role) => set({ role }),
//     reset: () => set({ id: "", email: "", role: "" }),
// }));

//persist를 이용해서 localstorage를 사용
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (newUser: User | null) => set({ user: newUser }),
            // 로그아웃 (상태 + Supabasse 세션 모두 제거)
            reset: async () => {
                await supabase.auth.signOut();

                // set({user:{ id: "", email: "", role: "" }}),
                // Zustand상태 초기화
                set({ user: null });
                localStorage.removeItem("auth-storage") 
            },
        }),
        // 내가 저장할값은 user만 담겠다는 뜻
        // user만 저아
        { name:"auth-storage", partialize: (state) => ({ user: state.user }) },
)
);