<template>
	<div class="bycourse">
		<div class="alert2">
			<div
				v-if="info&&info.vote"
				class="a_content"
				:style="{ background: 'url(' + info.vote.posterbg + ') no-repeat top center', 'background-size': '100% 100%' }"
				ref="courseInfo"
				v-cloak
			>
				<div class="a_center" v-show="info.slogan.length<8">
					<img :src="info.cover" alt />
					<div class="a_bottom">
						<div class="ab_top">
							<div class="ab_img">
								<img id="qs" :src="imgUrl" alt />
							</div>
						</div>
						<p>{{info.titleprefix || ''}}{{info.title}}</p>
					</div>
					<div class="b_bottom" v-show="info.slogan.length<8">{{info.slogan}}</div>
				</div>
				<div class="a_center1" v-show="info.slogan.length>8">
					<img :src="info.cover" alt />
					<div class="a_bottom">
						<div class="ab_top">
							<div class="ab_img">
								<img id="qs" :src="imgUrl" alt />
							</div>
						</div>
						<p>{{info.titleprefix || ''}}{{info.title}}</p>
					</div>
					<div class="b_bottom">{{info.slogan}}</div>
				</div>
				<div class="ab_bottom">
					<i>活动时间</i>
					<span>{{info.vote.start|dateFormat}} ~ {{info.vote.end|dateFormat}}</span>
				</div>
			</div>
		</div>
		<img id="poster" :src="dataURL" alt />
		<div v-if="dataURL" style="display:flex;position:fixed;bottom:1em;width:100%;z-index:999;">
			<button @click="saveImage()">
				<i class="icon iconfont icon-xaingji"></i>保存
			</button>
			<button @click="doShare()">
				<i class="icon iconfont icon-fenxiang- share"></i>分享
			</button>
		</div>
		<loading v-show="isloading"></loading>
	</div>
</template>
<script>
import QRCode from "qrcode";
import * as rasterizeHTML from "rasterizehtml";
import loading from "../Tab/loading";
import * as cmblapi from "cmblapi";
export default {
	data() {
		return {
			dataURL: "",
			imgUrl: "",
			info: {},
			itemId: this.$route.params.itemId,
			isloading: true
		};
	},
	components: {
		loading
	},
	created() {
		cmblapi.setNavigationBarTitle({ title: "活动分享" });
		this.getinfo();
	},
	mounted() {},
	methods: {
		doShare() {
			cmblapi.shareInfoWithUI({
				type: "image",
				channelList: ["weixinsession", "weixintimeline", "weibo", "qqsession"],
				shareContent: {
					imageData: this.dataURL.substring(this.dataURL.indexOf("base64,") + 7)
				},
				success: res => {},
				fail: res => {
					// this.$toast.fail(res.errCode + ":" + res.errMsg);
				}
			});
		},
		saveImage() {
			this.$toast.loading("正在保存");
			cmblapi.saveImageToAlbum({
				picData: this.dataURL.substring(this.dataURL.indexOf("base64,") + 7),
				success: res => {
					this.$toast.success("保存成功");
				},
				fail: res => {
					this.$toast.fail(res.errCode + ":" + res.errMsg);
				}
			});
		},
		toImage() {
			let canvas = document.createElement("canvas");
			rasterizeHTML
				.drawUrl(
					"http://localhost:8080/#/poster_share/f651dbda814c494fa09593e04bca5668",
					canvas,
					{
						width: window.innerWidth,
						height: window.innerHeight
					}
				)
				.then(({ image, svg }) => {
					this.dataURL = image.src;
					$(".a_content").css("display", "none");
				});
		},
		Change(callback) {
			let img = $("#qs");
			let canvas = document.createElement("canvas");
			canvas.width = "100%";
			canvas.height = "100%";
			QRCode.toCanvas(canvas, this.info.cmbUrl, error => {
				if (error) {
					console.error(error);
				} else {
					this.imgUrl = canvas.toDataURL("image/jpeg");
				}
				callback();
			});
		},
		getinfo() {
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/item/info", { itemId: this.itemId })
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.info = res.data;
						this.Change(() => {
							// setTimeout(() => {
							// 	this.toImage();
							// }, 1000);
						});
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
		getlength() {
			if (this.info.slogan.length == 0) {
				this.show = false;
			}
		}
	}
};
</script>
<style scoped>
.alert2 {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	padding: 0;
}
/* 弹框中的生成图片 */
.a_content {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	background-size: 100% 100%;
}
/* 没有宣言 */
.a_center {
	width: 95%;
	margin: 30vh auto 1rem;
	padding-bottom: 1rem;
}
.a_center1 {
	width: 95%;
	margin: 30vh auto 1rem;
	padding-bottom: 1rem;
}
.a_center img {
	display: block;
	width: 100%;
	margin: auto;
	height: 100%;
	max-height: 20rem;
	object-fit: cover;
}
.a_center1 img {
	display: block;
	width: 100%;
	margin: auto;
	height: 100%;
	max-height: 20rem;
	object-fit: cover;
}
.a_bottom {
	padding-right: 1rem;
	display: flex;
	justify-content: space-between;
	margin-left: 0.6rem;
	margin-top: -4rem;
	margin-bottom: 0;
}
.ab_top {
	padding: 1rem;
	flex: 2;
}
.ab_top .ab_img {
	padding-top: 1px;
	width: 7rem;
	height: 7rem;
	border: 2px solid #fff;
	background-color: #ccc;
	text-align: center;
}
/* 二维码的样式 */
.ab_top .ab_img img {
	width: 96%;
	height: 96%;
}
.a_bottom p {
	/* width: 100px; */
	flex: 8;
	text-align: right;
	height: 8rem;
	color: #fa8745;
	line-height: 12rem;
	overflow: hidden;
}
.b_bottom {
	/* height: 8rem; */
	font-size: 1.4rem;
	text-indent: 2em;
	margin-top: 1rem;
	/* margin-bottom: 2rem; */
	padding: 0 1rem;
	overflow: auto;
}
.ab_bottom {
	margin: 0 auto 2rem;
	text-align: center;
	font-size: 1.4rem;
	/* color: #cd5020; */
}
.ab_bottom i {
	margin-right: 0.5rem;
	font-weight: 550;
}
#poster {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 2;
}
button {
	border-radius: 20px;
	display: block;
	border: none;
	background: linear-gradient(left, #fdd03a, #fd6f1c);
	background: -webkit-linear-gradient(left, #ffd63e, #ff6e1f);
	padding: 0.7rem 4rem;
	color: #fff;
	margin: 1rem auto;
	font-size: 1.4rem;
	align-items: center;
}
button:active {
	opacity: 0.9;
}
</style>
