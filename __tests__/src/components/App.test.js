import { render, screen } from '@tests/utils/test-utils';

import App from '@src/components/Viewer.svelte';

/** */
function createWrapper(props) {
  return render(App, { ...props });
}

describe('App', () => {
  it('should asynchronously render all needed elements', async () => {
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
    createWrapper();

    expect(await screen.findByRole('main', {}, { timeout: 8000 })).toBeInTheDocument();
  });
});
