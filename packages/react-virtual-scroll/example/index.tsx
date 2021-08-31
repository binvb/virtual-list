import './index.less'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import VirtualList from './../src/index'
import scrollItem from './scrollItem'
import Tombstone from './tombstone'
import { getMessage, Message } from './mock'

const App: React.FC = () => {
  const [sourceData, setSource] = React.useState<Message[]>([])

  React.useEffect(() => {
    setSource(getMessage(200))
  },[])

  return (
    <VirtualList 
    ScrollItemComponent={scrollItem} 
    TombstoneComponent={Tombstone}
    sourceData={sourceData}
    />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))