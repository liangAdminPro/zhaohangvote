<template>
	<div class="container">
		<div class="content">
			<p>参赛规则:</p>
			<div class="i_content" v-html="data.desc"></div>
			<p>投票规则:</p>
			<div class="i_content" v-html="data.ruledesc"></div>
		</div>
		<loading v-show="isloading"></loading>
	</div>
</template>

<script>
import loading from "../Tab/loading";
import * as cmblapi from "cmblapi";
export default {
	name: "rule",
	data() {
		return {
			voteId: this.$route.params.voteId,
			isloading: true,
			data: {}
		};
	},
	created() {
		this.getDetail();
	},
	components: {
		loading
	},
	mounted() {},
	methods: {
		getDetail() {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/vote/info", { voteId: this.voteId })
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.data = res.data;
						cmblapi.setNavigationBarTitle({ title: res.data.title });
						$(".i_content").css({
							margin: "0 0.5rem  0 1.5rem",
							"line-height": "3rem",
							color: "#868686",
							"font-size": "1.6rem"
						});
					} else {
						this.$toast.fail(res.msg);
					}
					this.isloading = false;
				})
				.catch(err => {
					this.$toast.fail("加载失败");
					this.isloading = false;
					console.error(err);
				});
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
.container {
	background-color: #f9f9f9;
}
/* 头部 */
header {
	padding: 10px 20px;
	line-height: 30px;
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
}
header i.icon {
	font-size: 20px;
}
.container header .share {
	font-size: 24px;
}

.content {
	/* background-color: #fff; */
	width: 100%;
	padding: 20px;
	font-size: 14px;
}
.content p {
	font-size: 18px;
	padding: 10px 0;
}
.content .i_content {
	line-height: 30px;
	/* text-indent: 2em; */
}
</style>
