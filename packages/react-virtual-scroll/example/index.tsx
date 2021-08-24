import './index.less'

import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import VirtualList from '../.'
import { Message, getMessage } from './mock'
import scrollItem from './scrollItem'
import tombstone from './tombstone'

interface Mytest {
  name: string
}
function App() {
  let test:Mytest[] = [{name: 'vb'}]
  const [name, setName] = React.useState<Mytest[]>(test)
  const [age, setAge] = React.useState<number>(0)

  React.useEffect(() => {
    setName(test)
  })

  return (
    <div>my name is {age}</div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))