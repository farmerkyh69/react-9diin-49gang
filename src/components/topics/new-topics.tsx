import { CaseSensitive } from "lucide-react";
import { Card, Separator } from "../ui";
import type { Topic } from "@/types/topic.type";
import dayjs from "dayjs";
import relativeTime from "dayjs"
import { useNavigate } from "react-router";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface Props {
    props: Topic;
}

function extractTextFromContent(content:string|any[], maxChars=200) {
    try{
        const parsed = typeof content === "string" ? JSON.parse(content) : content;
        if (!Array.isArray(parsed)) {
            console.warn("content데이터 타입이 배열이 아닙니다.");
            return "";
        }
        let result = ""
        for(const block of parsed) {
            if (Array.isArray(block.content)) { 
                for(const child of block.content) {
                    if (child?.text) {
                        result += child.text + " ";
                        if (result.length >= maxChars) {
                            return result.slice(0, maxChars) + "...";
                        };
                    }
                }
            }
        }
        return result.trim();

        
    } catch(error){
        console.log("콘텐츠 파일실패:", error);
    }
}

// findUserById를 return 문장안의 tag들 사이에 넣을 수 없다. 이유는 async 함수이기 때문
//   그래서 아래쪽에서 useEffect 를 하나 만들어서 호출처리 하고 있다.
async function findUserById(id:string) {
    try {
        const { data: user, error } = await supabase.from('user').select("*").eq("id", id)
        if (error) {
            toast.error(error.message);
            return;
        }
        if (user && user.length > 0) {
            return user[0].email.split("@")[0] + "님";
        } else {
            return "알수 없는 사용자";
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function NewTopicCard({props}: Props) {
    const navigate = useNavigate();
    //const [email, setEmail] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");

    useEffect(() => {
        async function fetchAuthEmail() {
            const nickname =await findUserById(props.author);
            setNickname(nickname || "알 수 없는 사용자");
        }
        fetchAuthEmail();
    }, []);

  return (
    <Card className="w-full h-fit p-4 gap-4 !cursor-pointer" onClick={() => navigate(`/topics/${props.id}/detail`)}>
        <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col items-start gap-4">
                {/* 썸네일과 제목 */}
                <h3 className="h-16 text-base font-semibold tracking-tight line-clamp-2">
                    <CaseSensitive size={16} className="text-muted-foreground" />
                    <p>{props.title}</p>
                </h3>
                {/* 본문 */}
                <p className="line-clamp-3 text-muted-foreground">{extractTextFromContent(props.content)}</p>
                <p></p>
            </div>
            <img src={props.thumbnail} alt="@THUMBNAIL" className="w-[140px] h-[140px] aspect-square rounded-lg object-cover" />
        </div>
        <Separator />
        <div className="w-full flex items-center justify-between">
            <p>{nickname}</p>
            <p>{dayjs(props.create_at).format("YYYY-MM-DD")}</p>
            {/* <p>{dayjs(props.create_at).format("YYYY-MM-DD")}({dayjs(props.create_at).fromNow()})</p> */}
        </div>
    </Card>
  )
}