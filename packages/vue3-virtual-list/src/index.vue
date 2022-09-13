<script setup lang="ts">
import { ComponentPublicInstance, reactive, onMounted, onBeforeUnmount, withDefaults, nextTick } from 'vue'
import ResizeObserver from 'resize-observer-polyfill'
import 'intersection-observer'
import throttle from 'lodash/throttle'
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
	listHeight: 0,
	locationPosition: 0,
	userScrolling: false
})

// quick scroll end compensation
const checkIfCorrectCurrentData = throttle(() => {
	let currrentScrollTop = utils.getScrollTop(data)
	let correctIndex = utils.getCorrectTopIndex(data.sourceData, currrentScrollTop)!
	let scope = data.currentData.slice(0, data.currentData.length)

	if(data.userScrolling) {
		data.locationPosition = currrentScrollTop
	}
	data.ajusting = false
	data.scrolling = false
	data.userScrolling = false

	if(!scope.find(item => item.index === correctIndex)) {
		data.currentData = interSectionHandle.interAction(correctIndex, props.initDataNum, data, {intersectionObserver, resizeObserver})
	}
}, 100)

// resizeObserver
const resizeObserver = new ResizeObserver((entries, observer) => {
	for (const entry of entries) {
		let {height} = entry.contentRect

		if(!height) {
			return false
		}
		resizeHandle(data, props)
	}
})
// intersectionObserver
const intersectionObserver = new IntersectionObserver((entries) => {
	for(const entry of entries) {
		const currentIndex = entry.target.getAttribute('data-index')
		const lastIndex = props.direction === 'up' ? 0 : data.sourceData[data.sourceData.length - 1].index

		if(entry.intersectionRatio > 0 &&  data.scrolling && !data.ajusting) {
			data.currentData = interSectionHandle.interAction(+entry.target.getAttribute('data-index')!, props.initDataNum, data, {intersectionObserver, resizeObserver})
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
	scrollEvent(checkIfCorrectCurrentData, data)
})
onBeforeUnmount(() => {
	removeScrollEvent(data)
})

// expose
defineExpose<VirtualScrollExpose>({
	locate,
	del: (index) => {
		dataHandle.del(index, data, {resizeObserver, intersectionObserver}, props)
		setListHeight()
	},
	add: (index, insertData) => {
		dataHandle.add(index, insertData, data, {resizeObserver, intersectionObserver}, props)
		setListHeight()
		checkIfScrollToBottom()
	},
	update: (index, _data) => {
		dataHandle.update(index, _data, data.sourceData)
	},
	setSourceData: (_data) => {
		data.sourceData = []
		dataHandle.setSourceData(_data, data, {resizeObserver, intersectionObserver}, props)
		setListHeight()
		if(props.loadingOptions && props.direction === 'up') {
			nextTick(() => {
				scrollToBottom(data)
			})
		}
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
	dataHandle.resetSourceDataBeforeLocate(data.sourceData, index)

	let item = data.sourceData[index]
	let position = item.transformY

	data.locationPosition = position
	locatePosition(data.locationPosition, data) 
	nextTick(() => {
		checkIfCorrectCurrentData()
	})
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
		setListHeight()
		locate(res.length)
	})
}
function checkIfScrollToBottom() {
	if(props.loadingOptions && props.direction === 'up' && utils.ifBottomPosition(data)) {
		nextTick(() => {
			scrollToBottom(data)
		})
	}
}
</script>
<template>
	<div :class="'fishUI-virtual-list_' + data.componentID" style="width: 100%; height: 100%; overflow-y: scroll">
		<div v-if="props.loadingOptions && props.direction === 'up'">	
			<component :is="props.loadingOptions.loadingComponent || Loading" v-if="data.loading"></component>
			<div v-if="props.loadingOptions.nomoreData" style="text-align: center;">{{props.loadingOptions.nomoreDataText || 'no more data'}}</div>
		</div>
		<ul class="fishUI-virtual-list__inner" :style="{height: `${data.listHeight}px`}">
			<template v-for="item in data.currentData" :key="item.nanoid">
				<li
					:data-index="item.index"
					:data-offsetHeight="item.offsetHeight"
					:data-key="item.nanoid"
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
			<div v-if="props.loadingOptions.nomoreData" style="text-align: center;">{{props.loadingOptions.nomoreDataText || 'no more data'}}</div>
		</div>
	</div>
</template>

<style scoped>
.fishUI-virtual-list__inner {
	position: relative;
	margin: 0;
	padding: 0;
}
.fishUI-virtual-list__inner>li {
	width: 100%;
	list-style: none;
}

.fishUI-virtual-list__inner>ul {
	padding: 0;
}
</style>