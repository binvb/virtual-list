import * as utils from './utils'

const MESSAGES = [
"when you popState and actually being well, we expect it further",
"But I'm going to take care of ripping out my code in the fact that just something like that",
"And what we'll createdCallbacks than that you can still read what each one of this should go out",
"So just return Promise back and do this, the route equals",
"ah, let's do a clearRoutes it says I'm not going to do",
"At least trying new Promise",
"then, and then it's going to check what that",
"And we zoom in, then you can kind of set, except for a router",
"Now strictly today",
"I'm going to just takes an iterable as well be to add a visible",
"Anyway, so that we'll do a link",
"So what I'm going to minify this, so I'll just console",
"log data for now, just sometimes look at that",
"not then if we wanted to do position from the registerElements primed and red",
"That isn't get called",
"At all",
"No",
"Interesting that misc here",
"So what was a regular expression",
"Because once you get over doing a fancy techniques",
"And let's see",
"OK, we broke thing to do",
"Right",
"document",
"&quot; So",
"Yeah",
"which is fine",
"And that we'll do sc",
];
const NAME = [
    'vb',
    'fish',
    'fool'
]

export interface Message {
    content: string;
    avatar: string;
    time: Date;
    name: string;
    visible?: boolean;
}
/**
 * 
 * @param size 获取消息数量
 * @param visible 是否可见，透传字段
 * @returns 
 */
export function getMessage(size: number = 1, visible: boolean):Message[] {
    const msgList = []

    for(let i = 0; i < size; i++) {
        msgList.push(
            {
                content: MESSAGES[utils.getRandom(0, MESSAGES.length)],
                avatar: `./images/avatar${utils.getRandom(0, 3)}.jpg`,
                time: new Date(),
                name: NAME[utils.getRandom(0, NAME.length)],
                visible
            }
        )
    }

    return msgList
}