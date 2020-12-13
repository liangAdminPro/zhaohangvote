<template>
	<div class="container">
		<nav>
			<video
				v-if="info.videos&&info.videos.length>0"
				:src="info.videos"
				controls="controls"
				controlslist="nodownload"
				preload="none"
				:poster="info.cover"
			></video>
			<img
				v-if="!info.videos||info.videos.length==0"
				:src="info.vote&&info.vote.cover"
				style="width:100%"
				alt
			/>
		</nav>
		<div class="content">
			<span style="margin-top:0.5rem;" class="title">{{info.titleprefix || ''}}{{info.title}}</span>
			<div class="zan">
				<div class="circle">
					<template v-if="isMPBank()">
						<img
							v-if="info.voteable"
							src="../../assets/img/partner_detail/voteable.png"
							alt
							@click="zan()"
						/>
						<img v-else-if="info.voted" src="../../assets/img/partner_detail/voted.png" alt />
						<div v-else :style="{width: (width / 4) + 'px', height: (width / 4) + 'px'}"></div>
					</template>
					<div v-else :style="{width: (width / 4) + 'px', height: (width / 4) + 'px'}"></div>
				</div>
				<p>
					已获得
					<i>{{info.votecount}}</i> 票
					<!-- <span></span> -->
				</p>
			</div>

			<div class="item">
				<p
					v-for="(item, index) in info.forms"
					:key="index"
					style="text-align:left;color:#fd712a;margin-bottom:0.5rem;"
				>{{item.name}}：{{item.value}}</p>
				<p style="text-align:left;" v-if="info.slogan">{{info.slogan}}</p>
				<!-- <p style="text-align:left;" v-else>当前队伍暂无宣言</p> -->
				<img v-for="(item,i) in info.images" :key="i" :src="item" alt @click="pre=true" />
			</div>
			<button v-if="isMPBank()" @click="toImage()">
				<i class="icon iconfont icon-xaingji"></i>生成海报照片
			</button>
		</div>

		<van-image-preview v-model="pre" :images="info.images" @change="onChange">
			<template v-slot:index>第{{ index }}页</template>
		</van-image-preview>
		<loading v-show="isloading"></loading>
	</div>
</template>

<script>
import loading from "../Tab/loading";
import icon from "@/assets/font/iconfont.js";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import * as cmblapi from "cmblapi";
export default {
	name: "partner_detail",
	data() {
		return {
			itemId: this.$route.params.itemId,
			info: {},
			pre: false,
			index: 0,
			isloading: true,
			width: window.innerWidth
		};
	},
	components: {
		loading
	},
	created() {
		window.onresize = e => {
			this.width = e.currentTarget.innerWidth;
		};
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
		$("#app").css({ background: "#f1f1f1" });
		this.getinfo(0);
	},
	mounted() {},
	methods: {
		isMPBank() {
			return this.$isMPBank();
		},
		onChange(index) {
			this.index = index;
		},
		// 投票与未投票图标的切换
		zan() {
			if (!this.info.voteable) return;
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/mapi/record/add", {
				voteId: this.info.voteId,
				itemId: this.itemId
			})
				.then(res => {
					this.info.state = 1;
					if (res.code == 0) {
						this.getinfo(0);
						setTimeout(() => {
							this.success();
						}, 1000);
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
		_pregetinfo(itemId, callback) {
			this.itemId = itemId;
			this.getinfo(1, callback);
		},
		getinfo(from, callback) {
			if (!this.itemId) return;
			this.$toast.loading({ message: "" });
			var url = "/voteSrv/mapi/item/info";
			if (from == 1) url = "/voteSrv/wapi/item/infoweb";
			this.$post(url, { itemId: this.itemId })
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.info = res.data;
						cmblapi.setNavigationBarTitle({ title: res.data.title });
						typeof callback == "function" && callback(null);
					} else {
						this.$toast.fail(res.msg);
						typeof callback == "function" && callback(res.msg);
					}
					this.isloading = false;
				})
				.catch(err => {
					this.$toast.fail("加载失败");
					this.isloading = false;
					console.error(err);
					typeof callback == "function" && callback(err);
				});
		},
		success() {
			this.$router.push({
				path: "/success/" + this.info.voteId,
				query: { itemId: this.itemId }
			});
		},
		toImage() {
			this.$router.push({ path: "/poster_share/" + this.itemId });
		}
	},
	watch: {
		itemid: function(newvalue, oldvalue) {
			this.itemId = newvalue;
			this.getinfo(0);
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/partner_detail.css";
</style>
