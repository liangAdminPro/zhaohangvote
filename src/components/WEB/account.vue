<!---账号管理-->
<template>
	<div class="account">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="true">
			<button slot="addaccount" class="btn btn-success" style=" padding: 4px 12px;" @click="add">
				<span class="glyphicon glyphicon-plus" style="padding-right:5px;"></span>新增账户
			</button>
		</webheader2>
		<div class="list">
			<table class="table table-hover">
				<tr>
					<th>姓名</th>
					<th>手机号</th>
					<th>单位名称</th>
					<th>初始密码</th>
					<th></th>
				</tr>
				<tr
					v-for="(item, index) in accountdata"
					:key="index"
					@mouseover="hover(index)"
					@mouseleave="leave(index)"
				>
					<td>{{item.name}}</td>
					<td>{{item.mobile}}</td>
					<td>{{item.corpname}}</td>
					<td>{{item.initpwd}}</td>
					<td>
						<div>
							<el-button type="primary" plain size="small" @click="Reset(item._id)">重置密码</el-button>
							<el-button type="primary" size="small" icon="el-icon-edit" plain @click="edit(item._id)">编辑</el-button>
							<el-button
								v-if="item.removeable"
								type="primary"
								icon="el-icon-delete"
								@click="removeAccount(item._id)"
								size="small"
							>删除</el-button>
						</div>
					</td>
				</tr>
			</table>
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
		<!--模态框 -->
		<div
			class="modal fade"
			id="accountModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="accountModalLabel"
		>
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 class="modal-title" v-show="func=='addaccount'" id="accountModalLabel">新增账号</h4>
						<h4 class="modal-title" v-show="func=='resetpwd'" id="accountModalLabel">重置密码</h4>
					</div>
					<div class="modal-body">
						<addaccount v-show="func=='addaccount'" ref="addaccount" @closeModal="closeModal"></addaccount>
						<reset v-show="func=='resetpwd'" ref="resetpwd" @closeModal="closeModal"></reset>
					</div>
					<div class="modal-footer">
						<el-button v-show="func=='addaccount'" type="primary" size="medium" @click="addaccount">保存</el-button>
						<el-button v-show="func=='resetpwd'" type="primary" size="medium" @click="resetpwd">重置</el-button>
						<el-button type="primary" size="medium" @click="closeModal">取消</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import webheader2 from "./header2";
import addaccount from "./addaccount";
import reset from "./reset";
export default {
	name: "account",
	components: {
		webheader2,
		addaccount,
		reset
	},
	data() {
		return {
			breamlist: [{ path: "/web/account", title: "账户管理" }],
			slots: ["addaccount"],
			func: "",
			accountdata: [],
			page: 1,
			limit: 10,
			total: 0,
			current: [1],
			count: 0
		};
	},
	created() {
		this.getData();
	},
	methods: {
		showModal() {
			$("#accountModal").modal("show");
		},
		closeModal() {
			$("#accountModal").modal("hide");
			this.getData();
		},
		add() {
			this.func = "addaccount";
			this.$refs.addaccount.getAccount("", err => {
				if (!err) this.showModal();
			});
		},
		addaccount() {
			this.$refs.addaccount.addAccount();
		},
		edit(adminId) {
			this.func = "addaccount";
			this.$refs.addaccount.getAccount(adminId, err => {
				if (!err) this.showModal();
			});
		},
		Reset(adminId) {
			this.func = "resetpwd";
			this.$refs.resetpwd._init(adminId);
			this.showModal();
		},
		resetpwd() {
			this.$refs.resetpwd.resetpwd();
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
			this.$post("/voteSrv/wapi/admin/list", {
				page: this.page,
				limit: this.limit
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						const { isAdmin, count, data } = res.data;
						if (!isAdmin) {
							return this.$router.push({ path: "/web/home" });
						}
						this.count = count;
						this.accountdata = data;
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
		removeAccount(adminId) {
			this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(() => {
					// on confirm
					this.$toast.loading({ message: "正在删除" });
					this.$post("/voteSrv/wapi/admin/remove", { adminId })
						.then(res => {
							if (res.code == 0) {
								this.$toast.success("删除成功");
								this.getData();
							} else {
								this.$toast.fail(res.msg);
							}
						})
						.catch(err => {
							this.$toast.fail("删除失败");
						});
				})
				.catch(() => {
					this.$toast.fail("删除失败");
				});
		},
		hover(i) {
			$("table tr")
				.eq(i + 1)
				.css("background", "#E6F7FF");
		},
		leave(i) {
			$("table tr")
				.eq(i + 1)
				.css("background", "#fff");
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/account.css";
th {
	text-align: center;
}
</style>


