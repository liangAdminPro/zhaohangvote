<template>
	<div class="container">
		<!-- 轮播图 -->
		<nav>
			<Swiper></Swiper>
			<!-- 轮播 -->
		</nav>
		<div class="content">
			<img id="none" v-show="itemlist.length==0" src="@/assets/img/search-none.png" alt />
			<van-list
				v-show="itemlist.length!==0"
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				style="width:100%;"
				@load="getlist"
			>
				<div class="item" v-for="(item,i) in itemlist" :key="i">
					<div class="items">
						<router-link :to="'/active_detail/'+item._id" class="b_right">
							<img :src="item.cover" alt />
							<div class="bottom">
								<div class="b_left">
									<p>{{item.title}}</p>
									<p class="time">
										<i class="icon iconfont icon-iconfront-"></i>
										{{item.start|dateFormat}} ~ {{item.end|dateFormat}}
									</p>
								</div>
							</div>
						</router-link>
					</div>
				</div>
			</van-list>
		</div>
		<van-tabbar v-model="active">
			<van-tabbar-item name="home" :to="'/list' + (tags?'/'+tags:'')" icon="home-o">首页</van-tabbar-item>
			<van-tabbar-item name="friends" to="/myinfo" icon="contact">我的</van-tabbar-item>
		</van-tabbar>
		<loading v-show="isloading"></loading>
	</div>
</template>

<script>
import loading from "../Tab/loading";
import Swiper from "../Tab/swiper";
import * as cmblapi from "cmblapi";
import _ from "underscore";
export default {
	name: "list",
	data() {
		return {
			// 活动列表
			itemlist: [],
			isloading: false,
			active: 0,
			loading: false,
			finished: false,
			page: 1,
			limit: 10,
			tags: this.$route.params.tags || ""
		};
	},
	created() {
		cmblapi.setNavigationBarTitle({ title: "首页" });
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
		this.getlist();
	},
	methods: {
		getlist() {
			this.tags = this.$route.params.tags || "";
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/vote/list", {
				page: this.page,
				limit: this.limit,
				tags: this.tags
			})
				.then(res => {
					if (res.code == 0) {
						this.$toast.clear();
						if (this.itemlist.length == 0) {
							this.itemlist = res.data.data;
						} else {
							this.itemlist.push(
								..._.filter(
									res.data.data,
									n => !_.findWhere(this.itemlist, { _id: n._id })
								)
							);
						}
						this.finished = !res.data.loadmore;
						this.page++;
					} else {
						this.$toast.fail(res.msg);
					}
					this.loading = false;
				})
				.catch(err => {
					// console.error(err);
					this.$toast.fail("加载失败");
					this.loading = false;
				});
		}
	},
	components: {
		loading,
		Swiper
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/list.css";
#none {
	display: block;
	margin: 20% auto;
	width: 30%;
}
</style>
