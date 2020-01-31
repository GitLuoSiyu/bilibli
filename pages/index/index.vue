<template>
	<view>
		
		<!-- #ifdef MP -->
		<!-- 导航栏 -->
		<view class="flex align-center fixed-top" style="height: 44px;">
			<!-- 搜索框 -->
			<view class="ml-2 flex align-center flex-1 rounded-circle px-1" style="background-color: #F6F7F8;color: #959FA0;">
				<text class="iconfont iconsousuokuang"></text>
				<text>精彩热搜：帝莎编程学院</text>
			</view>
			<view class="flex align-center px-2" style="color: #959FA0;">分类</view>
		</view>
		<view style="height: 44px;"></view>
		<!-- #endif -->
		
		<!-- 轮播图组件 -->
		<view class="px-3 py-2">
			<swiper-dot :info="swipers" :current="current">
				<swiper :current="current" circular :autoplay="true" :interval="3000" :duration="150" style="height: 250rpx;" @change="changeSwiper">
					<swiper-item v-for="(item,index) in swipers" :key="index">
						<image :src="item.src" mode="aspectFill"
						style="height: 250rpx;width: 100%;"
						class="rounded-lg"></image>
					</swiper-item>
				</swiper>
			</swiper-dot>
		</view>
		
		<!-- 列表样式一 -->
		<card title="为你推荐">
		<view class="f-list">
			<view v-for="i in 6" :key="i" style="margin-left: 15rpx;margin-right: 15rpx;min-height: 5rpx;width:328rpx;position: relative;" class="rounded-lg border mb-2">
				<image src="/static/demo/list2/1.jpg" style="width: 100%;height: 220rpx;" class="rounded-top-lg"></image>
				<view style="height: 65rpx;background-image: linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.8));position: absolute;left: 0;right: 0;top: 155rpx;" class="text-white flex align-center">
					<text class="iconfont iconbofangshu font-md mx-1"></text>
					<text class="font-sm">203.6万</text>
					<text class="iconfont icondanmushu font-md mx-1"></text>
					<text class="font-sm">6910</text>
				</view>
				<view class="px-1 pb-1">
					<view class="font">
						标题
					</view>
					<view class="flex align-center justify-between text-light-muted">
						<text class="font">恶搞</text>
						<text class="iconfont icongengduo"></text>
					</view>
				</view>
			</view>
		</view>
		</card>
		<!--  -->
		<view class="f-divider"></view>
		<!-- 列表样式二 -->
		<card title="为你推荐">
		<view class="f-list">
			<view v-for="i in 6" :key="i" style="margin-left: 15rpx;margin-right: 15rpx;min-height: 5rpx;width:210rpx;position: relative;" class="rounded-lg mb-2">
				<image src="/static/demo/list3/1.webp" style="width: 100%;height: 280rpx;" class="rounded-lg"></image>
				<view style="height: 65rpx;background-image: linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.8));position: absolute;left: 0;right: 0;top: 215rpx;" class="text-white flex align-center rounded-bottom-lg">
					<text class="iconfont iconbofangshu font-md mx-1"></text>
					<text class="font-sm">203.6万</text>
				</view>
				<view class="font">标题</view>
			</view>
		</view>
		</card>
		<!--  -->
		<view class="f-divider"></view>
		<!-- 列表样式三 -->
		<card title="为你推荐">
		<view class="f-list">
			<view v-for="i in 6 " :key="i" style="width: 100%;" class="flex align-center py-2 border-bottom">
				<image src="/static/demo/list2/1.jpg" style="width: 260rpx;height: 160rpx;" class="rounded-lg mx-2 flex-shrink"></image>
				<view class="flex-1 flex flex-column">
					<text class="font" style="line-height: 1.2;">Uni-app第三季实战仿微信教程上线了</text>
					<text class="font-sm text-light-muted mt-auto">今天06:00</text>
					<view class="flex align-center justify-between text-muted line-h">
						<view class="line-h">
							<text class="iconfont iconbofangshu font-md mx-1"></text>
							<text class="font-sm">203.6万</text>
						</view>
						<view class="line-h">
							<text class="iconfont icondanmushu font-md mx-1"></text>
							<text class="font-sm">6910</text>
						</view>
						<text class="iconfont icongengduo"></text>
					</view>
				</view>
			</view>
		</view>
		</card>
	</view>
</template>

<script>
	import swiperDot from '@/components/common/swiper-dot.vue';
	import card from '@/components/common/card.vue';
	export default {
		components: {
			swiperDot,
			card
		},
		data() {
			return {
				current:0,
				swipers: [{
					src:"/static/demo/swiper/1.jpg",
					title:"Uni-app第三季实战仿微信教程上线了"
				},{
					src:"/static/demo/swiper/2.jpg",
					title:"Uni-app第五季实战企业网盘上线了"
				},{
					src:"/static/demo/swiper/3.jpg",
					title:"Uni-app第二季实战商城项目上线了"
				}]
			}
		},
		onLoad() {

		},
		onNavigationBarSearchInputClicked() {
			console.log('点击了搜索框');
		},
		onNavigationBarButtonTap(e) {
			console.log("点击了按钮");
		},
		methods: {
			changeSwiper(e){
				this.current = e.detail.current
			}
		}
	}
</script>

<style>
	.f-list{
		display: flex;
		flex-wrap: wrap;
		padding-left: 15rpx;
		padding-right: 15rpx;
	}
</style>
