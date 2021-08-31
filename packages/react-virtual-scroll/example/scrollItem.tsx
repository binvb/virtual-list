import * as React from 'react'
import { Message } from './mock'

const ScrollItem: React.FC<Message> = (props) => {
    return (
        <div className="chat-item">
            <img className="avatar" src={props.avatar} />
            <div className="bubble">
                <p>{props.content}</p>
                <div className="meta">
                    <time className="posted-date">{props.time.toString()}</time>
                </div>
            </div>
        </div>       
    )
}

export default ScrollItem