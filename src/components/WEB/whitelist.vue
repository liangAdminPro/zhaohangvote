<!---白名单管理-->
<template>
	<div class="white">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="true">
			<div slot="importwhitelist" style="display:inline-block;padding-right:10px;">
				<label for="importwh" class="btn btn-success">
					<span class="glyphicon glyphicon-plus" style="padding-right:5px;"></span>
					<span>导入白名单</span>
				</label>
				<input
					id="importwh"
					type="file"
					style="display:none"
					accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					@change="upwhite"
				/>
			</div>
			<button slot="addwhitelist" class="btn btn-success" style=" padding: 4px 12px;" @click="add">
				<span class="glyphicon glyphicon-plus" style="padding-right:5px;"></span>添加白名单
			</button>
		</webheader2>
		<div class="white-content">
			<div class="b-r">
				<table class="table table-hover" style="border-bottom:2px solid #ccc">
					<thead>
						<tr class="table-hea" style="background:#fff;color:#000;">
							<th class="wth">姓名</th>
							<th class="wth">手机号</th>
							<th class="wth">身份证号</th>
							<th class="wth">生日</th>
							<th class="wth">级别</th>
							<th style="width:30%;"></th>
						</tr>
					</thead>
					<template v-if="whitedata.length>0">
						<tbody v-for="(item, index) in whitedata" :key="index">
							<tr>
								<!-- <td>{{index+1}}</td> -->
								<td>{{item.name}}</td>
								<td>{{item.phone}}</td>
								<td>{{item.idno}}</td>
								<td>{{item.birth}}</td>
								<td>{{levels[item.level]}}</td>
								<td style="cursor:pointer;width:30%;">
									<el-button
										type="primary"
										size="small"
										icon="el-icon-edit"
										style="background:#fff; color:#0E90FE;"
										@click="edit(item._id)"
									>编辑</el-button>
									<el-button
										type="danger"
										style="background:#fff; color:red;"
										@click="removeWhite(item._id)"
										icon="el-icon-delete"
										size="small"
									>删除</el-button>
								</td>
							</tr>
						</tbody>
					</template>
					<tbody v-else>
						<tr>
							<td colspan="7">暂无数据</td>
						</tr>
					</tbody>
				</table>
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
		<!--模态框 -->
		<div
			class="modal fade lg"
			id="whitelistModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="whitelistModalLabel"
		>
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 class="modal-title" id="whitelistModalLabel">添加白名单</h4>
					</div>
					<div class="modal-body">
						<addwhitelist @closeModal="closeModal" ref="addwh"></addwhitelist>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
						<button type="button" class="btn btn-primary" @click="addwh">确认添加</button>
					</div>
				</div>
			</div>
		</div>
		<div
			class="modal fade bd-example-modal-lg"
			id="whsModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="whsModalLabel"
		>
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 class="modal-title" id="whsModalLabel">预览</h4>
					</div>
					<div class="modal-body">
						<table class="table table-hover" style="border-bottom:2px solid #ccc">
							<thead>
								<tr class="table-hea" style="background:#fff;color:#000;">
									<th class="wth">姓名</th>
									<th class="wth">手机号</th>
									<th class="wth">身份证号</th>
									<th class="wth">生日</th>
									<th class="wth">级别</th>
									<th style="width:30%;"></th>
								</tr>
							</thead>
							<tbody v-for="(item, index) in whs" :key="index">
								<tr>
									<td>{{item.name}}</td>
									<td>{{item.phone}}</td>
									<td>{{item.idno}}</td>
									<td>{{item.birth}}</td>
									<td>{{item.level}}</td>
									<td style="cursor:pointer;width:30%;">
										<el-button
											type="danger"
											style="background:#fff; color:red;"
											@click="removewh(index)"
											icon="el-icon-delete"
											size="small"
										>删除</el-button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
						<button type="button" class="btn btn-primary" @click="addwhs">确认添加</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import webheader2 from "./header2";
import addwhitelist from "./addwhitelist";
import XLSX from "xlsx";
export default {
	name: "whitelist",
	components: {
		webheader2,
		addwhitelist
	},
	data() {
		return {
			breamlist: [
				{ path: "/web/activity", title: "活动管理" },
				{ path: "", title: "白名单设置" }
			],
			slots: this.$route.params.voteId
				? ["importwhitelist", "addwhitelist"]
				: [],
			voteId: this.$route.params.voteId || "",
			whitedata: [],
			page: 1,
			limit: 5,
			current: [1],
			total: 0,
			count: 0,
			levels: {
				W5: "时点资产5万元以上",
				W10: "时点资产10万元以上"
			},
			whs: []
		};
	},
	watch: {
		$route(to, from) {
			this.voteId = to.params.voteId || "";
			if (!this.voteId) this.slots = [];
			else this.slots = ["importwhitelist", "addwhitelist"];
			this.getData();
		}
	},
	created() {
		this.getData();
	},
	methods: {
		showModal() {
			$("#whitelistModal").modal("show");
		},
		closeModal() {
			$("#whitelistModal").modal("hide");
			this.getData();
		},
		add() {
			this.$refs.addwh.getData("", err => {
				if (!err) this.showModal();
			});
		},
		edit(whid) {
			this.$refs.addwh.getData(whid, err => {
				if (!err) this.showModal();
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
		getData() {
			this.$toast.loading({ message: "正在加载" });
			this.$post("/voteSrv/wapi/whitelist/list", {
				voteId: this.voteId,
				page: this.page,
				limit: this.limit
			})
				.then(res => {
					if (res.code == 0) {
						const { count, data } = res.data;
						this.count = count;
						this.whitedata = data;
						this.total =
							count % this.limit == 0
								? count / this.limit
								: Math.floor(count / this.limit) + 1;
						this.current = this.$makePage(this.page, this.total);
						this.$toast.clear();
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("加载失败");
				});
		},
		removeWhite(_id) {
			this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(() => {
					this.$toast.loading({ message: "正在删除" });
					this.$post("/voteSrv/wapi/whitelist/remove", { _id })
						.then(res => {
							if (res.code == 0) {
								this.$toast.success("删除成功");
								setTimeout(() => {
									this.getData();
								}, 1000);
							} else {
								this.$toast.fail(res.msg);
							}
						})
						.catch(err => {
							this.$toast.fail("删除失败");
						});
				})
				.catch(err => {
					this.$toast.fail("删除失败");
				});
		},
		addwh() {
			this.$refs.addwh.addWhiteList();
		},
		addwhs() {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/wapi/whitelist/addbatch", {
				voteId: this.voteId,
				data: this.whs
			})
				.then(res => {
					if (res.code == 0) {
						this.$toast.success("导入成功");
						setTimeout(() => {
							$("#whsModal").modal("hide");
							this.getData();
						}, 1000);
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("导入失败");
				});
		},
		upwhite() {
			let file = event.target.files[0];
			if (!file) return;
			if (
				file.type != "application/vnd.ms-excel" &&
				file.type !=
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			) {
				return this.$toast.fail("请上传表格文件.xls");
			}
			if (file.size > 1 * 1024 * 1024) {
				return this.$toast.fail("文件超过1M,请拆分数据多次上传");
			}
			$("#importwh").val("");
			var reader = new FileReader();
			reader.onload = e => {
				var whs = [];
				var data = e.target.result;
				var workbook = XLSX.read(data, { type: "binary" });
				var XL_row_object = XLSX.utils.sheet_to_row_object_array(
					workbook.Sheets[workbook.SheetNames[0]]
				);
				if (XL_row_object.length == 0) return this.$toast.fail("空数据");
				for (var i = 0; i < XL_row_object.length; i++) {
					var row = XL_row_object[i];
					var name = row["姓名"] || "";
					var phone = row["手机号"] || "";
					var idno = row["身份证号"] || "";
					var birth = row["生日"] || "";
					var level = row["级别"] || "";
					if (phone) phone = phone + "";
					const wh = {
						name: name.replace(/\s/g, ""),
						phone: phone.replace(/\s/g, "").replace(/o|O/g, "0"),
						idno: idno
							.replace(/\s/g, "")
							.replace(/x/g, "X")
							.replace(/o|O/g, "0"),
						birth: birth.replace(/\s/g, ""),
						level: level.replace(/\s/g, "")
					};
					if (this.$isPhone(wh.phone) || this.$isCardID(wh.idno)) {
						whs.push(wh);
					}
				}
				this.whs = whs;
				$("#whsModal").modal("show");
			};
			reader.onerror = err => {
				$.alert("导入失败");
			};
			reader.readAsBinaryString(file);
		}, //上传白名单
		removewh(index) {
			var whs = [];
			for (var i = 0; i < this.whs.length; i++) {
				if (i != index) whs.push(this.whs[i]);
			}
			this.whs = whs;
			if (whs.length == 0) {
				$("#whsModal").modal("hide");
			}
		}
	}
};
</script>
<style>
@import "../../assets/web/css/whitelist.css";
.wth {
	text-align: center;
}
</style>