import { CircleSmall, NotebookPen, PencilLine } from "lucide-react"
import { AppDraftsDialog, AppSidebar } from "../components/common"
import { SkeletonTopic } from "../components/sekeleton"
import { Button } from "../components/ui"
import { useNavigate, useSearchParams } from "react-router"
import { useAuthStore } from "@/stores"
import { toast } from "sonner"
import supabase from "@/lib/supabase"
import { useEffect, useState } from "react"
import { TOPIC_STATUS, type Topic } from "@/types/topic.type"
import { NewTopicCard } from "@/components/topics"

function App() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchParam, setSearchParam] = useSearchParams("");
  const category = searchParam.get("category") || "";  //null : 전체
  const handleCategoryChange = (value: string) => {
    if (value === category) { return;  } //선택된 항목 재선택 시 무시
    if (value === "") {
      setSearchParam({ });
    } else {
      setSearchParam({ category: value }); 
    }
  };
  // const { topicId } = useParams();

  // 발행된 토픽 조회
  const fetchTopics = async () => {
    try {
      const query = supabase.from('topics').select('*').eq("status", TOPIC_STATUS.PUBLISH);
      if (category && category.trim() !== "") {
        query.eq("category", category);
      }
      const { data: topics, error } = await query;
      if (error)  {
        toast.error(error.message);
        return;
      }
      console.log(topics)
      if (topics) {
        setTopics(topics);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  useEffect(() => {
    fetchTopics();
  }, [category]);

  // 나만의 토픽생성 버튼 클릭
  const handleRoute = async() => {
    if (!user) {
      toast.warning("토픽 작성은 로그인 후 가능합니다.");
      return;
    }

    //임시로 null값으로 insert. 차후 [저장]버튼 클릭 시 update로 처리
    const { data, error } = await supabase
      .from('topics')
      .insert([
        { status:null, title:null, content:null, category: null, thumbnail: null, author: user.id },
      ])
      .select();
    if (error) {
      toast.error(error.message)
      return;
    }
    
    //console.log(user.id);
    console.log('id=', data[0].id);
    if (data) {
      toast.success("토픽 생성 완료");
      navigate(`/topics/${data[0].id}/create`)
    }
  };

  return (
    <main className="w-full h-full min-h-[720px] flex p-6 gap6">
      <div className="fixed right-1/2 bottom-10 translate-x-1/2 z-20 flex items-center gap-10">
        <Button variant={"destructive"} className="!py-5 !px-6 rounded-full" onClick={handleRoute}>
          <PencilLine />나만의 토픽작성
        </Button>
        {/* 아래처럼 하면 AppDraftsDialog컴포넌트에서 children으로 받을 수 있다 */}
        {/* <AppDraftsDialog children={<div>...</div>}> 이렇게 하지 않아도 된다 */}
        <AppDraftsDialog>
          <div>
            <Button variant={"outline"} className="rounded-full w-10 h-10">
              <NotebookPen />
            </Button>
            <CircleSmall size={14} className="absolute top-0 right-0 text-red-500" fill="#EF4444" />
          </div>
        </AppDraftsDialog>
      </div>
      {/* 카테고리 사이드바 */}
      {/* 반응형앱 : 전체화면이 작아지면 사이드바 히든처리 */}
      <div className="hidden lg:block lg:min-w-60 lg:w-60 lg:h-full">
        <AppSidebar category={ category } setCategory={handleCategoryChange}/>
      </div>
      {/* 토픽 콘텐트 */}
      {/* flex-1 : AppSidebar영역을 제외한 남은 영역이 할당됨 */}
      <section className="w-full lg:w-[calc(100%-264px)] flex flex-col gap-12">
        {/* 핫 토픽 */}
        <div className="w-full flex flex-col gap-6">
          <div className="flax flex-col gap-1">
            <div className="flex items-center gap-2">
              <img src="/assets/fire.gif" alt="@IMG" className="w-17 h-17" />
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tighter">HOT 토픽</h4>
            </div>
            <p className="md:text-base text-muted-foreground">지금 가장 주목받는 주제들을 살펴보고, 다양한 관점의 인사이트를 얻어 보세요</p>
          </div>
          {/* grid-cols-4 : Grid columns형식으로 4개 영역을 잡는다. */}

          {/* 기본형 : 화면 width가 줄어들면 SkeletonTopic 들이 서로 겹처져 보임
          <div className="grid grid-cols-4 gap-6"> */}
          {/* 반응형웹 : 화면 width가 줄어들어도 width가 줄어들지 않음 */}
          <div className="w-full flex items-centergrid gap-6 overflow-auto">
            <SkeletonTopic />
            <SkeletonTopic />
            <SkeletonTopic />
            <SkeletonTopic />
          </div>
        </div>

        {/* New 토픽 */}
        <div className="w-full flex flex-col gap-6">
          <div className="flax flex-col gap-1">
            <div className="flex items-center gap-2">
              <img src="/assets/fire.gif" alt="@IMG" className="w-17 h-17" />
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tighter">NEW 토픽</h4>
            </div>
            <p className="md:text-base text-muted-foreground">새로운 시선으로 새로운 이야기를 시작하세요. 자금 바로 당신만의 토픽을 시작하세요</p>
          </div>
          {/* grid-cols-4 : Grid columns형식으로 4개 영역을 잡는다. */}
          {topics?.length>0 ? 
            ( 
              // 가로형 : <div className="min-h-120 grid grid-cols-2 gap-6">
              // 아래는 반응형앱 : 화면 width가 줄어들면 세로형으로 자동 변경됨
              <div className="flex flex-col min-h-120 md:grid md:grid-cols-2 gap-6">
              {
              // 빠른순으로 정렬
              topics
              .sort((a,b)=>new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
              .map((topic:Topic) => {
                return <NewTopicCard key={topic.id} props={topic} />;
              })
              }
              </div>
            )
            :
            ( <div className="w-full min-h-120 flex items-center justify-center">
                <p className="text-muted-foreground/50">조회 가능한 토픽이 없습니다.</p>
              </div>
            )
          }
        </div>
      </section>
    </main>
  )
}

export default App
