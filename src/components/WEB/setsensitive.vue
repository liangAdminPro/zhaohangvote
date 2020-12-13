<!--敏感字设置 -->
<template>
	<div style="width:100%;padding-top:10%;">
		<div class="setsensitive">
			<div class="header">
				<p class="text-center sensi">敏感字设置</p>
				<div class="body" style="padding-top:10px;">
					<label for="set">设置字段</label>
					<input id="set" type="text" placeholder="请输入设置的敏感字" v-model="set" />
				</div>
				<div class="body">
					<label for="replace">代替字段</label>
					<input id="replace" type="text" placeholder="请输入代替的字段" v-model="replace" />
				</div>
				<div class="save text-center">
					<button type="button" class="btn btn-primary">确认设置</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "setsensitive",
	data() {
		return {
			set: "", //敏感字段
			replace: "" //代替字段
		};
	}
};
</script>
<style scoped>
@import "../../assets/web/css/setsensitive.css";
</style>

