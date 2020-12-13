<template>
	<van-swipe :autoplay="3000" indicator-color="white">
		<van-swipe-item v-for="(item,i) in bannerlist" :key="i">
			<img :src="item.cover" style="height:18rem;" @click="$router.push('/active_detail/' + item._id)" />
		</van-swipe-item>
	</van-swipe>
</template>

<script>
import Cookies from "js-cookie";
export default {
	name: "swiper",
	data() {
		return {
			bannerlist: []
		};
	},
	created() {
		this.getbanners();
	},
	mounted() {},
	methods: {
		getbanners() {
			this.$post("/voteSrv/mapi/vote/banners", {
				tags: Cookies.get("cmb.ListTags")
			})
				.then(res => {
					if (res.code == 0) {
						this.bannerlist = res.data;
					}
				})
				.catch(err => {
					console.error(err);
				});
		}
	}
};
</script>

<style scoped>
@import "../../assets/css/reset.css";
img {
	width: 100%;
}
</style>
