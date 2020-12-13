<template>
	<div class="main-header">
		<ol class="breadcrumb dbav" style="display:inline-block">
			<li>
				<i class="iconfont icon-sy icom"></i>
				<router-link tag="a" :to="breamlist[0].path">{{breamlist[0].title}}</router-link>
			</li>
			<li v-for="(item, index) in breamlist.slice(1)" :key="index">
				<i class="iconfont icon-wenjian icom"></i>
				<router-link tag="a" :to="item.path">{{item.title}}</router-link>
			</li>
		</ol>
		<div class="pull-right" v-if="!hideFunc">
			<slot name="loadwhite"></slot>

			<button
				v-if="$route.fullPath !== '/web/team'"
				class="btn btn-success"
				style=" padding: 4px 12px;"
				@click="click"
			>
				<span
					class="glyphicon glyphicon-plus"
					style="padding-right:5px;"
					v-if="$route.fullPath !== '/web/team'"
				></span>
				<slot>创建活动</slot>
				<span v-if="$route.fullPath == '/web/team'" class="caret"></span>
			</button>
			<div v-else style="display: inline-block;" class="btn-group">
				<button
					class="btn btn-success dropdown-toggle"
					style=" padding: 4px 12px;"
					@click="click"
					data-toggle="dropdown"
					aria-haspopup="false"
					aria-expanded="false"
				>
					<span>
						<slot :textcontent="textcontent">{{textcontent}}</slot>
					</span>
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					<li v-for="(item, index) in activityteam" :key="index" @click="textcontent = item">
						<span>{{item}}</span>
					</li>
				</ul>
			</div>
			<div class="d-inb mr-l10">
				<input type="text" v-model="search" placeholder="输入搜索内容" required />
				<div class="d-inb search">
					<span class="glyphicon glyphicon-search"></span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "webheader",
	props: {
		name: { type: String },
		hideFunc: { type: Boolean }
	},
	data() {
		return {
			search: "",
			pathname: this.$route.fullPath,
			breamlist: JSON.parse(localStorage.getItem("breamlist")) || [],
			pathregexp: /^\/web\/(account|whitelist\/[0-9a-zA-Z]{1,})/,
			activityteam: ["全民舞动～嗨起来", "最佳助威人"],
			textcontent: "选择活动归属"
		};
	},
	created() {
		this.getBreadcrumb();
	},
	methods: {
		click() {
			if (this.pathregexp.test(this.pathname)) {
				this.$emit("handleHeaderClick");
			}

			if (this.pathname == "/web/activity") {
				this.$router.push("/web/addactivity");
			}
		},
		getBreadcrumb() {
			let matched = this.$route.matched.filter(item => item.name);
			const { path, meta } = matched[0];
			if (
				path == "/web/account" ||
				path == "/web/activity" ||
				path == "/web/team/:voteId?"
			) {
				this.breamlist = [];
				this.breamlist.push({
					path: this.pathname,
					title: meta.title
				});
			} else {
				if (this.breamlist.length < 2) {
					this.breamlist.push({
						path: this.pathname,
						title: meta.title
					});
				} else {
					this.breamlist.splice(1, 1);
					this.breamlist.push({
						path: this.pathname,
						title: meta.title
					});
				}
			}
			localStorage.setItem("breamlist", JSON.stringify(this.breamlist));
		}
	}
};
</script>
<style scoped>
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

.main-header {
	background: #ffffff;
	padding: 5px 0;
	padding-right: 8px;
}
.dbav {
	margin: 0;
}
.icom {
	color: #666;
}
input[type="text"]:focus {
	box-shadow: 0 0 1px rgba(102, 175, 233, 0.6);
	border-color: #66afe9;
}
input[type="text"] {
	color: #666;
	border: 1px solid #ccc;
	border-right: none;
	padding: 6px 12px 6px 15px;
	border-top-left-radius: 20px;
	border-bottom-left-radius: 20px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	outline: none;
	/* box-shadow: 0 0 1px rgba(0, 0, 0, 0.7); */
	transition: box-shadow 0.15s ease-in-out border-color 0.15s ease-in-out;
	width: 250px;
}
.d-inb {
	display: inline-block;
}
.search {
	background-color: #66afe9;
	color: #fff;
	padding: 0 20px;
	line-height: 34px;
	border-top-left-radius: 0px;
	border-bottom-left-radius: 0px;
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
	margin-left: -4px;
	cursor: pointer;
}
.mr-l10 {
	margin-left: 10px;
}
.breadcrumb {
	background-color: #fff;
}
</style>

