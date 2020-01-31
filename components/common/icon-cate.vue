<template>
	<view class="icon-cate">
		<image :src="item.cover" style="width: 70rpx; height: 70rpx;" class="bg-light"></image>
		<text class="text-muted mt-1 font">{{item.name}}</text>
	</view>
</template>

<script>

export default {
	props:{
		item: Object,
		index: [Number,String]
	}
}
	
</script>

<style>
.icon-cate {
	width: 187.5rpx;
	height: 187.5rpx;
	line-height: 1;
	display: inline-flex !important;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
