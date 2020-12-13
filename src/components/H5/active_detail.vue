<template>
	<div class="container">
		<nav>
			<img :src="data.cover" />
			<div class="bottom">
				<p class="b_left" v-if="data.self_registration">
					<i class="icon iconfont icon-shimingrenzheng"></i>
					<router-link :to="'/participate/'+voteId">
						<i>我要参与</i>
					</router-link>
				</p>
				<p class="b_right">
					<i class="icon iconfont icon-zan01 xin"></i>
					<router-link :to="'/panking/'+voteId">
						<i>我要投票</i>
					</router-link>
				</p>
			</div>
		</nav>
		<div class="content">
			<h4>
				活动介绍
				<span></span>
			</h4>
			<div class="item">
				<div class="i_content" v-html="data.desc"></div>
			</div>
		</div>
		<loading v-show="isloading"></loading>
	</div>
</template>

<script>
import loading from "../Tab/loading";
import * as cmblapi from "cmblapi";
export default {
	name: "active_detail",
	data() {
		return {
			data: {},
			voteId: this.$route.params.voteId,
			isloading: true
		};
	},
	components: {
		loading
	},
	created() {
		cmblapi.setRightNavigationBar({
			btnType: "customize",
			btnContent: [
				{
					iconSource: "inner",
					iconContent: "more_btn.png",
					iconColor: "#000000",
					clickAction: "dropdown",
					clickContent: [
						{
							title: "我的",
							titleColor: "#000000",
							iconSource: "inner",
							iconContent: "popmenu_message.png",
							iconColor: "#000000",
							clickAction: "executeJs",
							clickContent: "window._doRouterPush('/myinfo')"
						},
						{
							title: "首页",
							titleColor: "#000000",
							iconSource: "inner",
							iconContent: "popmenu_home.png",
							iconColor: "#000000",
							clickAction: "executeJs",
							clickContent: "window._doRouterPush('/list')"
						}
					]
				}
			],
			success: function() {},
			fail: function(res) {}
		});
		cmblapi.setLeftNavigationBar({
			btnType: "goBack",
			btnContent: [
				{
					clickAction: "executeJs",
					clickContent: "window._doRouterPush('/list')"
				}
			],
			success: function() {},
			fail: function(res) {}
		});
		this.getDetail();
		$("#app").css("background", "#f1f1f1");
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
							"line-height": "2rem",
							color: "#868686",
							"font-size": "1.4rem",
							"padding-bottom": "1rem"
						});
					} else {
						this.$toast.fail(res.msg);
					}
					this.isloading = false;
				})
				.catch(err => {
					this.$toast.fail("加载失败");
					this.isloading = false;
				});
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/list_detail.css";
</style>
