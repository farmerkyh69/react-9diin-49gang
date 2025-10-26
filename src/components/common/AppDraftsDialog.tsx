import {
    Badge,
    Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "@/components/ui";
import dayjs from "dayjs";
import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TOPIC_STATUS, type Topic } from "@/types/topic.type";
import { useNavigate } from "react-router";

interface Props {
    children: React.ReactNode;    
}

export function AppDraftsDialog({children}: Props) {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState<any[]>([]);

    const fetchDrafts = async () => {
        if (!user) return;
        try{
            const { data: topic, error } = await supabase.from('topics').select("*").eq('author', user?.id).eq("status", TOPIC_STATUS.TEMP);
            if (error) {
                toast.error(error?.message)
                return;
            }
            if (topic) {
                setDrafts(topic)
                //console.log(topic)
            }
        } catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if (user) fetchDrafts();
    }, [])
  return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>임시 저장된 토픽</DialogTitle>
                <DialogDescription>
                    임시저장된 토픽 목록. 이어서 작성하거나 삭제할 수 있습니다.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    <div className="flex items-center gap-2">
                        <p>임시 저장</p>
                        <p className="text-green-600 -mr-[6px]">{drafts.length}</p>
                        <p>건</p>
                    </div>
                    <Separator />
                    {drafts.length > 0 ? (
                        <div className="min-h-60 h-60 flex flex-col items-center justify-start gap-3 overflow-y-scroll">
                        {
                            drafts.map((draft: Topic, index:number) => {
                                return (
                                        <div className="w-full flex items-center justify-between py-2 px-4 gap-4 rounded-md gb-card/50 cursor-pointer" onClick={() => navigate(`/topics/${draft.id}/create`)}>
                                            <div className="flex items-start gap-2">
                                                <Badge className="w-5 h-5 mt-[3px] rounded-sm aspect-square text-foreground bg-[#E26F24] hover:bg-[#e26f24]">{index+1}</Badge>
                                                <div className="flex flex-col">
                                                    <p className="line-clamp-1" >{draft.title}</p>
                                                    <p className="text-xs text-muted-foreground">생성일: {dayjs(draft.create_at).format("YYYY-MM-DD")}</p>
                                                </div>
                                            </div>
                                            <Badge variant={"outline"}>작성중</Badge>
                                        </div>
                                    );
                                })                            
                            }
                        </div>
                        ) 
                        :
                        (
                         <div className="min-h-60 flex items-center justify-center">
                                <p className="text-muted-foreground/50">조회가능한 정보가 없습니다.</p>
                         </div>
                        )  
                    }
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={"outline"}>닫기</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
  )
}
