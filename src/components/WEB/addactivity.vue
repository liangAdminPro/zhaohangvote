<!--创建活动 -->
<template>
	<div class="addactivity">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="false"></webheader2>
		<div class="panel panel-default">
			<div class="panel-heading">
				<img src="@/assets/web/img/tip.png" alt />
				<div class="right">
					<p>温馨提示</p>
					<p>
						请认真填写活动信息(带
						<span style="color:red">*</span>为必填项)
					</p>
				</div>
			</div>
			<div class="panel-body">
				<div class="f">
					<label for="title" class="title">
						<span>活动名称</span>
					</label>
					<input
						type="text"
						class="form-control"
						id="title"
						v-model="voteinfo.title"
						placeholder="请输入活动名称"
						required
						maxlength="50"
					/>
				</div>
				<div class="f">
					<label for="tag" class="title">
						<span>活动标签</span>
					</label>
					<input
						type="text"
						class="form-control"
						id="tag"
						v-model="voteinfo.tag"
						placeholder="请输入活动标签"
						required
					/>
				</div>
				<div class="f">
					<label for="time" class="title">
						<span>起止时间</span>
					</label>
					<div class="acti-time">
						<div class="date">
							<el-date-picker
								:editable="false"
								v-model="voteinfo.start"
								type="datetime"
								placeholder="选择开始日期"
								default-time="12:00:00"
								format="yyyy-MM-dd HH:mm"
							></el-date-picker>
						</div>
						<span>-</span>
						<div class="date">
							<el-date-picker
								:editable="false"
								v-model="voteinfo.end"
								type="datetime"
								placeholder="选择结束日期"
								default-time="12:00:00"
								format="yyyy-MM-dd HH:mm"
							></el-date-picker>
						</div>
					</div>
				</div>
				<div class="f">
					<label for="address" class="title">
						<span>活动地点</span>
					</label>
					<input
						type="text"
						class="form-control"
						id="address"
						v-model="voteinfo.address"
						placeholder="请输入活动地点"
						required
						maxlength="50"
					/>
				</div>
				<div class="f">
					<label for="self_registration" class="title">
						<span>我要参与</span>
					</label>
					<el-switch style="width: 100%;padding: 6px 12px;" v-model="voteinfo.self_registration"></el-switch>
				</div>
				<div class="f">
					<label for="lotteryUrl" class="title">活动抽奖地址</label>
					<input
						type="text"
						class="form-control"
						id="lotteryUrl"
						v-model="voteinfo.lotteryUrl"
						placeholder="请输入活动抽奖链接"
					/>
				</div>
				<!-- 上传封面 -->
				<div class="f">
					<label for="title" class="title" style="width:120px;">
						<span>活动封面</span>
					</label>
					<div class="updownload">
						<label for="cover">
							<div class="fmm" v-if="!voteinfo.cover">
								<div style="text-align:center;font-size:1.5rem;color:#ccc">
									<img class="img-add" src="../../assets/web/img/jiahao.png" />
								</div>
								<div class="text-center">上传活动封面</div>
							</div>
							<div class="fmm" v-if="voteinfo.cover" style="justify-content:unset;">
								<img :src="voteinfo.cover" style="width:100%;height:100%;object-fit:cover;" />
								<div class="text-center small">(点击图片更换)</div>
							</div>
						</label>
						<input
							type="file"
							id="cover"
							@change="uploadCover('cover')"
							style="display:none;"
							accept="image/png, image/jpg, image/jpeg"
						/>
					</div>
				</div>
				<div class="f">
					<label for="title" class="title" style="width:120px;">
						<span>海报背景(App分享用，尺寸1125x2001)</span>
					</label>
					<div class="updownload">
						<label for="posterbg">
							<div class="fmm" v-if="!voteinfo.posterbg">
								<div style="text-align:center;font-size:1.5rem;color:#ccc">
									<img class="img-add" src="../../assets/web/img/jiahao.png" />
								</div>
								<div class="text-center">上传海报背景</div>
							</div>
							<div class="fmm" v-if="voteinfo.posterbg" style="justify-content:unset;">
								<img :src="voteinfo.posterbg" style="width:100%;height:100%;object-fit:cover;" />
								<div class="text-center small">(点击图片更换)</div>
							</div>
						</label>
						<input
							type="file"
							id="posterbg"
							@change="uploadCover('posterbg')"
							style="display:none;"
							accept="image/png, image/jpg, image/jpeg"
						/>
					</div>
				</div>
				<!-- <div class="f">
          <label for="shareshorturl" class="title">
            <span>分享短链地址</span>
          </label>
          <input
            type="text"
            class="form-control"
            id="shareshorturl"
            v-model="voteinfo.shareshorturl"
            placeholder="请输入分享短链地址"
            required
            maxlength="256"
          />
				</div>-->
				<div class="f">
					<label for="desc" class="title" style="width:120px;text-align:right">
						<span>活动描述</span>
					</label>
					<div class="activi-content">
						<quill-editor
							id="desc"
							ref="quill"
							v-model="voteinfo.desc"
							:options="editorOption"
							style="width:574px;"
						></quill-editor>
					</div>
				</div>

				<div style="padding:15px 10px;text-align:center;background:#fff">
					<el-button type="primary" @click="addActivity">保存</el-button>
					<el-button type="primary" style="background:#fff;color:#0E90FE;">取消</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import _ from "underscore";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import webheader2 from "./header2";
export default {
	name: "addactivity",
	components: {
		quillEditor,
		webheader2
	},
	data() {
		return {
			breamlist: [
				{ path: "/web/activity", title: "活动管理" },
				{ path: "", title: "创建活动" }
			],
			slots: [],
			voteId: this.$route.params.voteId,
			voteinfo: {
				title: "",
				tag: "",
				start: new Date(),
				end: new Date(),
				address: "",
				self_registration: true,
				lotteryUrl: "",
				cover: "",
				posterbg: "",
				// shareshorturl: "",
				desc: ""
			},
			editorOption: {
				placeholder: "此处输入活动说明"
			}
		};
	},
	created() {
		this.getActivity();
	},
	mounted() {},
	methods: {
		getActivity() {
			if (this.voteId) {
				this.$toast.loading({ message: "正在加载" });
				this.$post("/voteSrv/wapi/vote/infoweb", { voteId: this.voteId })
					.then(res => {
						this.$toast.clear();
						if (res.code == 0) {
							const {
								title,
								tag,
								address,
								self_registration,
								cover,
								posterbg,
								// shareshorturl,
								lotteryUrl,
								start,
								end,
								desc
							} = res.data;
							this.voteinfo = {
								title,
								tag,
								address,
								self_registration,
								cover,
								posterbg,
								// shareshorturl: shareshorturl || "",
								lotteryUrl,
								start: new Date(start),
								end: new Date(end),
								desc
							};
						} else {
							this.$toast.fail(res.msg);
						}
					})
					.catch(err => {
						this.$toast.fail("加载失败");
					});
			} else {
				this._initvoteinfo();
			}
		},
		_initvoteinfo() {
			this.voteinfo = {
				title: "",
				tag: "",
				address: "",
				self_registration: true,
				cover: "",
				posterbg: "",
				// shareshorturl: "",
				lotteryUrl: "",
				start: new Date(),
				end: new Date(),
				desc: ""
			};
		},
		uploadCover(key) {
			let file = event.target.files[0];
			if (file.size > 2 * 1024 * 1024) {
				return this.$toast.fail("图片不能超过2M，请压缩后再上传");
			}
			if (file.type != "image/jpeg" && file.type != "image/png") {
				return this.$toast.fail("图片仅支持jpg/png格式，请转码后再上传");
			}
			let formData = new FormData();
			formData.append("file", file);
			this.$toast.loading({ message: "正在上传" });
			this.$upload(formData)
				.then(res => {
					if (res.code == 0) {
						this.voteinfo[key] = res.data;
						this.$toast.success("上传成功");
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("上传失败");
				});
		},
		addActivity() {
			if (!this.voteinfo.title) return this.$toast.fail("活动名称不能为空");
			if (!this.voteinfo.tag) return this.$toast.fail("活动标签不能为空");
			if (!this.voteinfo.address) return this.$toast.fail("活动地点不能为空");
			if (!this.voteinfo.start) return this.$toast.fail("开始时间不能为空");
			if (!this.voteinfo.end) return this.$toast.fail("结束时间不能为空");
			if (!this.voteinfo.cover) return this.$toast.fail("活动封面不能为空");
			if (!this.voteinfo.posterbg) return this.$toast.fail("海报背景不能为空");
			// if (!this.voteinfo.shareshorturl) return this.$toast.fail("分享短链不能为空");
			if (!this.voteinfo.desc) return this.$toast.fail("活动说明不能为空");
			const voteinfo = {
				title: this.voteinfo.title,
				tag: this.voteinfo.tag,
				start: this.voteinfo.start.getTime(),
				end: this.voteinfo.end.getTime(),
				address: this.voteinfo.address,
				self_registration: this.voteinfo.self_registration,
				cover: this.voteinfo.cover,
				posterbg: this.voteinfo.posterbg,
				// shareshorturl: this.voteinfo.shareshorturl,
				lotteryUrl: this.voteinfo.lotteryUrl,
				desc: this.voteinfo.desc
			};
			this.$toast.loading({ message: "正在保存" });
			this.$post("/voteSrv/wapi/vote/add", { voteId: this.voteId, voteinfo })
				.then(res => {
					if (res.code == 0) {
						this.$toast.success("保存成功");
						setTimeout(() => {
							this.$router.push({ path: "/web/activity" });
						}, 1000);
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("添加失败");
				});
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/creatactivity.css";
label[for] span::after {
	content: "*";
	color: #f56c6c;
	margin-left: 4px;
}
</style>


