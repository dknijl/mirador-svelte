import SvgIcon from '@mui/material/SvgIcon';

/**
 * ThumbnailNavigationLeftIcon ~ mirrors the right-hand icon
 */
export default function ThumbnailNavigationLeftIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0,0H24V24H0Z" transform="translate(0) rotate(-90)" fill="none" />
        {/* Rotating -90 puts this bar at y in [-21,-3]; translate it back into
            the 24x24 viewBox so the strip shows on the left edge. */}
        <path d="M3,3H21V5H3Z" transform="translate(0,24) rotate(-90)" />
        <path d="M19,3H5V21H19ZM17,19H7V5H17Z" transform="translate(2)" />
      </svg>
    </SvgIcon>
  );
}
