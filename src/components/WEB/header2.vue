<template>
	<div class="main-header">
		<!-- 左侧导航 -->
		<ol class="breadcrumb dbav" style="display:inline-block">
			<li v-for="(item, index) in breamlist" :key="index">
				<i v-if="index==0" class="iconfont icon-sy icom"></i>
				<i v-else class="iconfont icon-wenjian icom"></i>
				<router-link
					v-if="item.query"
					tag="a"
					:to="{path: item.path, query: item.query }"
				>{{item.title}}</router-link>
				<router-link v-else tag="a" :to="item.path">{{item.title}}</router-link>
			</li>
		</ol>
		<!-- 右侧按钮和导航区 -->
		<div class="pull-right" v-if="!hideFunc">
			<slot v-for="item in slots" :name="item"></slot>
			<div class="d-inb mr-l10" v-if="showSearch">
				<input type="text" placeholder="输入搜索内容" required />
				<div class="d-inb search">
					<span class="glyphicon glyphicon-search"></span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "webheader2",
	props: {
		breamlist: { type: Array }, //导航
		hideFunc: { type: Boolean },
		showSearch: { type: Boolean },
		slots: { type: Array }
	},
	data() {
		return {};
	},
	created() {},
	methods: {}
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

