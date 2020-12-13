<!-- 规则设置-->
<template>
	<div style="height:100%;width:100%;padding-left:20px;padding-top:10px;padding-right:10px">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="false"></webheader2>
		<div class="rule flex-col justify-around">
			<div class="base-set rule-flex-33">
				<div class="header">基本设置</div>
				<div class="vote-times">
					<span class="times">投票次数</span>
					<div class="dropdown vote-db-block">
						<button
							id="dLabel"
							class="btn btn-default"
							type="button"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							{{rule.count ? rule.count + '次' : '请选择'}}
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu" aria-labelledby="dLabel">
							<li v-for="item in maxcount" :key="item" @click="changeRule(item, 'count')">{{item}}次</li>
						</ul>
					</div>
					<div class="vote-compu-rule">
						<span class="times" style="vertical-align:top;margin-top:15px;display:inline-block">计算规则</span>
						<div class="vote-radio">
							<div class="radio" v-for="(item, index) in ratedata" :key="index">
								<label @change="changeRule(item.value, 'rate')">
									<i class="vote-active common" v-if="item.value == (rule.rate || ratedata[0].value)"></i>
									<i class="vote-unactive common" v-else></i>
									<input type="radio" name="rate" :value="item.value" style="display:none;" />
									{{item.option}}
								</label>
							</div>
						</div>
					</div>
					<div class="save text-center">
						<button type="button" @click="saveRule()" class="btn btn-default">保存</button>
					</div>
				</div>
			</div>
			<div class="card-set rule-flex-25">
				<div class="header">卡别设置</div>
				<div class="card">
					<div class="card-fe" v-for="(item, index) in carddata" :key="index">
						<div class="times" style="display:inline-block;min-width:110px;">{{item.name}}</div>
						<div class="dropdown vote-db-block">
							<button
								id="dLabel1"
								class="btn btn-default"
								type="button"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								{{rule[item.id]>=0 ? (rule[item.id]>0?('投票1次加' + rule[item.id] + '票'):'不可投票') : '请选择'}}
								<span
									class="caret"
								></span>
							</button>
							<ul class="dropdown-menu" aria-labelledby="dLabel1">
								<li
									v-for="(times, ti) in item.maxtimes"
									:key="ti"
									@click="changeRule(ti, item.id)"
								>{{ti>0?'投票1次加'+ti+'票': '不可投票'}}</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="save text-center">
					<button type="button" @click="saveRule()" class="btn btn-default">保存</button>
				</div>
			</div>
			<div class="whitelist-set rule-flex-25">
				<div class="header">白名单设置</div>
				<div class="card">
					<div class="card-fe" v-for="(item, index) in whitedata" :key="index">
						<span class="times whiteset">{{item.name}}</span>
						<div class="dropdown vote-db-block">
							<button
								id="dLabel2"
								class="btn btn-default"
								type="button"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								{{rule[item.id]>=0 ? (rule[item.id]>0?('投票1次加' + rule[item.id] + '票'):'不可投票') : '请选择'}}
								<span
									class="caret"
								></span>
							</button>
							<ul class="dropdown-menu" aria-labelledby="dLabel2">
								<li
									v-for="(times, ti) in item.maxtimes"
									:key="ti"
									@click="changeRule(ti, item.id)"
								>{{ti>0?'投票1次加'+ti+'票': '不可投票'}}</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="save text-center">
					<button type="button" @click="saveRule()" class="btn btn-default">保存</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import _ from "underscore";
import webheader2 from "./header2";
export default {
	name: "webrule",
	components: {
		webheader2
	},
	data() {
		return {
			breamlist: [
				{ path: "/web/activity", title: "活动管理" },
				{ path: "", title: "规则设置" }
			],
			slots: [],
			voteId: this.$route.params.voteId,
			maxcount: 5,
			ratedata: [
				{ value: "everyteam+everyday", option: "活动周期内每队每天" },
				{ value: "everyday", option: "活动周期内每天" },
				{ value: "total", option: "活动周期内" }
			],
			carddata: [
				{ id: "default", name: "无卡", maxtimes: 6 },
				{ id: "LV1", name: "普卡", maxtimes: 6 },
				{ id: "LV2", name: "金卡", maxtimes: 6 },
				{ id: "LV3", name: "金葵花", maxtimes: 6 },
				{ id: "LV4", name: "钻石卡", maxtimes: 6 },
				{ id: "LV5", name: "私人银行", maxtimes: 6 }
			],
			whitedata: [
				{ id: "W5", name: "时点资产5万元以上", maxtimes: 6 },
				{ id: "W10", name: "时点资产10万元以上", maxtimes: 6 }
			],
			rule: {}
		};
	},
	created() {
		this.getData();
	},
	methods: {
		changeRule(data, key) {
			let rule = _.extend({}, this.rule);
			rule[key] = data;
			this.rule = rule;
		},
		getData() {
			this.$toast.loading({ message: "正在读取当前规则" });
			this.$post("/voteSrv/wapi/vote/ruleinfo", { voteId: this.voteId })
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.rule = res.data;
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("读取失败");
				});
		},
		saveRule() {
			this.$toast.loading({ message: "正在保存" });
			this.$post("/voteSrv/wapi/vote/saverule", {
				voteId: this.voteId,
				rule: this.rule
			})
				.then(res => {
					if (res.code == 0) {
						this.getData();
						this.$toast.success("规则设置成功");
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("保存失败");
				});
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/rule.css";
.dnav {
	margin: 0;
	background-color: #eef0f5;
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
</style>

