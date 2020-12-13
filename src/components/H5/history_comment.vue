<template>
	<div class="container">
		<nav>
			<Swiper></Swiper>
		</nav>
		<Cpank></Cpank>
	</div>
</template>

<script>
import Cpank from "../Tab/Component_pank";
import Swiper from "../Tab/swiper";
import * as cmblapi from "cmblapi";
export default {
	name: "history_comment",
	data() {
		return {};
	},
	created() {
		cmblapi.setNavigationBarTitle({ title: "我的投票" });
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
					clickContent: "window._doRouterPush('/myinfo')"
				}
			],
			success: function() {},
			fail: function(res) {}
		});
	},
	components: {
		Cpank,
		Swiper
	},
	mounted() {},
	methods: {}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/panking.css";
.container {
	background: #f1f1f1;
}
</style>
