<template>
	<div class="header">
		<header>
			<i class="icon iconfont icon-zuo" @click="back()"></i>
			<p v-text="text"></p>
			<i class="icon iconfont icon-fenxiang- share"></i>
		</header>
	</div>
</template>

<script>
export default {
	name: "header",
	data() {
		return {
			path: this.$route.name,
			text: "",
			router: [
				{
					path: "info",
					title: "查看个人信息"
				},
				{
					path: "myinfo",
					title: "个人中心"
				},
				{
					path: "active_detail",
					title: "活动介绍"
				},
				{
					path: "history_comment",
					title: "投票历史"
				},
				{
					path: "list",
					title: "投票列表"
				},
				{
					path: "mysign",
					title: "我的报名"
				},
				{
					path: "panking",
					title: "排行榜"
				},
				{
					path: "participate_best",
					title: "报名最佳助威人"
				},
				{
					path: "participate",
					title: "报名参加活动"
				},
				{
					path: "partner_detail",
					title: "参赛者详情"
				},
				{
					path: "rule",
					title: "活动规则"
				},
				{
					path: "success",
					title: "投票成功"
				}
			]
		};
	},
	created() {
		this.getTitle();
		$("#app").css({ background: "#f1f1f1" });
	},
	mounted() {},
	methods: {
		getTitle() {
			this.router.forEach((item, value) => {
				if (this.path == item.path) {
					this.text = item.title;
				}
			});
		},
		back() {
			history.go(-1);
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
header {
	padding: 1rem 2rem;
	line-height: 2rem;
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
	font-size: 1.7rem;
	background-color: #f9f9f9;
}
header i.icon {
	font-size: 2rem;
}
.container header .share {
	font-size: 2.4rem;
}
</style>
