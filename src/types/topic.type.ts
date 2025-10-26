//tsconfig.app.json에서 이 속성을값을 변경해야 아래 TOPIC_STATUS 변수에 오류 해결
//  "erasableSyntaxOnly": false,

export enum TOPIC_STATUS {
    TEMP = "temp",
    PUBLISH = "publish",
}
export interface Topic {
    id: number;
    create_at: Date | string;
    author: any; //추후 변경
    title: string;
    content: string;
    category: string;
    thumbnail: string;
}