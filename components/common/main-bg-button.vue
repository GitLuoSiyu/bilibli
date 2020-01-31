<template>
	<view class="py-3 rounded-circle bg-main flex align-center justify-center font text-white" hover-class="bg-main-hover" @click="$emit('click')">
		<slot></slot>
	</view>
</template>

<script>
export default {
	props:{
		
	}
}
</script>

<style>
</style>
