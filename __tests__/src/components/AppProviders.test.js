import { render, markup, screen } from '@tests/utils/test-utils';
import AppProviders from '@src/components/AppProviders.svelte';
import settings from '@src/config/settings';

it('applies the configured palette, direction and language to the viewer', () => {
  const { container } = render(AppProviders, {
    theme: { ...settings.theme, direction: 'rtl' },
    language: 'ar',
    children: markup('<button>Viewer control</button>'),
  });
  // The root owns the viewer-wide language, direction, and theme.
  // eslint-disable-next-line testing-library/no-node-access
  const root = container.querySelector('.mirador-viewer-root');
  expect(root).toContainElement(screen.getByRole('button', { name: 'Viewer control' }));
  expect(root.style.getPropertyValue('--mirador-primary')).toBe('#1967d2');
  expect(root).toHaveAttribute('lang', 'ar');
  expect(root).toHaveAttribute('dir', 'rtl');
});
