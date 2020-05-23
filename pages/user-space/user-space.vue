<template>
	<view>
		<!-- 背景图 -->
		<image src="/static/demo/list2/3.jpg" mode="aspectFill" style="width: 100%; height: 320rpx;"></image>

		<view style="height: 350rpx;" class="border-bottom">
			<view class="flex justify-between align-center px-3">
				<image src="/static/demo/6.jpg" mode="" class="rounded-circle" style="width: 130rpx; height: 130rpx; margin-top: -60rpx;"></image>
				<view class=" flex justify-center align-center rounded bg-main text-white py-1 px-2" hover-class="bg-main-hover"><text class="font">关注</text></view>
			</view>

			<view class="px-4 flex align-center py-1">
				<view class="font-lg text-main font-weight-bold">昵称</view>
				<text class="font text-light-muted ml-2">UID: 123456</text>
			</view>
			<view class="flex align-center px-4 mt-2"><view class="rounded font-sm bg-main text-white px-1">年度大会员</view></view>
			<view class="flex align-center px-4 mt-2">
				<view class="font-md text-dark flex align-center">
					21
					<text class="ml-2 font-sm text-light-muted">关注</text>
				</view>
				<view class="font-md text-dark flex align-center ml-2">
					221
					<text class="ml-2 font-sm text-light-muted">粉丝</text>
				</view>
			</view>

			<view class="px-4">
				<view class="text-ellipsis font-sm text-light-muted" style="line-height: 1.5;">
					年度大会员年度大会员年度大会员年度大会员年度大会员年度大会员年度大会员年度大会员年度大会员
				</view>
			</view>
		</view>
		
		<view class="flex align-center" style="height: 44px;">
			<view class="flex-1 flex align-center justify-center" v-for="(item,index) in tabBars"  :key="index" @click="changeTab(index)"> 
				<text class="font-md font" :class="tabIndex === index ? 'text-main' : '' ">{{item.name}}</text>
			</view>
		</view>
		<view class="f-divider"></view>
		
			<swiper :current="tabIndex" :duration="300" :style="'height:' + scrollHeight + 'px'" @change="changeSwiper">
				<swiper-item v-for="(tab, tabIndex) in tabBars" :key="tabIndex">
							<scroll-view scroll-y="true" :style="'height:' + scrollHeight + 'px'" class="">
					<view class="swiper-item">
							<view class="f-divider"></view>
							<media-list v-for="(item, index) in list" :key="index"></media-list>
						</view>
						</scroll-view>
					</swiper-item>
				</swiper-item>
			</swiper>
		
		
	</view>
</template>

<script>
import mediaList from "@/components/common/media-list.vue"	
	
export default {
	components:{
		mediaList
	},
	data() {
		return {
			scrollHeight: 0,
			tabIndex: 0,
			tabBars: [{
				name: "主页"
			},{
				name: "动态"
			},{
				name: "作品"
			},{
				name: "收藏"
			}],
			
			list: [
				{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},
				{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},
				{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				}
			]
			
		};
	},
	created() {
		const res = uni.getSystemInfo()
		this.scrollHeight = res.windowHeight - 44 - 44 -res.statusBarHeight
	},
	methods: {
		
		// 切换
		changeTab(index) {
			this.tabIndex = index
		},
		
		// changeSwiper
		changeSwiper(e) {
			console.log(e.detail.current)
			
			
		}
	}
};
</script>

<style></style>
