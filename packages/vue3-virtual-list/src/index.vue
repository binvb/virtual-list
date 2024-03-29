<script setup lang="ts">
import { ComponentPublicInstance, reactive, onMounted, onBeforeUnmount, withDefaults, nextTick, watch } from 'vue'
import ResizeObserver from 'resize-observer-polyfill'
import 'intersection-observer'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import Loading from './loading.vue'
import { ReactiveData, VirtualScrollExpose, Direction, LoadingOptions, SourceData } from "./index.d"
import utils from './utils'
import resizeHandle from './resizeHandle'
import interSectionHandle from './interSectionHandle'
import dataHandle from './dataHandle'
import observeHandle from './observeHandle'
import { scrollEvent, removeScrollEvent, locatePosition } from "./scrollInstance"

interface Props {
	scrollItem: ComponentPublicInstance
	perPageItemNum: number
	height?: number
	direction?: Direction
	loadingOptions?: LoadingOptions,
	uniqueKey?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	perPageItemNum: 20,
	height: 100,
	direction: 'down',
	uniqueKey: true
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
	userScrolling: false,  // conflict userScroll/program scroll(e.g. locate)
})
// quick scroll end compensation
const checkIfCorrectCurrentData = debounce(() => {
	let currrentScrollTop = utils.getScrollTop(data)
	let correctIndex = utils.getCorrectTopIndex(data.sourceData, currrentScrollTop)

	data.ajusting = false
	data.scrolling = false
	data.userScrolling = false
	if(!data.currentData.find(item => item.index === correctIndex)) {
		locate(correctIndex)
	}
}, 100, {leading: false, trailing: true})
// observeHandle debounce
const observeHandleDebounce = debounce((val, pre) => {
	// unobserve first, avoid missing observe
	observeHandle.unobserve(pre, {resizeObserver, intersectionObserver}, data)
	observeHandle.observe(val, {resizeObserver, intersectionObserver}, data)
}, 10)
// IntersectionObserver throttle
const intersectionObserverThrottle = throttle((entryIndex) => {
	data.currentData = interSectionHandle.interAction(entryIndex, {data, observer: {resizeObserver, intersectionObserver}, props})
}, 100, {trailing: true, leading: false})
const resizeObserverThrottle = throttle(() => {
	resizeHandle(data)
}, 1, {trailing: true, leading: true})
// resizeObserver
const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		let {height} = entry.contentRect

		if(!height) {
			return false
		}
		resizeObserverThrottle()
	}
})
// intersectionObserver
const intersectionObserver = new IntersectionObserver((entries) => {
	for(const entry of entries) {
		const currentIndex = entry.target.getAttribute('data-index')
		const lastIndex = props.direction === 'up' ? 0 : data.sourceData[data.sourceData.length - 1].index

		if(entry.intersectionRatio === 1 && data.scrolling && !data.ajusting) {
			intersectionObserverThrottle(currentIndex)
		}
		// if it's last item and loading mode, should trigger loadingFn
		if(entry.intersectionRatio > 0 && lastIndex === Number(currentIndex)) {
			if(!data.loading && props.loadingOptions && !props.loadingOptions.nomoreData) {
				loadData(lastIndex)
			}
		}
	}
}, {threshold: [0, 1]})

watch(() => data.currentData, (val, pre) => {
	observeHandleDebounce(val, pre)
	nextTick(() => {
		// data change trigger resize handle
		resizeHandle(data)
	})
}, {deep: true})

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
		dataHandle.del(index, {data, observer: {resizeObserver, intersectionObserver}, props})
		setListHeight()
	},
	add: (index, insertData) => {
		// check if chat mode(up direction && loading options)
		if(props.direction === 'up' && props.loadingOptions && utils.ifBottomPosition(data)) {
			nextTick(() => {
				locate(data.sourceData[data.sourceData.length - 1].index)
			})
		}
		dataHandle.add(index, insertData, {data, observer: {resizeObserver, intersectionObserver}, props})
		setListHeight()
	},
	update: (index, _data) => {
		dataHandle.update(index, _data, data.sourceData)
	},
	setSourceData: (_data, locateIndex) => {
		// data.sourceData = []
		dataHandle.setSourceData(_data, {data, observer: {resizeObserver, intersectionObserver}, props})
		setListHeight()
		// check if chat mode(up direction && loading options)
		if(props.direction === 'up' && props.loadingOptions) {
			if(!_data.length) {
				return
			}
			nextTick(() => {
				locate(locateIndex !== undefined && locateIndex >= 0 ? locateIndex : data.sourceData[data.sourceData.length - 1].index)
			})
		} else if(locateIndex !== undefined && locateIndex >= 0) {
			nextTick(() => {
				locate(locateIndex)
			})
		}
	},
	getData() {
		return data.sourceData
	},
	getCurrentViewPortData() {
		return utils.getCurrentViewPortData(data)
	}
})

// methods 
function locateBykey(key: string) {
	const index = data.sourceData.findIndex(item => item.nanoid === key)

	locate(index)
}
function locate(index: number) {
	if(!data.sourceData.length) {
		return
	}
	if(index >= data.sourceData.length) {
		index = data.sourceData.length - 1
	}
	data.userScrolling = false // program scrolling
	// ajust row data
	dataHandle.resetSourceDataBeforeLocate(data.sourceData, index + props.perPageItemNum)
	dataHandle.resetCurrentData({data, observer: {resizeObserver, intersectionObserver}, props}, index - props.perPageItemNum)
	const item = data.sourceData[index]
	const position = item.transformY

	data.locationPosition = position
	locatePosition(data)
	setListHeight()
}

function setListHeight() {
	const lastItem = data.sourceData[data.sourceData.length - 1]

	if(lastItem) {
		data.listHeight = lastItem.offsetHeight + lastItem.transformY
	}
}
function loadData(lastIndex: number) {
	data.loading = true
	props.loadingOptions!.loadingFn().then((res) => {
		const _correctTopIndex = utils.getCorrectTopIndex(data.sourceData, utils.getScrollTop(data))
		const _correctTopItem = data.sourceData[_correctTopIndex]

		dataHandle.add(lastIndex, res, {data, observer: {resizeObserver, intersectionObserver}, props})
		setListHeight()
		data.loading = false
		nextTick(() => {
			locateBykey(_correctTopItem.nanoid)
		})
	})
}
function itemLoaded(item: SourceData) {
	const currentEl = document.querySelector(`.fishUI-virtual-list_${data.componentID} li[data-key="${item.nanoid}"]`) as HTMLElement
	
	if(!item.offset) {
		item.offset = {height: 0}
	}
	item.offset.height = currentEl.offsetHeight
}
</script>
<template>
	<div :class="'fishUI-virtual-list_' + data.componentID" style="width: 100%; height: 100%; overflow-y: scroll" data-testid="container">
		<div v-if="props.loadingOptions && props.direction === 'up'">	
			<component :is="props.loadingOptions.loadingComponent || Loading" v-if="data.loading" data-testid="loadingUp"></component>
			<div v-if="props.loadingOptions.nomoreData" data-testid="noMoreDataUp" style="text-align: center;">{{props.loadingOptions.nomoreDataText || 'no more data'}}</div>
		</div>
		<ul v-if="props.uniqueKey" class="fishUI-virtual-list__inner" :style="{height: `${data.listHeight}px`}">
			<template v-for="item in data.currentData" :key="item.nanoid">
				<li
					:data-index="item.index"
					:data-offsetHeight="item.offsetHeight"
					:data-key="item.nanoid"
					:style="{
					position: 'absolute',
					transform: `translateY(${item.transformY || 0}px)`,
					height: item.offset && item.offset.height ? `${item.offset.height}px`: 'auto'
					}"
					data-testid="listItem"
				>
					<component @itemLoaded="itemLoaded(item)" :is="props.scrollItem" :itemData="item" />
				</li>
			</template>
		</ul>
		<ul v-if="!props.uniqueKey" class="fishUI-virtual-list__inner" :style="{height: `${data.listHeight}px`}">
			<template v-for="item in data.currentData">
				<li
					:data-index="item.index"
					:data-offsetHeight="item.offsetHeight"
					:data-key="item.nanoid"
					:style="{
					position: 'absolute',
					transform: `translateY(${item.transformY || 0}px)`,
					height: item.offset && item.offset.height ? `${item.offset.height}px`: 'auto'
					}"
					data-testid="listItem"
				>
					<component @itemLoaded="itemLoaded(item)" :is="props.scrollItem" :itemData="item" />
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