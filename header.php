<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<!--
 _____   ____     ______  ____        __  __          ___       __      _     __     
/\  __`\/\  _`\  /\  _  \/\  _`\     /\ \/\ \       /'___`\   /'__`\  /' \  /'__`\   
\ \ \/\ \ \ \/\_\\ \ \L\ \ \ \/\ \   \ \ \ \ \     /\_\ /\ \ /\ \/\ \/\_, \/\_\L\ \  
 \ \ \ \ \ \ \/_/_\ \  __ \ \ \ \ \   \ \ \ \ \    \/_/// /__\ \ \ \ \/_/\ \/_/_\_<_ 
  \ \ \_\ \ \ \L\ \\ \ \/\ \ \ \_\ \   \ \ \_\ \      // /_\ \\ \ \_\ \ \ \ \/\ \L\ \
   \ \_____\ \____/ \ \_\ \_\ \____/    \ \_____\    /\______/ \ \____/  \ \_\ \____/
    \/_____/\/___/   \/_/\/_/\/___/      \/_____/    \/_____/   \/___/    \/_/\/___/ 

-->

<head>
<meta http-equiv="content-type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
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
</head>

<body <?php body_class(); ?>>
	<header id="app-head" role="banner" class="clearfix">
		<div class="container">
			<div class="logo">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
				<span id="site-title">2013</span>
				<div id="ocad-lologo">
					<div class="main">
						<div class="alpha"></div>
						<div class="beta"></div>
					</div>
				</div>
				</a>
			</div>

			<a class="visually-hidden skip" href="#content" title="Skip to content">Skip to content</a>

			<div id="search" role="search">
				<?php get_search_form(); ?>
			</div><!-- #search -->
			<div id="year-widget" data-visible="true">
				<div class="year-widget-toggle" title="What year is it?"><div class="indicator visible"></div></div>
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
				<nav id="year-select">
					<h3 class="visually-hidden"><?php _e( 'Year select', 'ocaduillustration' ); ?></h3>
						<div id="illu-jumpmenu" class="clearfix">
							<?php foreach( $grad_year as $year ) {
								if ( is_singular('illustrator') && $selected_year == $year->name ) {
									echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
								} elseif ( is_attachment() && $selected_year == $year->name ) {
									echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
								} elseif ( isset($term) && $term == $year->name ) {
									echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
								} else {
									echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."'>".$year->name."</a>";
								}
							}
							?>
						</div>
				</nav> <!-- #year-Select-->
			</div> <!-- #year-widget-->
			<?php if (is_singular('illustrator')) 
	echo '<a id="year-back-button" href="/year/'. $term->slug .'" title="Return to '.$term->name.' grid"><span>' . $term->name . ' index</span></a>';  
?>
			
		<div class="nav-secondary">
			<nav id="access" role="navigation">
				<h3 class="visually-hidden"><?php _e( 'Main menu', 'ocaduillustration' ); ?></h3>

				<?php wp_nav_menu( array( 
					'container' =>false,
					'menu_class' => 'nav',
					'theme_location' => 'primary' )
					); ?>
								
			</nav><!-- #access -->
		</div>
		<a href="#" id="info" title="Maintained by the Illustration Department at OCAD University">✌</a>

		<div id="colophon" role="contentinfo">
			<section>
				<p>&copy; <?php echo date("Y"); ?>, Respective Authors<br>Maintained by the Illustration Department at OCAD University</p>
			</section>
		</div><!-- #colophon -->

	</div><!-- .container -->
	</header><!-- #app-head -->

<div id="progress"></div>
<?php if ( is_home() || is_front_page() ) : ?>
	<div id="intro">
		<h2>
			An evolving archive maintained by the Illustration Department at OCAD University. <br> <br> Featuring work from the graduating class of 2013.
		</h2>
		<p>
			Coinciding with the 98<sup>th</sup> annual OCAD U Graduate Exhibition. May 2 to 5, 2013.
		</p>
		<small><a href="/about" title="Link to a message from Paul Dallas">A message from Paul Dallas, Illustration Chair</a></small>
	</div>
<?php endif; ?>
<div id="content" role="main">
