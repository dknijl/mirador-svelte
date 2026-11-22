import { getCompanionWindow } from '../state/selectors';

export const mapStateToProps = (state, { id }) => {
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });

  return {
    content: companionWindow?.content,
    id,
  };
};
