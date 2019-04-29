<?php $ocaduillustration_categories = get_the_terms( $this->ID, 'gradyear' ); ?>

<?php if ( $ocaduillustration_categories ) : ?>
  <div class="amp-wp-meta amp-wp-posted-on">
    <?php
      foreach ( $ocaduillustration_categories as $class_year ) {
        echo esc_html( $class_year->name );
      }
    ?>
  </div>
<?php endif; ?>
