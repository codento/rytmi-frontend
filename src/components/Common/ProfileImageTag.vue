<template>
  <div
    class="profile-tag mx-2"
    @click="openProfile(profileData.profile)"
  >
    <b-img
      :id="'thumbnail-' + profileData.profile.id"
      v-bind="imageProps"
      thumbnail
      fluid
      :src="imageToShow"
      :blank="!imageToShow || false"
      class="thumbnail"
      rounded="circle"
      @error="handleBrokenImg()"
    />
    <span :class="`${profileData.profileRoleClass} profile-tag-name px-2`"> {{ profileData.profile.firstName }} {{ profileData.profile.lastName }} </span>
  </div>
</template>
<script>
export default {
  name: 'ProfileImageTag',
  components: { },
  props: {
    profileData: Object,
    imageProps: Object,
    imageUrl: String
  },
  data () {
    return {
      imageToShow: this.imageUrl
    }
  },
  methods: {
    openProfile (profile) {
      this.$router.push({ name: 'profile', params: { id: profile.id } })
    },
    handleBrokenImg () {
      this.imageToShow = null
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.profile-tag {
  float: left;
  white-space: nowrap;
  cursor: pointer;

  .profile-tag-name {
    color: white;
    font-family: 'Poppins';
    font-weight: 400;
    white-space: nowrap;
  }

  .profile-tag-name:hover {
    background: white;
    color: $c-violet-dark;
  }

  .thumbnail {
    position: relative;
    left: 5px;
  }
}
.role-1 {
  background: $c-violet;
  border: 2px solid white;
}
.role-2 {
  background: $c-orange;
  border: 2px solid white;
}
.combined-role {
  background: repeating-linear-gradient(
      45deg,
      $c-violet,
      $c-violet 50px,
      $c-orange 50px,
      $c-orange 200px
  );
}
</style>
