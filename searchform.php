<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label>
    <span class="screen-reader-shortcut"><?php echo esc_html( 'Search for:' ); ?></span>
    <input type="search" class="search-field pill" id="autocomplete" placeholder="<?php echo esc_attr_x( 'Search illustrators', 'placeholder', 'ocaduillustration' ); ?>" value="<?php echo get_search_query(); ?>" name="s" title="<?php echo esc_attr_x( 'Search for:', 'label', 'ocaduillustration' ); ?>" />
  </label>
  <button type="submit" class="search-submit pill"><?php echo esc_html( 'Search' ); ?></button>
</form>
