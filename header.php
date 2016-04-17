<!doctype html>
<html <?php language_attributes(); ?>>

<!--
. 　　　　　 ✫  　　　　  ˚  * 　　* 　　 .   +  　　　  ·. ˚  * 　 ✺ 　 .  ˚ .
 ˚ 　　　　　　  ·. ˚  * 　　 ˚  ✺  *  　       ˚  ✺  *  　
　* 　　 .   +     * 　　 .   + * 　✷   ·     ✧　　　　　 ✹ 　   ✧ ·　  ˚  * 　　*
 @@@@@@   @@@@@@@  @@@@@@  @@@@@@@     @@@  @@@     @@@@@@   @@@@@@   @@@   @@@@@
@@!  @@@ !@@      @@!  @@@ @@!  @@@    @@!  @@@    @@   @@@ @@!  @@@ @@@@ @@!@
@!@  !@! !@!      @!@!@!@! @!@  !@!    @!@  !@!      .!!@!  @!@  !@!  !@! @!@!@!@
!!:  !!! :!!      !!:  !!! !!:  !!!    !!:  !!!     !!:     !!:  !!!  !!! !!:  !!!
 : :. :   :: :: :  :   : : :: :  :      :.:: :     :.:: :::  : : ::   ::   : : ::
  * 　✷   ·  　　 ✵  .· .* 　✷   ·  　　 ✵  .· . * 　✷       .* 　 ✵  .·　 ✵  .· .
   ✧　　　　　 ✹ 　   ✧ · ˚  ✺  *  　            ✺ 　 .  ˚ .      ✺ 　 　   ✧
    *  　　　　 .    · 　  ✺ 　　　 ✹  ˚  ✧ ✵  ˚  ✺  *  　.    ·   ✧ ✵  ˚  ✺    .· .*
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width,maximum-scale=1.0,initial-scale=1.0,minimum-scale=1.0,user-scalable=yes" />
  <?php wp_head(); ?>

</head>

<body <?php body_class(); ?> id="content-container">
  <a class="screen-reader-shortcut" tabindex="1" href="#main">Skip to main content</a>

  <div class="loader"><h1 class="loader-text hidden">Loading</h1></div>
  <header role="banner">
    <div class="app-head-items">

        <div class="heading-inner">
          <div class="logo-wrapper">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>
          </div>
          <div class="header-item-wrapper">
            <button id="year-select-link" data-panel="year-select" class="header-item" title="Navigate years">Years</button>
          </div>
          <div class="header-item-wrapper">
            <button id="search-link" data-panel="search-container" class="header-item" title="Search archives">Search</button>
          </div>
        </div>

        <?php
          $grad_year = get_terms( 'gradyear', 'hide_empty=1&order=DESC' );
          if ( is_singular( 'illustrator' ) ) {
            // Selected menu state for individual items.
            $terms = get_the_terms( $post->ID , 'gradyear' );
            foreach ( $terms as $term ) {
              $selected_year = $term->name;
            }
          } else {
            $taxonomy = get_queried_object();
            if ( isset( $taxonomy ) ) {
              $selected_year = $taxonomy->name;
            }
          }
        ?>

        <div class="year-select panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <ul class="year-select-wrapper">
              <?php foreach ( $grad_year as $year ) {
                $yearenglishnum = $year->description;
                if ( isset( $selected_year ) && $selected_year == $year->name ) {
                  echo "<li class='year-list-item'><a class='year-item active' data-engnum='" . esc_html( $yearenglishnum ) . "' data-numyear='" . esc_html( $year->name ) . "' data-engnum='" . esc_html( $yearenglishnum ) . "' href='" . esc_url( get_term_link( $year->slug, 'gradyear' ) ) . "' title='View Work From " . esc_html( $year->name ) . "'>";
                } else {
                  echo "<li class='year-list-item'><a class='year-item' data-engnum='" . esc_html( $yearenglishnum ) . "' data-numyear='" . esc_html( $year->name ) . "' href='" . esc_url( get_term_link( $year->slug, 'gradyear' ) ) . "' title='View Work From " . esc_html( $year->name ) . "'>";
                }
                  esc_html_e( $year->name );
                echo '</a></li>';
              }
              ?>
            </ul>
            <button class="close-panel hide-text" title="Close panel" aria-label="Close search panel">Close</button>
            <a href="/about" class="panel-colophon" title="About OCAD U Illustration"><span class="hidden">About OCAD U Illustration</span></a>
          </div>
        </div> <!-- year-select-->

        <div class="search-container panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <div class="search-wrapper">
              <?php get_search_form(); ?>
            </div>
            <button class="close-panel hide-text" title="Close search panel" aria-label="Close search panel">Close</button>
          </div>
        </div><!-- search -->
       
    </div><!-- .app-head-items -->
  </header><!-- header -->

  <main id="main" role="main">
