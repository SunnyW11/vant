<template>
  <demo-section>
    <van-grid :column-num="2" :border="false">
      <van-grid-item>
        <h3 class="demo-sidebar-title">{{ $t('basicUsage') }}</h3>
        <van-sidebar v-model="activeKey1">
          <van-sidebar-item :title="$t('title')" />
          <van-sidebar-item :title="$t('title')" />
          <van-sidebar-item :title="$t('title')" />
        </van-sidebar>
      </van-grid-item>

      <van-grid-item>
        <h3 class="demo-sidebar-title">{{ $t('showBadge') }}</h3>
        <van-sidebar v-model="activeKey2">
          <van-sidebar-item :title="$t('title')" info="8" />
          <van-sidebar-item :title="$t('title')" info="99" />
          <van-sidebar-item :title="$t('title')" info="99+" />
        </van-sidebar>
      </van-grid-item>

      <van-grid-item>
        <h3 class="demo-sidebar-title">{{ $t('disabled') }}</h3>
        <van-sidebar v-model="activeKey3">
          <van-sidebar-item :title="$t('title')" />
          <van-sidebar-item :title="$t('title')" disabled />
          <van-sidebar-item :title="$t('title')" />
        </van-sidebar>
      </van-grid-item>
    </van-grid>
  </demo-section>
</template>

<script>
export default {
  i18n: {
    'zh-CN': {
      title: '标签名',
      showBadge: '显示徽标',
      disabled: '禁用选项'
    },
    'en-US': {
      showBadge: 'Show Badge',
      disabled: 'Disabled'
    }
  },

  data() {
    return {
      activeKey1: 0,
      activeKey2: 0,
      activeKey3: 0
    };
  }
};
</script>

<style lang="less">
@import '../../style/var';

.demo-sidebar {
  background-color: @white;

  .van-sidebar {
    margin-left: @padding-md;
  }

  &-title {
    margin-bottom: 16px;
    color: @gray-dark;
    font-weight: normal;
    font-size: 14px;
  }
}
</style>
