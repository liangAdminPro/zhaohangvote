<!---登录-->
<template>
	<div class="login">
		<div class="login-box">
			<div class="login-box-body">
				<img
					id="title"
					src="@/assets/web/img/login/title.png"
					alt
					style="width:70%;margin:auto;display:block;margin-bottom:10%;"
				/>
				<form>
					<div class="form-group has-feedback">
						<input type="text" class="form-control" id="username" v-model="username" placeholder="用户名" />
						<span class="glyphicon glyphicon-user form-control-feedback"></span>
					</div>
					<div class="form-group has-feedback">
						<input
							type="password"
							class="form-control"
							id="inputPassword"
							v-model="password"
							placeholder="密码"
						/>
						<span class="glyphicon glyphicon-lock form-control-feedback"></span>
					</div>
					<div class="row op">
						<button type="button" style="margin:auto;" class="btn form-control" @click="login">立即登录</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import Cookies from "js-cookie";
export default {
	name: "weblogin",
	data() {
		return {
			username: "",
			password: ""
		};
	},
	methods: {
		login() {
			const username = this.username;
			const password = this.password;
			if (!username || !password)
				return alert("登录失败：用户名和密码不能为空");
			this.$post("/voteSrv/wapi/admin/login", { username, password })
				.then(res => {
					if (res.code == 0) {
						const { token } = res.data;
						Cookies.set("jtoken", token);
						let redirect = decodeURIComponent(
							this.$route.query.redirect || "/web/home"
						);
						this.$router.replace({ path: redirect });
					} else {
						return alert(res.msg);
					}
				})
				.catch(err => {});
		}
	}
};
</script>
 <style  scoped>
@import "../../assets/web/css/weblogin.css";
@import "../../assets/web/css/AdminLTE.min.css";
</style>


