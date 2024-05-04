<?php get_header(); ?>

  <div class="fixed flex items-center justify-center">
    <header class="entry-header">
      <h1 class="font-normal"><?php esc_html_e(
        'Page not found...D:',
        'ocaduillustration'
      ); ?></h1>
      <p class="entry-body">The page you requested could not be found<br />It might have been moved or renamed.</p>
    </header>
    <div id="error-blob-container"></div>
  </div>

<?php get_footer(); ?>
