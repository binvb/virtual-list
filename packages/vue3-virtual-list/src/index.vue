<script setup lang="ts">
import { ComponentPublicInstance, reactive, onMounted, onBeforeUnmount, withDefaults, nextTick } from 'vue'
import ResizeObserver from 'resize-observer-polyfill'
import 'intersection-observer'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import Loading from './loading.vue'
import { ReactiveData, VirtualScrollExpose, Direction, LoadingOptions, ItemProps } from "./index.d"
import utils from './utils'
import resizeHandle from './resizeHandle'
import interSectionHandle from './interSectionHandle'
import dataHandle from './dataHandle'
import observeHandle from './observeHandle'
import { scrollEvent, removeScrollEvent, locatePosition, scrollToBottom } from "./scrollInstance"

interface Props {
	ScrollItemComponent: ComponentPublicInstance
	initDataNum: number
	retainHeightValue?: number
	direction?: Direction
	loadingOptions?: LoadingOptions
}

const props = withDefaults(defineProps<Props>(), {
	initDataNum: 20,
	retainHeightValue: 100,
	direction: 'down'
})

const data = reactive<ReactiveData>({
	sourceData: [],
	currentData: [],
	loading: false,
	scrolling: false,
	ajusting: false,
	componentID: new Date().getTime() + utils.getRandom().toString(), 
	listHeight: 0 
})

const resizeThrottle = throttle(() => {
	utils.calculateListHeight(data.sourceData, undefined, setListHeight)
}, 1000)

// quick scroll end compensation
const checkIfCorrectPosition = debounce(() => {
	let currrentScrollTop = utils.getScrollTop(data)
	let correctIndex = utils.getCurrentTopIndex(data.sourceData, currrentScrollTop)!
	let scope = data.currentData.slice(0, data.currentData.length)

	data.ajusting = false
	data.scrolling = false
	if(!scope.find(item => item.index === correctIndex)) {
		locate(correctIndex)
	}
}, 10)

// resizeObserver
const resizeObserver = new ResizeObserver((entries, observer) => {
	for (const entry of entries) {
		let {height} = entry.contentRect

		if(!height) {
			return false
		}
		resizeHandle(data)
	}
})
// intersectionObserver
const intersectionObserver = new IntersectionObserver((entries) => {
	for(const entry of entries) {
		const currentIndex = entry.target.getAttribute('data-index')
		const lastIndex = props.direction === 'up' ? 0 : data.sourceData[data.sourceData.length - 1].index

		if(entry.intersectionRatio > 0 &&  data.scrolling && !data.ajusting) {
			data.currentData = interSectionHandle.interAction(+entry.target.getAttribute('data-index')!, props.initDataNum, data, {intersectionObserver, resizeObserver})
			resizeThrottle()
		}
		// if it's last item and loading mode, should trigger loadingFn
		if(entry.intersectionRatio > 0 && lastIndex === +currentIndex! && data.scrolling && !data.ajusting) {
			if(!data.loading && props.loadingOptions && !props.loadingOptions.nomoreData) {
				loadData(lastIndex)
			}
		}
	}
}, {threshold: [0, 1]})

// life cycle
onMounted(() => {
	observeHandle.observe(data.currentData, {resizeObserver, intersectionObserver}, data)
	scrollEvent(checkIfCorrectPosition, data)
	resizeHandle(data)
})
onBeforeUnmount(() => {
	removeScrollEvent(data)
})

// expose
defineExpose<VirtualScrollExpose>({
	locate,
	del: (index) => {
		dataHandle.del(index, data, {resizeObserver, intersectionObserver}, props)
	},
	add: (index, insertData) => {
		dataHandle.add(index, insertData, data, {resizeObserver, intersectionObserver}, props)
	},
	update: (index, _data) => {
		dataHandle.update(index, _data, data.sourceData)
	},
	setSourceData: (_data) => {
		data.sourceData = []
		//initail render
		dataHandle.setSourceData(_data, data, {resizeObserver, intersectionObserver}, props)
		nextTick(() => {
			setListHeight()
			// if direction === 'up', then scroll to bottom
			if(props.direction === 'up' && props.loadingOptions) {
				scrollToBottom(data)
			}
		})
	},
	getData() {
		return data.sourceData
	},
	getCurrentViewPortData() {
		const scrollTop = utils.getScrollTop(data) // range[scrollTop, scrollTop + viewportOffsetHeight]
		const viewPortOffset = utils.getViewPortOffsetHeight(data)
		const _data:ItemProps[] = []

		data.currentData.forEach(item => {
			if((item.transformY + item.offsetHeight >= scrollTop) && (item.transformY <= scrollTop + viewPortOffset)) {
				_data.push(item)
			}
		})
		return _data
	}
})

// methods 
function locate(index: number) {
	if(!data.sourceData.length) {
		return
	}
	// ajust row data
	dataHandle.getSourceDataAfterResize(data.sourceData, index)

	let item = data.sourceData[index]
	let position = item.transformY

	locatePosition(position, data) 
	data.currentData = interSectionHandle.interAction(index, props.initDataNum, data, {intersectionObserver, resizeObserver})
}

function setListHeight() {
	let lastItem = data.sourceData[data.sourceData.length - 1]

	if(lastItem) {
		let height = lastItem.offsetHeight + lastItem.transformY

		data.listHeight = height
	}
}
function loadData(lastIndex: number) {
	data.loading = true
	props.loadingOptions!.loadingFn().then((res) => {
		data.loading = false
		dataHandle.add(lastIndex, res, data, {resizeObserver, intersectionObserver}, props)
		// if direction === up, need to locate before position
		locate(data.currentData[data.currentData.length - 1].index)
	})
}
</script>
<template>
	<div :class="'fishUI-virtual-list_' + data.componentID" style="width: 100%; height: 100%; overflow-y: scroll">
		<div v-if="props.loadingOptions && props.direction === 'up'">	
			<component :is="props.loadingOptions.loadingComponent || Loading" v-if="data.loading"></component>
		</div>
		<ul class="fishUI-virtual-list__inner" :style="{height: `${data.listHeight}px`}">
			<template v-for="item in data.currentData" :key="item.nanoid">
				<li
					:data-index="item.index"
					:data-offsetHeight="item.offsetHeight"
					:style="{
					position: 'absolute',
					transform: `translateY(${item.transformY || 0}px)`,
					}"
				>
					<component :is="props.ScrollItemComponent" :itemData="item" />
				</li>
			</template>
		</ul>
		<div v-if="props.loadingOptions && props.direction === 'down'">	
			<component :is="props.loadingOptions.loadingComponent || Loading" v-if="data.loading"></component>
		</div>
	</div>
</template>

<style scoped>
.fishUI-virtual-list__inner {
	position: relative;
	margin: 0;
}
.fishUI-virtual-list__inner>li {
	width: 100%;
	list-style: none;
}
</style>