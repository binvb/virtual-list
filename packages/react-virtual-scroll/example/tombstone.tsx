import * as React from 'react'

const tombstone:React.FC = () => {
    return (
        <div className="chat-item">
            <img className="avatar" width="48" height="48" />
            <div className="bubble">
                <p></p>
                <p></p>
            </div>
        </div>       
    )
}

export default tombstone