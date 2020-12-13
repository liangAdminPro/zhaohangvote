<template>
	<div class="loading">
		<img src="../../assets/img/load.gif" alt />
	</div>
</template>

<script>
import Cookies from "js-cookie";
import { Base64 } from "js-base64";
import * as cmblapi from "cmblapi";
export default {
	name: "header",
	data() {
		return {};
	},
	created() {
		this.login();
	},
	mounted() {},
	methods: {
		login() {
			setTimeout(() => {
				try {
					var XdParams = Cookies.get("cmb.XdParams");
					if (XdParams) {
						XdParams = JSON.parse(Base64.decode(XdParams));
						console.log(XdParams);
						if (XdParams.type == "redirect") {
							this.$router.replace({ path: XdParams.path });
						} else {
							this.$router.replace({ path: "/list" });
						}
					} else {
						this.$router.replace({ path: "/list" });
					}
				} catch (e) {
					// console.error(e);
					this.$router.replace({ path: "/list" });
				}
			}, 1000);
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
.loading {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
div {
	padding: 10px;
}
p {
	overflow-wrap: break-word;
}
</style>
