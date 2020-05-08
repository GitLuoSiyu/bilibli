<template>
	<view>
		<view :style="'height:' + statusBarHeight + 'px'" class=""></view>
		<view style="height: 44px;" class="flex align-center">
			<view class="flex justify-center align-center animated fast" style="width: 44px; height: 44px;" hover-class="text-main pulse">
				<text class="iconfont iconfanhui font-lg"></text>
			</view>
		</view>
		
		<view class="flex justify-center align-center font-lg text-muted" style="margin-top: 100rpx; margin-bottom: 80rpx;">
			欢迎回来
		</view>
		
		<view class="px-4">
			<input type="text" value="" class="uni-input bg-light rounded mb-4" placeholder="手机号/用户名/邮箱" />
			<input type="text" value="" class="uni-input bg-light rounded mb-4" placeholder="请输入密码" />
		</view>
		
		<view class="px-4">
			<main-big-button>登 录</main-big-button>
		</view>
		
		<view class="flex justify-center align-center py-5">
			<view style="height: 2rpx; background-color: #E3E1DD;width: 100rpx;"></view>
			<view class="text-muted mx-2 font-sm">社交账号登录</view>
			<view style="height: 2rpx; background-color: #E3E1DD;width: 100rpx;"></view>
		</view>
		
	</view>
</template>

<script>
	
import mainBigButton from "@/components/common/main-bg-button.vue"	
export default {
	components:{
		mainBigButton
	},
	data() {
		return {
			statusBarHeight:null,
		}
	},
	onLoad() {
		this.statusBarHeight = uni.getSystemInfo().statusBarHeight
	},
	methods: {
		
	}
}
</script>

<style>

</style>
