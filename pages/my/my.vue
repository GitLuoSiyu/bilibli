<template>
	<view>
		<!-- head-img -->
		<view class="p-3 flex align-center">
			<image src="../../static/demo/6.jpg" style="width: 120rpx; height: 120rpx;" class="bg-light rounded-circle flex-shrink"></image>
			<view class="flex flex-column pl-3 flex-1">
				<view class="font-md text-dark">summer<text class="font-sm text-muted ml-3">男 广东</text></view>
				<text class="font-sm text-muted">迪沙学院编程创始人</text>
			</view>
		</view>
		<view class="f-divider"></view>
		<!--  -->
		<f-list-item icon="iconshipin" title="我的作品" :showRightIcon="false" :rightText="26" @click="navigateTo('user-video')"></f-list-item>
		<f-list-item icon="iconshoucang1" title="收藏" @click="navigateTo('user-fava')"></f-list-item>
		<f-list-item icon="iconguanzhu" title="关注" :rightText="365"></f-list-item>
		<f-list-item icon="iconlishi" title="历史记录"></f-list-item>
		<view class="f-divider"></view>
		<view class="py-2 px-3">
			<main-bg-button @click="addMsg">立即投稿</main-bg-button>
		</view>
		
		<!-- 弹框 -->
		<f-popup ref="popup">
			<view class="position-absolute left-0 right-0 bg-white bottom-0 animated faster fadeIn">
				<view class="flex" style="height: 200rpx;">
					<!-- 单集 -->
					<view class="flex-1 flex justify-center align-center flex-column" hover-class="bg-light" @click="navigateTo('create')">
						<text class="iconfont icondingdanwenjian flex justify-center align-center text-white bg-primary rounded-circle" style="width: 80rpx; height: 80rpx;"></text>
						<text class="font mt-1 text-muted">单集</text>
					</view>
					<!-- 连载 -->
					<view class="flex-1 flex justify-center align-center flex-column" hover-class="bg-light">
						<text class="iconfont icondingdanwenjian flex justify-center align-center text-white bg-primary rounded-circle" style="width: 80rpx; height: 80rpx;"></text>
						<text class="font mt-1 text-muted">连载</text>
					</view>
				</view>
				<view class="f-divider"></view>
				<view class="py-2 flex justify-center align-center font-md text-muted" hover-class="bg-light" @click.stop="hidePopup">
					取消
				</view>
			</view>
		</f-popup>
		
	</view>
</template>

<script>
import fListItem from '@/components/common/f-list-item.vue';
import mainBgButton from '@/components/common/main-bg-button.vue';
import fPopup from '@/components/common/f-popup.vue';
export default {
	components:{
		fListItem,mainBgButton,fPopup
	},
	data() {
		return {
			showToast: false,
		}
	},
	methods: {
		
		// 选择投稿类型
		addMsg() {
			this.$refs.popup.show()
		},
		
		hidePopup() {
			this.$refs.popup.hide()
		},
		
		navigateTo(path) {
			uni.navigateTo({
				url:"/pages/" + path + "/" + path,
			})
		}
	}
}
</script>

<style>

</style>
