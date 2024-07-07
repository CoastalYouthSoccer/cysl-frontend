import { mount } from '@vue/test-utils';
import { expect, it, describe, vi, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VenueSelect from './components/VenueSelect.vue'; // Adjust the import path as needed
import { fetchVenues } from '@/services/api.venue.js';

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

// Mock the fetchVenues API call
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
    await wrapper.vm.$nextTick(); // Wait for Vue to render
  });

  it('renders v-select when venues are fetched', async () => {
    // Check if the v-select component is rendered
    expect(wrapper.findComponent({ name: 'v-select' }).exists()).toBe(true);

    // Check if the correct number of items are rendered
    const items = wrapper.findComponent({ name: 'v-select' }).props('items');
    expect(items).toHaveLength(2);
  });

  it('emits venueChange event when venue is selected', async () => {
    const vSelect = wrapper.findComponent({ name: 'v-select' });

    // Simulate selecting a venue
    vSelect.vm.$emit('update:modelValue', { name: 'Venue 1', city: 'City 1' });
    await wrapper.vm.$nextTick();

    // Check if the 'venueChange' event is emitted with the correct payload
    expect(wrapper.emitted().venueChange).toBeTruthy();
    expect(wrapper.emitted().venueChange[0]).toEqual([{ name: 'Venue 1', city: 'City 1' }]);
  });
});
