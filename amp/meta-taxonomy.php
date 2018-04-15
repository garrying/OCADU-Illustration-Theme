<?php $ocaduillustration_categories = get_the_terms( $this->ID, 'gradyear' ); ?>

<?php if ( $ocaduillustration_categories ) : ?>
  <div class="amp-wp-meta amp-wp-posted-on">
    <?php
      foreach ( $ocaduillustration_categories as $year ) {
        echo esc_html( $year->name );
      }
    ?>
  </div>
<?php endif; ?>
