import { render, screen } from '@tests/utils/test-utils';
import Viewer from '@src/components/Viewer.svelte';
import createStore from '@src/state/store';
import { updateConfig } from '@src/state/actions';
import Plugin from '../../integration/components/AddComponentA.svelte';

it('updates nested targets and translations when a Svelte host changes viewer props', () => {
  const first = createStore();
  const next = createStore();
  next.dispatch(updateConfig({ translations: { en: { welcome: 'Second workspace' } } }));
  const view = render(Viewer, { store: first, plugins: [] });
  expect(screen.queryByText('Plugin A')).not.toBeInTheDocument();
  view.rerender({ store: next, plugins: [{ component: Plugin, mode: 'add', target: 'Workspace' }] });
  expect(screen.getByText('Plugin A')).toBeInTheDocument();
  expect(screen.getByText('Second workspace')).toBeInTheDocument();
  view.rerender({ store: next, plugins: [] });
  expect(screen.queryByText('Plugin A')).not.toBeInTheDocument();
});
