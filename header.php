<?php ?>
<!DOCTYPE html>

<!--
                                         
 OOOOO   CCCCC    AAA   DDDDD      UU   UU     2222    00000   1   1  
OO   OO CC    C  AAAAA  DD  DD     UU   UU    222222  00   00 111 111 
OO   OO CC    c AA   AA DD   DD    UU   UU        222 00   00  11  11 
OO   OO CC      AA   AA DD   DD    UU   UU        222 00   00  11  11 
OO   OO CC      AA   AA DD   DD    UU   UU        222 00   00  11  11 
OO   OO CC    C AAAAAAA DD   DD    UU   UU     2222   00   00  11  11 
OO   OO CC    C AA   AA DD   DD    UU   UU     2222   00   00  11  11 
 OOOO0   CCCCC  AA   AA DDDDDD      UUUUU     2222222  00000  111 111

-->

<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />

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
		
	<?php if ( is_front_page() ) : ?>
	<meta name="description" content="OCAD U Illustration is an evolving archive and showcase presented by OCAD University's Illustration Department. Featuring work from the graduating class of 2011, 2010 and 2009." /> 
	<?php endif; ?>
	<meta name="keywords" content="ocad, ocad u, ocadu, ontario college of art and design, university, toronto, canada, design, illustration, illustrators, designers, graphic, art, creativity, portfolio" />

	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/assets/stylesheets/main.css" />
	<link href='http://fonts.googleapis.com/css?family=Cuprum' rel='stylesheet' type='text/css'>
	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/assets/images/favicon.ico"/>
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	 <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<div id="header">
	<div class="container">
		<div id="logo">
			<a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>"><?php bloginfo('name'); ?></a>
		</div>
			<div id="year-select">
			<?php $grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); ?>

			<?php $terms = get_the_terms( $post->ID , 'gradyear' ); ?>
			
			<?php if ( empty($terms) || is_post_type_archive() || is_search() ) : ?>		
				
			<?php else : ?>
			
				<?php $terms = get_the_terms( $post->ID , 'gradyear' );
				foreach ( $terms as $term ) {
					$selected_year = $term->name;
				}
				
			?>
	
			<?php endif; ?>
					
			  <ul>
			    <?php foreach( $grad_year as $year ) : ?>
			      <li class="year <?php if ($term == $year->name) echo 'active' ?> <?php if ($selected_year == $year->name) echo 'active' ?>">
			        <h2><a title="View work of <?php echo $year->name; ?>" href="<?php echo get_term_link( $year->slug, 'gradyear' ); ?>">
			          <?php echo $year->name; ?>
			        </a></h2>
			      </li>
			    <?php endforeach ?>
			  </ul>
			</div> <!-- #year-Select-->

			<div class="search-nav-right">
				<div id="page-nav">	
					<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
				</div>
		
				<div id="search"><?php get_search_form(); ?></div>
			</div>
		</div> <!-- .container -->
	</div> <!-- #header -->