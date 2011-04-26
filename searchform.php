<form role="search" method="get" id="searchform" action="<?php echo home_url( '/' ); ?>">
        <input type="text" value="Looking For Something?" name="s" id="s" onfocus="if (this.value == 'Looking For Something?') {this.value = '';}" onblur="if (this.value == '') {this.value = 'Looking For Something?';}" />
        <input type="image" id="button" alt="Search" src="<?php bloginfo( 'template_url' ); ?>/assets/images/search.png" />
</form>
