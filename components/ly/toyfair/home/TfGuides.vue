<!--
  Toy Fair home: the play guide (design fairGuide): the four newest posts of the shop's own blog as cards (cover,
  date, title, line, "Read the guide"). Hidden when the shop has no posts.
-->
<template>
  <section v-if="posts.length" aria-labelledby="tf-guides-h" :class="['tf-sec', 'tf-guides-sec', { band }]">
    <div class="wrap">
      <div class="tf-top">
        <h2 id="tf-guides-h">{{ t("tf.home.guidesH", "The {shop} play guide", { shop: shopName }) }}</h2>
        <router-link :to="blogTo" class="tf-more">{{ t("tf.home.allGuides", "See all guides") }}<ly-icon name="arrow" /></router-link>
      </div>
      <ul :data-n="posts.length" class="tf-guides">
        <li v-for="b in posts" :key="b.id">
          <router-link :to="postRoute(b)" class="tf-guide">
            <span class="tf-guide-ph"><img v-if="b.image" :src="cover(b)" alt="" loading="lazy" /></span>
            <span class="tf-guide-tx">
              <time v-if="b.created_at" :datetime="b.created_at">{{ fmtDate(b.created_at) }}</time>
              <strong>{{ b.title }}</strong>
              <span v-if="b.description" class="tf-guide-p">{{ b.description }}</span>
              <span class="tf-more">{{ t("tf.home.readGuide", "Read the guide") }}<ly-icon name="arrow" /></span>
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import TfHome from "./tf-home";
import { fmtDate } from "../../ly";
import { journalPage, journalRoute, postRoute } from "../../../kalio/pages/kalio-journal";

export default {
  name: "TfGuides",
  components: { LyIcon },
  mixins: [TfHome],
  data: () => ({ posts: [] }),
  computed: {
    blogTo() {
      return journalRoute();
    },
  },
  created() {
    journalPage({ page: 1, limit: 8 })
      .then(({ articles }) => (this.posts = (articles || []).slice(0, 4)))
      .catch(() => (this.posts = []));
  },
  methods: {
    fmtDate,
    postRoute,
    cover(b) {
      return window.CDN.GET_SHOP_IMAGE_PATH(b.image, null);
    },
  },
};
</script>
