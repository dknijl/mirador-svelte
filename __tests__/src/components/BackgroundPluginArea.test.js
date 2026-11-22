import { render, screen } from '@tests/utils/test-utils';
import Background from '@src/components/BackgroundPluginArea.svelte';
import Add from '../../integration/components/AddComponentA.svelte';

it('mounts background plugins inside the hidden background area', () => {
  render(Background, { plugins: [{ component: Add, target: 'BackgroundPluginArea', mode: 'add' }] });
  expect(screen.getByTestId('add-plugin-component-a')).toBeInTheDocument();
  expect(screen.getByTestId('add-plugin-component-a')).not.toBeVisible();
});
