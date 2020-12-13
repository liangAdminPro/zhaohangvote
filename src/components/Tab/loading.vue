<template>
	<div class="loading">
		<van-loading type="spinner" color="#1989fa" />
	</div>
</template>

<script>
export default {
	name: "loading",
	data() {
		return {};
	},
	created() {},
	mounted() {},
	methods: {}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
.loading {
	width: 100%;
	height: 100%;
}
.van-loading {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
