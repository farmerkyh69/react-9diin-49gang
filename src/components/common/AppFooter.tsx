import { Button, Separator } from "../ui";

function AppFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-center bg-[#121212]">
      <div className="w-full max-w-[1328px] flex flex-col gap-6 p-6 pb-18 ">
        {/* 기본형 : <div className="w-full flex items-start justify-between"> */}
        {/* 반응형앱 : 화면 width가 줄어들면 두줄로 됨*/}
        <div className="w-full flex flex-col items-start justify-between gap-6 md:flex-row md:gap-0">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start">
              <h3 className="scroll-m-20 text-base md:text-2xl font-semibold tracking-tight">나의 학습여정,</h3>
              <h3 className="scroll-m-20 text-base md:text-2xl font-semibold tracking-tight">나만의 창작으로 이어지는 프랫폼</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={"outline"} size={"icon"} className="border-0">
                <img src="/assets/facebook.png" alt="@SNS" className="w-6 h-6 mt-[2px]"/>
              </Button>
              <Button variant={"outline"} size={"icon"} className="border-0">
                <img src="/assets/facebook.png" alt="@SNS" className="w-[22px] h-[22px]"/>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="cursor-pointer transition' duration-300 hover:font-medium">이용약관</p>
            <Separator orientation="vertical" className="!h-[14px]" />
            <p className="cursor-pointer transition' duration-300 hover:font-medium">개인정보처리방침</p>
            <Separator orientation="vertical" className="!h-[14px]" />
            <p className="cursor-pointer transition' duration-300 hover:font-medium">클래스 론칭 문의</p>
          </div>
        </div>
        <Separator />
        {/* 기본형 : <div className="w-full flex items-start justify-between"> */}
        {/* 반응형앱 : 화면 width가 줄어들면 두줄로 됨*/}
        <div className="w-full flex flex-col items-start justify-between gap-12 md:flex-row md:gap-0">
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col items-start gap-1">
              <p>고객센터</p>
              <div>
                <p>평일 오전 9시 ~ 오후 6시</p>
                <p>문의 : farmerkyh@naver.com</p>
              </div>
            </div>
            <p>@ Mingo Team rights reserverd</p>
          </div>
          <div className="flex flex-col mr-[66px]">
            <p className="h-10 text-base font-semibold">사업자 정보</p>
            <div className="flex flex-col items-start gap-1">
              <p>대표이사 : 개발자 농부지기</p>
              <p>사업자 번호 : 000-110-12345</p>
              <p>통신판매신고번호:203-대한민구-1234</p>
              <p>대표번호 : 010-1234-5678</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export {AppFooter};