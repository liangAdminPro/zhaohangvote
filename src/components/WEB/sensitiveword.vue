<!---敏感字-->
<template>
	<div class="sensitive">
		<webheader :title="navname" :name="name"></webheader>
		<div class="sensitive-content">
			<table class="table table-hover">
				<tr class="table-hea">
					<th>#</th>
					<th>姓名</th>
					<th>手机号</th>
					<th>生日</th>
					<th>操作</th>
				</tr>
				<tbody v-for="(item, index) in tabledata" :key="index">
					<tr>
						<td>{{index + md}}</td>
						<td>{{item.name}}</td>
						<td>{{item.mobile}}</td>
						<td>{{item.birthday}}</td>
						<td style="text-align:right;cursor:pointe">
							<button class="btn btn-danger">{{item.state}}</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="footer-elp text-center">
			<nav aria-label="Page navigation">
				<ul class="pagination">
					<li>
						<a href="#" aria-label="Previous">
							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>
					<li>
						<a href="#">1</a>
					</li>
					<li>
						<a href="#">2</a>
					</li>
					<li>
						<a href="#">3</a>
					</li>
					<li>
						<a href="#">4</a>
					</li>
					<li>
						<a href="#">5</a>
					</li>
					<li>
						<a href="#" aria-label="Next">
							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>
<script>
import webheader from "./header";
export default {
	name: "sensitiveword",
	components: {
		webheader
	},
	data() {
		return {
			md: 1, //当前的页数
			word: true,
			navname: "setsensitive",
			name: "敏感字",
			tabledata: [
				{
					id: 1,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 2,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 3,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 4,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 5,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 6,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 7,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 8,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 9,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				},
				{
					id: 10,
					name: "张三",
					mobile: 1672947893,
					birthday: "1999-11-03",
					state: "删除"
				}
			]
		};
	}
};
</script>
<style>
@import "../../assets/web/css/sensitiveword.css";
</style>