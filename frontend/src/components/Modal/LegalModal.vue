<template>
  <h2>{{ $t('legal.title2') }}</h2>

  <div class="legal-text">
    <p>{{ $t('legal.description') }}</p>

    <h3>{{ $t('legal.data-controller') }}</h3>
    <p>{{ $t('legal.data-controller-info') }}</p>

    <h3>{{ $t('legal.legal-base') }}</h3>
    <p>{{ $t('legal.legal-base-content') }}</p>
    <ul>
      <li>{{ $t('legal.legal-base-consent') }}</li>
      <li>{{ $t('legal.legal-base-legitimate') }}</li>
    </ul>

    <h3>{{ $t('legal.data-collected') }}</h3>
    <p>{{ $t('legal.data-collected-info') }}</p>
    <ul>
      <li>{{ $t('legal.data-analytics') }}</li>
      <li>{{ $t('legal.data-contact') }}</li>
      <li>{{ $t('legal.data-builds') }}</li>
    </ul>

    <h3>{{ $t('legal.cookies') }}</h3>
    <p>{{ $t('legal.cookies-description') }}</p>
    <ul>
      <li>{{ $t('legal.save') }}</li>
      <li>{{ $t('legal.remember') }}</li>
      <li>{{ $t('legal.remember2') }}</li>
    </ul>
    <p>
      <strong>{{ $t('legal.no-tracking') }}</strong>
    </p>
    <p>
      <strong>{{ $t('legal.no-third-party') }}</strong>
    </p>

    <h3>{{ $t('legal.third-party-services') }}</h3>
    <p>{{ $t('legal.third-party-info') }}</p>
    <ul>
      <li>{{ $t('legal.iconify') }}</li>
      <li>{{ $t('legal.riot-api') }}</li>
    </ul>

    <h3>{{ $t('legal.duration') }}</h3>
    <p>{{ $t('legal.duration-description') }}</p>
    <ul>
      <li>{{ $t('legal.duration-local') }}</li>
      <li>{{ $t('legal.duration-contact') }}</li>
      <li>{{ $t('legal.duration-analytics') }}</li>
    </ul>

    <h3>{{ $t('legal.your-rights') }}</h3>
    <p>{{ $t('legal.your-rights-description') }}</p>
    <ul>
      <li>{{ $t('legal.right-access') }}</li>
      <li>{{ $t('legal.right-rectification') }}</li>
      <li>{{ $t('legal.right-erasure') }}</li>
      <li>{{ $t('legal.right-portability') }}</li>
      <li>{{ $t('legal.right-opposition') }}</li>
      <li>{{ $t('legal.right-withdraw') }}</li>
    </ul>
    <p>
      <em>{{ $t('legal.rights-exercise') }}</em>
    </p>

    <h3>{{ $t('legal.data-security') }}</h3>
    <p>{{ $t('legal.data-security-info') }}</p>
    <ul>
      <li>{{ $t('legal.security-https') }}</li>
      <li>{{ $t('legal.security-local') }}</li>
      <li>{{ $t('legal.security-no-db') }}</li>
    </ul>

    <h3>{{ $t('legal.intellectual-property') }}</h3>
    <p>{{ $t('legal.intellectual-property-description') }}</p>
    <ul>
      <li>{{ $t('legal.shared-builds') }}</li>
      <li>{{ $t('legal.league-of-legends') }}</li>
      <li>{{ $t('legal.champions-data') }}</li>
      <li>{{ $t('legal.no-link') }}</li>
    </ul>

    <div
      style="
        background: rgba(218, 165, 32, 0.1);
        border: 1px solid var(--color-gold-300);
        border-radius: 6px;
        padding: 1rem;
        margin: 1rem 0;
      "
    >
      <strong style="color: var(--color-gold-300)">{{
        $t('legal.riot-disclaimer')
      }}</strong>
    </div>

    <h3>{{ $t('legal.contact-authority') }}</h3>
    <p>{{ $t('legal.contact-authority-info') }}</p>

    <hr style="margin: 1.5rem 0; border: 1px solid var(--color-gold-300)" />
    <p>
      <small
        ><em>{{ $t('legal.last-update') }}</em></small
      >
    </p>
  </div>
</template>
