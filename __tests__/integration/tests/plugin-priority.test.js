import { expect, it } from 'vitest';
import { screen, setupIntegrationTestViewer } from '@tests/utils/test-utils';
import settings from '../mirador-configs/plugin-priority';

describe('try to apply 2 add plugins and 2 wrap plugins to <WorkspaceControlPanelButtons>', () => {
  setupIntegrationTestViewer(settings.config, settings.plugins);

  it('nests both Svelte wrappers in registration order', async () => {
    const wrapPluginComponentA = await screen.findByTestId('wrap-plugin-component-a');
    expect(wrapPluginComponentA).toBeInTheDocument();

    const wrapPluginComponentB = screen.queryByTestId('wrap-plugin-component-b');
    expect(wrapPluginComponentA).toContainElement(wrapPluginComponentB);

    const addPluginComponentA = await screen.findByTestId('add-plugin-component-a');
    expect(addPluginComponentA).toBeInTheDocument();

    // Check if the second add plugin component is in the document
    const addPluginComponentB = await screen.findByTestId('add-plugin-component-b');
    expect(addPluginComponentB).toBeInTheDocument();
  });
});
