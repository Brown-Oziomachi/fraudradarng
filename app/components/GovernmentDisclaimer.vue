<!-- app/components/GovernmentDisclaimer.vue -->
<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'banner' | 'full' }>(), {
  variant: 'banner'
})
</script>

<template>
  <div v-if="variant === 'banner'" class="disclaimer-banner">
    <svg class="banner-icon" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <p class="banner-text">
      FRNG is an independent, community-driven platform. We are
      <strong>not</strong> affiliated with the Nigerian government,
      the Police, the EFCC, or any law enforcement agency.
    </p>
  </div>

  <section v-else class="disclaimer-full">
    <div class="section-title-row">
      <svg class="section-icon" viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <h2 class="section-title">FRNG is not a government agency</h2>
    </div>

    <div class="disclaimer-card fade-in" style="--delay: 0s">
      <p>
        Fraud Radar NG (FRNG) is an independent platform built to help
        everyday Nigerians identify and report suspected scams, fraudulent
        bank accounts, and fake companies. We are not a government body,
        and we are not affiliated with, endorsed by, or acting on behalf
        of the Nigeria Police Force, the Economic and Financial Crimes
        Commission (EFCC), the Central Bank of Nigeria, or any other
        official regulatory or law enforcement agency.
      </p>
      <p>
        Reports submitted on FRNG are community-sourced and reflect user
        experiences and concerns. They are <strong>not</strong> verified
        criminal findings and do not carry legal weight on their own. If
        you have been a victim of fraud, we strongly encourage you to
        also report the matter to the appropriate authorities, such as
        the EFCC or the Nigeria Police Force, in addition to using FRNG.
      </p>
      <p class="muted">
        Any imagery, branding, or previous materials associated with FRNG
        that may have implied an official or governmental role were
        stylistic and unofficial, and do not represent any real
        affiliation, personnel, or authority.
      </p>
    </div>

    <div class="disclaimer-card fade-in" style="--delay: 0.08s">
      <h3 class="card-heading">No warranty on report accuracy</h3>
      <p>
        FRNG does not independently investigate, verify, or fact-check
        reports before or after they are published. Names, account
        numbers, business details, and descriptions come directly from
        the person filing the report. We make no representation or
        warranty, express or implied, as to the accuracy, completeness,
        or reliability of any report, comment, or piece of evidence
        submitted on the platform.
      </p>
      <p>
        Use your own judgment when relying on any report. Where possible,
        cross-check details independently before making a decision based
        on information found here.
      </p>
    </div>

    <div class="disclaimer-card fade-in" style="--delay: 0.16s">
      <h3 class="card-heading">Limitation of liability</h3>
      <p>
        To the fullest extent permitted by law, FRNG, its operators, and
        contributors will not be held liable for any loss, damage, or
        harm — financial or otherwise — arising from reliance on content
        published on this platform, from a false or inaccurate report, or
        from any transaction, dispute, or decision made using information
        found here.
      </p>
      <p>
        FRNG is provided on an "as is" and "as available" basis, without
        guarantees of uptime, uninterrupted access, or that the service
        will be free of errors.
      </p>
    </div>

    <div class="disclaimer-card fade-in" style="--delay: 0.24s">
      <h3 class="card-heading">User-submitted content</h3>
      <p>
        Reports, comments, and evidence are submitted by members of the
        public and reflect their own account of events, not FRNG's
        findings. Publishing a report does not mean FRNG endorses,
        confirms, or agrees with its contents. If you believe a report
        about you or your business is false, defamatory, or submitted in
        bad faith, you can flag it for review through the Flag a Report page.
      </p>
    </div>

    <div class="disclaimer-card fade-in" style="--delay: 0.32s">
      <h3 class="card-heading">Third-party links and tools</h3>
      <p>
        Pages such as the Naira Recovery Pipeline may reference or link
        to third-party agencies, including the CBN, FCCPC, EFCC, and the
        Nigeria Police Force. These references are provided for
        convenience only. FRNG does not control, operate, or speak on
        behalf of any of these organizations, and cannot guarantee the
        outcome of any report, letter, or complaint you file with them.
      </p>
    </div>

    <div class="disclaimer-card fade-in" style="--delay: 0.4s">
      <h3 class="card-heading">Changes to this disclaimer</h3>
      <p>
        This disclaimer may be updated from time to time as the platform
        evolves. Continued use of FRNG after changes are posted means you
        accept the updated terms. We recommend checking this page
        periodically.
      </p>
    </div>
  </section>
</template>

<style scoped>
@keyframes disclaimerFadeIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.disclaimer-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--accent-dim, rgba(220, 51, 51, 0.08));
  border: 1px solid var(--accent-bdr, rgba(220, 51, 51, 0.35));
  border-radius: var(--radius, 8px);
  padding: 12px 16px;
  max-width: 920px;
  margin: 0 auto 24px;
  animation: disclaimerFadeIn 0.4s ease both;
}
.banner-icon { color: var(--accent, #dc3333); flex-shrink: 0; margin-top: 1px; }
.banner-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-2, #444);
  font-weight: 300;
}
.banner-text strong { color: var(--text-1, #111); font-weight: 600; }

.disclaimer-full {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  animation: disclaimerFadeIn 0.4s ease both;
}
.section-icon { color: var(--accent, #dc3333); flex-shrink: 0; }
.section-title {
  font-family: var(--serif, serif);
  font-size: 22px;
  color: var(--text-1, #111);
}

.disclaimer-card {
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e2e2e2);
  border-radius: var(--radius, 8px);
  padding: 24px;
}
.fade-in {
  animation: disclaimerFadeIn 0.5s ease both;
  animation-delay: var(--delay, 0s);
}

.card-heading {
  font-family: var(--serif, serif);
  font-size: 16px;
  color: var(--text-1, #111);
  margin-bottom: 10px;
}
.disclaimer-card p {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-2, #444);
  font-weight: 300;
  margin-bottom: 16px;
}
.disclaimer-card p:last-child { margin-bottom: 0; }
.disclaimer-card strong { color: var(--text-1, #111); font-weight: 600; }
.disclaimer-card .muted { color: var(--text-3, #888); font-size: 12.5px; }
</style>