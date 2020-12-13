<template>
	<div class="container">
		<header>
			<img src="../../assets/img/match/sign-in.png" alt @click="participate" />
		</header>
		<div class="content">
			<div class="item">
				<span class="sign">报名即送大礼包</span>
				<div class="text">
					<p v-for="(item,i) in sign" :key="i">{{item}}</p>
				</div>
			</div>
			<!-- 比赛机制 -->
			<div class="item mechanism">
				<span class="lable">比赛机制</span>
				<span class="underline">线上预赛---线下决赛</span>
				<div class="text indent">
					<p>郑州站线上预赛总评分前21名的队伍取得参加郑州站决赛的资格，如有入选队伍放弃资格，按名次顺延递补参加郑州站决赛。</p>
					<p>获得郑州站线下决赛前3名的队伍，可获得参加全省总决赛参赛资格。</p>
				</div>
			</div>
			<!-- 赛事流程 -->
			<div class="item item_center process">
				<div class="text center">
					<p v-for="(item,i) in steps" :key="i">
						<i>
							<span>{{item.step}}</span>
							<span>{{item.time}}</span>
						</i>
					</p>
				</div>
			</div>
			<!-- 奖项设置 -->
			<div class="item setting">
				<span class="lable">奖项设置</span>
				<div class="text indent">
					<p>体育彩票·第四届河南省全民广场舞大赛“招商银行金葵花杯”郑州站设置专业奖项、人气奖项、投票有礼、助力有礼四类奖项。</p>
				</div>
				<div class="itemlist" v-for="(item,i) in itemlist" :key="i">
					<div class="title">
						<span>{{item.id}}</span>
						<span>{{item.title}}</span>
					</div>
					<div class="text indent">
						<p>{{item.desc}}</p>
					</div>
					<ul class="prizelist">
						<li v-for="(item,i) in item.prizelist" :key="i">
							<p>{{item.prize}}</p>
							<p>{{item.bonus}}</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 竞赛项目 -->
			<div class="item competition">
				<span class="lable">竞赛项目</span>
				<div class="text indent">
					<p>广场舞、健身秧歌、健身腰鼓、啦啦操、搏击操、有氧健身操、排舞、快闪等具有健身效果的舞种均可参赛。</p>
				</div>
			</div>
			<!-- 特色活动 -->
			<div class="item activity">
				<span class="special">特色活动</span>
				<h4>
					<i>线下免费设置</i>
					<em>金葵花广场舞大讲堂</em>
				</h4>
				<div class="text share">
					<p>分享更多参赛宝典</p>
					<P>授课环境舒适优美</P>
					<P>享受更多赛事大礼包</P>
				</div>
			</div>
			<!-- 报名方式 -->
			<div class="item way">
				<span class="lable">报名方式</span>
				<div class="text indent">
					<p>本次大赛不收取报名费，统一采用线上报名，各参赛队以团长为代表登录招商银行APP填写参赛信息，待审核后提交参赛作品，上传成功后由大赛组委（需要补充明确赛事组委会成员来源那些部门或协会）会进行审核，审核通过后即可上传参赛视频。</p>
				</div>
			</div>
			<!-- 参赛办法 -->
			<div class="item beat">
				<span class="lable">参赛办法</span>
				<div class="text indent">
					<p>每队设领队、教练、管理各1人，比赛队员15-25人，替补选手不超过4人，性别不限。</p>
				</div>
			</div>
			<!--参赛要求  -->
			<div class="item require">
				<span class="lable">参赛要求</span>
				<div class="text">
					<p v-for="(item,i) in requirelist" :key="i">{{item}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import * as cmblapi from "cmblapi";
export default {
	name: "vote",
	data() {
		return {
			// 奖项设置
			itemlist: [
				{
					id: "01",
					title: "专业奖项",
					desc:
						"参赛选手将参赛视频通过招行手机银行进行上传，上传后由专业评审根据专业表现进行评选，10-11月每三周一次专家线上评分，取3轮总评分前21名的队伍入围郑州站决赛，最终专业奖项（郑州站决赛前十名）由现场专业评审与大众评审共同评选。",
					prizelist: [
						{
							prize: "郑州站冠军",
							bonus: "30000元"
						},
						{
							prize: "郑州站亚军",
							bonus: "20000元"
						},
						{
							prize: "郑州站季军",
							bonus: "10000元"
						},
						{
							prize: "郑州站优秀舞团(7名)",
							bonus: "3000元"
						}
					]
				},
				{
					id: "02",
					title: "人气奖项",
					desc:
						"人气奖项由参赛选手上传视频的投票数作为依据，设置人气奖金池，每票等值1元助力金，，非持卡客户、持卡大众客群、金卡客群、金葵花客群分别拥有不同数量的票数/助力金，投票期结束后，依最终票数排名，团队奖和个人奖投票绝对量排名靠前者，获得相应人气奖项（即最赞广场舞团和最美广场舞者）。",
					prizelist: [
						{
							prize: "团队奖3名",
							bonus: "5000元/队（最高上限）"
						},
						{
							prize: "个人奖5名",
							bonus: "1000元/人（最高上限）"
						}
					]
				},
				{
					id: "03",
					title: "投票有礼",
					desc:
						"凡是下载招商银行APP并注册一网通的客户（持招行卡与非招行卡均可），均可参与投票，投票完毕即可参与抽奖，对应礼品和票券需通过手机银行线上领取。",
					prizelist: [
						{
							prize: "一等奖",
							bonus: "价值200元礼品/票券"
						},
						{
							prize: "二等奖",
							bonus: "价值100元礼品/票券"
						},
						{
							prize: "三等奖",
							bonus: "价值25元礼品/票券"
						}
					]
				},
				{
					id: "04",
					title: "助力有礼",
					desc:
						"线上预赛和现场决赛设置助力有礼奖项，针对现场参与观众或亲友团（需是招行一网通用户），均可通过手机银行转发心仪队伍/舞者的助力图片链接，经审核后将链接分享至朋友圈或微信群等各种渠道，投票数量排名前20的即可获得助力奖。",
					prizelist: [
						{
							prize: "助力奖",
							bonus: "价值100元礼品/票券"
						}
					]
				}
			],
			//   参赛要求
			requirelist: [
				"参加郑州站决赛的舞蹈需与预赛上传视频作品保持一致。",
				"各参赛队所上传视频要为近期拍摄，拍摄背景要有参赛队伍名称、LOGO、组委会指定金葵花元素（可寻找就近招商银行网点进行提供），画面清晰完整、正面且连续，不可剪辑编辑及加工。",
				"网站上传参赛视频要求为无后期编辑及加工，需包括所有队员完整动作，视频画面不得出现其他非表演参赛人员。",
				"参赛音乐需选择能体现健康向上，具有正能量的曲目，时长为3分至4分30秒。音乐中不得出现不健康词语。如有发现将取消该队伍比赛资格。",
				"舞蹈编排及动作设计要遵循健康、安全的原则，整体编排需符合广场舞特点。队形统一、动作整齐流畅。有团队配合与交流。不提倡做高难度、危险性动作，不得使用低俗、不雅的舞蹈动作，如有发现将取消该队伍比赛资格。",
				"各队应统一参赛服装，工装、制服、演出服均可，参赛服装须整洁、美观、大方，能彰显本队参赛人员特点。",
				"每队参赛选手原则上不得更换。"
			],
			//比赛流程
			steps: [
				{
					step: "大赛报名",
					time: "（2019年7-8月）"
				},
				{
					step: "郑州站线上预赛",
					time: "（2019年10月-11月）"
				},
				{
					step: "郑州站线下决赛",
					time: "（2019年12月）"
				}
			],
			sign: [
				"凡下载招商银行APP注册一网通的客户，参与报名可获得价值1380元港澳五天四晚游代金券1张。",
				"凡下载招商银行APP注册一网通的客户，报名即可获得一件夏季训练服。",
				"开卡大礼包，凡新开卡客户，实现绑卡并体验相应功能，即可参与“新人见面礼，不止666”活动，体验功能，有机会赢取899元拉杆箱、华为电脑、三星GalaxyS10+手机等大奖。"
			]
		};
	},
	components: {},
	created() {},
	mounted() {},
	methods: {
		participate() {
			this.$router.push({
				path: "/participate/db3937f8ed7643d3808c2bacefcb8e0c"
			});
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/match.css";
</style>
