<!doctype html>
<html <?php language_attributes(); ?> class="
  <?php if (is_home() || is_front_page()) {
    echo 'lock-scroll-home';
  } ?>">

<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <a class="screen-reader-shortcut" href="#main">Skip to main content</a>

  <header>
    <div class="app-head-items">

        <div class="heading-inner">
          <div class="logo-wrapper">
            <a href="<?php echo esc_url(
              home_url('/')
            ); ?>" class="logo font-normal" rel="home" title="OCAD U Illustration">
              <?php bloginfo('name'); ?>
            </a>
          </div>
          <div class="header-items-wrapper">
              <button id="year-select-link" aria-controls="panel-year-select" data-panel="year-select" class="header-item" title="Navigate years">2009.....2025</button>
              <div class="search-wrapper content-center">
                <?php get_search_form(); ?>
              </div>
          </div>
        </div>

        <?php
        $ocaduillustration_grad_year = get_terms([
          'taxonomy' => 'gradyear',
          'hide_empty' => true,
          'order' => 'DESC',
          'parent' => 0,
        ]);
        if (is_singular('illustrator') && has_term('', 'gradyear')) {
          // Selected menu state for individual items.
          $ocaduillustration_terms = get_the_terms($post->ID, 'gradyear');
          foreach ($ocaduillustration_terms as $ocaduillustration_class_year) {
            $ocaduillustration_selected_year =
              $ocaduillustration_class_year->name;
          }
        } else {
          $ocaduillustration_class_taxonomy = get_queried_object();
          if (isset($ocaduillustration_class_taxonomy)) {
            $ocaduillustration_selected_year =
              $ocaduillustration_class_taxonomy->name;
          }
        }
        ?>

        <div id="panel-year-select" class="year-select panel" aria-hidden="true" tabindex="-1">
          <div class="panel-inner">
            <ul class="year-select-wrapper">
              <?php
              $ocaduillustration_year_thumb_ids = ocaduillustration_year_thumb_ids();

              foreach (
                $ocaduillustration_grad_year
                as $ocaduillustration_class_year
              ) {
                if (
                  isset($ocaduillustration_selected_year) &&
                  $ocaduillustration_selected_year ===
                    $ocaduillustration_class_year->name
                ) {
                  $ocaduillustration_selected_year_class = 'active';
                } else {
                  $ocaduillustration_selected_year_class = '';
                }

                $ocaduillustration_year_image = '';
                $ocaduillustration_year_image_srcset = '';
                $ocaduillustration_year_term_id = $ocaduillustration_class_year->term_id;
                if (!empty($ocaduillustration_year_thumb_ids[ $ocaduillustration_year_term_id ])) {
                  $ocaduillustration_year_term_thumbs = $ocaduillustration_year_thumb_ids[ $ocaduillustration_year_term_id ];
                  $ocaduillustration_random_thumb_id  = $ocaduillustration_year_term_thumbs[ array_rand($ocaduillustration_year_term_thumbs) ];
                  $ocaduillustration_year_image = wp_get_attachment_image_url(
                    $ocaduillustration_random_thumb_id,
                    'illustrator-small'
                  );
                  $ocaduillustration_year_image_srcset = wp_get_attachment_image_srcset(
                    $ocaduillustration_random_thumb_id
                  );
                }

                echo "<li class='year-list-item'><div class='year-list-item-inner'>";
                echo wp_kses(
                  ocaduillustration_year_item_navigation(
                    $ocaduillustration_class_year,
                    $ocaduillustration_selected_year_class,
                    $ocaduillustration_year_image,
                    $ocaduillustration_year_image_srcset
                  ),
                  [
                    'a' => [
                      'href' => [],
                      'title' => [],
                      'class' => [],
                    ],
                    'span' => [
                      'class' => [],
                    ],
                    'img' => [
                      'class' => [],
                      'srcset' => [],
                      'alt' => [],
                      'sizes' => [],
                      'width' => [],
                      'height' => [],
                      'src' => [],
                      'loading' => [],
                    ],
                  ]
                );
                echo '</div></li>';
              }
              ?>
            </ul>
          </div>
          <button class="close-panel rounded-full" title="Close panel" aria-label="Close search panel"><?php get_template_part(
            'assets/dist/images/close.svg'
          ); ?><span class="hidden">Close</span></button>
        </div> <!-- year-select-->
    </div><!-- .app-head-items -->
  </header><!-- header -->

  <main id="main">
