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

  const sanitized = $derived(DOMPurify.sanitize(htmlString, htmlRules[ruleSet]));
  const className = $derived([ns('third-party-html'), classes.root].filter(Boolean).join(' '));
</script>

<span class={className} {...rest}>{@html sanitized}</span>
