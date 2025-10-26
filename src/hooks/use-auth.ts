// desc : 모든 인증 상태를 자동으로 감지하는 컴포넌트
//        로그인 뿐만 아니라, 자동 로그아웃등이 되었을 경우에도 자동 감지

import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";

export default function useAuthListener() {
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(()=>{
        const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            setUser({id: session.user.id, email: session.user.email as string , role: session.user.role as string});
        }
        }
        checkSession();        

        // 실시간 상태 변화 감지
        const {data: listener} = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser({id: session.user.id, email: session.user.email as string , role: session.user.role as string});
            } else {
                setUser(null);
            }
        });

        return () => listener.subscription.unsubscribe();
    });
} 