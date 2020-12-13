<!-- 添加账户 -->
<template>
	<div class="addcount">
		<div>
			<div class="name">
				<label for="user" class="com-label">姓名</label>
				<input type="text" id="user" v-model="account.name" placeholder="请输入姓名" title="请填写此字段" required />
			</div>
			<div class="mob">
				<label for="mobile" class="com-label">手机号</label>
				<input
					v-if="adminId"
					type="text"
					id="mobile"
					v-model="account.mobile"
					placeholder="请输入手机号"
					title="请填写此字段"
					maxlength="11"
					readonly
				/>
				<input
					v-else
					type="text"
					id="mobile"
					v-model="account.mobile"
					placeholder="请输入手机号"
					title="请填写此字段"
					maxlength="11"
					required
				/>
			</div>
			<div class="name">
				<label for="corpname" class="com-label">单位名称</label>
				<input
					type="text"
					id="corpname"
					v-model="account.corpname"
					placeholder="请输入单位名称"
					title="请填写此字段"
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
			account: { name: "", mobile: "", corpname: "" }
		};
	},
	created() {},
	mounted() {},
	watch: {},
	methods: {
		addAccount() {
			if (!this.account.name) return this.$toast.fail("姓名不能为空");
			if (!this.account.mobile) return this.$toast.fail("手机号不能为空");
			this.$toast.loading({ message: "正在添加" });
			this.$post("/voteSrv/wapi/admin/add", {
				adminId: this.adminId,
				name: this.account.name,
				mobile: this.account.mobile,
				corpname: this.account.corpname
			})
				.then(res => {
					this.$toast.clear();
					if (res.code == 0) {
						this.account = { name: "", mobile: "", corpname: "" };
						this.$emit("closeModal");
					} else {
						this.$toast.fail(res.msg);
					}
				})
				.catch(err => {
					this.$toast.fail("添加失败");
				});
		},
		getAccount(adminId, callback) {
			this.adminId = adminId;
			if (adminId) {
				this.$toast.loading({ message: "正在加载" });
				this.$post("/voteSrv/wapi/admin/info2", { adminId })
					.then(res => {
						this.$toast.clear();
						if (res.code == 0) {
							const { name, mobile, corpname } = res.data;
							this.account = { name, mobile, corpname };
							callback(null);
						} else {
							this.$toast.fail(res.msg);
							callback(res.msg);
						}
					})
					.catch(err => {
						this.$toast.fail("加载失败");
						callback(err);
					});
			} else {
				this.account = { name: "", mobile: "", corpname: "" };
				callback(null);
			}
		}
	}
};
</script>
<style scoped>
@import "../../assets/web/css/addcount.css";
</style>

