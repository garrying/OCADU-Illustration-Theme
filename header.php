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

  <script src="//use.typekit.net/gmd4pmi.js"></script>
  <script>try{Typekit.load();}catch(e){}</script>

</head>

<body <?php body_class(); ?>>
  <div id="loader"></div>
  <header id="app-head" role="banner">
    <div id="app-head-items" class="heading">
        
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>

        <div class="year-select-container">
          <div id="clock">
            
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31 31">
              <path class="clock-face" fill="#999" d="M15.5 1C23.5 1 30 7.5 30 15.5S23.5 30 15.5 30 1 23.5 1 15.5 7.5 1 15.5 1m0-1C6.9 0 0 6.9 0 15.5S6.9 31 15.5 31 31 24.1 31 15.5 24.1 0 15.5 0z"/>
              <line class="hour-hand" fill="none" stroke="#999999" stroke-linecap="round" stroke-miterlimit="10" x1="15.5" y1="3.7" x2="15.5" y2="19.3"/>
              <line class="minute-hand" fill="none" stroke="#999999" stroke-linecap="round" stroke-miterlimit="10" x1="11.9" y1="14" x2="22.3" y2="18.3"/>
            </svg>

          </div> <!-- #clock-->

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

          <div class="year-select panel">
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
            <div class="close-panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10"><path d="M4.8 5.4L25 25.5M25 5.4L4.8 25.5"/></g></svg>
            </div>
          </div> <!-- .year-Select-->
        </div>

        <div class="search" role="search">
          <div id="magnifying-glass">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31 31" id="magnify"><path class="glass" fill="#999" d="M13.7 3.8c5.8 0 10.5 4.7 10.5 10.5s-4.7 10.5-10.5 10.5S3.2 20.1 3.2 14.3 7.9 3.8 13.7 3.8m0-1C7.3 2.8 2.2 8 2.2 14.3s5.2 11.5 11.5 11.5 11.5-5.2 11.5-11.5S20 2.8 13.7 2.8z"/><path class="handle" fill="none" stroke="#999" stroke-linecap="round" stroke-miterlimit="10" d="M21.8 22.5l6.4 6.3"/></svg>
          </div>
          <div class="search-container panel">
            <div class="search-wrapper">
              <?php get_search_form(); ?>
            </div>
            <div class="close-panel">
              <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10"><path d="M4.8 5.4L25 25.5M25 5.4L4.8 25.5"/></g></svg>
            </div>
          </div>
        </div><!-- .search -->
       
        <nav id="access" class="hidden" role="navigation">
          <h3 class="hidden"><?php _e( 'Main menu', 'ocaduillustration' ); ?></h3>
          <?php wp_nav_menu( array( 
            'container' =>false,
            'menu_class' => 'nav',
            'theme_location' => 'primary' )
            ); ?>     
        </nav><!-- #access -->

    </div><!-- .heading -->
  </header><!-- #app-head -->


  <main id="content" role="main">
    <div class="item year-indicator">
      <span class="year-current"><?php if (isset($selected_year)) { echo $selected_year; } ?></span> 
      <?php if (is_singular('illustrator')) 
          echo '<a class="year-back" href="/year/'. $term->slug .'" title="Return to '.$term->name.' grid"><span>⤴</span></a>';  
        ?>
      <?php if (is_archive()) 
          echo '<a class="year-back" href="/" title="Return to homepage"><span>⤴</span></a>';  
        ?>
    </div>