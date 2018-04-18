<!doctype html>
<html <?php language_attributes(); ?>>

<!--
 ˚ 　　　　　　  ·. ˚  * 　　 ˚  ✺  *  　       ˚  ✺  *  　
　* 　　 .   +     * 　　 .   + * 　✷   ·     ✧　　　　　 ✹ 　   ✧ ·　  ˚  * 　　*
 @@@@@@   @@@@@@@  @@@@@@  @@@@@@@     @@@  @@@     @@@@@@   @@@@@@   @@@  @@@@@@  
@@!  @@@ !@@      @@!  @@@ @@!  @@@    @@!  @@@    @@   @@@ @@!  @@@ @@@@ @@!  @@@ 
@!@  !@! !@!      @!@!@!@! @!@  !@!    @!@  !@!      .!!@!  @!@  !@!  !@!  !@!@!@  
!!:  !!! :!!      !!:  !!! !!:  !!!    !!:  !!!     !!:     !!:  !!!  !!! !!:  !!! 
 : :. :   :: :: :  :   : : :: :  :      :.:: :     :.:: :::  : : ::   ::   :.:: :  
  * 　✷   ·  　　 ✵  .· .* 　✷   ·  　　 ✵  .· . * 　✷       .* 　 ✵  .·　 ✵  .· .
   ✧　　　　　 ✹ 　   ✧ · ˚  ✺  *  　            ✺ 　 .  ˚ .      ✺ 　 　   ✧
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000">
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/icon.png">
  <?php wp_head(); ?>

</head>

<body <?php body_class(); ?> id="content-container">
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
              <button id="year-select-link" aria-controls="panel-year-select" data-panel="year-select" class="header-item" title="Navigate years">2009–2018</button>
            </div>
            <div class="header-item-link">
              <button id="search-link" aria-controls="panel-search" data-panel="search-container" class="header-item" title="Search archives">Search</button>
            </div>
          </div>
        </div>

        <?php
          $ocaduillustration_grad_year = get_terms( 'gradyear', 'hide_empty=1&order=DESC' );
          if ( is_singular( 'illustrator' ) ) {
            // Selected menu state for individual items.
            $ocaduillustration_terms = get_the_terms( $post->ID, 'gradyear' );
            foreach ( $ocaduillustration_terms as $term ) {
              $ocaduillustration_selected_year = $term->name;
            }
          } else {
            $taxonomy = get_queried_object();
            if ( isset( $taxonomy ) ) {
              $ocaduillustration_selected_year = $taxonomy->name;
            }
          }
        ?>

        <div id="panel-year-select" class="year-select panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <ul class="year-select-wrapper">
              <?php
              foreach ( $ocaduillustration_grad_year as $year ) {
                if ( isset( $ocaduillustration_selected_year ) && $ocaduillustration_selected_year === $year->name ) {
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
                      'terms'    => $year->name,
                    ),
                  ),
                );

                $ocaduillustration_query = new WP_Query( $ocaduillustration_args );
                if ( $ocaduillustration_query->have_posts() ) {
                  $ocaduillustration_query->the_post();
                  $ocaduillustration_year_image = get_the_post_thumbnail_url();
                }

                echo "<li class='year-list-item'><a class='year-item " . esc_html( $ocaduillustration_selected_year_class ) . "' href='" . esc_url( get_term_link( $year->slug, 'gradyear' ) ) . "' title='View Work From " . esc_html( $year->name ) . "'>" . esc_html( $year->name ) . "</a><img data-src='" . esc_html( $ocaduillustration_year_image ) . "' class='year-item-image lazyload' alt='Graduating year feature image' /></li>";
                wp_reset_postdata();
              }
              ?>
            </ul>
            <div class="preview-image-container">
            </div>
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
