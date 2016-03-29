<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label>
    <span class="screen-reader-shortcut"><?php echo esc_html( 'Search for:', 'label' ); ?></span>
    <input type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search illustrators', 'placeholder' ); ?>" value="<?php echo get_search_query(); ?>" name="s" title="<?php echo esc_attr_x( 'Search for:', 'label' ); ?>" />
  </label>
  <button type="submit" class="search-submit"><?php echo esc_html( 'Search', 'submit button' ); ?></button>
</form>
