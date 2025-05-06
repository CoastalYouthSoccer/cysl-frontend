import { mount } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VenueSelect from '@/components/venue/VenueSelect.vue';
import { fetchVenues } from '@/services/api.venue.js';

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('@/services/api.venue.js', () => ({
  fetchVenues: vi.fn(),
}));

describe('VenueSelect', () => {
  let wrapper;

  beforeEach(async () => {
    fetchVenues.mockResolvedValue({
      data: [
        { name: 'Venue 1', city: 'City 1' },
        { name: 'Venue 2', city: 'City 2' }
      ],
      error: null
    });

    wrapper = mount(VenueSelect, {
      props: {},
      global: {
        plugins: [vuetify],
      }
    });
    await wrapper.vm.$nextTick();
  });

  it('renders v-select when venues are fetched', async () => {
    expect(wrapper.findComponent({ name: 'v-select' }).exists()).toBe(true);

    const items = wrapper.findComponent({ name: 'v-select' }).props('items');
    expect(items).toHaveLength(2);
  });

  it('emits venueChange event when venue is selected', async () => {
    const vSelect = wrapper.findComponent({ name: 'v-select' });

    vSelect.vm.$emit('update:modelValue', { name: 'Venue 1', city: 'City 1' });
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().venueChange).toBeTruthy();
    expect(wrapper.emitted().venueChange[0]).toEqual([{ name: 'Venue 1', city: 'City 1' }]);
  });
});
