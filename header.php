<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<!--

 @@@@@@   @@@@@@@  @@@@@@  @@@@@@@     @@@  @@@     @@@@@@   @@@@@@   @@@ @@@  @@@
@@!  @@@ !@@      @@!  @@@ @@!  @@@    @@!  @@@    @@   @@@ @@!  @@@ @@@@ @@@  @@@
@!@  !@! !@!      @!@!@!@! @!@  !@!    @!@  !@!      .!!@!  @!@  !@!  !@! @!@!@!@!
!!:  !!! :!!      !!:  !!! !!:  !!!    !!:  !!!     !!:     !!:  !!!  !!!      !!!
 : :. :   :: :: :  :   : : :: :  :      :.:: :     :.:: :::  : : ::   ::       : :
 
-->

<head>
<meta http-equiv="content-type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
<title><?php

	global $page, $paged;

	wp_title( '|', true, 'right' );

	// Add the blog name.
	bloginfo( 'name' );

	// Add the blog description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		echo " | $site_description";

	?></title>
	
	<?php
		wp_head();
	?>

	<script type="text/javascript" src="//use.typekit.net/sgm7vuw.js"></script>
	<script type="text/javascript">try{Typekit.load();}catch(e){}</script>

</head>

<body <?php body_class(); ?>>
	<header id="app-head" class="<?php if ( is_home() || is_front_page() || is_archive() ) : ?>inverted<?php endif; ?>" role="banner">
		<div class="container">
			<div class="flex-wrapper">

				<div class="left">
				
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home"><?php bloginfo( 'name' ); ?></a>

				<div class="item year-indicator">
					<?php 
						$grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); 
						// Selected menu state for attachments 
						if (is_attachment()) {
							$terms = get_the_terms($post->post_parent, 'gradyear');
							foreach ( $terms as $term ) { 
								$selected_year = $term->name;
							}
						} elseif (is_singular('illustrator')) {
							// Selected menu state for individual items
							$terms = get_the_terms( $post->ID , 'gradyear' );
							foreach ( $terms as $term ) {
								$selected_year = $term->name;
							}
						}
					?>
					<span class="year-current"><?php if (isset($selected_year)) { echo $selected_year; } elseif (isset($term)) { echo $term; } else {echo('2014');}  ?></span>
					<div id="year-widget">
						<nav id="year-select">
							<ul id="illu-jumpmenu" class="normalized">
								<?php foreach( $grad_year as $year ) {
									echo "<li class='year-item'>";
										if ( is_singular('illustrator') && $selected_year == $year->name ) {
											echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
										} elseif ( is_attachment() && $selected_year == $year->name ) {
											echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
										} elseif ( isset($term) && $term == $year->name ) {
											echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
										} else {
											echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."'>".$year->name."</a>";
										}
									echo "</li>";
								}
								?>
							</ul>
						</nav> <!-- #year-Select-->
					</div> <!-- #year-widget-->

				</div>

				<div class="item search" role="search">
					<div class="search-container">
						<?php get_search_form(); ?>
					</div>
				</div><!-- #search -->
				<?php if (is_singular('illustrator')) 
		echo '<a class="item" id="year-back-button" href="/year/'. $term->slug .'" title="Return to '.$term->name.' grid"><span>' . $term->name . '</span></a>';  
	?>
				
				</div>
				<div class="right">
					<nav id="access" role="navigation">
						<h3 class="hidden"><?php _e( 'Main menu', 'ocaduillustration' ); ?></h3>
						<?php wp_nav_menu( array( 
							'container' =>false,
							'menu_class' => 'nav',
							'theme_location' => 'primary' )
							); ?>			
					</nav><!-- #access -->
				</div>
			</div>
		</div><!-- .container -->
	</header><!-- #app-head -->


<?php if ( is_home() || is_front_page() ) : ?>
	<div id="intro">
		<div class="intro-inner visible">
			<div class="close" title="Close this block please."></div>
			<h2>
				An evolving archive maintained by the Illustration Department at OCAD University. Featuring work from the graduating class of 2014.
			</h2>
			<p>
				Coinciding with the 99<sup>th</sup> annual OCAD U Graduate Exhibition. May 1 to 4, 2014.
			</p>
			<p><a href="/introduction" title="Link to a message from Paul Dallas" class="link truncate">Introduction from Paul Dallas<br />Illustration Chair</a></p>
		</div>
	</div>
<?php endif; ?>

<div <?php if ( is_home() || is_front_page() || is_archive() ) : ?>id="pack-content"<?php else: ?>id="content"<?php endif; ?> role="main">
