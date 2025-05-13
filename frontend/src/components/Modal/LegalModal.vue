<template>
  <h2>{{ $t('legal.title2') }}</h2>

  <div class="legal-text">
    <h3>{{ $t('legal.cookies') }}</h3>
    <p>{{ $t('legal.cookies-description') }}</p>
    <ul>
      <li>{{ $t('legal.save') }}</li>
      <li>{{ $t('legal.remember') }}</li>
      <li>{{ $t('legal.remember2') }}</li>
    </ul>

    <h3>{{ $t('legal.duration') }}</h3>
    <p>{{ $t('legal.duration-description') }}</p>
    <ul>
      <li>{{ $t('legal.delete') }}</li>
      <li>
        {{ $t('legal.delete2') }}
      </li>
    </ul>

    <h3>{{ $t('legal.your-rights') }}</h3>
    <ul>
      <li>{{ $t('legal.delete3') }}</li>
      <li>{{ $t('legal.reset') }}</li>
      <li>
        {{ $t('legal.delete4') }}
      </li>
    </ul>

    <h3>{{ $t('legal.intellectual-property') }}</h3>
    <ul>
      <li>{{ $t('legal.shared-builds') }}</li>
      <li>{{ $t('legal.league-of-legends') }}</li>
      <li>
        {{ $t('legal.champions-data') }}
      </li>
      <li>{{ $t('legal.no-link') }}</li>
    </ul>
  </div>
</template>
