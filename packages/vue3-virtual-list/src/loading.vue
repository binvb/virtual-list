<script setup lang="ts">
</script>

<template>
    <div class="m-loader">
        <!-- loading https://loading.io/ -->
        <div class="loadingio-spinner-spinner-221tthfz5zp"><div class="ldio-5o160khqex"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
        <span class="m-loader__text">loading...</span>
    </div>
</template>

<style scoped>
.m-loader {
    width: 150px;
    height: 40px;
    margin: 0 auto;
    line-height: 48px;
    font-size: 14px;
    color: #333;
}
.m-loader__text {
    display: inline-block;
    vertical-align: top;
    line-height: 40px;
}
@keyframes ldio-5o160khqex {
  0% { opacity: 1 }
  100% { opacity: 0 }
}
.ldio-5o160khqex div {
  left: 47px;
  top: 26px;
  position: absolute;
  animation: ldio-5o160khqex linear 1s infinite;
  background: #333333;
  width: 6px;
  height: 8px;
  border-radius: 3px / 4px;
  transform-origin: 3px 24px;
}.ldio-5o160khqex div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -0.875s;
  background: #333333;
}.ldio-5o160khqex div:nth-child(2) {
  transform: rotate(45deg);
  animation-delay: -0.75s;
  background: #333333;
}.ldio-5o160khqex div:nth-child(3) {
  transform: rotate(90deg);
  animation-delay: -0.625s;
  background: #333333;
}.ldio-5o160khqex div:nth-child(4) {
  transform: rotate(135deg);
  animation-delay: -0.5s;
  background: #333333;
}.ldio-5o160khqex div:nth-child(5) {
  transform: rotate(180deg);
  animation-delay: -0.375s;
  background: #333333;
}.ldio-5o160khqex div:nth-child(6) {
  transform: rotate(225deg);
  animation-delay: -0.25s;
  background: #333333;
}.ldio-5o160khqex div:nth-child(7) {
  transform: rotate(270deg);
  animation-delay: -0.125s;
  background: #333333;
}.ldio-5o160khqex div:nth-child(8) {
  transform: rotate(315deg);
  animation-delay: 0s;
  background: #333333;
}
.loadingio-spinner-spinner-221tthfz5zp {
  width: 40px;
  height: 40px;
  display: inline-block;
  overflow: hidden;
}
.ldio-5o160khqex {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(0.4);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-5o160khqex div { box-sizing: content-box; }
</style>