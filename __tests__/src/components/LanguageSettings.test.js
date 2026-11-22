import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import LanguageSettings from '@src/components/LanguageSettings.svelte';

const languages = [
  { current: true, label: 'Deutsch', locale: 'de' },
  { current: false, label: 'English', locale: 'en' },
];

describe('LanguageSettings', () => {
  it('renders the configured languages and marks the current language', () => {
    render(LanguageSettings, { languages });
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    expect(screen.getByRole('menuitem', { name: /Deutsch/ })).toHaveAttribute('aria-current', 'true');
  });

  it('calls the selection handler with the language code', async () => {
    const handleClick = vi.fn();
    render(LanguageSettings, { languages, handleClick });
    await userEvent.setup().click(screen.getByRole('menuitem', { name: /English/ }));
    expect(handleClick).toHaveBeenCalledWith('en');
  });
});
