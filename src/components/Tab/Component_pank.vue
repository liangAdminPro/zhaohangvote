<template>
	<div>
		<div class="content" v-show="itemlist.length">
			<h4>
				排行榜
				<span></span>
			</h4>
			<div class="i_content">
				<van-list
					v-model="loading"
					:finished="finished"
					finished-text="没有更多了"
					style="width:100%;"
					@load="getitemlist"
				>
					<div class="item" v-for="(item,i) in itemlist" :key="i">
						<router-link :to="'/partner_detail/'+item._id">
							<i
								:class="[{'icon iconfont icon-wangguan- wangguan':i==0},
							{'icon iconfont icon-wangguan- wangguan wangguan1':i==1},
							{'icon iconfont icon-wangguan- wangguan wangguan2':i==2}]"
							></i>
							<i :class="i>2?'num1':'num'">{{i+1}}</i>
							<div class="i_top">
								<img :src="item.cover" alt />
							</div>

							<div class="i_bottom">
								<p>{{item.titleprefix}}{{item.title}}</p>
								<p>
									<i>{{item.votecount}}</i>票
								</p>
								<template v-if="isMPBank()">
									<button @click.stop.prevent="zan(i)" v-if="item.voteable">
										<i class="icon iconfont icon-zan01 xin"></i>我要投票
									</button>
									<button v-else-if="item.voted" class="yizan">您已投票</button>
								</template>
							</div>
						</router-link>
					</div>
				</van-list>
				<loading v-show="isloading"></loading>
			</div>
		</div>
		<div class="content" v-show="!itemlist.length" style="margin-top:1rem;background:transparent;">
			<img id="none" src="@/assets/img/search-none.png" alt />
		</div>
	</div>
</template>

<script>
import loading from "./loading";
import _ from "underscore";
export default {
	name: "Cpank",
	data() {
		return {
			voteId: this.$route.params.voteId,
			itemlist: [],
			router: this.$route.name,
			isloading: false,
			//   列表加载的参数
			loading: false,
			finished: false,
			refresh: false, //刷新当前列表数据
			//   页码设置
			page: 1,
			limit: 20
		};
	},
	created() {
		this.getitemlist();
	},
	components: {
		loading
	},
	mounted() {},
	methods: {
		isMPBank() {
			return this.$isMPBank();
		},
		getitemlist() {
			if (this.router == "panking") {
				this.$toast.loading({ message: "" });
				this.$post("/voteSrv/mapi/item/listbyvotecount", {
					voteId: this.voteId,
					page: this.page,
					limit: this.limit,
					refresh: this.refresh
				})
					.then(res => {
						this.$toast.clear();
						if (res.code == 0) {
							if (this.itemlist.length == 0 || this.refresh) {
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
							if (this.refresh) this.refresh = false;
							else this.page++;
						} else {
							this.$toast.fail(res.msg);
						}
						this.loading = false;
					})
					.catch(err => {
						this.$toast.fail("加载失败");
						this.loading = false;
						console.log(err);
					});
			} else if (this.router == "history_comment") {
				this.$toast.loading({ message: "" });
				this.$post("/voteSrv/mapi/item/voted", {
					page: this.page,
					limit: this.limit,
					refresh: this.refresh
				})
					.then(res => {
						this.$toast.clear();
						if (res.code == 0) {
							if (this.itemlist.length == 0 || this.refresh) {
								this.itemlist = res.data.data;
								// console.log(this.itemlist);
							} else {
								this.itemlist.push(
									..._.filter(
										res.data.data,
										n => !_.findWhere(this.itemlist, { _id: n._id })
									)
								);
							}
							this.finished = !res.data.loadmore;
							if (this.refresh) this.refresh = false;
							else this.page++;
						} else {
							this.$toast.fail(res.msg);
						}
						this.loading = false;
					})
					.catch(err => {
						this.$toast.fail("加载失败");
						this.loading = false;
						console.log(err);
					});
			}
		},
		zan(i) {
			if (!this.itemlist[i].voteable) return;
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/record/add", {
				voteId: this.itemlist[i].voteId,
				itemId: this.itemlist[i]._id
			})
				.then(res => {
					if (res.code == 0) {
						this.refresh = true;
						this.getitemlist();
						this.$toast("投票成功");
						setTimeout(() => {
							this.success(this.itemlist[i].voteId, this.itemlist[i]._id);
						}, 1000);
						// 使用时时间需要修改
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("请求失败");
					console.log(err);
				});
		},
		success(voteId, itemId) {
			this.$router.push({
				path: "/success/" + voteId,
				query: { itemId }
			});
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
/* 投票排行榜 */
.content {
	position: relative;
	margin: -2rem 1rem 2rem;
	border-radius: 15px;
}
.content h4 {
	font-size: 2rem;
	text-align: center;
	padding-top: 1.5rem;
	padding-bottom: 1.5rem;
	position: relative;
	background-color: #fff;
	border-radius: 1.5rem 1.5rem 0 0;
}
.content h4 span {
	display: block;
	margin: auto;
	width: 5rem;
	height: 2px;
	background: linear-gradient(left, #fdd03a, #fd6f1c);
	background: -webkit-linear-gradient(left, #fdd03a, #fd6f1c);
}

.i_content,
.i_content .van-list {
	padding-top: 0.5rem;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}

.i_content .item {
	width: 49%;
	position: relative;
	background-color: #fefefe;
	margin-bottom: 1rem;
	border-radius: 3px;
	height: 21rem;
	z-index: 0;
}
.i_content .item .i_top {
	padding: 0.5rem;
}
.i_top img {
	width: 100%;
	height: 11rem;
	object-fit: cover;
}
.i_bottom {
	padding: 0.5rem;
	width: 80%;
	position: absolute;
	border-radius: 10px;
	left: 50%;
	top: 10rem;
	transform: translateX(-50%);
	background-color: #fff;
	text-align: center;
	font-size: 1.4rem;
}
.i_bottom p {
	margin-bottom: 0.5rem;
}
.i_bottom p:nth-child(1) {
	height: 3.6rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: wrap;
}
.i_bottom p i {
	color: #fd7135;
	margin-right: 0.3rem;
}
.xin {
	margin-right: 2px;
}
button {
	border-radius: 20px;
	box-shadow: none;
	border: none;
	background: linear-gradient(left, #ffd63e, #ff6e1f);
	background: -webkit-linear-gradient(left, #ffd63e, #ff6e1f);
	padding: 0.2rem 1rem;
	color: #fff;
	font-size: 1.4rem;
}
button.yizan {
	background: linear-gradient(left, #bababa, #919191);
	background: -webkit-linear-gradient(left, #bababa, #919191);
	padding: 0.2rem 1.5rem;
}
.item .wangguan {
	position: absolute;
	left: 0;
	top: -0.5rem;
	font-size: 3rem;
	color: #fcc642;
}
/* 以上是第一名的颜色 */
.num {
	position: absolute;
	left: 1rem;
	top: 0.7rem;
	color: #fff;
	transform: rotate(-45deg);
	font-size: 1.4rem;
}

.item .wangguan1 {
	color: #80b1de;
}
/* 第二名的颜色 */
.item .wangguan2 {
	color: #f7a15e;
}
/* 第三名的颜色 */
.num1 {
	position: absolute;
	left: 0.5rem;
	top: 0.5rem;
	width: 2rem;
	height: 2rem;
	display: block;
	text-align: center;
	color: #fff;
	background-color: #feac31;
	line-height: 2rem;
}

#none {
	display: block;
	margin: 20% auto;
	width: 30%;
}
</style>
