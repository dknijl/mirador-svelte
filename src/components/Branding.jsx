import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

/**
 * Display a branding icon
 */
export function Branding({ variant = 'default', ...ContainerProps }) {
  const { t } = useTranslation();
  return (
    <Stack sx={{ alignItems: 'center' }} {...ContainerProps}>
      {variant === 'wide' && (
        <div>
          <Typography align="center" component="p" variant="h3">
            {t('mirador')}
          </Typography>
        </div>
      )}
      <Typography align="center">
        <IconButton component="a" aria-label={t('aboutMirador')} href="https://github.com/dknijl/mirador-svelte" target="_blank" rel="noopener" size="large">
          K
        </IconButton>
      </Typography>
    </Stack>
  );
}

Branding.propTypes = {
  variant: PropTypes.oneOf(['default', 'wide']),
};
