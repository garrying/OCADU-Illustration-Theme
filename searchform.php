<form method="get" role="search" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="s" class="hidden"><?php _e( 'Search', 'ocaduillustration' ); ?></label>
	<input type="text" class="field illustrator-search" name="s" id="s" placeholder="Illustrator Name" required />
  <input style="visibility: hidden; position: fixed;" type="submit" />
</form>