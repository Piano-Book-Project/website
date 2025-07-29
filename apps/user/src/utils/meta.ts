export interface MetaTag {
  name: string;
  content: string;
}

export interface OpenGraphTag {
  property: string;
  content: string;
}

export interface TwitterCardTag {
  name: string;
  content: string;
}

export interface PageMeta {
  title: string;
  description?: string;
  keywords?: string[];
  metaTags?: MetaTag[];
  openGraph?: OpenGraphTag[];
  twitterCard?: TwitterCardTag[];
}

export function setPageMeta(meta: PageMeta) {
  // Title 설정
  document.title = meta.title;

  // Description meta tag
  if (meta.description) {
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', meta.description);
  }

  // Keywords meta tag
  if (meta.keywords && meta.keywords.length > 0) {
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.setAttribute('content', meta.keywords.join(', '));
  }

  // Custom meta tags
  if (meta.metaTags) {
    meta.metaTags.forEach((tag) => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
  }

  // Open Graph tags
  if (meta.openGraph) {
    meta.openGraph.forEach((tag) => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });
  }

  // Twitter Card tags
  if (meta.twitterCard) {
    meta.twitterCard.forEach((tag) => {
      let twitterTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', tag.name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', tag.content);
    });
  }
}

export function setDefaultMeta() {
  setPageMeta({
    title: 'Music Player',
    description: 'Listen to your favorite music with our advanced music player',
    keywords: ['music', 'player', 'playlist', 'audio'],
    openGraph: [
      { property: 'og:title', content: 'Music Player' },
      {
        property: 'og:description',
        content: 'Listen to your favorite music with our advanced music player',
      },
      { property: 'og:type', content: 'website' },
    ],
    twitterCard: [
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Music Player' },
      {
        name: 'twitter:description',
        content: 'Listen to your favorite music with our advanced music player',
      },
    ],
  });
}
