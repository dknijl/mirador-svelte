<script module>
  import DOMPurify from 'dompurify';

  // Add a hook to make all links open a new window
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // set all elements owning target to target=_blank
    if ('target' in node) {
      node.setAttribute('target', '_blank');
      // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
</script>

<script>
  import ns from '../config/css-ns.js';
  import htmlRules from '../lib/htmlRules.js';

  /** @type {{ classes?: { root?: string }, htmlString: string, ruleSet: string }} */
  let { classes = {}, htmlString, ruleSet, ...rest } = $props();
  const attributes = $derived(
    Object.fromEntries(
      Object.entries(rest).filter(
        ([key]) => !['failedImages', 'fallbackImage', 'notifyFailure', 'plugins', 'store', 't'].includes(key),
      ),
    ),
  );

  const sanitized = $derived(DOMPurify.sanitize(htmlString, htmlRules[ruleSet]));
  const className = $derived([ns('third-party-html'), classes.root].filter(Boolean).join(' '));
</script>

<!-- DOMPurify sanitizes the string using the selected allowlist before insertion. -->
<span class={className} {...attributes}>{@html sanitized}</span>
