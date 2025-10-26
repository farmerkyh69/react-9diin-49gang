import { AppEditor, AppFileUpload } from "@/components/common";
import { Button, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui";
import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import type { Block } from "@blocknote/core";
import { ArrowLeft, Asterisk, BookOpenCheck, ImageOff, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { TOPIC_STATUS } from "@/types/topic.type";

const TOPIC_CATEGORY = [
    { id: 1, label: "인문학", category: "humanity" },
    { id: 2, label: "스타트업", category: "start-up" },
    { id: 3, label: "IT·프로그래밍", category: "programming" },
    { id: 4, label: "서비스·전략 기획", category: "planning" },
    { id: 5, label: "마케팅", category: "marketing" },
    { id: 6, label: "디자인·일러스트", category: "design" },
    { id: 7, label: "자기계발", category: "self-development" },
];

export default function CreateTopic() {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTile] = useState<string>("");
  const [content, setContent] = useState<Block[]>([]);
  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);

  useEffect(() => {
      fetchTopic();
  }, [])

  const fetchTopic = async () => {
      try {
            const { data: topics, error } = await supabase.from('topics').select('*').eq('id', id);
            if (error) {
                toast.error(error.message)
                return;
            }
            console.log(topics)
            if (topics) {
                setTile(topics[0].title);
                setContent(JSON.parse(topics[0].content));
                setCategory(topics[0].category);
                setThumbnail(topics[0].thumbnail);
            }
      } catch (error) {
        console.log(error)
        throw error;
      }
  }


  const handleSave = async () => {
    if (!title && !content && !category && !thumbnail) {
        toast.warning("제목, 본문, 카테고리, 썸네일은 필수값 입니다.");
        return;
    }

    //1. 파일 업로드시, Supabase의 Storage 즉, bucket폴더에 이미지를 먼저 업로드 후
    //   이미지가 저장된 bucket폴더의 경로 url주소를 우리가관리하고 있는 Topic 테이블의 thumbnail 컬럼에 저장
    //   즉, string 타입 (DB에서는 Text타입)으로 저장
    // console.log(thumbnail)
    // return;
    let thumbnailUrl: string | null = null;
    if (thumbnail && thumbnail instanceof File) {
        //썸네일 이미지르르 storate에 업로드
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${nanoid()}.${fileExt}`;
        const filePath = `topics/${fileName}`;  //이때 topics는 supabase의 storage 폴더명
        // console.log('nanoid=', nanoid)
        // console.log('filePath=', filePath)
        // return;

        const {error: uploadError} = await supabase.storage.from("files").upload(filePath, thumbnail);
        if (uploadError) {
            throw uploadError;
        }

        //업로드된 이미지의 Public URL값 가져오기
        const {data} = supabase.storage.from("files").getPublicUrl(filePath);
        if (!data) {
            throw new Error("썸네일 Public URL조회를 실패하였습니다.");
        }
        thumbnailUrl = data.publicUrl;
    } else if (typeof thumbnail === "string") {
        //기존 이미지 유지
        thumbnailUrl = thumbnail;
    }

    const { data, error } = await supabase
      .from('topics')
      .update([{status:"temp", title, content:JSON.stringify(content), category, thumbnail:thumbnailUrl, author: user?.id },])
      .eq("id", id)
      .select();
    if (error) {
      toast.error(error.message)
      return;
    }
    if(data) {
        toast.success("토픽 저장 완료");
        return;
    }
  }

  //자료 저장 후 [발행]을 눌러야 외부에 공개 됨. status(상태) 컬럼을 이용
  const handlePublish = async () => {
   if (!title && !content && !category && !thumbnail) {
        toast.warning("제목, 본문, 카테고리, 썸네일은 필수값 입니다.");
        return;
    }

    //1. 파일 업로드시, Supabase의 Storage 즉, bucket폴더에 이미지를 먼저 업로드 후
    //   이미지가 저장된 bucket폴더의 경로 url주소를 우리가관리하고 있는 Topic 테이블의 thumbnail 컬럼에 저장
    //   즉, string 타입 (DB에서는 Text타입)으로 저장
    // console.log(thumbnail)
    // return;
    let thumbnailUrl: string | null = null;
    if (thumbnail && thumbnail instanceof File) {
        //썸네일 이미지르르 storate에 업로드
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${nanoid()}.${fileExt}`;
        const filePath = `topics/${fileName}`;  //이때 topics는 supabase의 storage 폴더명
        // console.log('nanoid=', nanoid)
        // console.log('filePath=', filePath)
        // return;

        const {error: uploadError} = await supabase.storage.from("files").upload(filePath, thumbnail);
        if (uploadError) {
            throw uploadError;
        }

        //업로드된 이미지의 Public URL값 가져오기
        const {data} = supabase.storage.from("files").getPublicUrl(filePath);
        if (!data) {
            throw new Error("썸네일 Public URL조회를 실패하였습니다.");
        }
        thumbnailUrl = data.publicUrl;
    } else if (typeof thumbnail === "string") {
        //기존 이미지 유지
        thumbnailUrl = thumbnail;
    }

    const { data, error } = await supabase
      .from('topics')
      .update([{status:TOPIC_STATUS.PUBLISH, title, content:JSON.stringify(content), category, thumbnail:thumbnailUrl, author: user?.id },])
      .eq("id", id)
      .select();
    if (error) {
      toast.error(error.message)
      return;
    }
    if(data) {
        toast.success("토픽을 발행하였습니다.");
        navigate("/");
        return;
    }
  }

  return (
    <main className="w-full h-full min-h-[1024px] flex gap-6 p-6">
        <div className="fixed right-1/2 bottom-10 translate-x-1/2 z-20 flex items-center gap-2">
            <Button variant={"outline"} size={"icon"} onClick={()=>navigate("/")}>
                <ArrowLeft  />
            </Button>
            <Button type="button" onClick={handleSave} variant={"outline"} className="w-22 !bg-yellow-800/50">
                <Save />저장
            </Button>
            <Button type="button" onClick={handlePublish} variant={"outline"} className="w-22 !bg-emerald-800/50">
                <BookOpenCheck />발행
            </Button>
        </div>

        {/* 토픽 작성하기 */}
        <section className="w-3/4 h-full flex flex-col gap-6">
            <div className="flex flex-col pb-6 border-b">
                <span className="text-[#F96859] font-semibold">Step 01</span>
                <span className="text-[#F96859] font-semibold">Step 01</span>
                <span className="text-base font-semibold">토픽 작성하기</span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <Asterisk size={14} className="text-[#F96859]" />
                    <Label className="text-muted-foreground">제목</Label>
                </div>
                <Input placeholder="토픽 제목을 입력" value={title} onChange={(e)=>setTile(e.target.value)} className="h-16 pl-6 !text-lg placeholder:text-lg placeholder:font-semibold border-0"/>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <Asterisk size={14} className="text-[#F96859]" />
                    <Label className="text-muted-foreground">본문</Label>
                </div>
                {/* Blocknote Text Editor UI */}
                <AppEditor props={content} setContent={setContent} />
            </div>
        </section>

        {/* 카테고리 및 썸네일 등록 */}
        <section className="w-1/4 h-full flex flex-col gap-6 p-6">
            <div className="flex flex-col pb-6 border-b">
                <span className="text-[#F96859] font-semibold">Step 02</span>
                <span className="text-[#F96859] font-semibold">Step 02</span>
                <span className="text-base font-semibold">카테고리 및 썸네일 등록</span>
            </div>        
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <Asterisk size={14} className="text-[#F96859]" />
                    <Label className="text-muted-foreground">카테고리</Label>
                </div>
                <Select value={category} onValueChange={(value)=>setCategory(value)} >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="토픽(주제)선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>카테고리(주제)</SelectLabel>
                        {TOPIC_CATEGORY.map((item) => {
                            return (
                                <SelectItem key={item.id} value={item.category}>{item.label}</SelectItem>
                            )
                        })}
                        
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <Asterisk size={14} className="text-[#F96859]" />
                    <Label className="text-muted-foreground">썸네일</Label>
                </div>
                {/* 썸네일 UI */}
                {/* <Skeleton className="w-full h-100" /> */}
                <AppFileUpload file={thumbnail} onChange={setThumbnail}  />
                <Button variant={"outline"} className="border-0" onClick={()=>setThumbnail(null)}>
                    <ImageOff />썸네일 제거
                </Button>
            </div>
        </section>
    </main>
  )
}
