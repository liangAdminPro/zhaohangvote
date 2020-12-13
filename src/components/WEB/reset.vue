<!-- 添加账户 -->
<template>
	<div class="addcount">
		<div>
			<div class="pass">
				<label for="password" class="com-label">新密码</label>
				<input
					type="password"
					id="password"
					v-model="password"
					placeholder="请输入新密码"
					title="请填写此字段"
					maxlength="20"
					required
				/>
			</div>
			<div class="pass">
				<label for="password2" class="com-label">确认密码</label>
				<input
					type="password"
					id="password2"
					v-model="password2"
					placeholder="请再次输入新密码"
					title="请填写此字段"
					maxlength="20"
					required
				/>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "addaccount",
	data() {
		return {
			adminId: "",
			password: "",
			password2: ""
		};
	},
	created() {},
	mounted() {},
	watch: {},
	methods: {
		_init(adminId) {
			this.adminId = adminId;
			this.password = "";
			this.password2 = "";
		},
		resetpwd() {
			if (!this.password) return this.$toast.fail("新密码不能为空");
			if (this.password != this.password2)
				return this.$toast.fail("两次输入密码不一致");
			this.$toast.loading({ message: "" });
			this.$post("/voteSrv/wapi/admin/resetpwd", {
				adminId: this.adminId,
				password: this.password
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.$emit("closeModal");
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("修改失败");
				});
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/addcount.css";
</style>

