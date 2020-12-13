<template>
	<div class="container">
		<nav>
			<div class="center">
				<i class="icon iconfont icon-dui- dui"></i>
				<p class="thank">
					感谢投票，您还能投
					<span style="color:red;font-size:2.2rem;">{{info.leftvotecount}}</span> 票
				</p>
				<p class="rank">
					<i class="icon iconfont icon_index-paihang icon-icon_index-paihang"></i>
					<router-link :to="'/panking/'+voteId">
						<i>查看排行榜</i>
					</router-link>
				</p>
				<div class="content" style="padding-top: 5%;">
					<p class="no-thank" style="color:#000;" @click="goback()">返回</p>
				</div>
			</div>
		</nav>
		<div class="content" v-if="info.lotteryUrl">
			<p class="thanks" v-if="info.lotteryDesc" v-html="info.lotteryDesc"></p>
			<p class="b_bottom" @click="golottery()">
				<i class="icon iconfont icon-shimingrenzheng"></i>
				<i>我要抽奖</i>
			</p>
			<p class="no-thank" @click="giveup()">不了，谢谢</p>
		</div>
		<!-- <div class="content" v-if="info.bindvote">
			<p class="thanks">为了感谢您对{{info.title}}活动的大力支持，诚邀你参加‘{{info.bindvote.title}}’的投票活动。神秘大奖等你拿。</p>
			<p class="b_bottom">
				<i class="icon iconfont icon-shimingrenzheng"></i>
				<router-link :to="'/participate_best/'+info.bindvote._id">
					<i>我要参与</i>
				</router-link>
			</p>
			<p class="no-thank" @click="goback()">不了，谢谢</p>
		</div>-->
	</div>
</template>

<script>
import * as cmblapi from "cmblapi";
export default {
	name: "success",
	data() {
		return {
			voteId: this.$route.params.voteId, //主活动ID
			itemId: this.$route.query.itemId,
			info: {}
		};
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
					clickContent: "history.go(-1)"
				}
			],
			success: function() {},
			fail: function(res) {}
		});
		this.getinfo();
	},
	mounted() {
		$("#app").css({
			background: "url(/voteSrv/static/img/bg.3d7f049.png)",
			"background-size": "100% 100%",
			"padding-bottom": "3rem"
		});
	},
	methods: {
		// 点击不了，回退到投票页
		getinfo() {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/vote/info", {
				voteId: this.voteId,
				itemId: this.itemId
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.info = res.data;
						cmblapi.setNavigationBarTitle({ title: res.data.title });
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
		},
		goback() {
			// this.$router.push({ path: "/list" });
			history.go(-1);
		},
		golottery() {
			console.log("去抽奖", this.info.lotteryUrl);
			window.location.href = this.info.lotteryUrl;
			// cmblapi.pushWindow({
			// 	url: this.info.lotteryUrl,
			// 	navigationBarProperties: {
			// 		showNavigationBar: true
			// 	},
			// 	success: function() {},
			// 	fail: function(res) {}
			// });
		},
		giveup() {
			this.$confirm("确定要放弃抽奖机会吗?", "提示", {
				confirmButtonText: "放弃",
				cancelButtonText: "不放弃",
				type: "warning",
				center: true
			})
				.then(() => {
					this.goback();
				})
				.catch(err => err);
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/success.css";
</style>
