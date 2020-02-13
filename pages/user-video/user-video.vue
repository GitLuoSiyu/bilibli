<template>
	<view>
		<view v-for="(item, index) in list" :key="index">
			<media-list :item="item" :index="index"></media-list>
			<view class="flex" style="height: 100rpx;">
				<view class="flex-1 flex align-center justify-center" hover-class="bg-light">修改</view>
				<view class="flex-1 flex align-center justify-center" hover-class="bg-light">视频</view>
				<view class="flex-1 flex align-center justify-center" hover-class="bg-light">删除</view>
			</view>
			<view class="f-divider"></view>
		</view>
	</view>
</template>

<script>
import mediaList from '@/components/common/media-list.vue';	
	
export default {
	components:{
		mediaList
	},
	data() {
		return {
			list: [
				{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				}
			]
		}
	},
	methods: {
		
	}
}
</script>

<style>

</style>
