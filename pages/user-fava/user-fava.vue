<template>
	<view class="">
		<view v-for="(item, index) in list" :key="index">
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="bindClick">
					<media-list :item="item" :index="index"></media-list>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>s
	</view>
</template>

<script>
import mediaList from '@/components/common/media-list.vue';		
import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action.vue';	
import uniSwipeActionItem from '@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
	components:{
		mediaList,uniSwipeAction,uniSwipeActionItem
	},
	data() {
		return {
			options: [{
				text: "取消收藏"
			}],
			list:[
				{
					id:0,
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					id:1,
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					id:2,
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					id:3,
					cover: '/static/demo/list2/1.jpg',
					title: 'Uni-app第二季实战商城项目上线了',
					create_time: '今天06:00',
					play_count: 0,
					danmu_count: 0
				},{
					id:4,
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
		
		// 点击取消收藏
		bindClick(e,item) {
			console.log(e,item);
			uni.showToast({
				title: `点击了${e.content.text}按钮`,
				icon: "none"
			})
		}
	}
}
</script>

<style>

</style>
