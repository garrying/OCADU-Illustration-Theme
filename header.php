<!DOCTYPE html>

<!--

 _____   ____     ______  ____        __  __          ___       __      _     ___     
/\  __`\/\  _`\  /\  _  \/\  _`\     /\ \/\ \       /'___`\   /'__`\  /' \  /'___`\   
\ \ \/\ \ \ \/\_\\ \ \L\ \ \ \/\ \   \ \ \ \ \     /\_\ /\ \ /\ \/\ \/\_, \/\_\ /\ \  
 \ \ \ \ \ \ \/_/_\ \  __ \ \ \ \ \   \ \ \ \ \    \/_/// /__\ \ \ \ \/_/\ \/_/// /__ 
  \ \ \_\ \ \ \L\ \\ \ \/\ \ \ \_\ \   \ \ \_\ \      // /_\ \\ \ \_\ \ \ \ \ // /_\ \
   \ \_____\ \____/ \ \_\ \_\ \____/    \ \_____\    /\______/ \ \____/  \ \_\\______/
    \/_____/\/___/   \/_/\/_/\/___/      \/_____/    \/_____/   \/___/    \/_//_____/ 

-->

<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?php
	/*
	 * Print the <title> tag based on what is being viewed.
	 */
	global $page, $paged;

	wp_title( '|', true, 'right' );

	// Add the blog name.
	bloginfo( 'name' );

	// Add the blog description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		echo " | $site_description";

	?></title>
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<?php
	wp_head();
?>
</head>

<body <?php body_class(); ?>>
<div id="page">
	<header id="branding" role="banner">
		<div class="container">
			<hgroup>
				<h1 id="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
				<h2 id="site-description"><?php bloginfo( 'description' ); ?></h2>
			</hgroup> 
			
			 <nav id="year-select">
				<h3 class="assistive-text"><?php _e( 'Year select' ); ?></h3>
				
				<?php 
					$grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); 
					// Selected menu state for attachments 
					if (is_attachment()) {
						$terms = get_the_terms($post->post_parent, 'gradyear');
						foreach ( $terms as $term ) { 
							$selected_year = $term->name;
						}
					} else if (is_single()) {
						// Selected menu state for individual items
						$terms = get_the_terms( $post->ID , 'gradyear' );
						foreach ( $terms as $term ) {
							$selected_year = $term->name;
						}
					}
				?>

					<div id="illustrator-select">
						<div id="illu-indicator">Graduating Year</div>
							<div id="illu-jumpmenu">
								<a class="home" href="/" title="Back to Main Index">Current Year</a>
								<?php foreach( $grad_year as $year ) : ?>
								<a href="<?php echo get_term_link( $year->slug, 'gradyear' ); ?>" <?php if ($term == $year->name || $selected_year == $year->name) echo 'class="selected"' ?> title="View Work From <?php echo $year->name ?>" >

								<?php echo $year->name; ?>

								</a>
								<?php endforeach ?>
							</div>
					</div>

			</nav> <!-- #year-Select-->
			
<?php if (is_singular('illustrator')) 
	echo 
		'<a id="year-back-button" href="/year/'. $term->slug .'" title="Return to '.$term->name.' grid"><span>Back to ' . $term->name . ' index</span></a>';  
?>


			<div class="page-search">

			<nav id="access" role="navigation">
				<h3 class="assistive-text"><?php _e( 'Main menu' ); ?></h3>

				<?php wp_nav_menu( array( 
					'container' =>false,
					'menu_class' => 'nav',
					'theme_location' => 'primary' )
					); ?>
								
			</nav><!-- #access -->
			<div id="search" role="search">
			  <?php get_search_form(); ?>
			</div><!-- #search -->
			</div><!-- .page-search -->
			</div><!-- .container -->
	</header><!-- #branding -->

	<div id="main" class="container">