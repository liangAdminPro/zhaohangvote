<template>
	<div class="addteam">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="false"></webheader2>
		<div class="panel panel-default" style="margin-top:5px">
			<div class="panel-heading">
				<img src="@/assets/web/img/tip.png" alt />
				<div class="right">
					<p>温馨提示</p>
					<p>
						请认真填写队伍信息(带
						<span style="color:red">*</span>为必填项)
					</p>
				</div>
			</div>

			<el-steps
				v-if="!voteId"
				:active="active"
				align-center
				style="padding:20px;padding-top:40px;"
				process-status="finish"
				finish-status="success"
			>
				<el-step @click.native="active=0,show=false" :title="votename" style="cursor:pointer"></el-step>
				<el-step title="请填入相应信息"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<template v-if="!show&&!voteId">
				<div
					class="btn-group f"
					style="margin:30px 50px  80px;left:50%;margin-left:-276px;"
					v-if="!itemId"
				>
					<el-button
						type="primary"
						class="elbtn dropdown-toggle"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false"
						style="width:572px;"
					>
						{{votename}}
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<ul class="dropdown-menu" style="width:572px;">
						<li
							v-for="(item, index) in votedata"
							:key="index"
							@click="votename=item.title;formset=item.formset;teaminfo.voteId=item._id;active=1,show=true"
						>
							<span>{{item.title}}</span>
						</li>
						<li v-if="votedata.length === 0">暂无参赛活动</li>
					</ul>
				</div>
			</template>
			<template v-if="show||voteId">
				<div
					class="panel-body"
					style="position:relative;left:50%;margin-left:-400px;padding-left:15px;padding-top:30px;"
				>
					<!-- 队伍名称 -->
					<div class="f" v-show="formset.title&&formset.title.show">
						<label for="title" class="title">
							<span :class="formset.title&&formset.title.required?'must':''">{{formset.title.title}}</span>
						</label>

						<input
							type="text"
							id="title"
							v-model="teaminfo.title"
							:placeholder="formset.title.description"
							maxlength="10"
							required
						/>
					</div>
					<!-- 负责人名称 -->
					<div class="f" v-show="formset.linkman&&formset.linkman.show">
						<label for="linkman" class="title">
							<span :class="formset.linkman&&formset.linkman.required?'must':''">{{formset.linkman.title}}</span>
						</label>
						<input
							id="linkman"
							type="text"
							:placeholder="formset.linkman.description"
							v-model="teaminfo.linkman"
							required
						/>
					</div>
					<!-- 负责人电话 -->
					<div class="f" v-show="formset.linkphone&&formset.linkphone.show">
						<label for="linkphone" class="title">
							<span
								:class="formset.linkphone&&formset.linkphone.required?'must':''"
							>{{formset.linkphone.title}}</span>
						</label>
						<input
							id="linkphone"
							type="text"
							maxlength="11"
							:placeholder="formset.linkphone.description"
							v-model="teaminfo.linkphone"
							required
						/>
					</div>
					<div class="f" v-show="formset.IDnumber&&formset.IDnumber.show">
						<label for="title" class="title">
							<span
								:class="formset.IDnumber&&formset.IDnumber.required?'must':''"
							>{{formset.IDnumber.title}}</span>
						</label>

						<input
							type="text"
							id="title"
							v-model="teaminfo.IDnumber"
							:placeholder="formset.IDnumber.description"
							maxlength="18"
							required
						/>
					</div>
					<div class="f" v-show="formset.comefrom&&formset.comefrom.show">
						<label for="title" class="title">
							<span
								:class="formset.comefrom&&formset.comefrom.required?'must':''"
							>{{formset.comefrom.title}}</span>
						</label>

						<input
							type="text"
							id="title"
							v-model="teaminfo.comefrom"
							:placeholder="formset.comefrom.description"
							required
						/>
					</div>
					<!-- 上传投票图片 -->
					<div class="fc" v-show="formset.images&&formset.images.show">
						<label
							for="linkman"
							class="title"
							style="width:135px;float:left;margin-right:10px;line-height:81px;text-align:right"
						>
							<span :class="formset.images&&formset.images.required?'must':''">{{formset.images.title}}</span>
						</label>
						<div style="float:left;width:625px">
							<div class="add" v-for="(item, index) in teaminfo.images" :key="index">
								<img :src="item" width="81px" height="81px" v-if="teaminfo.images.length" />
								<span class="right-dui">
									<i class="el-icon-upload-success el-icon-check ii"></i>
								</span>
								<div class="mask text-center">
									<i class="el-icon-delete" @click="removeimg(index)"></i>
								</div>
							</div>

							<label for="up" v-if="teaminfo.images.length<9">
								<img src="../../assets/web/img/jiahao.png" class="upimg" />
								<span style="color:#666">{{teaminfo.images.length>0 ?'(最多九张)':'(最多九张,仅支持jpg和png格式的图片)'}}</span>
							</label>
						</div>
						<input
							@change="upimages()"
							type="file"
							id="up"
							style="display:none;"
							multiple
							maxlength="9"
							accept="image/png, image/jpg, image/jpeg"
						/>
					</div>
					<!-- 上传参赛视频 -->
					<div class="f" v-show="formset.videos&&formset.videos.show" style="margin-bottom:63px">
						<label for="linkphone" class="title" style="width:135px;">
							<span :class="formset.videos&&formset.videos.required?'must':''">{{formset.videos.title}}</span>
						</label>
						<div style="position:relative">
							<video
								:src="teaminfo.videos[0]"
								v-if="teaminfo.videos[0]"
								class="video"
								controls
								controlslist="nodownload"
								preload="none"
							></video>
							<label for="drop" :class="!teaminfo.videos[0]?'upload':'self'">
								<span
									class="btn btn-primary"
									v-if="teaminfo.videos[0]"
									style="position:absolute;bottom:-41px;left:102px"
								>更换视频</span>
								<div v-if="!teaminfo.videos[0]">
									<img src="../../assets/web/img/shangchuan.png" class="upvideo" />
									<p style="margin:0;color:#666;font-weight:400;">(点击上传视频，仅支持MP4)</p>
								</div>
							</label>
						</div>
						<input @change="upvideo()" type="file" id="drop" accept="video/mp4" style="display:none" />
					</div>
					<div class="f" v-show="formset.slogan&&formset.slogan.show">
						<label for="linkman" class="title" style="width:150px;">
							<span :class="formset.slogan&&formset.slogan.required?'must':''">{{formset.slogan.title}}</span>
						</label>
						<textarea
							:placeholder="formset.slogan.description+',10-200字'"
							v-model="teaminfo.slogan"
							@keyup="computeword"
							@change="computeword"
							maxlength="200"
						></textarea>
					</div>
					<div style="padding:15px 10px;text-align:center;background:#fff">
						<el-button type="primary" @click="addTeam">保存</el-button>
						<el-button type="primary" style="background:#fff;color:#0E90FE;" @click="$router.go(-1)">取消</el-button>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import webheader2 from "./header2";
import _ from "underscore";
export default {
	name: "addteam",
	components: {
		webheader2
	},
	data() {
		return {
			itemId: this.$route.params.itemId,
			voteId: this.$route.query.voteId,
			breamlist: [
				{ path: "/web/team", title: "报名数据" },
				{
					path: this.$route.params.itemId
						? "/web/addteam/" + this.$route.params.itemId
						: "",
					query: this.$route.params.itemId ? this.$route.query : null,
					title: this.$route.params.itemId ? "编辑报名" : "新增报名"
				}
			],
			active: 0, //步骤的状态
			slots: [""],
			votedata: [],
			votename: "选择参赛活动",
			formset: {
				title: {
					title: "",
					description: "",
					show: true,
					required: true
				},
				linkman: {
					title: "",
					description: "",
					show: true,
					required: true
				},
				linkphone: {
					title: "",
					description: "",
					show: true,
					required: true
				},
				IDnumber: {
					title: "",
					description: "",
					show: true,
					required: true
				},
				comefrom: {
					title: "",
					description: "",
					show: true,
					required: true
				},
				images: {
					title: "",
					description: "",
					show: true,
					required: true
				},
				videos: {
					title: "",
					description: "",
					show: true,
					required: true
				},
				slogan: {
					title: "",
					description: "",
					show: true,
					required: true
				}
			},
			teaminfo: {
				_id: "",
				voteId: "",
				title: "",
				linkman: "",
				linkphone: "",
				images: [],
				videos: [],
				slogan: "",
				IDnumber: "",
				comefrom: ""
			},
			show: false
		};
	},
	beforeRouteUpdate(to, from, next) {
		this.itemId = to.params.itemId;
		this.voteId = to.query.voteId;
		this.breamlist = [
			{ path: "/web/team", title: "报名数据" },
			{ path: "", title: to.params.itemId ? "编辑报名" : "新增报名" }
		];
		this.active = 0;
		this.getTeam();
		next();
	},
	created() {
		this.getTeam();
		this.getVoteData();
	},
	methods: {
		decide() {
			if (this.voteId) {
				for (let i of this.votedata) {
					if (i._id == this.voteId) {
						this.formset = i.formset;
					}
				}
			}
		}, //用来判断当前路由是否带有参数
		getVoteData() {
			this.$post("/voteSrv/wapi/vote/allforweb", {})
				.then(res => {
					if (res.code == 0) {
						this.votedata = res.data;
						this.decide();
					} else {
						this.votedata = [];
					}
				})
				.catch(err => {});
		},
		getTeam() {
			if (this.itemId) {
				this.$toast.loading({ message: "" });
				this.$post("/voteSrv/wapi/item/infoweb", { itemId: this.itemId })
					.then(res => {
						this.getVoteData();
						this.$toast.clear();
						if (res.code == 0) {
							this.teaminfo = _.pick(res.data, [
								"_id",
								"voteId",
								"title",
								"linkman",
								"linkphone",
								"images",
								"videos",
								"slogan",
								"IDnumber",
								"comefrom"
							]);
						} else {
							this.$toast.fail(res.msg);
						}
					})
					.catch(err => {
						this.$toast.fail("加载失败");
					});
			} else {
				this.teaminfo = {
					_id: "",
					voteId: "",
					title: "",
					linkman: "",
					linkphone: "",
					images: [],
					videos: [],
					slogan: "",
					IDnumber: "",
					comefrom: ""
				};
			}
		},
		addTeam() {
			if (this.formset.title.show) {
				if (this.formset.title.required && !this.teaminfo.title)
					return this.$toast.fail(this.formset.title.title + "不能为空");
			}
			if (this.teaminfo.title.length > 10) {
				this.$toast.fail("队伍名称不能超过10个字，请重新输入");
			}
			if (this.formset.linkman.show) {
				if (this.formset.linkman.required && !this.teaminfo.linkman)
					return this.$toast.fail(this.formset.linkman.title + "不能为空");
			}
			if (this.formset.linkphone.show) {
				if (this.formset.linkphone.required && !this.teaminfo.linkphone) {
					return this.$toast.fail(this.formset.linkphone.title + "不能为空");
				} else if (this.teaminfo.linkphone.length !== 11) {
					return this.$toast.fail(this.formset.linkphone.title + "必须11位");
				}
			}
			if (this.formset.IDnumber.show) {
				if (this.formset.IDnumber.required && !this.teaminfo.IDnumber) {
					return this.$toast.fail(this.formset.IDnumber.title + "不能为空");
				} else if (this.teaminfo.IDnumber.length !== 18) {
					return this.$toast.fail(this.formset.IDnumber.title + "必须18位");
				}
			}
			if (this.formset.comefrom.show) {
				if (this.formset.comefrom.required && !this.teaminfo.comefrom) {
					return this.$toast.fail(this.formset.comefrom.title + "不能为空");
				}
			}
			if (this.formset.images.show) {
				if (this.formset.images.required && this.teaminfo.images.length == 0) {
					return this.$toast.fail(this.formset.images.title + "不能为空");
				}
			}
			if (this.formset.videos.show) {
				if (this.formset.videos.required && this.teaminfo.videos.length == 0) {
					return this.$toast.fail(this.formset.videos.title + "不能为空");
				}
			}
			if (this.formset.slogan.show) {
				if (this.formset.slogan.required && !this.teaminfo.slogan) {
					return this.$toast.fail(this.formset.slogan.title + "不能为空");
				}
			}

			if (!this.teaminfo.voteId) {
				return this.$toast.fail("未选择活动");
			}

			this.$toast.loading({ message: "正在保存" });
			this.active = 2;
			this.$post("/voteSrv/wapi/item/addweb", this.teaminfo)
				.then(res => {
					if (res.code == 0) {
						this.active = 3;
						this.$toast.success("保存成功");
						this.$router.go(-1);
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("添加失败");
				});
		},
		upimages() {
			let files = event.target.files;
			if (files.length + this.teaminfo.images.length > 9) {
				return this.$toast.fail("最多上传九张图片");
			}
			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				if (file.size > 2 * 1024 * 1024) {
					return this.$toast.fail("单张图片不能超过2M，请压缩后再上传");
				}
				if (file.type != "image/jpeg" && file.type != "image/png") {
					return this.$toast.fail("图片仅支持jpg/png格式，请转码后再上传");
				}
			}
			this.$toast.loading({ message: "正在上传" });
			var findex = 0;
			this.$async.eachSeries(
				files,
				(file, callback) => {
					if (this.teaminfo.images.length < 9) {
						let formData = new FormData();
						formData.append("file", file);
						this.$upload(formData)
							.then(res => {
								if (res.code == 0) {
									this.teaminfo.images.push(res.data);
									callback(null);
									this.$toast.loading({
										mask: true,
										message: `进度:(${findex + 1}/${files.length})`
									});
								} else {
									callback(res.msg);
								}
							})
							.catch(err => {
								callback(err.message);
							});
					} else {
						callback("最多上传9张图片");
					}
				},
				err => {
					this.$toast.clear();
					if (err) return this.$toast.fail(err);
				}
			);
		},
		removeimg(index) {
			this.teaminfo.images.splice(index, 1);
		},
		upvideo() {
			let file = event.target.files[0];
			if (file.size > 100 * 1024 * 1024) {
				return this.$toast.fail("视频不能超过100M，请压缩后再上传");
			}
			if (file.type != "video/mp4") {
				return this.$toast.fail("视频仅支持mp4格式，请转码后再上传");
			}
			var slicefiles = this.$sliceFile(file);
			var faid = this.$makeUUID();
			this.$toast.loading({ message: "正在上传", duration: 1800000 });
			this.$async.mapSeries(
				slicefiles,
				(slicefile, callback) => {
					let formData = new FormData();
					if (slicefile.chunks > 21)
						return callback("文件超过上传限制：最大100M");
					if (slicefile.chunks > 1) {
						let _file = file.slice(slicefile.from, slicefile.to);
						formData.append("file", _file);
					} else {
						formData.append("file", file);
					}
					formData.set("faid", faid);
					formData.set("chunk", slicefile.chunk);
					formData.set("chunks", slicefile.chunks);
					formData.set("name", slicefile.name);
					this.$plupload(formData)
						.then(res => {
							if (res.code == 0) {
								if (slicefile.chunk + 1 == slicefile.chunks) {
									callback(null, res.data);
								} else {
									callback(null);
								}
							} else {
								callback(res.msg);
							}
						})
						.catch(err => {
							this.$toast.fail("上传失败");
							callback(err);
						});
				},
				(err, results) => {
					this.$toast.clear();
					if (err) {
						this.$toast.fail(err);
					} else {
						this.teaminfo.videos = [results[results.length - 1]];
					}
				}
			);
		},
		computeword() {
			if (this.teaminfo.slogan.trim().length >= 200) {
				this.$message("字数请控制在200以内");
				this.teaminfo.slogan = this.teaminfo.slogan.trim().substr(0, 200);
			}
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/addteam.css";
.panel-heading {
	background-color: #fff;
}
.elbtn {
	padding: 9px 15px;
	background-color: #fff;
	color: #0e90fe;
	font-size: 12px;
	border-radius: 3px;
	border-color: #409eff;
}
.dropdown-menu li {
	padding-left: 8px;
	line-height: 2;
	cursor: pointer;
	color: #666;
}
.dropdown-menu li:hover {
	background-color: #259dff;
	color: #fff;
}
.self {
	align-self: flex-end;
	padding-left: 10px;
}
/* label[for] span:not(.btn)::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
} */
label span.must::after {
	content: "*";
	color: #f56c6c;
	margin-left: 4px;
}
.el-step .el-step__main > .el-step__title {
	margin-top: -60px !important;
}
.fc {
	overflow: hidden;
	margin-bottom: 30px;
}
</style>

