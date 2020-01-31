<template>
	<view class="px-3 py-2 flex align-center" hover-class="bg-light">
		<text v-if="icon" :class="icon" class="iconfont mr-3"></text>
		<view class="mr-auto font-md">{{title}}</view>
		<view class="text-muted font">
			{{rightText}}<text v-if="showRightIcon" class="iconfont iconjinru ml-1 text-light-muted"></text>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		icon: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		rightText: {
			type: [String,Number],
			default: ""
		},
		showRightIcon: {
			type: Boolean,
			default: true
		}
	},
	methods:{
		
	}
}	
</script>

<style>
	
</style>
