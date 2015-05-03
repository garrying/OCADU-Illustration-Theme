<form role="search" method="get" class="search-form" action="<?php echo home_url( '/' ); ?>">
  <label>
    <span class="screen-reader-shortcut">Search for:</span>
    <input type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search illustrators', 'placeholder' ) ?>" value="<?php echo get_search_query() ?>" name="s" title="<?php echo esc_attr_x( 'Search for:', 'label' ) ?>" />
  </label>
  <input type="submit" class="search-submit btn" value="<?php echo esc_attr_x( 'Go', 'submit button' ) ?>" />
</form>