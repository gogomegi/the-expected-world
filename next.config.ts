import type { NextConfig } from "next";

const lovableRedirects = [
  ["dr-paul-r-ehrlich-1971-lovable", "ehrlich-population-bomb-1971"],
  ["the-22nd-congress-of-the-commu-1961-lovable", "khrushchev-ussr-surpass-usa-1961"],
  ["fyodor-mikhailovich-dostoevsky-1873-lovable", "dostoevsky-weapons-evolution-1873"],
  ["jose-ortega-y-gasset-1930-lovable", "ortega-revolt-of-masses-1930"],
  ["witold-gombrowicz-1958-lovable", "gombrowicz-democracy-crisis-1958"],
  ["claude-grahame-white-1914-lovable", "grahame-white-flight-travel-1914"],
  ["bondara-dr-ian-pearson-2015-lovable", "pearson-robot-intimacy-2015"],
  ["j-c-r-licklider-1960-lovable", "licklider-speech-recognition-1960"],
  ["ray-kurzweil-2001-lovable", "kurzweil-moores-law-2001"],
  ["jean-baudrillard-1992-lovable", "baudrillard-year-2000-1992"],
  ["joseph-barry-1968-lovable", "barry-fashion-revolution-1968"],
  ["h-g-wells-1924-lovable", "wells-great-war-aftermath-1924"],
  ["charles-fourier-1808-lovable", "fourier-professions-access-1808"],
  ["charles-fourier-1808-lovable-1858", "fourier-ottoman-hordes-1808"],
  ["alvin-toffler-1970-lovable", "toffler-future-shock-1970"],
  ["john-maynard-keynes-1930-lovable", "keynes-evolved-for-struggle-1930"],
  ["strand-magazine-1931-lovable", "strand-magazine-robots-1931"],
  ["university-of-chicago-press-1958-lovable", "chicago-press-automation-1958"],
  ["jessica-l-tracy-richard-w-robi-2003-lovable", "tracy-robins-cognitive-psych-2003"],
  ["jacques-attali-1998-lovable", "attali-television-2010-1998"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return lovableRedirects.map(([from, to]) => ({
      source: `/entry/${from}`,
      destination: `/entry/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
