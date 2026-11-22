import { screen } from '@testing-library/dom';
import { renderSvelte } from '@tests/utils/render-svelte';
import ViewerInfo from '@src/components/ViewerInfo.svelte';

describe('ViewerInfo', () => {
  it('shows the canvas position and label', () => {
    renderSvelte(ViewerInfo, { canvasCount: 8, canvasIndex: 2, canvasLabel: 'testLabel' });
    expect(screen.getByText('3 of 8')).toBeInTheDocument();
    expect(screen.getByText('• testLabel')).toBeInTheDocument();
  });
});
