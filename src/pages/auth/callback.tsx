import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
      const {data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!session?.user) {
            console.error("세션에 사용자 정보가 없습니다.")
            return;
        }
        const user = session.user;
        if (!user.id) {
            console.error("USER ID정보가 없습니다.")
            return;
        }

        try{
            const {data: existing, error: selectError} = await supabase.from("user").select("*").eq("id", user.id).single();
            if (!existing) {
                const { error: insertError } = await supabase.from('user').insert([{ id:user.id, email: user.email, service_agree: true, privacy_agree: true, marketing_agree: false },]);
                if (insertError) {
                    console.error("USER 테이블에 삽입 중 에러가 발생했습니다");
                    return;
                }
            }
            setUser({id:user.id, email: user.email || "알수없는 사용자" , role: user.role || ""});
        } catch (error) {
            console.error(error);
            throw error;
        } 
        
      });

      // 언마운트 시 구독 해지
      return () => listener.subscription.unsubscribe();
  }, [])
  return (
    <>
        <div>.</div>
        <div>.</div>
        <div className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행중입니다.</div>
    </>
  )
}
