import { expect, it } from 'vitest';
import { screen, fireEvent, within, setupIntegrationTestViewer } from '@tests/utils/test-utils';
import settings from '../mirador-configs/plugin-add';

describe('add two plugins to <WorkspaceControlPanelButtons>', () => {
  setupIntegrationTestViewer(settings.config, settings.plugins);

  it('all add plugins are present', async () => {
    expect(await screen.findByText('Plugin A')).toBeInTheDocument();
    expect(await screen.findByText('Plugin B')).toBeInTheDocument();
    expect(screen.getByDisplayValue('hello componentD')).toBeInTheDocument();
  });

  it('wrapped and added plugins are present', async () => {
    fireEvent.click(screen.getByRole('button', { name: /window options/i }));
    const pluginDiv = screen.getByTestId('wrapped-plugin-with-adds');
    // The umbrella icon that this component wraps
    // eslint-disable-next-line testing-library/no-node-access
    expect(pluginDiv.querySelector('.umbrella')).toBeInTheDocument();

    // Plugin C is added by the wrapped plugin.
    expect(within(pluginDiv).getByText('Plugin C')).toBeInTheDocument();
  });
});
