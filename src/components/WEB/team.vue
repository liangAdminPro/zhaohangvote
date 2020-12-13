<!-- 投票管理-->
<template>
	<div class="team" style="height:100%;">
		<!--头部组件 -->
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="true">
			<div slot="votelist" style="display: inline-block;" class="btn-group">
				<button
					class="btn btn-success dropdown-toggle"
					style=" padding: 4px 12px;"
					data-toggle="dropdown"
					aria-haspopup="false"
					aria-expanded="false"
				>
					<span>{{votename}}</span>
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					<li
						v-for="(item, index) in votedata"
						:key="index"
						@click="votename=item.title;voteId=item._id;getData();"
					>
						<span>{{item.title}}</span>
					</li>
				</ul>
			</div>
		</webheader2>
		<div class="team-content">
			<div class="list-items" v-for="(item, index) in teamdata" :key="index">
				<!-- <img class="db-block" :src="item.cover"  style="width:240px;height:140px;"/> -->
				<div
					:style="{width:'240px',height:'140px','margin-right':'20px','border-radius':'5px','box-shadow':'0 0 1px rgba(0, 0, 0, 0.7)',background:'url(' + item.cover + ') center center no-repeat', 'background-size': 'cover', position: 'relative'}"
				></div>
				<div class="content-right">
					<div class="top flex">
						<div class="left" style="flex:2;">
							<div class="title" style="font-size:18px;">{{item.titleprefix || ''}}{{item.title}}</div>
							<div class="desc" style="font-size:16px;">
								<span style="margin-right:15px;">{{item.linkman}}</span>
								<span>{{item.linkphone}}</span>
							</div>
							<div class="desc" style="font-size:16px;">
								<span style="margin-right:15px;">{{item.comefrom}}</span>
								<span>{{item.IDnumber}}</span>
							</div>
						</div>
						<div class="center" style="flex:3;height:6rem;overflew:hidden;position:relative">
							<div style="margin: 0 0 10px 0">
								<div
									v-show="item.videos[0]"
									@click="showvideo(item.videos[0])"
									style="display: inline-block;cursor: pointer;"
								>
									视频预览
									<span class="glyphicon glyphicon-play" style="color:#3C8DBC"></span>
								</div>
							</div>
							<van-rate v-model="value" />
							<div class="btn-group btn-group-xs opration" role="group">
								<button
									class="btn btn-primary"
									@click="$router.push('/web/addteam/'+item._id+'?voteId='+item.voteId)"
								>编辑</button>
								<button class="btn btn-danger" @click="removeitem(item._id)">删除</button>
							</div>
						</div>
						<div class="right">
							<el-button
								type="success"
								:icon="item.state==0?'el-icon-check':''"
								size="small"
								:style="item.state==0?'background:#3EB989;': item.state == -1? 'background:red':'background:#E2A022;'"
							>{{item.state==0?'审核通过': item.state == -1 ? '待审核' :'审核不通过'}}</el-button>
						</div>
					</div>
					<div class="bottom flex">
						<div class="time">
							<span v-html="item.vote.title"></span>
						</div>
						<div class="right">
							<el-button
								v-if="item.state !==0"
								type="success"
								size="small"
								@click="pass(item._id)"
								plain
							>审核通过</el-button>
							<el-button
								v-if="item.state !==0&&item.state !==1"
								type="danger"
								size="small"
								@click="reject(item._id)"
								plain
							>审核不通过</el-button>
							<el-button type="primary" size="small" @click="showH5(item._id)" plain>查看H5</el-button>
						</div>
					</div>
				</div>
			</div>
			<div v-if="teamdata.length == 0">
				<img class="nodataimg" src="../../assets/web/img/nodata.png" width="180" height="180" />
			</div>
		</div>
		<!--创建活动弹窗 -->
		<div class="modal fade" id="h5Modal" tabindex="-1" role="dialog" aria-labelledby="h5ModalLabel">
			<div class="modal-content">
				<div class="modal-header">
					<span aria-hidden="true" class="close" data-dismiss="modal" aria-label="Close">&times;</span>
					<h4 class="modal-title" id="h5ModalLabel"></h4>
				</div>
				<div class="modal-body">
					<detail ref="h5"></detail>
				</div>
			</div>
		</div>
		<!-- 视频预览弹窗-->
		<div
			class="modal fade"
			id="videopreview"
			tabindex="-1"
			role="dialog"
			aria-labelledby="videopreviewModalLabel"
		>
			<div class="modal-content default-video">
				<div class="modal-header">
					<span aria-hidden="true" class="close" data-dismiss="modal" aria-label="Close">&times;</span>
					<h4 class="modal-title text-center" id="videopreviewModalLabel">视频预览</h4>
				</div>
				<div class="modal-body">
					<div class="video text-center">
						<video :src="url" controls v-if="url" controlslist="nodownload" preload="none" autoplay></video>
						<h1 v-else>没有视频内容</h1>
					</div>
				</div>
			</div>
		</div>
		<!-- 分页导航-->
		<div class="footer-elp text-center">
			<nav aria-label>
				<ul class="pagination" v-if="total > 1">
					<li :class="page <= 1 ? 'disabled' : ''">
						<a href="javascript:;" aria-label="Previous" @click="prev()">
							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>
					<li
						:class="page==item?'active':''"
						v-for="(item,i) in current"
						:key="i"
						@click="CurrentPage(item)"
					>
						<a href="javascript:;">{{item>total?total:item }}</a>
					</li>
					<li :class="page >= total ? 'disabled' : ''">
						<a href="javascript:;" aria-label="Next" @click="next()">
							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>
<script>
import detail from "../H5/partner_detail";
import webheader2 from "./header2";
export default {
	name: "team",
	components: {
		webheader2,
		detail
	},
	data() {
		return {
			breamlist: [
				{ path: "/web/team", title: "报名数据" },
				{ path: "/web/team", title: "报名列表" }
			],
			slots: ["votelist"],
			voteId: "",
			votename: "选择活动",
			votedata: [{ _id: "A", title: "A" }, { _id: "B", title: "B" }],
			curindex: {},
			teamdata: [],
			page: 1,
			limit: 6,
			current: [1],
			total: 0,
			count: 0,
			value: 5,
			url: null
		};
	},
	watch: {},
	created() {
		this.getVoteData();
		this.getData();
	},
	methods: {
		getVoteData() {
			this.$post("/voteSrv/wapi/vote/allforweb", {})
				.then(res => {
					if (res.code == 0) {
						this.votedata = res.data;
					} else {
						this.votedata = [];
					}
				})
				.catch(err => {});
		},
		getData() {
			this.$toast.loading({ message: "正在加载" });
			this.$post("/voteSrv/wapi/item/listforweb", {
				page: this.page,
				limit: this.limit,
				voteId: this.voteId
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						const { count, data } = res.data;
						this.count = count;
						this.teamdata = data;
						this.total =
							count % this.limit == 0
								? count / this.limit
								: Math.floor(count / this.limit) + 1;
						this.current = this.$makePage(this.page, this.total);
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("加载失败");
				});
		},
		CurrentPage(page) {
			if (this.page == page) return;
			this.page = page;
			this.getData();
		},
		prev() {
			if (this.page <= 1) return;
			this.page--;
			this.getData();
		},
		next() {
			if (this.page >= this.total) return;
			this.page++;
			this.getData();
		},
		// 删除队伍
		removeitem(itemId) {
			this.$confirm("即将删除该队伍，是否继续?", "提示", {
				confirmButtonText: "删除",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(() => {
					this.$post("/voteSrv/wapi/item/remove", { itemId })
						.then(res => {
							if (res.code == 0) {
								this.$message.success("删除成功");
								this.getData();
							}
						})
						.catch(err => err);
				})
				.catch(err => err);
		},
		// 编辑队伍
		edititem(itemId) {
			this.$router.push(`/web/addteam/${itemId}`);
		},
		pass(itemId) {
			this.$confirm("审核通过", "提示", {
				confirmButtonText: "通过",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(() => {
					this.$toast.loading({ message: "" });
					this.$post("/voteSrv/wapi/item/pass", { itemId })
						.then(res => {
							this.$toast.clear();
							if (res.code == 0) {
								this.getData();
							} else {
								this.$toast.fail(res.msg);
							}
						})
						.catch(err => {
							this.$toast.fail("操作失败");
						});
				})
				.catch(err => err);
		},
		reject(itemId) {
			this.$confirm("审核不通过", "提示", {
				confirmButtonText: "不通过",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(() => {
					this.$toast.loading({ message: "" });
					this.$post("/voteSrv/wapi/item/reject", { itemId })
						.then(res => {
							this.$toast.clear();
							if (res.code == 0) {
								this.getData();
							} else {
								this.$toast.fail(res.msg);
							}
						})
						.catch(err => {
							this.$toast.fail("操作失败");
						});
				})
				.catch(err => err);
		},
		showvideo(url) {
			this.url = url;
			$("#videopreview").modal("show");
		},
		showH5(itemId) {
			this.$refs.h5._pregetinfo(itemId, err => {
				if (!err) $("#h5Modal").modal("show");
			});
		}
	}
};
</script>
<style scoped>
.nodataimg {
	display: block;
	margin: 100px auto;
}
.video video {
	min-width: 480px;
	height: 400px;
	object-fit: fill;
	width: 80%;
	border-radius: 4px;
}
.default-video {
	min-width: 600px;
	width: 60%;
	height: 530px;
	margin: 0 auto;
	margin-top: 5%;
}
.opration {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 0;
}

.team {
	padding-left: 20px;
	padding-top: 10px;
	padding-right: 10px;
}
.dnav {
	background: #ecf0f5;
}
.team-content {
	padding-top: 10px;
}
table {
	border-bottom: 2px solid #ccc;
	border-collapse: separate;
}
th {
	padding: 8px;
}
td {
	line-height: 3rem !important;
}
.table-hea {
	background: #337ab7;
	color: #fff;
	border-radius: 5px;
}
.table-hea th:first-of-type {
	border-top-left-radius: 5px;
}
.table-hea th:last-of-type {
	border-top-right-radius: 5px;
	text-align: right;
	padding-right: 34px;
}

.list-items {
	display: flex;
	position: relative;
	justify-content: flex-start;
	background-color: #fff;
	padding: 10px;
	margin-bottom: 10px;
}
/* .db-block {
	margin-right: 20px;
	height: 12rem;
	width: 20rem;
	border-radius: 5px;
	box-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
	object-fit: cover;
} */
/*  */
.content-right {
	width: 100%;
}
.content-right .top {
	display: flex;
	border-bottom: 1px solid #ccc;
	padding-bottom: 5px;
	justify-content: flex-start;
	/* justify-content: space-around; */
	padding-top: 10px;
}
.content-right .top .right .el-button {
	position: absolute;
	top: 0;
	right: 0;
	border: none;
}
.title,
.desc {
	margin-bottom: 8px;
}

.content-right .bottom {
	display: flex;
	justify-content: space-between;
	padding-top: 10px;
}
.content-right .bottom .time {
	padding-top: 10px;
	color: #999;
}

#h5Modal {
	width: 400px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	height: 80%;
}
#h5Modal::-webkit-scrollbar {
	display: none;
}
.modal-header {
	border-bottom: 0 solid #000;
}
/* 提交保存按钮 */
.modal-footer {
	text-align: center;
	border-top: none;
	padding-bottom: 80px;
}
.modal-footer .el-button:last-child {
	background-color: #fff;
	color: #0e90fe;
	border-color: #0e90fe;
}
</style>