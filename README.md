usage
yarn && cd example && yarn && yarn serve

关于无限滚动
有一句话印象很深刻，如果你觉得前端简单，写一个无限滚动的组件来看一下。
由于 dom 渲染性能问题，但需要渲染大量列表时候页面就会变得卡顿，无限滚动就是解决这个问题的其中一个方案。
目前无限滚动的插件基本上都有各种各样的问题，性能不佳,体验不好,或者是只能应用在某些固定场景。
最近看到 google 一个无限滚动的实践文章，体验了一下感觉很好(仍会有问题，例如滚动过快会出现空白背景).所以参考这个实践，写了一个 vue 的无限滚动插件。

It’s still not perfect
Our current implementation of DOM recycling is not ideal as it adds all elements that pass through the viewport, instead of just caring about the ones that are actually on screen. This means, that when you scroll reaaally fast, you put so much work for layout and paint on Chrome that it can’t keep up. You will end up seeing nothing but the background. It’s not the end of the world but definitely something to improve on.
before start
这个项目其实酝酿了很长时间，各种复杂场景想了个遍，要解决的问题很多有种无从下手的感觉，最近有些时间，决定先写再改。
第一版本，需要实现的功能如下：
1 dom 回收；
2 锚点定位；
3 滚动获取数据；
4 搜索；
5 下拉滚动；
6 快速滚动时候，先渲染骨架屏，等计算好后再显示真正的 dom 结构；

整体流程：
1 初始化渲染(根据参数渲染显示数量);
2 监听滚动事件，根据滚动方向，滚动距离增加显示 item 数量；
3 根据已显示 item, 滚动方向, 需要渲染的 item 高度计算出定位；
4 先显示 tonstone 再渲染成 scrollitem(已渲染过的元素直接渲染)；
5 根据当前滚动高度计算出滚动高度对应 scrollitem 的 index 值， 根据 index 值回收不需要展示的 scrollitem；

问题记录
1 因为元素需要进行绝对定位，在定位之前需要获取元素高度；如何在未渲染前获取元素高度；
考虑了几种方案：

1 渲染手动计算 dom 内所有会导致高度变化的元素，得到高度；  
2 渲染后再获取元素高度；  
3 复制元素渲染到不展示的区域，计算出高度后再进行真实渲染；  
方案 1 因为渲染的列表内容是开发者自行处理的，变化太多，不可控；
方案 2 可能会导致页面重排，可以考虑在渲染前将元素设置为不可见，计算高度并修改重新渲染后再设置为可见；
方案 3 因为列表中每个 item 都需要先渲染计算高度，再进行正常的渲染(文章开头的方案)。
所以只需要从方案 2 和方案 3 中做选择：

方案 2： 渲染->重排；  
方案 3： 渲染->计算 dom 高度->正式渲染列表；  
从性能消耗角度来看，两者相差不大，因为我是要做几个前框加框的组件，不太适合过多 dom 操作，所以选择用方案 2；

2 首屏渲染数据数量；
暂时考虑在两屏左右，由开发者配置，在不影响性能的前提下初始可以多渲染一些数据；

3 滚动时候加载更多数据的时机；

方案 1： 监听滚动事件(防抖), 计算已滚动的 item 数量，补充&回收 dom；  
方案 2： 监听滚动事件，如果滚动到某个临界值(例如滚动了多少个数据/滚动了一定的距离), 则进行 补充&回收 数据；  
方案 2 太多定制内容(滚动数据数量变化，临界值处理)，容易出现问题。方案 1 可能会出现性能问题(但考虑到 google 也是用这个方案，并没有出现性能问题)，所以采用方案 2；

4 被回收的数据如何恢复并重新渲染；
首先数据要保证是完整的，只有 dom 是被回收的，在 dom 上标记一个 index，通过 index 快速查询到需要渲染的数据；

5 如何计算滚动的 item 数量，在滚动后如何计算应该补充哪些数据(上下滚动)， 多少数据？回收多少数据？ 设置一个公式，以滚动条位置的 item 为分界，item 上方(上下滚动)显示元素数量为开发者初始渲染数据(后面以 N 替代)的 1/2，下方为 N-1.根据这个公式对数据进行补充/回收。临界状态(初始化上方数据未 0，底部数据无补充)特殊处理。 因为 item 是在变化的，一开始是 tomestone 渲染，然后是 scrollitem 渲染，这两个元素的之间的高度是不一样的，scrollitem 元素之间的高度也是不一样的。所以补充/回收的操作必须是等数据渲染完毕后进行。

性能问题记录
1 深拷贝；
一直没留意深拷贝的性能问题，但这次数据量比较大，问题就凸显了。当用 lodash 的 cloneDeep 拷贝一个两万条数据的数组时候(不只是简单类型的数组元素)，耗时大概是 220ms，即使用 JOSN.parse(JSON.stringify())也需要 180ms 左右(称赞下 lodash 优化做的很好了). 之前比较习惯在处理完数据后再赋值给 vue 绑定的数据进行渲染，一个是不用经过多次渲染，一次渲染完成。但其实框架是有自己做优化，例如 vue 某个时间周期内多次数据变化会合并为一次渲染(后面在 vue 文档补充),react 的 setState 合并渲染；但也延伸了另外的问题，e.g. vue 无法监听到通过下标修改的数组元素变化，只能通过一些 trick 方式来修改，例如修改一个数组元素的时候，通过 splice 方式替换；
结论是当数据量很大而且对性能要求比较高的时候，尽量不要使用深拷贝。

更新记录
21/11/15: 去掉 tonestone 模块;

参考
1 Complexities of an Infinite Scroller：https://developers.google.com/web/updates/2016/07/infinite-scroller
2 react-infinite-scroller： https://github.com/danbovey/react-infinite-scroller
3 react-infinite-scroll-component: https://github.com/ankeetmaini/react-infinite-scroll-component
4 动态生成 DOM 元素的高度及行数获取与计算方法： https://segmentfault.com/a/1190000004956121
