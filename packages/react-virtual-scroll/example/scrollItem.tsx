import * as React from 'react'

const scrollItem: React.FC = () => {
    return (
        <div className="chat-item">
            <img className="avatar" />
            <div className="bubble">
                <p></p>
                <div className="meta">
                    <time className="posted-date"></time>
                </div>
            </div>
        </div>       
    )
}

export default scrollItem