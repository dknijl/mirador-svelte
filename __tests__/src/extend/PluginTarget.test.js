import { render, screen, within, markup } from '@tests/utils/test-utils';
import PluginTarget from '@src/extend/PluginTarget.svelte';
import AddA from '../../integration/components/AddComponentA.svelte';
import AddB from '../../integration/components/AddComponentB.svelte';
import WrapA from '../../integration/components/WrapComponentA.svelte';
import WrapB from '../../integration/components/WrapComponentB.svelte';
import Replace from '../../integration/components/ValidPluginA.svelte';

const plugin = (component, mode, target = 'Target') => ({ component, mode, target });
const create = (plugins, extra = {}) =>
  render(PluginTarget, { name: 'Target', plugins, children: markup('<span>target content</span>'), ...extra });
describe('native Svelte extension points', () => {
  it('renders its children without plugins', () => {
    create([]);
    expect(screen.getByText('target content')).toBeInTheDocument();
  });
  it('adds matching plugins in order only to the selected target', () => {
    create([plugin(AddA, 'add'), plugin(AddB, 'add'), plugin(Replace, 'add', 'Elsewhere')]);
    expect(screen.getAllByText(/Plugin [AB]/).map((el) => el.textContent)).toEqual(['Plugin A', 'Plugin B']);
    expect(screen.queryByTestId('valid-plugin-a')).not.toBeInTheDocument();
  });
  it('nests the wrappers in registration order and passes children through both', () => {
    create([plugin(WrapA, 'wrap'), plugin(WrapB, 'wrap')]);
    const inner = within(screen.getByTestId('wrap-plugin-component-a')).getByTestId('wrap-plugin-component-b');
    expect(within(inner).getByText('target content')).toBeInTheDocument();
  });
  it('allows wrappers to replace the target', () => {
    create([plugin(Replace, 'wrap')]);
    expect(screen.getByTestId('valid-plugin-a')).toBeInTheDocument();
    expect(screen.queryByText('target content')).not.toBeInTheDocument();
  });
  it('can place additions inside a wrapped target without rendering wrappers twice', () => {
    create([plugin(AddA, 'add'), plugin(Replace, 'wrap')], { mode: 'add' });
    expect(screen.getByTestId('add-plugin-component-a')).toBeInTheDocument();
    expect(screen.queryByTestId('valid-plugin-a')).not.toBeInTheDocument();
  });
});
