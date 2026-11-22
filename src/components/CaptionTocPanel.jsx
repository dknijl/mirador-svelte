import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CompanionWindow from '../containers/CompanionWindow';
import CaptionTocList from './CaptionTocPanel.svelte';
import { toReactComponent } from '../svelte/toReactComponent';

const CaptionTocListBridge = toReactComponent(CaptionTocList, 'CaptionTocPanel');

/**
 * Right-pane table of contents generated from the manifest's caption data
 * (IIIF structures and canvas labels).
 */
export function CaptionTocPanel({ entries = [], id, selectedCanvasIds = [], setCanvas, windowId }) {
  const { t } = useTranslation();

  return (
    <CompanionWindow title={t('tableOfContentsList')} id={id} windowId={windowId}>
      <CaptionTocListBridge
        emptyLabel={t('noTableOfContents')}
        entries={entries}
        onSelectCanvas={setCanvas}
        selectedCanvasIds={selectedCanvasIds}
        windowId={windowId}
      />
    </CompanionWindow>
  );
}

CaptionTocPanel.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  selectedCanvasIds: PropTypes.arrayOf(PropTypes.string),
  setCanvas: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};
