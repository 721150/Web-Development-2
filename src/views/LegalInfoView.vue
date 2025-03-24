<script>
import OpenWebsiteButton from '../components/OpenWebsiteButton.vue';

export default {
  name: 'LegalInfo',
  components: {
    OpenWebsiteButton
  }
};
</script>

<template>
  <main>
    <h1>Juridische informatie rechtsmiddelen studenten</h1>
    <p>In het hoger beroepsonderwijs (HBO) en wetenschappelijk onderwijs (WO) zijn er verschillende procedures die je kunt volgen bij misstanden en onregelmatigheden.</p>
    <div>
      <p class="fw-bold">Verzoekschrift:</p>
      <ul>
        <li>Vraag een orgaan binnen de onderwijsinstelling om jouw probleem op te lossen.</li>
        <li>Meestal ingediend bij de examencommissie.</li>
        <li>Raadpleeg het Studentenstatuut voor de juiste procedure.</li>
      </ul>
      <p class="fw-bold">Bezwaar:</p>
      <ul>
        <li>Niet eens met een beslissing? Dien binnen zes weken bezwaar in.</li>
        <li>Het orgaan heroverweegt de beslissing.</li>
        <li>Meestal ingediend bij het instellingsbestuur.</li>
        <li>Lees het Studentenstatuut voor details.</li>
      </ul>
      <p class="fw-bold">Beroep:</p>
      <ul>
        <li>Na een afgewezen bezwaar kun je in beroep gaan.</li>
        <li>Controleer of het besluit aan formele vereisten voldoet.</li>
        <li>Dien binnen zes weken na de beslissing op bezwaar een beroepschrift in.</li>
        <li>Raadpleeg het Studentenstatuut voor de juiste instantie.</li>
      </ul>
      <p class="fw-bold">Klacht:</p>
      <ul>
        <li>Altijd mogelijk om een klacht in te dienen.</li>
        <li>Geen juridische consequenties, maar kan bijdragen aan verbeteringen.</li>
        <li>Raadpleeg het Studentenstatuut voor de klachtenprocedure.</li>
      </ul>
    </div>
    <div class="d-flex justify-content-between">
      <OpenWebsiteButton :buttonText="'Rechten & Plichten - LSVB'" :buttonLink="'https://lsvb.nl/dossiers/juridische-hulp/rechten-plichten/'" />
      <OpenWebsiteButton :buttonText="'Rechtsmiddelen - LSVB'" :buttonLink="'https://lsvb.nl/dossiers/juridische-hulp/rechtsmiddelen-2/'" />
      <OpenWebsiteButton :buttonText="'Landelijk Studenten Rechtsbureau'" :buttonLink="'https://www.lsr.nl/'" />
      <OpenWebsiteButton :buttonText="'Rechtshulp - ISO'" :buttonLink="'https://iso.nl/rechtshulp/'" />
    </div>
  </main>
</template>

<style scoped>

</style>
