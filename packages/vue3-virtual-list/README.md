## FEATURE
1、async component render;  
2、locate/update/delete/add specify location;  
4、scroll loading;  
5、chat mode(keep bottom position);  

[demo]()
## USAGE
1、install;  
```
npm install --save @vb_he/vue-virtual-scroll
```

2、import;  
```
import VirtualList from '@vb_he/vue-virtual-scroll'
import '@vb_he/vue-virtual-scroll/dist/style.css'

// global
createApp(App).use(VirtualList).use(router).mount('#app')
```

3、use in vue component
```
<Virtual-list
ref="virtualScroll"
:perPageItemNum="20"
:scrollItem="StaticItem"
:height="42"
></Virtual-list>
```

### props
|   key   | default value | required | description |
|  ----  | -------------  | -------- | ----------- |
| perPageSize  | 20       |  true    | 
| height  | 100  | true    |

### expose method