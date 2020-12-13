<template>
	<div class="wrap-selfset">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="false"></webheader2>
		<div class="datatable">
			<table class="table table-hover">
				<tr>
					<th style="width:20%;">
						<el-checkbox v-model="checkAll" @change="all">{{!checkAll ? '全选' : '全不选'}}</el-checkbox>
					</th>
					<th style="width:25%;">选项</th>
					<th>是否必填</th>
					<th>描述</th>
				</tr>
				<tbody v-for="(item, index) in itemdata" :key="index">
					<tr>
						<th>
							<el-checkbox v-model="item.show"></el-checkbox>
						</th>
						<th v-if="item.dropmenu" style="position:relative">
							<span
								class="btn dropdown-toggle btn-blue btn-sm"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								{{item.title}}
								<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<ul class="dropdown-menu self-menu">
								<li
									v-for="(item1, index1) in item.dropmenu"
									:key="index1"
									@click="item.show && (item.title = item1.title,item.description = item1.description)"
									size="medium"
								>
									<span>{{item1.title}}</span>
								</li>
							</ul>
						</th>
						<th v-if="!item.dropmenu">{{item.title}}</th>
						<th>
							<el-switch v-model="item.required" :disabled="!item.show"></el-switch>
						</th>
						<th v-if="item.dropmenu">{{item.description}}</th>
						<th v-if="!item.dropmenu">{{item.description}}</th>
					</tr>
				</tbody>
			</table>
			<div class="text-center selfset-foot">
				<el-button type="primary" size="medium" plain @click="saveForm">保存</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import webheader2 from "./header2";
import _ from "underscore";
export default {
	name: "selfset",
	components: {
		webheader2
	},
	data() {
		return {
			voteId: this.$route.params.voteId,
			itemdata: [
				{
					show: true,
					title: "名称",
					required: true,
					description: "请输入名称",
					dropmenu: [
						{ title: "名称", description: "请输入名称" },
						{ title: "队伍名称", description: "请输入队伍名称" },
						{ title: "姓名", description: "请输入姓名" }
					]
				},
				{
					show: true,
					title: "负责人姓名",
					required: true,
					description: "请输入负责人姓名"
				},
				{
					show: true,
					title: "负责人电话",
					required: true,
					description: "请输入负责人电话"
				},
				{
					show: true,
					title: "图片",
					required: true,
					description: "上传图片"
				},
				{
					show: true,
					title: "视频",
					required: true,
					description: "上传视频"
				},
				{
					show: true,
					title: "宣言",
					required: true,
					description: "请输入宣言",
					dropmenu: [
						{ title: "宣言", description: "请输入宣言" },
						{ title: "口号", description: "请输入口号" },
						{ title: "自我介绍", description: "请输入自我介绍" }
					]
				},
				{
					show: true,
					title: "身份证号",
					required: true,
					description: "请输入身份证号码"
				}
			],
			formset: {},
			breamlist: [
				{ path: "/web/activity", title: "活动管理" },
				{
					path: "/web/selfset/" + this.$route.params.voteId,
					title: "自定义报名"
				}
			],
			slots: []
		};
	},
	mounted() {
		this.getData();
	},
	methods: {
		saveForm() {
			var formset = {
				title: _.pick(this.itemdata[0], [
					"title",
					"description",
					"show",
					"required"
				]),
				linkman: _.pick(this.itemdata[1], [
					"title",
					"description",
					"show",
					"required"
				]),
				linkphone: _.pick(this.itemdata[2], [
					"title",
					"description",
					"show",
					"required"
				]),
				images: _.pick(this.itemdata[3], [
					"title",
					"description",
					"show",
					"required"
				]),
				videos: _.pick(this.itemdata[4], [
					"title",
					"description",
					"show",
					"required"
				]),
				slogan: _.pick(this.itemdata[5], [
					"title",
					"description",
					"show",
					"required"
				]),
				IDnumber: _.pick(this.itemdata[6], [
					"title",
					"description",
					"show",
					"required"
				]),
				comefrom: _.pick(this.itemdata[7], [
					"title",
					"description",
					"show",
					"required"
				])
			};
			this.$toast.loading({ message: "正在保存" });
			this.$post("/voteSrv/wapi/vote/saveform", {
				voteId: this.voteId,
				formset
			})
				.then(res => {
					if (res.code == 0) {
						this.getData();
						this.$toast.success("自定义设置保存成功");
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("保存失败");
				});
		},
		all() {
			!this.checkAll
				? this.itemdata.forEach(val => {
						val.show = true;
				  })
				: this.itemdata.forEach(val => {
						val.show = false;
				  });
		},
		getData() {
			this.$toast.loading({ message: "正在读取自定义设置" });
			this.$post("/voteSrv/wapi/vote/forminfo", { voteId: this.voteId })
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.formset = res.data;
						this.makeFormSetToItemData();
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("读取失败");
				});
		},
		makeFormSetToItemData() {
			var itemdata = [
				{
					show: true,
					title: "队伍名称",
					required: true,
					description: "请输入队伍名称",
					dropmenu: [
						{ title: "队伍名称", description: "请输入队伍名称" },
						{ title: "姓名", description: "请输入姓名" },
						{ title: "名称", description: "请输入名称" }
					]
				},
				{
					show: true,
					title: "负责人姓名",
					required: true,
					description: "请输入负责人姓名"
				},
				{
					show: true,
					title: "负责人电话",
					required: true,
					description: "请输入负责人电话"
				},
				{
					show: true,
					title: "图片",
					required: true,
					description: "上传图片"
				},
				{
					show: true,
					title: "视频",
					required: true,
					description: "上传视频"
				},
				{
					show: true,
					title: "宣言",
					required: true,
					description: "请输入宣言",
					dropmenu: [
						{ title: "宣言", description: "请输入宣言" },
						{ title: "口号", description: "请输入口号" },
						{ title: "自我介绍", description: "请输入自我介绍" }
					]
				},
				{
					show: true,
					title: "身份证号",
					required: true,
					description: "请输入身份证号码"
				},
				{
					show: true,
					title: "所属舞队",
					required: true,
					description: "请输入所属舞队"
				}
			];
			_.extend(
				itemdata[0],
				_.pick(this.formset.title, ["show", "title", "required", "description"])
			);
			_.extend(
				itemdata[1],
				_.pick(this.formset.linkman, [
					"show",
					"title",
					"required",
					"description"
				])
			);
			_.extend(
				itemdata[2],
				_.pick(this.formset.linkphone, [
					"show",
					"title",
					"required",
					"description"
				])
			);
			_.extend(
				itemdata[3],
				_.pick(this.formset.images, [
					"show",
					"title",
					"required",
					"description"
				])
			);
			_.extend(
				itemdata[4],
				_.pick(this.formset.videos, [
					"show",
					"title",
					"required",
					"description"
				])
			);
			_.extend(
				itemdata[5],
				_.pick(this.formset.slogan, [
					"show",
					"title",
					"required",
					"description"
				])
			);
			_.extend(
				itemdata[6],
				_.pick(this.formset.IDnumber, [
					"title",
					"description",
					"show",
					"required"
				])
			);
			_.extend(
				itemdata[7],
				_.pick(this.formset.comefrom, [
					"title",
					"description",
					"show",
					"required"
				])
			);
			this.itemdata = itemdata;
		}
	},
	computed: {
		checkAll: {
			get() {
				return this.itemdata.every(val => {
					return val.show;
				});
			},
			set(val) {
				return val;
			}
		}
	}
};
</script>
<style scoped>
.wrap-selfset {
	background: #ecf0f5;
	height: 100%;
	padding-left: 20px;
	padding-top: 10px;
	padding-right: 10px;
}
.wrap-selfset .datatable {
	margin-top: 5px;
	background-color: #fff;
	padding-left: 10px;
}
.table,
.table tbody {
	border: none;
}
.table tr > th {
	line-height: 3rem;
	padding: 8px;
}
.selfset-foot {
	padding: 20px 0;
}
.btn-blue {
	color: #000;
	border: 1px solid #259dff;
}
.self-menu > li {
	padding-left: 8px;
}
.self-menu {
	top: 76%;
	margin-left: 8px;
}
ul.self-menu li:hover {
	background-color: #259dff;
	color: #fff;
}
</style>