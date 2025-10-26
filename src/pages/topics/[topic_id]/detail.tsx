import { AppEditor } from "@/components/common";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Separator } from "@/components/ui";
import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function TopicDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);

  const [author, setAuthor] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [catetory, setCatetory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [content, setContent] = useState<string>("");
  
  const fetchTopic = async () => {
      try{
        const { data: topic, error } = await supabase.from('topics').select("*").eq("id", id);
        if (error) {
            toast.error(error.message)
            return;
        }
        if (topic) {
            setAuthor(topic[0].author);
            setTitle(topic[0].title);
            setCatetory(topic[0].category);
            setThumbnail(topic[0].thumbnail);
            setContent(topic[0].content);
            console.log(JSON.parse(topic[0].content));
            
        }
      } catch(error){
        console.log(error);
        throw error;
      }
  }

  const handleDelete = async() => {
      try{
        const { error } = await supabase.from('topics').delete().eq('id', id);
        if (error) {
            toast.error(error.message)
            return;
        } 
        navigate("/");
        toast.success("토픽 삭제 성공!");
      } catch(error){
        console.log(error);
        throw error;
      }
  }

  useEffect(() => {
      fetchTopic();
  }, [id])

  return (
    <main className="w-full h-full min-h-[720px] flex flex-col">
        <div className="relative w-full h-50 sm:h-60 md:h-100 bg-cover bg-[50%_35%] bg-accent" style={{backgroundImage: `url(${thumbnail})`}}>
            {/* 뒤로가기 */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigate("/")}>
                    <ArrowLeft />
                </Button>
                {/* 토픽을 작성한 사람의 user id인 경우만 활성화 */}
                {author === user?.id && (
                    <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant="outline" size="icon" className="!bg-red-800/50">
                            <Trash2 className="text-red-500"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>해당 토픽 삭제 하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                            삭제하시면 해당 토픽의 모든 내용이 삭제 됩니다.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>닫기</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-8--50 text-foreground hover:bg-red-700/50" onClick={handleDelete}>삭제</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
            {/* 좌,우 하단 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>
        <section className="relative w-full flex flex-col items-center -mt-40">
            <span className="mb-4">{catetory}</span>
            {/* text-xl sm:text-2xl md:text-4xl */}
            {/* text-xl -> width가 640 보다 작을 경우 폰트 적용,  sm:text-2xl->640이상일경우 폰트 적용,  md:text-4xl->768이상일경우 폰트 적용*/}
            <h1 className="scroll-m-20 text-center font-extrabold tracking-tight text-xl sm:text-2xl md:text-4xl">{title}</h1>
            <Separator className="!w-6 my-4 bg-foreground" />
            <span>2025.10.25</span>
        </section>
        {/* 에디터 내용을 불러와 렌더링 */}
        <div className="w-full py-6">
            {content && <AppEditor props={JSON.parse(content)} readonly />}
        </div>
        
    </main>
  )
}