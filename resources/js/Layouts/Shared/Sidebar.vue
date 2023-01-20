<template>
  <aside id="sidebar" class="sidebar">

    <ul id="sidebar-nav" class="sidebar-nav">

      <template
        v-for="(item, index) in sidebarMenu"
        :key="`sidebar-${index}`"
      >

        <NavItem
          v-if="!item.isGroup"
          :link="item.link"
          :active-on="item.activeOn"
        />

        <NavItemGroup
          v-else
          :name="item.name"
          :icon="item.icon"
        >

          <NavItem
            v-for="(children, idx) in item.childrens"
            :key="`children-${idx}`"
            :link="children.link"
            :active-on="item.activeOn"
          />

        </NavItemGroup>

      </template>
    </ul>

  </aside>
</template>

<script>
import NavItem from '@/Components/Sidebar/NavItem';
import NavItemGroup from '@/Components/Sidebar/NavItemGroup';
import { computed } from 'vue';

export default {
  name: 'Sidebar',
  components: { NavItemGroup, NavItem },
  props: {
    navigations: {
      type: Array
    }
  },
  setup(props) {

    const sidebarMenu = computed(() => {
      return buildMenu(props.navigations);
    });

    const buildMenu = (items) => (
      items.map((item) => (item.name ? {
        ...item,
        isGroup: true,
        childrens: item.childrens?.map((item) => ({
          link: {
            ...item
          },
          activeOn: item.active_on
        }))
      } : {

        link: {
          ...item,
        },
        activeOn: item?.active_on,
        isGroup: false

      })));

    return {
      sidebarMenu
    };

  }
};
</script>
