import * as React from 'react'

interface VirtualListProps {
  sourceData: any[],
  scrollItemComponent: React.FC,
  tombstoneComponent: React.FC
}

const VirtualList: React.FC<VirtualListProps> = (props) => {
  console.log(props)
  return (
    <>
      <ul className="scroll-wrapper" data-testid="scroll-wrapper">
        {props.sourceData.length && props.sourceData.reduce((acc, curr) => {
          return (
            acc + <li>测试{props.scrollItemComponent}</li>
          )
        })}
      </ul>
    </>
  )
}

export default VirtualList