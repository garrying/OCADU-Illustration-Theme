<form method="get" role="search" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="s" class="assistive-text"><?php _e( 'Search', 'ocaduillustration' ); ?></label>
	<input type="text" class="field" name="s" id="s" placeholder="<?php esc_attr_e( 'Looking for Someone?' ); ?>" required />
</form>
<div id="search-tip">
	Press Enter When You're Ready
</div>
