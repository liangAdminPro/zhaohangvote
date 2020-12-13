<template>
	<div class="container">
		<nav>
			<img src="../../assets/img/participate/tip.png" alt />
			<div class="tip">
				<p>填写您的姓名或昵称参加‘最佳助威人’活动</p>
			</div>
		</nav>
		<div class="content">
			<form action>
				<div class="item">
					<p>
						昵称
						<i>*</i>
					</p>
					<input
						type="text"
						v-model="teaminfo.title"
						placeholder="请输入您的姓名或昵称"
						name="name"
						maxlength="10"
						@blur="getlength()"
					/>
				</div>
				<div class="item">
					<p>
						上传精彩图片(默认第一张图片为投票封面图)
						<i>*</i>
					</p>
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
				<div class="item">
					<p>
						活动宣言
						<i>*</i>
					</p>
					<textarea name="sign" v-model="teaminfo.slogan" cols="50" rows="6" placeholder="10-200字"></textarea>
				</div>
				<div class="item">
					<p>*填写姓名或昵称请符合网络文明要求。</p>
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
	name: "participate_best",
	data() {
		return {
			show: false,
			pre: false,
			index: 0,
			teaminfo: {
				voteId: this.$route.params.voteId,
				title: "",
				images: [],
				slogan: ""
			},
			isloading: false
		};
	},
	components: {
		loading
	},
	created() {},
	mounted() {
		$("#app").css("background", "#fff");
	},
	methods: {
		alert() {
			this.show = true;
		},
		del(i) {
			this.teaminfo.images.splice(i, 1);
		},
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
		hidden() {
			this.show = false;
		},
		getlength() {
			if (this.teaminfo.title.length > 10) {
				this.$toast.fail("输入的队伍名称不能超过10个字，请重新输入");
			}
		},
		submit() {
			if (!this.teaminfo.title) return this.$toast.fail("昵称或姓名不能为空");
			if (this.teaminfo.images.length == 0) {
				return this.$toast.fail("精彩图片不能为空");
			}
			if (!this.teaminfo.slogan) {
				return this.$toast.fail("队伍介绍/参赛口号不能为空");
			}
			this.$toast.loading({ message: "" });
			// 提交成功后，显示相应海报
			this.$post("/voteSrv/mapi/item/add", this.teaminfo)
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.alert();
					} else {
						this.$toast.fail(res.msg + "请重新输入报名信息");
					}
				})
				.catch(err => {
					this.$toast.fail("提交失败");
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
</style>
