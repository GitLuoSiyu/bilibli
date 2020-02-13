<template>
	<view>
		<view style="height: 350rpx;" class="bg-light position-relative" hover-class="bg-hover-light" @tap="upload">
			<image v-if="form.cover" :src="form.cover" mode="aspectFill"
			style="width: 750rpx;height: 350rpx;"></image>
			<view class="position-absolute left-0 right-0 top-0 bottom-0 flex flex-column align-center justify-center" style="background-color: rgba(255,255,255,0.2);">
				<text v-if="!form.cover" class="iconfont iconjia" style="font-size: 50rpx;"></text>
				<text class="font text-muted">点击{{form.cover ? '切换' : '添加'}}封面图</text>
			</view>
		</view>
		<form-item label="标题">
			<input type="text" v-model="form.title" placeholder="请填写视频标题" placeholder-class="text-light-muted" class="w-100 pr-5"/>
		</form-item>
		<picker mode="selector" :range="range" @change="change">
			<form-item label="分类" rightIcon>
				<input type="text" v-model="form.category" placeholder="请填写视频标题" placeholder-class="text-light-muted" class="w-100 pr-5" disabled/>
			</form-item>
		</picker>
		<form-item label="描述">
			<textarea v-model="form.desc" placeholder="请填写视频描述" style="width: 550rpx;" class="py-3"/>
		</form-item>
		<!-- #ifdef MP -->
		<view class="py-2 px-3">
			<main-big-button @tap="submit">发 布</main-big-button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import formItem from '@/components/common/form-item.vue';
import mainBgButton from '@/components/common/main-bg-button.vue';	

export default {
	components: {
		formItem,mainBgButton
	},
	data() {
		return {
			form:{
				cover:"",
				title:"",
				category:"",
				desc:""
			},
			range:["分类1","分类2","分类3"]
			
		};
	},
	methods: {
		// 点击添加封面图
		upload() {
			console.log('点击添加封面图')
			uni.chooseImage({
				count:1,
				sizeType:["compressed"],
				success: (res) => {
					this.form.cover = res.tempFilePaths[0]
				}
			});
		},
		
		// picker change
		change(e) {
			// console.log(e.detail.value)
			this.form.category = this.range[e.detail.value]
		},
		
		
		// 发布
		submit() {
			console.log('发布')
		}
	}
};
</script>

<style></style>
