<template>
	<view>
		<view :style="'height:' + statusBarHeight + 'px'" class=""></view>
		<view style="height: 44px;" class="flex align-center" @click="back">
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
			<input v-if="type === 'login'" type="text" value="" class="uni-input bg-light rounded mb-4" placeholder="请输入确认密码" />
		</view>
		
		<view class="px-4">
			<main-big-button>{{type === "login" ? "登 录" : "注 册"}}</main-big-button>
		</view>
		
		<view class="flex justify-center align-center py-5">
			<view style="height: 2rpx; background-color: #E3E1DD;width: 100rpx;"></view>
			<view class="text-muted mx-2 font-sm">社交账号登录</view>
			<view style="height: 2rpx; background-color: #E3E1DD;width: 100rpx;"></view>
		</view>
		
		<view class="flex align-center px-5">
			<view class="flex justify-center align-center flex-1">
				<view class="rounded-circle flex justify-center align-center bg-light" style="120rpx; height: 120rpx;">
					<text class="iconfont iconweixin"></text>
				</view>
			</view>
			<view class="flex justify-center align-center flex-1">
				<view class="rounded-circle flex justify-center align-center bg-light" style="120rpx; height: 120rpx;">
					<text class="iconfont iconQQ"></text>
				</view>
			</view>
			<view class="flex justify-center align-center flex-1">
				<view class="rounded-circle flex justify-center align-center bg-light" style="120rpx; height: 120rpx;">
					<text class="iconfont iconxinlangweibo"></text>
				</view>
			</view>
		</view>
		
		<!-- 注册 -->
		<view class="flex justify-center align-center py-5" @click="changeType">
			<view class="text-muted mx-2 font-sm">
				{{ type === "login" ? "注册账号" : "去登录" }}
			</view>
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
			type: "login",
			statusBarHeight:null,
		}
	},
	onLoad() {
		this.statusBarHeight = uni.getSystemInfo().statusBarHeight
	},
	methods: {
		
		// 更改状态
		changeType(){
			this.type = this.type === "login" ? "register" : "login"
		},
		
		// 返回上一页
		back() {
			uni.navigateBack({
				delta: 1
			})
		}
	}
}
</script>

<style>

</style>
