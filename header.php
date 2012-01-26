<!DOCTYPE html>
<!--[if IE 6]>
<html id="ie6" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 7]>
<html id="ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html id="ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
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
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'template_directory' ); ?>/assets/stylesheets/main.css" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<script src="<?php bloginfo( 'template_directory' ); ?>/assets/js/modernizr-2.0.6.min.js"></script>

<?php
	wp_head();
?>
</head>

<body <?php body_class(); ?>>
<div id="page">
	<header id="branding" role="banner">
		<div class="container">
			<!-- <hgroup>
				<h1 id="site-title"><span><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></span></h1>
				<h2 id="site-description"><?php bloginfo( 'description' ); ?></h2>
			</hgroup> -->
			
			 <nav id="year-select">
        <?php 
          $grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); 
					// Selected menu state for attachments 
					$terms = get_the_terms($post->post_parent, 'gradyear');
					foreach ( $terms as $term ) { 
	      		$selected_year = $term->name;
					}
					// Selected menu state for individual items
					$terms = get_the_terms( $post->ID , 'gradyear' );
          foreach ( $terms as $term ) {
        		$selected_year = $term->name;
					}
        ?>

					<ul>
            <?php foreach( $grad_year as $year ) : ?>
              <li class="year <?php if ($term == $year->name || $selected_year == $year->name) echo 'selected' ?>">
                <h2><a title="View work of <?php echo $year->name; ?>" href="<?php echo get_term_link( $year->slug, 'gradyear' ); ?>">
                  <?php echo $year->name; ?>
                </a></h2>
              </li>
            <?php endforeach ?>
          </ul>
        </nav> <!-- #year-Select-->
			
			<div class="page-search">

			<nav id="access" role="navigation">
				<h3 class="assistive-text"><?php _e( 'Main menu' ); ?></h3>
				
				     
				

				<?php wp_nav_menu( array( 
					'container' =>false,
					'menu_class' => 'nav',
					'theme_location' => 'primary' )
					); ?>
								
  
				
			</nav><!-- #access -->
			<div id="search">
			  <?php get_search_form(); ?>
			</div><!-- #search -->
			</div><!-- .page-search -->
			</div><!-- .container -->
	</header><!-- #branding -->

	<div id="main" class="container">