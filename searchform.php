<form method="get" role="search" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="s" class="visually-hidden"><?php _e( 'Search', 'ocaduillustration' ); ?></label>
	<input type="text" class="field" name="s" id="s" placeholder="<?php esc_attr_e( 'Search Illustrators' ); ?>" required />
</form>