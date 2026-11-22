import { getConfig, getTheme } from '../state/selectors';

export const mapStateToProps = (state) => ({
  language: getConfig(state).language,
  theme: getTheme(state),
  translations: getConfig(state).translations,
});
