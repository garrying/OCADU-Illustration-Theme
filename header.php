<!doctype html>
<html <?php language_attributes(); ?>>

<!--
  ____  ________   ___    __  __  ___  ___  ___  ___ 
 / __ \/ ___/ _ | / _ \  / / / / |_  |/ _ \|_  ||_  |
/ /_/ / /__/ __ |/ // / / /_/ / / __// // / __// __/ 
\____/\___/_/ |_/____/  \____/ /____/\___/____/____/ 
                                                     
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#ff5722" />
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <a class="screen-reader-shortcut" href="#main">Skip to main content</a>

  <header>
    <div class="app-head-items">

        <div class="heading-inner">
          <div class="logo-wrapper">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>
          </div>
          <div class="header-items-wrapper">
            <div class="header-item-link">
              <button id="year-select-link" aria-controls="panel-year-select" data-panel="year-select" class="header-item" title="Navigate years">2009–2023</button>
            </div>
            <div class="header-item-link">
              <button id="search-link" aria-controls="panel-search" data-panel="search-container" class="header-item" title="Search archives"></button>
            </div>
          </div>
        </div>

        <?php
          $ocaduillustration_grad_year = get_terms( 'gradyear', 'hide_empty=1&order=DESC&parent=0' );
          if ( is_singular( 'illustrator' ) && has_term( '', 'gradyear' ) ) {
            // Selected menu state for individual items.
            $ocaduillustration_terms = get_the_terms( $post->ID, 'gradyear' );
            foreach ( $ocaduillustration_terms as $ocaduillustration_class_year ) {
              $ocaduillustration_selected_year = $ocaduillustration_class_year->name;
            }
          } else {
            $ocaduillustration_class_taxonomy = get_queried_object();
            if ( isset( $ocaduillustration_class_taxonomy ) ) {
              $ocaduillustration_selected_year = $ocaduillustration_class_taxonomy->name;
            }
          }
        ?>

        <div id="panel-year-select" class="year-select panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <ul class="year-select-wrapper">
              <?php

              function ocaduillustration_year_item_navigation( $term_obj, $term_active, $term_image, $term_srcset ) {
                return "<a class='year-item " . esc_html( $term_active ) . "' href='" . esc_url( get_term_link( $term_obj->slug, 'gradyear' ) ) . "' title='View Work From " . esc_html( $term_obj->name ) . "'><span class='year-text'>" . esc_html( $term_obj->name ) . "</span><img data-srcset='" . esc_html( $term_srcset ) . "' loading='lazy' width='320' height='480' data-src='" . esc_html( $term_image ) . "' data-sizes='auto' class='year-item-image lazyload' alt='Graduating year feature image' /></a>";
              }

              foreach ( $ocaduillustration_grad_year as $ocaduillustration_class_year ) {
                
                if ( isset( $ocaduillustration_selected_year ) && $ocaduillustration_selected_year === $ocaduillustration_class_year->name ) {
                  $ocaduillustration_selected_year_class = 'active';
                } else {
                  $ocaduillustration_selected_year_class = '';
                }

                $ocaduillustration_args = array(
                  'posts_per_page' => 1,
                  'orderby'        => 'rand',
                  'post_type'      => 'illustrator',
                  'tax_query'      => array( // phpcs:ignore
                    array(
                      'taxonomy' => 'gradyear',
                      'field'    => 'name',
                      'terms'    => $ocaduillustration_class_year->name,
                    ),
                  ),
                );

                $ocaduillustration_query = new WP_Query( $ocaduillustration_args );
                if ( $ocaduillustration_query->have_posts() ) {
                  $ocaduillustration_query->the_post();
                  $ocaduillustration_year_image        = get_the_post_thumbnail_url();
                  $ocaduillustration_year_image_srcset = wp_get_attachment_image_srcset( get_post_thumbnail_id() );
                }

                $ocaduillustration_term_children = get_term_children( $ocaduillustration_class_year->term_id, $ocaduillustration_class_year->taxonomy );
                $ocaduillustration_year_streams  = '';

                foreach ( $ocaduillustration_term_children as $ocaduillustration_class_year_stream ) {
                  $ocaduillustration_year_stream      = get_term( $ocaduillustration_class_year_stream );
                  $ocaduillustration_year_stream_args = array(
                    'posts_per_page' => 1,
                    'orderby'        => 'rand',
                    'post_type'      => 'illustrator',
                    'tax_query'      => array( // phpcs:ignore
                      array(
                        'taxonomy' => 'gradyear',
                        'field'    => 'name',
                        'terms'    => $ocaduillustration_year_stream->name,
                      ),
                    ),
                  );

                  $ocaduillustration_year_stream_query = new WP_Query( $ocaduillustration_year_stream_args );
                  if ( $ocaduillustration_year_stream_query->have_posts() ) {
                    $ocaduillustration_year_stream_query->the_post();
                    $ocaduillustration_year_stream_query_year_image        = get_the_post_thumbnail_url();
                    $ocaduillustration_year_stream_query_year_image_srcset = wp_get_attachment_image_srcset( get_post_thumbnail_id() );
                  }

                  $ocaduillustration_year_streams .= "<li class='year-list-item'>" . ocaduillustration_year_item_navigation( $ocaduillustration_year_stream, $ocaduillustration_selected_year_class, $ocaduillustration_year_stream_query_year_image, $ocaduillustration_year_stream_query_year_image_srcset ) . '</li>';
                  wp_reset_postdata();
                }

                if ( $ocaduillustration_year_streams ) {
                  echo "<li class='year-list-item extended'><div class='year-list-item-inner'>" . ocaduillustration_year_item_navigation( $ocaduillustration_class_year, $ocaduillustration_selected_year_class, $ocaduillustration_year_image, $ocaduillustration_year_image_srcset ); // phpcs:ignore
                } else {
                  echo "<li class='year-list-item'><div class='year-list-item-inner'>" . ocaduillustration_year_item_navigation( $ocaduillustration_class_year, $ocaduillustration_selected_year_class, $ocaduillustration_year_image, $ocaduillustration_year_image_srcset ); // phpcs:ignore
                }
                  if ( $ocaduillustration_year_streams ) {
                    echo '<ul class="sub">';
                    echo $ocaduillustration_year_streams; // phpcs:ignore
                    echo '</ul>';
                  }
                echo '</div></li>';
                wp_reset_postdata();
              }
              ?>
            </ul>
          </div>
          <button class="close-panel pill" title="Close panel" aria-label="Close search panel"><?php get_template_part( 'assets/dist/images/close.svg' ); ?><span class="hidden">Close</span></button>
        </div> <!-- year-select-->

        <div id="panel-search" class="search-container panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <div class="search-wrapper">
              <?php get_search_form(); ?>
            </div>
            <button class="close-panel pill" title="Close search panel" aria-label="Close search panel"><?php get_template_part( 'assets/dist/images/close.svg' ); ?><span class="hidden">Close</span></button>
          </div>
        </div><!-- search -->
    </div><!-- .app-head-items -->
  </header><!-- header -->

  <main id="main">
