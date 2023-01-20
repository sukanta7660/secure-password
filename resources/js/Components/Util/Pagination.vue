<template>
  <div class="d-flex justify-content-between align-items-center">
    <div v-if="!hideCount">
      <p class="small text-muted"> Showing
        <span class="fw-semibold">{{ paginator.from }}</span>
        to
        <span class="fw-semibold">{{ paginator.to }}</span>
        of
        <span class="fw-semibold">{{ paginator.total }}</span>
        results
      </p>
    </div>
    <div>
      <nav v-if="paginator.links.length > 3">
        <ul class="pagination">

          <template
            v-for="(link, index) in paginator.links"
            :key="`pagination-${index}`"
          >

            <li
              v-if="link.url === null"
              class="page-item disabled"
            >
              <Link
                aria-disabled="true"
                class="page-link"
                href="#"
                tabindex="-1"
                v-html="link.label"
              />
            </li>

            <li v-else class="page-item">
              <Link
                :class="{active : link.active}"
                :href="link.url"
                class="page-link"
                v-html="link.label"
              />
            </li>
          </template>
        </ul>
      </nav>
    </div>
  </div>

</template>

<script>
import { Link } from '@inertiajs/inertia-vue3';

export default {
  name: 'Pagination',
  components: { Link },
  props: {
    paginator: {
      type: Object,
      default: () => {
      }
    },
    hideCount: {
      type: Boolean,
      default: false
    }
  }
};
</script>
