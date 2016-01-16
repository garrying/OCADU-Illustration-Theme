<!doctype html>
<html <?php language_attributes(); ?>>

<!--
. 　　　　　 ✫  　　　　  ˚  * 　　* 　　 .   +  　　　  ·. ˚  * 　 ✺ 　 .  ˚ .  
 ˚ 　　　　　　  ·. ˚  * 　　 ˚  ✺  *  　       ˚  ✺  *  　
　* 　　 .   +     * 　　 .   + * 　✷   ·     ✧　　　　　 ✹ 　   ✧ ·　  ˚  * 　　* 　
 _____   ____     ______  ____        __  __          ___       __      _  ______    
/\  __`\/\  _`\  /\  _  \/\  _`\     /\ \/\ \       /'___`\   /'__`\  /' \/\  ___\   
\ \ \/\ \ \ \/\_\\ \ \L\ \ \ \/\ \   \ \ \ \ \     /\_\ /\ \ /\ \/\ \/\_, \ \ \__/   
 \ \ \ \ \ \ \/_/_\ \  __ \ \ \ \ \   \ \ \ \ \    \/_/// /__\ \ \ \ \/_/\ \ \___``\ 
  \ \ \_\ \ \ \L\ \\ \ \/\ \ \ \_\ \   \ \ \_\ \      // /_\ \\ \ \_\ \ \ \ \/\ \L\ \
   \ \_____\ \____/ \ \_\ \_\ \____/    \ \_____\    /\______/ \ \____/  \ \_\ \____/
    \/_____/\/___/   \/_/\/_/\/___/      \/_____/    \/_____/   \/___/    \/_/\/___/ 
                                                                                     
  * 　✷   ·  　　 ✵  .· .* 　✷   ·  　　 ✵  .· . * 　✷       .* 　 ✵  .·　 ✵  .· . 
   ✧　　　　　 ✹ 　   ✧ · ˚  ✺  *  　            ✺ 　 .  ˚ .      ✺ 　 　   ✧ 
    *  　　　　 .    · 　  ✺ 　　　 ✹  ˚  ✧ ✵  ˚  ✺  *  　.    ·   ✧ ✵  ˚  ✺    .· .* 
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <?php wp_head(); ?>

</head>

<body <?php body_class(); ?> id="content-container">
  <a class="screen-reader-shortcut heading" tabindex="1" href="#main">Skip to main content</a>

  <div class="loader"></div>
  <header role="banner">
    <div class="app-head-items heading">

        <div class="heading-inner">
          <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>
          <button id="year-select-link" data-panel="year-select" class="header-item" title="Select year">
            Year
          </button>
          <button id="search-link" data-panel="search-container" class="header-item" title="Search archive">
            Search
          </button>
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
          <ul class="year-select-wrapper">
            <?php foreach ( $grad_year as $year ) {
              if ( isset( $selected_year ) && $selected_year == $year->name ) {
                echo "<li><a class='year-item active' href='". esc_url( get_term_link( $year->slug, 'gradyear' ) )."' title='View Work From ". esc_html( $year->name ) ."'>";
              } else {
                echo "<li><a class='year-item' href='". esc_url( get_term_link( $year->slug, 'gradyear' ) )."' title='View Work From ". esc_html( $year->name ) ."'>";
              }
                esc_html_e( $year->name );
              echo '</a></li>';
            }
            ?>
          </ul>
          <button class="close-panel" title="Close panel" aria-label="Close search panel">Close</button>
          <a href="/about" class="panel-colophon" title="About OCAD U Illustration"><span class="hidden">About OCAD U Illustration</span></a>
        </div> <!-- year-select-->

        <div class="search-container panel" aria-hidden="true" tabindex="-1">
          <div class="search-wrapper">
            <?php get_search_form(); ?>
          </div>
          <button class="close-panel" title="Close search panel" aria-label="Close search panel">Close</button>
          <a href="/about" class="panel-colophon" title="About OCAD U Illustration"><span class="hidden">About OCAD U Illustration</span></a>
        </div><!-- search -->
       
    </div><!-- .app-head-items -->
  </header><!-- header -->

  <main id="content" role="main">
