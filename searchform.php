<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label for="autocomplete" class="screen-reader-shortcut"><?php echo esc_html( 'Search' ); ?></label>
  <input type="search" class="search-field input-reset" id="autocomplete" placeholder="<?php echo esc_attr_x( 'Search illustrators', 'placeholder', 'ocaduillustration' ); ?>" value="<?php echo get_search_query(); ?>" name="s" title="<?php echo esc_attr_x( 'Search for:', 'label', 'ocaduillustration' ); ?>" />
  <button type="submit" class="search-submit"><?php echo esc_html( 'Search' ); ?></button>
</form>
