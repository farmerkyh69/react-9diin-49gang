import { ChartNoAxesCombined, CodeXml, DraftingCompass, Footprints, Goal, Lightbulb, List, Rocket } from "lucide-react";

import { ChevronDown } from "lucide-react";
import { Button } from "../ui";

const CLASS_CATEGORY2 = [
    { id: 1, label: "전체", category: "", icon: <List /> },
    { id: 2, label: "인문학", category: "humanity", icon: <Lightbulb /> },
    { id: 3, label: "스타트업", category: "start-up", icon: <Rocket /> },
    { id: 4, label: "IT·프로그래밍", category: "programming", icon: <CodeXml /> },
    { id: 5, label: "서비스·전략 기획", category: "planning", icon: <Goal /> },
    { id: 6, label: "마케팅", category: "marketing", icon: <ChartNoAxesCombined /> },
    { id: 7, label: "디자인·일러스트", category: "design", icon: <DraftingCompass /> },
    { id: 8, label: "자기계발", category: "self-development", icon: <Footprints /> },
];

interface Props {
  category: string;
  setCategory:(value:string) => void;
}

function AppSidebar({category, setCategory}: Props) {
  return (
            <aside className="min-w-60 w-60 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                {/* Shadcn UI의 Typoraphy h4컴포넌트 그대로 사용*/}
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">카테고리</h4>
                <ChevronDown className="mt-1" />
              </div>
              <div className="w-full flex flex-col gap-2">
                {CLASS_CATEGORY2.map((menu) => {
                  return (
                    <Button key={menu.id} variant={"ghost"} className={`justify-start text-muted-foreground hover:text-white hover:pl-6 transition-all duration-500 ${category === menu.category ? "text-foreground !pl-6 bg-accent/50" : ""}`} 
                      onClick={() => setCategory(menu.category)} >
                      {menu.icon}
                      {menu.label}
                    </Button>
                  )
                })}
              </div>
            </aside>
  )
}

export { AppSidebar }