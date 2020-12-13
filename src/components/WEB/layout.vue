<!--总布局 -->
<template>
	<div class="webhome skin-blue sidebar-mini">
		<div class="wrapper">
			<header class="main-header">
				<a href="/voteSrv/#/web/home" class="logo" style="text-align:left">
					<span class="logo-mini" style="text-align:center">
						<b>C</b>MB
					</span>
					<span class="logo-lg">招行手机银行投票系统后台</span>
				</a>
				<nav class="navbar navbar-static-top">
					<a
						class="glyphicon glyphicon-list"
						data-toggle="push-menu"
						role="button"
						style="color:#fff;line-height:51px;padding-left:10px;"
						@click.prevent="pushmenu"
					>
						<span class="sr-only">Toggle navigation</span>
					</a>
					<!-- 头部-->
					<div class="navbar-custom-menu">
						<ul class="nav navbar-nav">
							<li class="dropdown user user-menu">
								<a href="#" class="dropdown-toggle" data-toggle="dropdown">
									<img v-if="admininfo.avatar" :src="admininfo.avatar" class="user-image" alt="User Image" />
									<i class="iconfont icon-xuerentou" v-else style="color:pink"></i>
									<span class="hidden-xs">{{admininfo.name}}({{admininfo.mobile}})</span>
								</a>
								<ul class="dropdown-menu">
									<li class="user-header">
										<img v-if="admininfo.avatar" :src="admininfo.avatar" class="img-circle" alt="User Image" />
										<i class="iconfont icon-xuerentou" v-else style="color:pink"></i>
										<p>
											{{admininfo.name}}({{admininfo.mobile}})
											<small v-if="admininfo.role=='0'">管理员</small>
											<small v-if="admininfo.role=='1'">超级管理员</small>
										</p>
									</li>
									<!-- 菜单底部-->
									<li class="user-footer">
										<div class="pull-left">
											<a href="javascript:;" @click="showpwdmodal" class="btn btn-default btn-flat">修改密码</a>
										</div>
										<div class="pull-right">
											<a href="javascript:;" @click="logout" class="btn btn-default btn-flat">注销</a>
										</div>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</nav>
			</header>
			<div
				class="modal fade"
				id="userModal"
				tabindex="-1"
				role="dialog"
				aria-labelledby="userModalLabel"
			>
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 class="modal-title" id="userModalLabel">修改密码</h4>
						</div>
						<div class="modal-body">
							<form role="form">
								<div class="form-group">
									<input
										type="password"
										class="form-control"
										v-model="oldpwd"
										placeholder="输入原密码"
										maxlength="20"
										required
									/>
								</div>
								<div class="form-group">
									<input
										type="password"
										class="form-control"
										v-model="newpwd"
										placeholder="输入新密码"
										maxlength="20"
										required
									/>
								</div>
								<div class="form-group">
									<input
										type="password"
										class="form-control"
										v-model="newpwd2"
										placeholder="再次输入新密码"
										maxlength="20"
										required
									/>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
							<button type="button" class="btn btn-primary" @click="updatepwd">提交</button>
						</div>
					</div>
				</div>
			</div>
			<!-- 侧边栏-->
			<aside class="main-sidebar">
				<section class="sidebar">
					<ul class="sidebar-menu">
						<li class="header" style="font-size:120%;color:#666">欢迎您，{{admininfo.name}}</li>
						<li
							v-for="(navitem, index) in leftnav"
							:key="index"
							:class="['treeview', {'active1': !navitem.leftnavTwo && navitem.urlRegex.test($route.path)}]"
						>
							<router-link v-if="!navitem.leftnavTwo" :to="navitem.url" tag="a">
								<i :class="['iconfont',navitem.icon]"></i>

								<span>{{navitem.name}}</span>
							</router-link>
							<template v-else>
								<a href="javascript:;" @click.prevent="tog(index)">
									<i
										:class="['iconfont', {'icon-huodongguanli':index == 1},{'icon-shujuguanli': index == 2}]"
									></i>
									<span>{{navitem.name}}</span>
									<span v-if="index==1" class="jiantou jiantou1 glyphicon pull-right glyphicon-menu-down"></span>
									<span v-else class="jiantou jiantou2 glyphicon pull-right glyphicon-menu-right"></span>
								</a>
								<ul :class="['treeview-menu','cc'+index]" style="padding-left:0">
									<li
										v-for="(navitem2,index2) in navitem.leftnavTwo"
										:key="index2"
										:class="[{'active': navitem2.urlRegex.test($route.path)}]"
									>
										<router-link tag="a" :to="navitem2.url">{{navitem2.name}}</router-link>
									</li>
								</ul>
							</template>
						</li>
					</ul>
				</section>
				<!-- 结束 -->
			</aside>
			<div class="content-wrapper">
				<router-view />
			</div>
			<div class="main-footer">
				<div class="pull-right hidden-xs">
					<b>Version</b> 1.1.1
				</div>
				<strong>Copyright @{{nowYear()}}</strong>
				招行手机银行投票系统后台管理
			</div>
		</div>
	</div>
</template>
<script>
import Cookies from "js-cookie";
import $ from "jquery";
import moment from "moment";
moment.locale('zh-cn');
export default {
	name: "layout",
	data() {
		return {
			cur: null,
			oldpwd: "",
			newpwd: "",
			newpwd2: "",
			admininfo: {},
			leftnav: [
				{
					name: "首页",
					urlRegex: /^\/web\/home$/,
					url: "/web/home",
					icon: "icon-sy"
				},
				{
					name: "活动管理",
					urlRegex: /^\/web\/(activity|addactivity|rulesummary|rule|whitelist)/,
					// url: "/web/activity",
					leftnavTwo: [
						{
							name: "活动列表",
							url: "/web/activity",
							urlRegex: /^\/web\/activity/
						},
						{
							name: "创建活动",
							url: "/web/addactivity",
							urlRegex: /^\/web\/addactivity/
						},
						{
							name: "白名单管理",
							url: "/web/whitelist",
							urlRegex: /^\/web\/whitelist/
						},
						{
							name: "规则列表",
							url: "/web/rulesummary",
							urlRegex: /^\/web\/rulesummary/
						}
					]
				},
				{
					name: "报名数据",
					urlRegex: /^\/web\/(team|addteam)/,
					// url: "/web/team",
					leftnavTwo: [
						{
							name: "报名列表",
							url: "/web/team",
							urlRegex: /^\/web\/team/
						},
						{
							name: "新增报名",
							url: "/web/addteam",
							urlRegex: /^\/web\/addteam$/
						}
					]
				},
				// { name: "敏感字处理", url: "/web/sensitiveword" },
				{
					name: "账户管理",
					urlRegex: /^\/web\/account$/,
					url: "/web/account",
					icon: "icon-weibiaoti5",
					admin: true
				}
			], //侧边栏内容
			curindex: 0, // 侧边栏的点击索引
			name: "首页",
			voteId: "",
			itemId: ""
		};
	},
	created() {
		this.getAdminInfo();
	},
	mounted() {
		$(".cc1").slideDown();
	},
	methods: {
		nowYear() {
			return moment().format('YYYY');
		},
		getAdminInfo() {
			this.$post("/voteSrv/wapi/admin/info")
				.then(res => {
					if (res.code == 0) {
						if (!res.data.isAdmin) {
							Cookies.remove("jtoken");
							this.$router.push({ path: "/web/login" });
							return;
						}
						this.admininfo = res.data;
						if (res.data.role != "1") {
							this.leftnav = this.leftnav.filter(n => !n.admin);
							if (this.$route.path == "/web/account") {
								return this.$router.push({ path: "/web/home" });
							}
						}
					} else if (res.code == 3) {
						//token失效 重新登录
						Cookies.remove("jtoken");
						this.$router.push({ path: "/web/login" });
					}
				})
				.catch(err => {});
		},
		showpwdmodal() {
			this.oldpwd = "";
			this.newpwd = "";
			this.newpwd2 = "";
			$("#userModal").modal("show");
		},
		hidepwdmodal() {
			this.oldpwd = "";
			this.newpwd = "";
			this.newpwd2 = "";
			$("#userModal").modal("hide");
		},
		updatepwd() {
			if (!this.oldpwd) return this.$toast.fail("原密码不能为空");
			if (!this.newpwd) return this.$toast.fail("新密码不能为空");
			if (this.newpwd != this.newpwd2)
				return this.$toast.fail("两次新密码不一致");
			if (this.newpwd == this.oldpwd)
				return this.$toast.fail("新密码不能与原密码相同");
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/wapi/admin/updatepwd", {
				oldpwd: this.oldpwd,
				newpwd: this.newpwd
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.hidepwdmodal();
						this.$alert("重新登录", "密码修改成功", {
							confirmButtonText: "确定",
							callback: action => {
								Cookies.remove("jtoken");
								this.$router.push({ path: "/web/login" });
							}
						});
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					console.error(err);
					this.$toast.fail("修改失败");
				});
		},
		logout() {
			Cookies.remove("jtoken");
			this.$router.push({ path: "/web/login" });
		},
		pushmenu() {
			$(".webhome").toggleClass("sidebar-collapse");
		},
		tog(index) {
			if (index === 1) {
				$(".cc1").slideToggle();
				$(".jiantou1").toggleClass("glyphicon-menu-right");
				$(".jiantou1").toggleClass("glyphicon-menu-down");
			}
			if (index === 2) {
				$(".cc2").slideToggle();
				$(".jiantou2").toggleClass("glyphicon-menu-down");
			}
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/skins/_all-skins.min.css";
@import "../../assets/web/css/AdminLTE.min.css";
@import "../../assets/web/css/creatactivity.css";
.webhome {
	height: 100%;
}
.pull-down {
	transform: rotate(-90deg) !important;
	transition: all 0.6s;
}
.active1 a:nth-child(1) {
	color: #fff;
}
.tt {
	transform: rotate(90deg) !important;
}
@media (max-width: 767px) {
	.logo-lg {
		text-align: center;
	}
}
</style>
