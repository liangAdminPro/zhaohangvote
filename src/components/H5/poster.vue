<template>
	<div class="bycourse">
		<div class="alert" ref="courseInfo">
			<div class="pic">
				<div class="pic_center">
					<div class="nickname">{{text}}</div>
					<div class="code">
						<img :src="imgUrl" id="qs" alt />
					</div>
				</div>
			</div>
		</div>
		<img :src="dataURL" id="poster" alt />
	</div>
</template>
<script>
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import * as cmblapi from "cmblapi";
export default {
	data() {
		return {
			dataURL: "",
			qrCodeUrl:
				"http://192.168.6.75:8080/?from=singlemessage#/partner_detail/",
			imgUrl: "",
			text: "昵称十个字"
		};
	},
	created() {
		this.Change();
	},
	mounted() {
		this.toImage();
	},
	methods: {
		toImage() {
			html2canvas(this.$refs.courseInfo, {
				// backgroundColor: null
			}).then(canvas => {
				let dataURL = canvas.toDataURL("image/png");
				this.dataURL = dataURL;
			});
		},
		Change() {
			let img = $("#qs");
			let canvas = document.createElement("canvas");
			canvas.width = "100%";
			canvas.height = "100%";
			QRCode.toCanvas(canvas, this.qrCodeUrl, error => {
				if (error) {
					console.log(error);
				} else {
					this.imgUrl = canvas.toDataURL("image/jpeg");
				}
			});
		}
	}
};
</script>
<style>
.alert {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow-y: auto;
	padding: 0;
}
.pic {
	height: 100%;
	width: 100%;
	background: url("../../assets/img/pic/picbg.png") no-repeat top center;
	background-size: 100% 100%;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
}
.pic_center {
	width: 100%;
}
.pic_center .code {
	width: 30%;
	background-color: #ccc;
	border: 1px solid #fff;
}
.pic_center {
	overflow-y: auto;
	padding-top: 3rem;
}
.nickname {
	width: 90%;
	text-align: center;
	margin: 0 auto;
	background: url("../../assets/img/pic/nicknamebg.png") no-repeat top center;
	background-size: 80% 100%;
	padding: 0 2rem;
	font-size: 1.8rem;
	color: #fff;
}
.code {
	margin: 5px auto 0;
}
.code img {
	width: 100%;
}
#poster {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 2;
}
</style>
