<template>
	<div class="container">
		<!-- 轮播图 -->
		<nav>
			<img :src="vote.cover" @click="$router.push('/active_detail/' + vote._id)" />
			<router-link :to="'/active_detail/'+voteId">
				<div class="rule">投票规则</div>
			</router-link>
		</nav>
		<Cpank></Cpank>
	</div>
</template>

<script>
import Cpank from "../Tab/Component_pank";
import Swiper from "../Tab/swiper";
import * as cmblapi from "cmblapi";
export default {
	name: "panking",
	data() {
		return {
			voteId: this.$route.params.voteId,
			vote: {}
		};
	},
	components: {
		Cpank,
		Swiper
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
	},
	updated() {},
	mounted() {},
	methods: {
		getDetail() {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/vote/info", { voteId: this.voteId })
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.vote = res.data;
						cmblapi.setNavigationBarTitle({ title: res.data.title });
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("加载失败");
					console.error(err);
				});
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/panking.css";
.container {
	background-color: #f1f1f1;
}
</style>
