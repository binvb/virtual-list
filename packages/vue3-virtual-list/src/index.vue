<script setup lang="ts">
import { ComponentPublicInstance, reactive, onMounted, onBeforeUnmount, withDefaults, nextTick, watch } from 'vue'
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
	scrollItem: ComponentPublicInstance
	perPageItemNum: number
	height?: number
	direction?: Direction
	loadingOptions?: LoadingOptions
}

const props = withDefaults(defineProps<Props>(), {
	perPageItemNum: 20,
	height: 100,
	direction: 'down'
})
const data = reactive<ReactiveData>({
	sourceData: [],
	currentData: [],
	loading: false,
	scrolling: false,
	ajusting: false,
	componentID: new Date().getTime() + utils.getRandom().toString(), // unique id
	listHeight: 0,
	locationPosition: 0, // record user scrolling end position
	userScrolling: false  // conflict userScroll/program scroll(e.g. locate)
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
		locate(correctIndex)
	}
}, 100)
// IntersectionObserver throttle
const intersectionObserverThrottle = throttle((entry) => {
	data.currentData = interSectionHandle.interAction(Number(entry.target.getAttribute('data-index'))!, props.perPageItemNum, data, {intersectionObserver, resizeObserver})
}, 100, {trailing: true, leading: false})
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

		if(entry.intersectionRatio > 0 && data.scrolling && !data.ajusting) {
			intersectionObserverThrottle(entry)
		}
		// if it's last item and loading mode, should trigger loadingFn
		if(entry.intersectionRatio > 0 && lastIndex === Number(currentIndex)) {
			if(!data.loading && props.loadingOptions && !props.loadingOptions.nomoreData) {
				loadData(lastIndex)
			}
		}
	}
}, {threshold: [0, 1]})

watch(() => data.listHeight, () => {
	checkIfScrollToBottom()
})
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
	},
	update: (index, _data) => {
		dataHandle.update(index, _data, data.sourceData)
	},
	setSourceData: (_data) => {
		data.sourceData = []
		dataHandle.setSourceData(_data, data, {resizeObserver, intersectionObserver}, props)
		setListHeight()
	},
	getData() {
		return data.sourceData
	},
	getCurrentViewPortData() {
		const scrollTop = utils.getScrollTop(data) // range[scrollTop, scrollTop + viewportOffsetHeight]
		const viewPortOffset = utils.getViewPortOffsetHeight(data)
		const _data:ItemProps[] = []

		data.currentData.forEach(item => {
			if((item.transformY + item.offsetHeight > scrollTop) && (item.transformY < scrollTop + viewPortOffset)) {
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
	dataHandle.resetSourceDataBeforeLocate(data.sourceData, data.sourceData.length)
	dataHandle.resetCurrentData(data, {intersectionObserver, resizeObserver}, props, index - props.perPageItemNum)
	let item = data.sourceData[index]
	let position = item.transformY

	data.locationPosition = position
	locatePosition(data.locationPosition, data)
	setListHeight()
}

function setListHeight() {
	let lastItem = data.sourceData[data.sourceData.length - 1]

	if(lastItem) {
		data.listHeight = lastItem.offsetHeight + lastItem.transformY
	}
}
function loadData(lastIndex: number) {
	data.loading = true
	props.loadingOptions!.loadingFn().then((res) => {
		data.loading = false
		dataHandle.add(lastIndex, res, data, {resizeObserver, intersectionObserver}, props)
		setListHeight()
		nextTick(() => {
			// locate after load data
			if(props.direction === 'up') {
				locate(res.length)
			} else {
				const _correctIndex = utils.getCorrectTopIndex(data.sourceData, utils.getScrollTop(data))!

				locate(_correctIndex)
			}
		})
	})
}
function checkIfScrollToBottom() {
	if(props.direction === 'up' && utils.ifBottomPosition(data)) {
		nextTick(() => {
			scrollToBottom(data)
		})
	}
}
</script>
<template>
	<div :class="'fishUI-virtual-list_' + data.componentID" style="width: 100%; height: 100%; overflow-y: scroll" data-testid="container">
		<div v-if="props.loadingOptions && props.direction === 'up'">	
			<component :is="props.loadingOptions.loadingComponent || Loading" v-if="data.loading" data-testid="loadingUp"></component>
			<div data-testid="noMoreDataUp" v-if="props.loadingOptions.nomoreData" style="text-align: center;">{{props.loadingOptions.nomoreDataText || 'no more data'}}</div>
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
					data-testid="listItem"
				>
					<component :is="props.scrollItem" :itemData="item" />
				</li>
			</template>
		</ul>
		<div v-if="props.loadingOptions && props.direction === 'down'">	
			<component :is="props.loadingOptions.loadingComponent || Loading" v-if="data.loading" data-testid="loadingDown"></component>
			<div v-if="props.loadingOptions.nomoreData" style="text-align: center;" data-testid="noMoreDataDown">{{props.loadingOptions.nomoreDataText || 'no more data'}}</div>
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