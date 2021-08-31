import * as React from 'react'

interface VirtualListProps {
  sourceData: any[],
  ScrollItemComponent: React.FC<any>,
  TombstoneComponent: React.FC<any>
}

const VirtualList: React.FC<VirtualListProps> = (props) => {
  return (
    <>
      <ul className="scroll-wrapper" data-testid="scroll-wrapper">
        {props.sourceData.length && props.sourceData.map((element, index) => (
          <props.ScrollItemComponent {...element} key={index} />
        ))}
      </ul>
    </>
  )
}

export default React.memo(VirtualList)