<template>
	<div class="container">
		<nav>
			<img src="../../assets/img/participate/tip.png" alt />
			<div class="tip">
				<p>请仔细填写下列信息，其中*为必填项。</p>
				<p>请保证填写信息的真实性，与参赛信息保持一致。</p>
			</div>
		</nav>
		<div class="content">
			<form action>
				<div class="item" v-if="vote.formset&&vote.formset.title&&vote.formset.title.show">
					<p :class="vote.formset.title.required?'must':''">{{vote.formset.title.title}}</p>
					<input
						type="text"
						v-model="teaminfo.title"
						:placeholder="vote.formset.title.description"
						name="name"
						maxlength="10"
						@blur="getlength()"
					/>
				</div>
				<div class="item" v-if="vote.formset&&vote.formset.linkman&&vote.formset.linkman.show">
					<p :class="vote.formset.linkman.required?'must':''">{{vote.formset.linkman.title}}</p>
					<input
						v-if="userinfo.name"
						type="text"
						v-model="teaminfo.linkman"
						:placeholder="vote.formset.linkman.description"
						name="linkman"
						readonly
					/>
					<input v-else type="text" v-model="teaminfo.linkman" placeholder="请输入负责人姓名" name="linkman" />
				</div>
				<div class="item" v-if="vote.formset&&vote.formset.linkphone&&vote.formset.linkphone.show">
					<p :class="vote.formset.linkphone.required?'must':''">{{vote.formset.linkphone.title}}</p>
					<input
						v-if="userinfo.rphone"
						type="phone"
						v-model="teaminfo.linkphone"
						:placeholder="vote.formset.linkphone.description"
						name="linkphone"
						readonly
					/>
					<input
						v-else
						type="phone"
						v-model="teaminfo.linkphone"
						placeholder="请输入负责人联系电话"
						name="linkphone"
						maxlength="11"
					/>
				</div>
				<div class="item" v-if="vote.formset&&vote.formset.IDnumber&&vote.formset.IDnumber.show">
					<p :class="vote.formset.IDnumber.required?'must':''">{{vote.formset.IDnumber.title}}</p>
					<input
						type="text"
						v-model="teaminfo.IDnumber"
						:placeholder="vote.formset.IDnumber.description"
						name="idno"
						maxlength="18"
						@blur="getlength()"
					/>
				</div>
				<div class="item" v-if="vote.formset&&vote.formset.comefrom&&vote.formset.comefrom.show">
					<p :class="vote.formset.comefrom.required?'must':''">{{vote.formset.comefrom.title}}</p>
					<input
						type="text"
						v-model="teaminfo.comefrom"
						:placeholder="vote.formset.comefrom.description"
						name="comefrom"
					/>
				</div>
				<div class="item" v-if="vote.formset&&vote.formset.images&&vote.formset.images.show">
					<p
						:class="vote.formset.images.required?'must':''"
					>{{vote.formset.images.title+'(默认第一张图片为投票封面图,最多上传9张)'}}</p>
					<label class="ui_button ui_button_primary" for="x" id="imgadd">
						<div
							class="pic"
							v-show="teaminfo.images.length!=0&&teaminfo.images.length<=9"
							v-for="(item,i) in teaminfo.images"
							:key="i"
						>
							<img src="../../assets/img/participate/close.png" alt class="del" @click.prevent="del(i)" />
							<img :src="teaminfo.images[i]" class="img-avatar" @click.prevent="pre=true" />
						</div>
						<div id="pic" v-show="teaminfo.images.length<9">
							<p></p>
							<p></p>
						</div>
					</label>
					<input
						type="file"
						ref="file"
						id="x"
						@change="uploadImg()"
						name="avatar"
						class="take-picture"
						accept="image/jpeg, image/jpg, image/png"
						multiple
						v-if="teaminfo.images.length<9"
					/>
				</div>
				<div class="item" v-if="vote.formset&&vote.formset.videos&&vote.formset.videos.show">
					<p :class="vote.formset.videos.required?'must':''">{{vote.formset.videos.title}}</p>
					<label class="ui_button ui_button_primary" for="y">
						<div id="videoImg" v-show="teaminfo.videos.length==0">
							<div class="top">
								<p></p>
								<p></p>
							</div>
							<div class="bottom">
								<p>点击上传视频</p>
								<p>支持的扩展名.mp4</p>
							</div>
						</div>
					</label>
					<input
						type="file"
						id="y"
						name="take-video"
						class="take-video"
						accept="video/mp4"
						@change="uploadVideo()"
					/>
					<video
						v-for="(item,i) in teaminfo.videos"
						:key="i"
						v-show="teaminfo.videos.length!==0"
						id="video"
						:src="item"
						preload="none"
						controls
						controlslist="nodownload"
						reload
						type="video/mp4"
						:poster="vote.cover"
					></video>
				</div>
				<div class="item" v-if="vote.formset&&vote.formset.slogan&&vote.formset.slogan.show">
					<p :class="vote.formset.slogan.required?'must':''">{{vote.formset.slogan.title}}</p>
					<textarea
						name="sign"
						v-model="teaminfo.slogan"
						cols="50"
						rows="6"
						:placeholder="vote.formset.slogan.description+',10-200字'"
					></textarea>
				</div>
			</form>
			<button @click="submit()" class="submit">报&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</button>
		</div>

		<div class="alert" v-show="show">
			<div class="alert_content">
				<img class="close" src="../../assets/img/participate/close.png" alt @click="hidden()" />
				<h5>
					温馨提示
					<span></span>
				</h5>
				<div class="a_center">
					<i class="icon iconfont icon-dui- dui"></i>
					<p>您的报名资料已提交谢谢参与</p>
				</div>
				<button @click="toast()" class="confirm">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定</button>
			</div>
		</div>
		<!-- 图片预览 -->
		<van-image-preview v-model="pre" :images="teaminfo.images" @change="onChange()">
			<template v-slot:index>第{{ index }}页</template>
		</van-image-preview>
		<loading v-show="isloading"></loading>
	</div>
</template>

<script>
import loading from "../Tab/loading";
import * as cmblapi from "cmblapi";
export default {
	name: "participate",
	data() {
		return {
			show: false,
			vote: {},
			voteId: this.$route.params.voteId,
			pre: false,
			index: 0,
			isloading: false,
			userinfo: {
				name: "",
				rphone: ""
			},
			teaminfo: {
				voteId: this.$route.params.voteId,
				title: "",
				linkman: "",
				linkphone: "",
				images: [],
				videos: [],
				slogan: "",
				IDnumber: "",
				comefrom: ""
			}
		};
	},
	components: {
		loading
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
					clickContent: "history.go(-1)"
				}
			],
			success: function() {},
			fail: function(res) {}
		});
		this.getDetail();
		this.getUserInfo();
		$("#app").css("background", "#fff");
	},
	mounted() {},
	methods: {
		getUserInfo() {
			this.$post("/voteSrv/mapi/user/info", {})
				.then(res => {
					if (res.code == 0) {
						this.userinfo = res.data;
						this.teaminfo = {
							voteId: this.$route.params.voteId,
							title: "",
							linkman: res.data.name,
							linkphone: res.data.rphone,
							images: [],
							videos: [],
							slogan: "",
							IDnumber: res.data.idno,
							comefrom: res.data.comefrom || ""
						};
					}
				})
				.catch(err => {
					console.error(err);
				});
		},
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
		},
		// 报名成功后提示报名成功
		alert() {
			this.show = true;
		},
		//关闭报名成功提示
		hidden() {
			this.show = false;
		},
		// 上传视频
		uploadVideo() {
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
							callback(err.message);
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
		// 上传图片
		uploadImg() {
			// 获取上传的图片
			let files = this.$refs.file.files;
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
		// 点击叉号删除
		del(i) {
			this.teaminfo.images.splice(i, 1);
		},
		getlength() {
			if (this.teaminfo.title.length > 10) {
				this.$toast.fail("输入的队伍名称不能超过10个字，请重新输入");
			}
		},
		// 提交的表单信息
		submit() {
			if (this.vote.formset.title.show) {
				if (this.vote.formset.title.required && !this.teaminfo.title)
					return this.$toast.fail(this.vote.formset.title.title + "不能为空");
			}
			if (this.vote.formset.linkman.show) {
				if (this.vote.formset.linkman.required && !this.teaminfo.linkman)
					return this.$toast.fail(this.vote.formset.linkman.title + "不能为空");
			}
			if (this.vote.formset.linkphone.show) {
				if (this.vote.formset.linkphone.required && !this.teaminfo.linkphone)
					return this.$toast.fail(
						this.vote.formset.linkphone.title + "不能为空"
					);
			}
			if (this.vote.formset.IDnumber.show) {
				if (this.vote.formset.IDnumber.required && !this.teaminfo.IDnumber) {
					return this.$toast.fail(
						this.vote.formset.IDnumber.title + "不能为空"
					);
				}
			}
			if (this.vote.formset.comefrom.show) {
				if (this.vote.formset.comefrom.required && !this.teaminfo.comefrom) {
					return this.$toast.fail(
						this.vote.formset.comefrom.title + "不能为空"
					);
				}
			}
			if (this.vote.formset.images.show) {
				if (
					this.vote.formset.images.required &&
					this.teaminfo.images.length == 0
				) {
					return this.$toast.fail(this.vote.formset.images.title + "不能为空");
				}
			}
			if (this.vote.formset.videos.show) {
				if (
					this.vote.formset.videos.required &&
					this.teaminfo.videos.length == 0
				) {
					return this.$toast.fail(this.vote.formset.videos.title + "不能为空");
				}
			}
			if (this.vote.formset.slogan.show) {
				if (this.vote.formset.slogan.required && !this.teaminfo.slogan) {
					return this.$toast.fail(this.vote.formset.slogan.title + "不能为空");
				}
			}

			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/item/add", this.teaminfo)
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.alert();
					} else {
						this.$toast.fail(res.msg);
					}
					this.isloading = false;
				})
				.catch(err => {
					this.$toast.fail("请求失败");
					this.isloading = false;
					console.error(err);
				});
		},
		toast() {
			this.hidden();
			this.$toast.fail("您的报名信息已经提交，请耐心等候审核通过");
			setTimeout(() => {
				this.success();
			}, 1000);
		},
		success() {
			this.$router.push({ path: "/mysign" });
		},
		onChange(index) {
			this.index = index;
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/participate.css";
.item p.must::after {
	content: "*";
	color: #f56c6c;
	margin-left: 4px;
}
</style>
