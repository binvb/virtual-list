import * as React from 'react'

const Tombstone:React.FC = () => {
    return (
        <div className="chat-item">
            <img className="avatar" width="48" height="48" src={require('./images/unknown.jpg')}/>
            <div className="bubble">
                <p></p>
                <p></p>
            </div>
        </div>       
    )
}

export default Tombstone