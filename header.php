<!DOCTYPE html>
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
                                                                                     
  * 　✷   ·  　　 ✵  .· .* 　✷   ·  　　 ✵  .· . * 　✷       .* 
   ✧　　　　　 ✹ 　   ✧ · ˚  ✺  *  　            ✺ 　 .  ˚ .      ✺ 　
    *  　　　　 .    · 　  ✺ 　　　 ✹  ˚  ✧ ✵  ˚  ✺  *  　
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#f2f2f2">
  
  <?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>
  <a class="screen-reader-shortcut heading" tabindex="1" href="#main">Skip to main content</a>

  <div class="loader"></div>
  <header role="banner">
    <div class="app-head-items heading">

        <div class="heading-inner">
          <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>
          <button id="year-select-link" class="header-item" title="Select year">
            Year
          </button>
          <button id="search-link" class="header-item" title="Search archive">
            Search
          </button>
        </div>
        

        <div class="year-select-container">
          <?php 
            $grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); 
            if (is_singular('illustrator')) {
              // Selected menu state for individual items
              $terms = get_the_terms( $post->ID , 'gradyear' );
              foreach ( $terms as $term ) {
                $selected_year = $term->name;
              }
            } else {
              $taxonomy = get_queried_object();
              if (isset($taxonomy)) {
                $selected_year = $taxonomy->name;
              }
            }
          ?>

          <div class="year-select panel" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="year-select-wrapper">
              <?php foreach( $grad_year as $year ) {
                if (isset($selected_year) && $selected_year == $year->name) {
                  echo "<a class='year-item active' href='". esc_url( get_term_link( $year->slug, 'gradyear' ) )."' title='View Work From ".$year->name."'>";
                } else {
                  echo "<a class='year-item' href='". esc_url( get_term_link( $year->slug, 'gradyear' ) )."' title='View Work From ".$year->name."'>";
                }
                  echo $year->name;
                echo "</a>";
              }
              ?>
            </div>
            <button class="close-panel" title="Close panel" aria-label="Close search panel"></button>
            <a href="/about" class="panel-colophon" title="About OCAD U Illustration"><span class="hidden">About OCAD U Illustration</span></a>
          </div> <!-- .year-Select-->
        </div>

        <div class="search-container panel" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="search-wrapper">
            <?php get_search_form(); ?>
          </div>
          <button class="close-panel" title="Close search panel" aria-label="Close search panel"></button>
          <a href="/about" class="panel-colophon" title="About OCAD U Illustration"><span class="hidden">About OCAD U Illustration</span></a>
        </div><!-- search -->
       
    </div><!-- .heading -->
  </header><!-- #app-head -->


  <main id="content" role="main">
    <div class="year-indicator">
      <?php if (is_singular('illustrator')) 
          echo '<a class="year-back" href="/year/'. $term->slug .'" title="Return to '.$term->name.' grid">';
          if (isset($selected_year)) { echo $selected_year; };
          echo '</a>';  
        ?>
      <?php if (is_archive()) 
          echo '<a class="year-back" href="/" title="Return to homepage"></a>';  
        ?>
    </div>