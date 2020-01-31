<template>
	<view class="position-fixed top-0 left-0 right-0 bottom-0 animated faster fadeIn" style="background-color: rgba(0,0,0,0.3);z-index: 999;" v-if="showToast" @click.stop="hide">
		<slot></slot>
	</view>
</template>

<script>
export default {
	data() {
		return{
			showToast: false
		}
	},
	methods:{
		show() {
			this.showToast = true
		},
			
		
		hide() {
			this.showToast = false
		}
	}
}
</script>

<style>
</style>
