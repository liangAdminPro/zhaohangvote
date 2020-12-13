<template>
	<div class="firstpage">
		<div class="flex-1">
			<p class="big lh pl15">
				<i class="huoyue com"></i>活跃人数
			</p>
			<div class="flex text-center lh">
				<div v-for="(item, index) in activecontent " :key="index" class="flex-33" style="line-height:1">
					<div class="active-blue">{{item.count}}</div>
					<div class="small">{{item.name}}</div>
				</div>
			</div>
		</div>
		<div class="flex-2">
			<p class="big lh pl15">
				<i class="huore com"></i>热门活动
			</p>
			<div style="overflow:hidden">
				<div class="col-lg-3 col-xs-6" v-for="(item, index) in votedata" :key="index">
					<div class="box box-widget widget-user">
						<div
							class="widget-user-header bg-aqua-active"
							:style="'height: ;padding:10px 10px 10px 20px ;background:'+bgColor[index]"
						>
							<h3
								class="widget-user-username"
								style="font-size:18px;margin-bottom:10px;display:flex;justify-content: space-between;"
							>
								<span
									style="flex:1;white-space: nowrap;
                     text-overflow: ellipsis;
                    overflow: hidden;"
									:title="item.title"
								>{{item.title}}</span>
								<span
									:style="'background:#fff;font-size:14px;padding:5px 10px;line-height:1rem;color:'+bgColor[index]"
								>{{item._state==0?'即将开始':(item._state==1?'正在进行':'已经结束')}}</span>
							</h3>
							<h6
								style="text-align:right;margin:10px 0 0"
							>{{item.start|dateFormat}}~{{item.end|dateFormat}}</h6>
						</div>
						<div class="box-footer" :style="'color:#fff;background-color:'+bgColor[index]">
							<div class="flex">
								<div class="flex-50">
									<div class="description-block">
										<h5
											class="description-header"
										>{{votestatistics[item._id]?votestatistics[item._id].voteCount:0}}</h5>
										<span class="description-text">投票数</span>
									</div>
								</div>
								<div class="flex-50">
									<div class="description-block">
										<h5
											class="description-header"
										>{{votestatistics[item._id]?votestatistics[item._id].viewCount:0}}</h5>
										<span class="description-text">访问量</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex-3">
			<p class="big lh pl15">
				<i class="datadetail com"></i>今日大数据详情
			</p>
			<div class="flex flex-around">
				<div v-for="(item, index) in todaydata" :key="index" class="text-center">
					<p class="c-66">{{item.title}}</p>
					<p class="b-b">{{item.count}}</p>
				</div>
			</div>
		</div>
		<div class="flex-4" id="linechart"></div>
	</div>
</template>
<script>
export default {
	name: "webhome",
	data() {
		return {
			activecontent: [
				{ count: 0, name: "日活跃数" },
				{ count: 0, name: "月活跃数" },
				{ count: 0, name: "年活跃数" }
			], //活跃数据
			bgColor: ["#00C3C1", "#899ED4", "#60BA75", "#DCBD4F"],
			votedata: [], //最新活动
			votestatistics: {},
			todaydata: [
				{ title: "新用户", count: 0 },
				{ title: "活动数", count: 0 },
				{ title: "访问量", count: 0 },
				{ title: "投票数", count: 0 }
			],
			legend: ["新用户", "活动数", "访问量", "投票数"],
			weekstatistics: {}
		};
	},
	mounted() {
		this.getData();
	},
	methods: {
		getData() {
			this.$toast.loading({ message: "正在加载" });
			this.$post("/voteSrv/wapi/home/data")
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						try {
							const {
								activeCount_day,
								activeCount_month,
								activeCount_year,
								votedata,
								votestatistics,
								weekstatistics,
								todaydata
							} = res.data;
							this.activecontent = [
								{ count: activeCount_day, name: "日活跃数" },
								{ count: activeCount_month, name: "月活跃数" },
								{ count: activeCount_year, name: "年活跃数" }
							];
							this.votedata = votedata;
							this.votestatistics = votestatistics;
							this.weekstatistics = weekstatistics;
							this.todaydata = [
								{ title: "新用户", count: todaydata.newUserCount },
								{ title: "活动数", count: todaydata.VoteCount },
								{ title: "访问量", count: todaydata.viewCount },
								{ title: "投票数", count: todaydata.voteCount }
							];
							this.lineChart();
						} catch (e) {
							this.$toast.fail("加载失败");
						}
					}
				})
				.catch(err => {});
		},
		lineChart() {
			let charts = this.$echarts.init(document.querySelector("#linechart"));
			charts.setOption({
				title: { text: "一周数据详情" },
				tooltip: { trigger: "axis" },
				legend: { data: this.legend },
				grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
				xAxis: {
					type: "category",
					boundaryGap: false,
					data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
				},
				yAxis: { type: "value" },
				series: [
					{
						name: "新用户",
						type: "line",
						smooth: true,
						stack: "总量",
						data: this.weekstatistics.newUserCount
					},
					{
						name: "活动数",
						smooth: true,
						type: "line",
						stack: "总量",
						data: this.weekstatistics.VoteCount
					},
					{
						name: "访问量",
						smooth: true,
						type: "line",
						stack: "总量",
						data: this.weekstatistics.viewCount
					},
					{
						name: "投票数",
						smooth: true,
						type: "line",
						stack: "总量",
						data: this.weekstatistics.voteCount
					}
				]
			});
			window.addEventListener("resize", function() {
				charts.resize();
			});
		}
	}
};
</script>

<style scoped>
@import "../../assets/web/css/AdminLTE.min.css";
@import "../../assets/web/css/firstpage.css";
#linechart {
	height: 350px;
	width: 100%;
	padding: 20px 0 10px 10px;
	margin-bottom: 20px;
}
.com {
	display: inline-block;
	height: 20px;
	width: 20px;
	background-size: 100% 100%;
	margin-right: 5px;
	vertical-align: -2px;
}
.huoyue {
	background-image: url("../../assets/web/img/huoyue.png");
	filter: invert(86%) sepia(18%) saturate(2893%) hue-rotate(355deg)
		brightness(98%) contrast(108%);
}
.huore {
	background-image: url("../../assets/web/img/huore.png");
}
.datadetail {
	background-image: url("../../assets/web/img/bigdata.png");
}

/*  */
.flex-1,
.flex-2,
.flex-3,
.flex-4 {
	background-color: #fff;
	margin-bottom: 10px;
}
.flex-1,
.flex-3 {
	padding-bottom: 20px;
}
.firstpage {
	margin-left: 10px;
	padding-top: 10px;
}
</style>

