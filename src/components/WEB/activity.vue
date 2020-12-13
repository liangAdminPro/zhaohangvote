<!---活动管理-->
<template>
	<div class="activity">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="true">
			<button slot="addactivity" class="btn btn-success" style=" padding: 4px 12px;" @click="add">
				<span class="glyphicon glyphicon-plus" style="padding-right:5px;"></span>创建活动
			</button>
		</webheader2>
		<div class="list">
			<div class="list-item">
				<template v-for="item in activitydata">
					<div class="list-items flex" :key="item._id">
						<!-- <img class="db-block" :src="item.cover" style="width: 200px;height:140px" /> -->
						<div
							:style="{width:'240px',height:'140px','border-radius':'5px','box-shadow':'0 0 1px rgba(0, 0, 0, 0.7)',background:'url(' + item.cover + ') center center no-repeat', 'background-size': 'cover', position: 'relative'}"
						>
							<span
								v-if="item.tag"
								style="position:absolute;top:0;right:0;background:#E2A022;color:#fff;font-weight:bold;padding:2px 8px;"
							>{{item.tag}}</span>
						</div>
						<div class="content-right">
							<div class="top flex">
								<div class="left">
									<div class="title">{{item.title}}</div>
									<!-- <div class="desc">活动描述信息</div> -->
									<div class="time">时间：{{item.start|dateFormat}} 至 {{item.end|dateFormat}}</div>
								</div>
								<div class="right">
									<el-button
										@click="active(item._id)"
										type="success"
										:icon="item.publish?'el-icon-check':''"
										size="small"
										:style="item.publish?'background:#3EB989;':'background:#E2A022;'"
									>{{item.publish?'已发布':'未发布'}}</el-button>
								</div>
							</div>
							<div class="bottom flex">
								<div class="time">
									<span>
										队伍数量
										<span>{{item.itemcount}}</span>
									</span>
									<span>
										总投票数量
										<span>{{item.votecount}}</span>
									</span>
								</div>
								<div class="right">
									<el-button
										type="primary"
										size="small"
										v-if="item.self_registration"
										@click="$router.push('/web/selfset/' + item._id)"
									>自定义报名</el-button>
									<el-button type="primary" size="small" @click="$router.push('/web/rule/' + item._id)">规则设置</el-button>
									<el-button
										type="primary"
										size="small"
										@click="$router.push('/web/whitelist/' + item._id)"
									>白名单</el-button>
									<el-button
										type="primary"
										size="small"
										icon="el-icon-edit"
										@click="$router.push('/web/addactivity/' + item._id)"
									>编辑</el-button>
									<el-button
										type="danger"
										icon="el-icon-delete"
										size="small"
										@click="removeActivity(item._id)"
									>删除</el-button>
								</div>
							</div>
							<div>
								<el-button
									type="primary"
									size="small"
									v-clipboard:copy="item.short_h5url"
									v-clipboard:success="onCopy"
									v-clipboard:error="onError"
								>复制活动详情</el-button>
								<el-button
									type="success"
									size="small"
									v-clipboard:copy="item.short_h5listurl"
									v-clipboard:success="onCopy"
									v-clipboard:error="onError"
								>复制活动列表</el-button>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
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
import webheader2 from "./header2";
export default {
	name: "activity",
	components: {
		webheader2
	},
	data() {
		return {
			breamlist: [
				{ path: "/web/activity", title: "活动管理" },
				{ path: "/web/activity", title: "活动列表" }
			],
			slots: ["addactivity"],
			activitydata: [],
			page: 1,
			limit: 10,
			current: [1],
			total: 0,
			count: 0,
			voteId: ""
		};
	},
	created() {
		this.getData();
	},
	methods: {
		add() {
			this.$router.push({ path: "/web/addactivity" });
		},
		// 点击页面跳转到相应页面
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
		getData() {
			this.$toast.loading({ message: "正在加载" });
			this.$post("/voteSrv/wapi/vote/listforweb", {
				page: this.page,
				limit: this.limit
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						const { count, data } = res.data;
						this.count = count;
						this.activitydata = data;
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
		active(voteId) {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/wapi/vote/active", { voteId })
				.then(res => {
					this.$toast.clear();
					console.log(res);
					if (res.code == 0) {
						this.getData();
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("操作失败");
				});
		},
		removeActivity(voteId) {
			this.$confirm("即将删除该活动，是否确认删除", "提示", {
				confirmButtonText: "确认",
				canceButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(res => {
					this.$post("/voteSrv/wapi/vote/remove", { voteId })
						.then(res => {
							if (res.code == 0) {
								this.$message.success("删除成功");
								this.getData();
							}
						})
						.catch(err => err);
				})
				.catch(err => {
					this.$message("已取消");
				});
		},
		onCopy: function(e) {
			this.$toast.success("已复制");
		},
		onError: function(e) {
			this.$toast.fail("复制失败");
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/activity.css";
</style>
