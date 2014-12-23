<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<!--

 @@@@@@   @@@@@@@  @@@@@@  @@@@@@@     @@@  @@@     @@@@@@   @@@@@@   @@@ @@@  @@@
@@!  @@@ !@@      @@!  @@@ @@!  @@@    @@!  @@@    @@   @@@ @@!  @@@ @@@@ @@@  @@@
@!@  !@! !@!      @!@!@!@! @!@  !@!    @!@  !@!      .!!@!  @!@  !@!  !@! @!@!@!@!
!!:  !!! :!!      !!:  !!! !!:  !!!    !!:  !!!     !!:     !!:  !!!  !!!      !!!
 : :. :   :: :: :  :   : : :: :  :      :.:: :     :.:: :::  : : ::   ::       : :
 
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <?php wp_head(); ?>

  <script type="text/javascript" src="//use.typekit.net/sgm7vuw.js"></script>
  <script type="text/javascript">try{Typekit.load();}catch(e){}</script>

</head>

<body <?php body_class(); ?>>
  <header id="app-head" role="banner">
    <div class="container">
        
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>

        <div class="item year-indicator">
          <?php 
            $grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); 
            // Selected menu state for attachments 
            if (is_attachment()) {
              $terms = get_the_terms($post->post_parent, 'gradyear');
              foreach ( $terms as $term ) { 
                $selected_year = $term->name;
              }
            } elseif (is_singular('illustrator')) {
              // Selected menu state for individual items
              $terms = get_the_terms( $post->ID , 'gradyear' );
              foreach ( $terms as $term ) {
                $selected_year = $term->name;
              }
            }
          ?>
          <span class="year-current"><?php if (isset($selected_year)) { echo $selected_year; } elseif (isset($term)) { echo $term; } else {echo('2014');}  ?></span>
          <div id="year-widget">
            <nav id="year-select">
              <ul id="illu-jumpmenu" class="normalized">
                <?php foreach( $grad_year as $year ) {
                  echo "<li class='year-item'>";
                    if ( is_singular('illustrator') && $selected_year == $year->name ) {
                      echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
                    } elseif ( isset($term) && $term == $year->name ) {
                      echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."' class='selected' >".$year->name."</a>";
                    } else {
                      echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."'>".$year->name."</a>";
                    }
                  echo "</li>";
                }
                ?>
              </ul>
            </nav> <!-- #year-Select-->
          </div> <!-- #year-widget-->

        </div>

        <div class="item search" role="search">
          <div class="search-container">
            <?php get_search_form(); ?>
          </div>
        </div><!-- #search -->
        <?php if (is_singular('illustrator')) 
    echo '<a class="item" id="year-back-button" href="/year/'. $term->slug .'" title="Return to '.$term->name.' grid"><span>' . $term->name . '</span></a>';  
  ?>
        
       
          <nav id="access" role="navigation">
            <h3 class="hidden"><?php _e( 'Main menu', 'ocaduillustration' ); ?></h3>
            <?php wp_nav_menu( array( 
              'container' =>false,
              'menu_class' => 'nav',
              'theme_location' => 'primary' )
              ); ?>     
          </nav><!-- #access -->

    </div><!-- .container -->
  </header><!-- #app-head -->


  <div id="content" role="main">
