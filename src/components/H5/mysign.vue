<template>
	<div class="container">
		<div class="content" v-show="itemlist.length!==0&&!show">
			<div
				class="item"
				v-for="(item,i) in itemlist"
				v-show="item.state!=2"
				:key="i"
				@click.stop.prevent="check(item)"
			>
				<img :src="item.cover" style="max-height:18rem;" alt />
				<div class="detail" @click="check(item)">查看详情</div>
				<div class="bottom" style="display:flex;justify-content: space-between; align-items: center;">
					<div>{{item.titleprefix || ''}}{{item.title}}</div>
					<van-tag
						style="padding:0.1rem 0.2rem;"
						:type="item.state==0?'success':'danger'"
					>{{item.state==0?'审核通过':item.state == -1 ? '待审核' :'审核不通过'}}</van-tag>
				</div>
			</div>
		</div>
		<div class="content" v-show="itemlist.length===0||show">
			<img id="none" src="@/assets/img/search-none.png" alt />
		</div>
		<loading v-show="isloading"></loading>
	</div>
</template>

<script>
import loading from "../Tab/loading";
import * as cmblapi from "cmblapi";
export default {
	name: "mysign",
	data() {
		return {
			isloading: true,
			data: {},
			itemlist: [],
			show: false,
			length: 0
		};
	},
	components: {
		loading
	},
	created() {
		cmblapi.setNavigationBarTitle({ title: "我的报名" });
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
		$("#app").css("background", "#f1f1f1");
		this.getlist();
	},
	mounted() {},
	methods: {
		getlist() {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/item/my", {})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.itemlist = res.data;
						this.getshow();
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
		check(item) {
			if (item.state !== 0) {
				this.$toast.fail("您的报名信息还未审核，请耐心等待，我们会尽快审核。");
			} else {
				this.$router.push({ path: "/partner_detail/" + item._id });
			}
		},
		getshow() {
			for (var i = 0; i < this.itemlist.length; i++) {
				if (this.itemlist[i].state == 2) {
					this.length++;
				}
			}
			if (this.itemlist.length == this.length) {
				this.show = true;
			} else {
				this.show = false;
			}
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
.container {
	background-color: #f1f1f1;
}
/* 投票列表 */
.content {
	width: 100%;
	padding: 0.8rem;
	margin-bottom: 5rem;
}
.content .item {
	display: flex;
	flex-direction: column;
	background-color: #fff;
	padding: 0.9rem;
	border-radius: 6px;
	margin: 0 auto 1rem;
	position: relative;
}
.content .item img {
	flex: 6;
	width: 100%;
	margin-bottom: 1rem;
}

.content .item .detail {
	position: absolute;
	top: 1rem;
	padding: 0.5rem 1rem;
	right: 1rem;
	border-radius: 1.5rem 0 0 1.5rem;
	background-color: rgba(0, 0, 0, 0.4);
	text-align: right;
	color: #fff;
	align-items: center;
}
#none {
	display: block;
	margin: 20% auto;
	width: 30%;
}
</style>
