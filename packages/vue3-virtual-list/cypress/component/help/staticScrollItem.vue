<script lang="ts" setup>
interface Item {
    index: number,
    avatar: string,
    content: string,
    time: Date,
    showBox?:boolean,
    imgUrl: string
}

defineProps<{itemData: Item}>()
</script>
<template>
    <div>{{itemData.content || 'empty'}}, index: {{itemData.index}}</div>
</template>
<style scoped>
div {
    height: 20px;
    padding: 10px;
    border: 1px solid #000;
    font-size: 12px;
}
</style>