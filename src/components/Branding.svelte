<script>
  let { variant = 'default', t = (key) => key } = $props();
</script>

<div class="branding" data-variant={variant}>
  {#if variant === 'wide'}<p>{t('mirador')}</p>{/if}
  <a aria-label={t('aboutMirador')} href="https://github.com/dknijl/mirador-svelte" target="_blank" rel="noopener">K</a>
</div>

<style>
  .branding {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  p {
    margin: 0;
    text-align: center;
  }
  a {
    align-items: center;
    border-radius: 50%;
    color: inherit;
    display: inline-flex;
    font-size: 1.25rem;
    font-weight: 700;
    height: 32px;
    justify-content: center;
    min-width: 32px;
    text-decoration: none;
  }
</style>
