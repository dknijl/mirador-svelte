import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import SearchHit from '@src/components/SearchHit.svelte';

const baseProps = {
  annotation: { targetId: 'canvas-1', content: 'Light up the moose, and start the chainsaw' },
  annotationId: 'annotation-1',
  hit: { annotations: ['annotation-1'], match: 'moose' },
  index: 0,
  total: 3,
};

describe('SearchHit', () => {
  it('renders hit content and selects it when activated', async () => {
    const user = userEvent.setup();
    const selectAnnotation = vi.fn();
    render(SearchHit, { ...baseProps, selectAnnotation, canvasLabel: 'Canvas 1', annotationLabel: 'Note' });
    expect(screen.getByRole('listitem')).toHaveTextContent('Canvas 1');
    expect(screen.getByRole('heading', { level: 4, name: 'Canvas 1 Note' })).toBeInTheDocument();
    await user.click(screen.getAllByRole('button')[0]);
    expect(selectAnnotation).toHaveBeenCalledWith('annotation-1');
  });

  it('shows selected content without a selection button', () => {
    render(SearchHit, { ...baseProps, selected: true });
    expect(screen.getByRole('listitem')).toHaveTextContent('moose');
    expect(screen.queryByRole('button', { name: /1 of 3/ })).not.toBeInTheDocument();
  });
});

vi.mock('@src/components/ScrollTo.svelte', () => import('@tests/utils/MockScrollTo.svelte'));

function renderSubject(extra) {
  const props = {
    windowSelected: true,
    annotation: { targetId: 'x' },
    annotationId: 'foo',
    index: 0,
    hit: { after: ', and start the chainsaw', annotations: ['foo'], before: 'Light up the', match: 'moose' },
    ...extra,
  };
  const view = render(SearchHit, props);
  return { rerender: (next) => view.rerender({ ...props, ...next }) };
}

describe('SearchHit', () => {
  it('renders a ListItem for each hit', async () => {
    const user = userEvent.setup();
    const selectAnnotation = vi.fn();
    renderSubject({ selectAnnotation });

    expect(screen.getByRole('listitem')).toHaveClass('windowSelected');
    expect(screen.getByRole('listitem')).toHaveTextContent('1Light up the moose , and start the chai more');

    await user.click(screen.getByRole('button', { name: '1 Light up the moose , and start the chai more...' }));
    expect(selectAnnotation).toHaveBeenCalledWith('foo');
  });

  it('renders a ListItem for a selected hit', async () => {
    renderSubject({ selected: true });

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders the annotation char if the hit is not available', () => {
    renderSubject({ annotation: { chars: 'xyz' }, hit: undefined });

    expect(screen.getByRole('listitem')).toHaveTextContent('1xyz');
  });

  it('renders a ScrollTo', () => {
    renderSubject({ containerRef: { current: null } });

    expect(screen.getByTestId('scrollto')).toBeInTheDocument();
  });

  describe('Annotation Labels', () => {
    it('renders the annotationLabel if present', () => {
      renderSubject({ annotationLabel: 'The Anno Label' });

      expect(screen.getByRole('heading', { level: 4, name: 'The Anno Label' })).toBeInTheDocument();
    });

    it('does not render the typography if no annotation label is present', () => {
      renderSubject({});

      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    });
  });

  describe('announcer', () => {
    it('sends information about the annotation when selected', () => {
      const announcer = vi.fn();
      const props = {
        annotationLabel: 'The Annotation Label',
        announcer,
        canvasLabel: 'The Canvas Label',
        selected: false,
        total: 9,
      };

      const { rerender } = renderSubject({ ...props });
      expect(announcer).not.toHaveBeenCalled();

      rerender({ ...props, selected: true });
      expect(announcer).toHaveBeenCalledWith(
        '1 of 9 The Canvas Label The Annotation Label Light up the moose , and start the chai',
        'polite',
      );
    });

    it('calls the announcer when initially rendered as selected', () => {
      const announcer = vi.fn();
      renderSubject({ announcer, selected: true });

      expect(announcer).toHaveBeenCalled();
    });

    it('does not call the announcer when initially rendered as unselected', () => {
      const announcer = vi.fn();
      renderSubject({ announcer, selected: false });

      expect(announcer).not.toHaveBeenCalled();
    });

    it('does not send information about annotations that are not being deselected', () => {
      const announcer = vi.fn();
      const { rerender } = renderSubject({ announcer, selected: true });

      announcer.mockClear();

      rerender({ announcer, selected: false });
      expect(announcer).not.toHaveBeenCalled();
    });
  });
});
