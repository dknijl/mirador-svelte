import { render, screen } from '@tests/utils/test-utils';
import { Branding } from '@src/components/Branding';

describe('Branding', () => {
  it('renders', () => {
    render(<Branding />);

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/dknijl/mirador-svelte');
    expect(screen.getByRole('link')).toHaveTextContent('K');
  });

  it('renders additional items for the wide variant', () => {
    render(<Branding variant="wide" />);

    expect(screen.getByText('Kokudor')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
