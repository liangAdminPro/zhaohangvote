<!--白名单添加 -->
<template>
	<div class="addwhitelist">
		<div class="content">
			<div class="body">
				<label for="name">姓名</label>
				<input type="text" id="name" v-model="whiteinfo.name" placeholder="请输入姓名" />
			</div>
			<div class="body">
				<label for="phone">手机号</label>
				<input
					v-if="whiteinfo._id"
					type="text"
					id="phone"
					v-model="whiteinfo.phone"
					placeholder="请输入手机号"
					maxlength="11"
					readonly
				/>
				<input
					v-else
					type="text"
					id="phone"
					v-model="whiteinfo.phone"
					placeholder="请输入手机号"
					maxlength="11"
				/>
			</div>
			<div class="body">
				<label for="idno">身份证号</label>
				<input
					v-if="whiteinfo._id"
					type="text"
					id="idno"
					v-model="whiteinfo.idno"
					@input="calcidno()"
					placeholder="请输入身份证号"
					maxlength="18"
					readonly
				/>
				<input
					v-else
					type="text"
					id="idno"
					v-model="whiteinfo.idno"
					@input="calcidno()"
					placeholder="请输入身份证号"
					maxlength="18"
				/>
			</div>
			<div class="body">
				<label for="birth">生日</label>
				<el-date-picker
					id="birth"
					v-model="whiteinfo.birth"
					:editable="true"
					placeholder="请选择生日"
					type="date"
					format="yyyy-MM-dd"
					size="small"
				></el-date-picker>
			</div>
			<div class="body dropdown last">
				<label for="level">级别</label>
				<input
					type="type"
					id="level"
					v-model="lname"
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
					placeholder="请选择级别"
					readonly
				/>
				<span class="caret cc"></span>
				<ul class="dropdown-menu" aria-labelledby="lv">
					<li
						v-for="(item, index) in levels"
						:key="index"
						@click="whiteinfo.level=item.id,lname=item.name"
					>{{item.name}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import moment from "moment";
moment.locale("zh-cn");
import _ from "underscore";
export default {
	name: "addwhitelist",
	data() {
		return {
			whiteinfo: {
				_id: "",
				voteId: this.$route.params.voteId || "",
				name: "",
				phone: "",
				idno: "",
				birth: "",
				level: ""
			},
			lname: "请选择",
			levels: [
				{ id: "W5", name: "时点资产5万元以上" },
				{ id: "W10", name: "时点资产10万元以上" }
			]
		};
	},
	created() {},
	watch: {},
	methods: {
		calcidno() {
			var idno = this.whiteinfo.idno;
			var idNoInfo = this.$isCardID(idno);
			if (idNoInfo) {
				this.whiteinfo.birth = new Date(idNoInfo.birth + " 00:00:00.000+08:00");
			}
		},
		getData(whid, callback) {
			if (whid) {
				this.$toast.loading({ message: "正在加载" });
				this.$post("/voteSrv/wapi/whitelist/info", { whid })
					.then(res => {
						this.$toast.clear();
						if (res.code == 0) {
							const { _id, voteId, name, phone, idno, birth, level } = res.data;
							this.whiteinfo = { _id, voteId, name, phone, idno, birth, level };
							this.lname = _.findWhere(this.levels, { id: level }).name;
							callback(null);
						} else {
							this.$toast.fail(res.msg);
							callback(res.msg);
						}
					})
					.catch(err => {
						this.$toast.fail("加载失败");
						callback(err);
					});
			} else {
				this.whiteinfo = {
					_id: "",
					voteId: this.$route.params.voteId || "",
					name: "",
					phone: "",
					idno: "",
					birth: "",
					level: ""
				};
				callback(null);
			}
		},
		addWhiteList() {
			if (!this.whiteinfo.name) return this.$toast.fail("姓名不能为空");
			if (!this.whiteinfo.phone && !this.whiteinfo.idno)
				return this.$toast.fail("手机号和身份证号至少填写一项");
			if (!this.whiteinfo.level) return this.$toast.fail("级别不能为空");
			if (this.whiteinfo.birth) {
				this.whiteinfo.birth = moment(this.whiteinfo.birth).format(
					"YYYY-MM-DD"
				);
			}
			this.$toast.loading({ message: "正在添加" });
			this.$post("/voteSrv/wapi/whitelist/add", this.whiteinfo)
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.$emit("closeModal");
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
label[for] {
	padding-right: 10px;
	width: 70px;
	text-align: right;
	color: #666;
}
.addwhitelist {
	padding-bottom: 7%;
	color: #666;
}
.addwhitelist .header {
	font-size: 120%;
	padding: 10px 0;
	border-bottom: 1px solid #ccc;
	text-align: center;
	letter-spacing: 0.5em;
}

.body {
	line-height: 2;
	margin-top: 20px;
	padding-left: 40px;
}
.last {
	padding-bottom: 40px;
}
.bodyla {
	margin: 30px 0 0 0;
	padding-bottom: 20px;
}
.text-center {
	text-align: center;
}
input {
	border-radius: 2px;
	border: 1px solid #ccc;
	box-shadow: 0 0 1px #ccc;
	transition: border-color 0.35s, box-shadow 0.35s;
	width: calc(100% - 180px);
	padding-left: 8px;
	line-height: 32px;
	border-radius: 5px;
}
input:focus {
	box-shadow: 0 0 1px rgba(102, 175, 233, 0.6);
	border-color: #66afe9;
}
.dropdown-menu {
	top: 40% !important;
	left: 113px !important;
	width: calc(100% - 218px);
}
.dropdown-menu li {
	padding-left: 8px;
	line-height: 2;
	cursor: pointer;
}
.dropdown-menu li:hover {
	background-color: #259dff;
	color: #fff;
}
.cc {
	margin-left: -20px !important;
}
</style>


