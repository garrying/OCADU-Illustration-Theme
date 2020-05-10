<!doctype html>
<html <?php language_attributes(); ?>>

<!--
 _______  _______  _______  ______     __   __    _______  _______  _______  _______ 
|       ||       ||   _   ||      |   |  | |  |  |       ||  _    ||       ||  _    |
|   _   ||       ||  |_|  ||  _    |  |  | |  |  |____   || | |   ||____   || | |   |
|  | |  ||       ||       || | |   |  |  |_|  |   ____|  || | |   | ____|  || | |   |
|  |_|  ||      _||       || |_|   |  |       |  | ______|| |_|   || ______|| |_|   |
|       ||     |_ |   _   ||       |  |       |  | |_____ |       || |_____ |       |
|_______||_______||__| |__||______|   |_______|  |_______||_______||_______||_______|
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="profile" href="https://gmpg.org/xfn/11" />
  <?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>
  <a class="screen-reader-shortcut" href="#main">Skip to main content</a>

  <div class="loader"><h1 class="loader-text">Loading ☺</h1></div>
  <header>
    <div class="app-head-items">

        <div class="heading-inner">
          <div class="logo-wrapper">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>
          </div>
          <div class="header-items-wrapper">
            <div class="header-item-link">
              <button id="year-select-link" aria-controls="panel-year-select" data-panel="year-select" class="header-item pill" title="Navigate years">2009–2020</button>
            </div>
            <div class="header-item-link">
              <button id="search-link" aria-controls="panel-search" data-panel="search-container" class="header-item pill" title="Search archives">Search</button>
            </div>
          </div>
        </div>

        <?php
          $ocaduillustration_grad_year = get_terms( 'gradyear', 'hide_empty=1&order=DESC' );
          if ( is_singular( 'illustrator' ) && has_term('', 'gradyear')) {
            // Selected menu state for individual items.
            $ocaduillustration_terms = get_the_terms( $post->ID, 'gradyear' );
            foreach ( $ocaduillustration_terms as $class_year ) {
              $ocaduillustration_selected_year = $class_year->name;
            }
          } else {
            $class_taxonomy = get_queried_object();
            if ( isset( $class_taxonomy ) ) {
              $ocaduillustration_selected_year = $class_taxonomy->name;
            }
          }
        ?>

        <div id="panel-year-select" class="year-select panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <ul class="year-select-wrapper">
              <?php
              foreach ( $ocaduillustration_grad_year as $class_year ) {
                if ( isset( $ocaduillustration_selected_year ) && $ocaduillustration_selected_year === $class_year->name ) {
                  $ocaduillustration_selected_year_class = 'active';
                } else {
                  $ocaduillustration_selected_year_class = '';
                }

                $ocaduillustration_args = array(
                  'posts_per_page' => 1,
                  'orderby'        => 'rand',
                  'post_type'      => 'illustrator',
                  'tax_query'      => array(
                    array(
                      'taxonomy' => 'gradyear',
                      'field'    => 'name',
                      'terms'    => $class_year->name,
                    ),
                  ),
                );

                $ocaduillustration_query = new WP_Query( $ocaduillustration_args );
                if ( $ocaduillustration_query->have_posts() ) {
                  $ocaduillustration_query->the_post();
                  $ocaduillustration_year_image        = get_the_post_thumbnail_url();
                  $ocaduillustration_year_image_srcset = wp_get_attachment_image_srcset( get_post_thumbnail_id() );
                }

                echo "<li class='year-list-item'><a class='year-item " . esc_html( $ocaduillustration_selected_year_class ) . "' href='" . esc_url( get_term_link( $class_year->slug, 'gradyear' ) ) . "' title='View Work From " . esc_html( $class_year->name ) . "'><span class='year-text'>" . esc_html( $class_year->name ) . "</span><img data-srcset='" . esc_html( $ocaduillustration_year_image_srcset ) . "' loading='lazy' width='320' height='480' data-src='" . esc_html( $ocaduillustration_year_image ) . "' data-sizes='auto' class='year-item-image lazyload' alt='Graduating year feature image' /></a></li>";
                wp_reset_postdata();
              }
              ?>
            </ul>
          </div>
          <button class="close-panel" title="Close panel" aria-label="Close search panel"><?php get_template_part( 'assets/dist/images/close.svg' ); ?><span class="hidden">Close</span></button>
        </div> <!-- year-select-->

        <div id="panel-search" class="search-container panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <div class="search-wrapper">
              <?php get_search_form(); ?>
            </div>
            <button class="close-panel" title="Close search panel" aria-label="Close search panel"><?php get_template_part( 'assets/dist/images/close.svg' ); ?><span class="hidden">Close</span></button>
          </div>
        </div><!-- search -->
    </div><!-- .app-head-items -->
  </header><!-- header -->

  <main id="main">
