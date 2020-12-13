<template>
	<div class="summary">
		<webheader2 :breamlist="breamlist" :slots="slots" :showSearch="false"></webheader2>
		<div style="padding-bottom:1px;background-color:#fff">
			<table
				class="table table-hover"
				style="background:#fff;margin-top:5px;color:#333;border-bottom:1px solid #ccc"
			>
				<tr>
					<th style="padding-left:20px">活动名称</th>
					<th>基本设置</th>
					<th>卡别设置</th>
					<th>白名单设置</th>
					<th>创建时间</th>
					<th style="width:200px"></th>
				</tr>
				<tbody v-for="(item, index) in ruledata" :key="index">
					<tr>
						<td style="padding-left:20px">{{item.title}}</td>
						<td>
							<span class="label label-primary">{{getValue(item.rule.rate, 'rate')}}</span>
							<span class="label label-primary">{{item.rule.count}}次</span>
						</td>
						<td>
							<span
								:class="item.rule.default>0?'label label-success':'label label-danger'"
							>{{getValue('default', 'card')}}+{{item.rule.default>0?item.rule.default:'不可投票'}}</span>
							<span
								:class="item.rule.LV1>0?'label label-success':'label label-danger'"
							>{{getValue('LV1', 'card')}}+{{item.rule.LV1?item.rule.LV1:'不可投票'}}</span>
							<span
								:class="item.rule.LV2>0?'label label-success':'label label-danger'"
							>{{getValue('LV2', 'card')}}+{{item.rule.LV2>0?item.rule.LV2:'不可投票'}}</span>
							<span
								:class="item.rule.LV3>0?'label label-success':'label label-danger'"
							>{{getValue('LV3', 'card')}}+{{item.rule.LV3>0?item.rule.LV3:'不可投票'}}</span>
							<span
								:class="item.rule.LV4>0?'label label-success':'label label-danger'"
							>{{getValue('LV4', 'card')}}+{{item.rule.LV4>0?item.rule.LV4:'不可投票'}}</span>
							<span
								:class="item.rule.LV5>0?'label label-success':'label label-danger'"
							>{{getValue('LV5', 'card')}}+{{item.rule.LV5>0?item.rule.LV5:'不可投票'}}</span>
						</td>
						<td>
							<span
								:class="item.rule.W5>0?'label label-info':'label label-danger'"
							>{{getValue('W5', 'white')}}+{{item.rule.W5>0?item.rule.W5:'不可投票'}}</span>
							<span
								:class="item.rule.W10>0?'label label-info':'label label-danger'"
							>{{getValue('W10', 'white')}}+{{item.rule.W10>0?item.rule.W10:'不可投票'}}</span>
						</td>
						<td>{{item.createdAt|dateFormat}}</td>
						<td style="cursor:pointer;width:200px;">
							<el-button
								type="primary"
								size="small"
								icon="el-icon-edit"
								style="background:#fff; color:#0E90FE;"
								@click="$router.push('/web/rule/' + item._id)"
							>编辑</el-button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--导航栏 -->
		<div class="nav text-center" v-if="total > 1">
			<nav aria-label="Page navigation">
				<ul class="pagination" v-if="total > 1">
					<li :class="page <= 1 ? 'disabled' : ''">
						<a href="javascript:;" aria-label="Previous" @click="prev()">
							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>
					<li
						:class="page==item?'active':''"
						v-for="(item,i) in current"
						:key="i"
						@click="CurrentPage(item)"
					>
						<a href="javascript:;">{{item>total?total:item }}</a>
					</li>
					<li :class="page >= total ? 'disabled' : ''">
						<a href="javascript:;" aria-label="Next" @click="next()">
							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>
<script>
import _ from "underscore";
import webheader2 from "./header2";
export default {
	name: "rulesummary",
	components: {
		webheader2
	},
	data() {
		return {
			breamlist: [
				{ path: "/web/activity", title: "活动管理" },
				{ path: "", title: "规则列表" }
			],
			slots: [],
			ratedata: [
				{ value: "everyteam+everyday", option: "活动周期内每队每天" },
				{ value: "everyday", option: "活动周期内每天" },
				{ value: "total", option: "活动周期内" }
			],
			carddata: [
				{ id: "default", name: "无卡", maxtimes: 5 },
				{ id: "LV1", name: "普卡", maxtimes: 5 },
				{ id: "LV2", name: "金卡", maxtimes: 5 },
				{ id: "LV3", name: "金葵花", maxtimes: 5 },
				{ id: "LV4", name: "钻石卡", maxtimes: 5 },
				{ id: "LV5", name: "私人银行", maxtimes: 5 }
			],
			whitedata: [
				{ id: "W5", name: "时点资产5万元以上", maxtimes: 5 },
				{ id: "W10", name: "时点资产10万元以上", maxtimes: 5 }
			],
			ruledata: [],
			page: 1,
			limit: 5,
			current: [1],
			total: 0,
			count: 0
		};
	},
	created() {
		this.getData();
	},
	methods: {
		getValue(id, type) {
			if (type == "rate")
				return _.findWhere(this.ratedata, { value: id }).option;
			if (type == "card") return _.findWhere(this.carddata, { id }).name;
			if (type == "white") return _.findWhere(this.whitedata, { id }).name;
		},
		CurrentPage(page) {
			if (this.page == page) return;
			this.page = page;
			this.getData();
		},
		prev() {
			if (this.page <= 1) return;
			this.page--;
			this.getData();
		},
		next() {
			if (this.page >= this.total) return;
			this.page++;
			this.getData();
		},
		getData() {
			this.$toast.loading({ message: "正在加载" });
			this.$post("/voteSrv/wapi/vote/rulelist", {
				page: this.page,
				limit: this.limit
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						const { count, data } = res.data;
						this.count = count;
						this.ruledata = data;
						this.total =
							count % this.limit == 0
								? count / this.limit
								: Math.floor(count / this.limit) + 1;
						this.current = this.$makePage(this.page, this.total);
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("加载失败");
				});
		}
	}
};
</script>
<style scoped>
.summary {
	background: #ecf0f5;
	height: 100%;
	padding-left: 20px;
	padding-top: 10px;
	padding-right: 10px;
}
tbody tr td,
th {
	line-height: 3rem !important;
}
th {
	padding-left: 8px;
}
tbody tr:hover {
	background-color: #ecf0f5 !important;
}
.nav {
	background-color: #fff;
}
</style>