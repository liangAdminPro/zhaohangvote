<template>
	<div class="container">
		<nav>
			<div class="center">
				<div class="img">
					<img :src="info.avatar" alt />
				</div>
				<p class="name">{{info.name||'非持卡用户'}}</p>
				<p class="phone" v-if="info.phone">{{info.phone}}</p>
				<p class="phone2" v-else>非持卡用户</p>
			</div>
		</nav>
		<div class="content">
			<router-link to="/mysign">
				<div class="item">
					<div class="left">
						<img src="../../assets/img/myinfo/mysign.png" alt />
						<i>我的报名</i>
					</div>

					<div class="right">
						<i class="icon iconfont icon-htbArrowright"></i>
					</div>
				</div>
			</router-link>
			<router-link to="/history_comment">
				<div class="item">
					<div class="left">
						<img src="../../assets/img/myinfo/myzan.png" alt />
						<i>我的投票</i>
					</div>

					<div class="right">
						<i class="icon iconfont icon-htbArrowright"></i>
					</div>
				</div>
			</router-link>
		</div>
		<loading v-show="isloading"></loading>
		<van-tabbar v-model="active">
			<van-tabbar-item name="home" :to="'/list' + (tags?'/'+tags:'')" icon="home-o">首页</van-tabbar-item>
			<van-tabbar-item name="friends" to="/myinfo" icon="contact">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
import loading from "../Tab/loading";
import * as cmblapi from "cmblapi";
import Cookies from "js-cookie";
export default {
	name: "myinfo",
	data() {
		return {
			isloading: true,
			info: {},
			active: 1,
			tags: Cookies.get("cmb.ListTags")
		};
	},
	components: {
		loading
	},
	created() {
		cmblapi.setNavigationBarTitle({ title: "我的" });
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
			btnContent: [{ clickAction: "default" }],
			success: function() {},
			fail: function(res) {}
		});
		this.getuserinfo();
	},
	mounted() {},
	methods: {
		getuserinfo() {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/user/info", {})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.info = res.data;
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
@import "../../assets/css/myinfo.css";
</style>
