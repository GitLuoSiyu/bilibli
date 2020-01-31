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
		</view>
		<view style="height: 44px;"></view>
		<!-- #endif -->
		<!--  -->
		<card title="热门分类" :showRefresh="false">
			<!--  -->
			<scroll-view scroll-x class="scroll-row" >
				<icon-cate v-for="(item,index) in list" :key="index" :item="item" :index="index"></icon-cate>
			</scroll-view>
		</card>
		<!--  -->
		<view class="f-divider"></view>
		<!--  -->
		<card title="全部分类">
			<icon-cate v-for="(item,index) in list" :key="index" :item="item" :index="index"></icon-cate>
		</card>
		
	</view>
</template>

<script>
import card from '@/components/common/card.vue';
import iconCate from '@/components/common/icon-cate.vue';
	
export default {
	components:{
		card,iconCate
	},
	data() {
		return {
			list: []
		}
	},
	onLoad() {
		for (let i = 0; i < 10; i++) {
			this.list.push({
				name: "分类",
				cover: "/static/demo/cate/1%20(1).png"
			})
		}
	},
	methods: {
		
	}
}
</script>

<style>

</style>
