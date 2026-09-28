import Parser from 'rss-parser';
import { DiscoveryModel } from '../models/discoveryModel.js';

const parser = new Parser({
  headers: {
    'User-Agent': 'OrbitNotes-Observatory/1.0 (Astronomy & Space Research Feed)'
  },
  timeout: 10000
});

// Official YouTube Space Channels with open public XML feeds
const YOUTUBE_CHANNELS = [
  {
    name: 'NASA (YouTube)',
    channelId: 'UCLA_DiR1FfKNvjuUpBHmylQ',
    category: 'Space Missions'
  },
  {
    name: 'ESA (YouTube)',
    channelId: 'UCIBaDdAbGlFDeS33shmlD0A',
    category: 'Astrophysics'
  },
  {
    name: 'James Webb Space Telescope (YouTube)',
    channelId: 'UCfi4_aCc2nEhtUMSGqaim_Q',
    category: 'Deep Sky'
  },
  {
    name: 'Anton Petrov Space Science (YouTube)',
    channelId: 'UCciQ8wFcVoIIMi-lfu8-cjQ',
    category: 'Cosmology'
  }
];


// Reddit Space Subreddits
const REDDIT_SUBREDDITS = [
  { name: 'r/astronomy (Reddit)', sub: 'astronomy', category: 'Deep Sky' },
  { name: 'r/space (Reddit)', sub: 'space', category: 'Space Missions' },
  { name: 'r/spacenews (Reddit)', sub: 'spacenews', category: 'Astrophysics' }
];

// =============================================================================
// 1. YouTube Collector
// =============================================================================
export const fetchYouTubeFeeds = async () => {
  const items = [];
  const apiKey = process.env.YOUTUBE_API_KEY;

  for (const ch of YOUTUBE_CHANNELS) {
    try {
      if (apiKey && !apiKey.includes('your_')) {
        // Use official YouTube Data API v3 if API key is provided
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${ch.channelId}&part=snippet,id&order=date&maxResults=5&type=video`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.items) {
            for (const item of json.items) {
              const vid = item.id.videoId;
              items.push({
                title: item.snippet.title,
                summary: item.snippet.description?.slice(0, 300) || '',
                content: item.snippet.description || '',
                source_name: ch.name,
                source_url: `https://www.youtube.com/watch?v=${vid}`,
                category: ch.category,
                image_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
                published_at: item.snippet.publishedAt || new Date().toISOString(),
                is_official_feed: true,
                tags: ['YouTube', ch.name, 'Video', ch.category]
              });
            }
            continue;
          }
        }
      }

      // Default Open Public YouTube RSS Feed (No API key or login required!)
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.channelId}`;
      const feed = await parser.parseURL(feedUrl);
      if (feed && feed.items) {
        for (const entry of feed.items.slice(0, 5)) {
          // Extract video ID from entry link or id
          const videoId = entry.id ? entry.id.replace('yt:video:', '') : '';
          const thumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';

          items.push({
            title: entry.title?.trim() || 'Official Space Video Dispatch',
            summary: entry.contentSnippet?.slice(0, 300) || entry.title || '',
            content: entry.content || entry.contentSnippet || '',
            source_name: ch.name,
            source_url: entry.link || `https://www.youtube.com/watch?v=${videoId}`,
            category: ch.category,
            image_url: thumb,
            published_at: entry.pubDate ? new Date(entry.pubDate).toISOString() : new Date().toISOString(),
            is_official_feed: true,
            tags: ['YouTube', ch.name, 'Video', ch.category]
          });
        }
      }
    } catch (err) {
      console.warn(`[SocialCollector] YouTube notice for ${ch.name}:`, err.message);
    }
  }

  return items;
};

// =============================================================================
// 2. Reddit Space Collector
// =============================================================================
export const fetchRedditFeeds = async () => {
  const items = [];

  for (const sub of REDDIT_SUBREDDITS) {
    try {
      const url = `https://www.reddit.com/r/${sub.sub}/hot.json?limit=6`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'OrbitNotes-Observatory/1.0 (Astronomy Research Aggregator by /u/debartha)'
        }
      });

      if (res.ok) {
        const json = await res.json();
        const posts = json?.data?.children || [];

        for (const p of posts) {
          const post = p.data;
          // Filter out stickied announcements or mod posts
          if (post.stickied) continue;

          let imageUrl = '';
          if (post.preview?.images?.[0]?.source?.url) {
            imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
          } else if (post.thumbnail && post.thumbnail.startsWith('http')) {
            imageUrl = post.thumbnail;
          }

          const permalink = `https://www.reddit.com${post.permalink}`;

          items.push({
            title: post.title?.trim() || 'Reddit Space Discussion',
            summary: post.selftext ? post.selftext.slice(0, 300) : `Shared link: ${post.url}`,
            content: post.selftext || `Discussion thread with ${post.num_comments} comments and ${post.score} upvotes.`,
            source_name: sub.name,
            source_url: post.url?.startsWith('http') && !post.url.includes('reddit.com') ? post.url : permalink,
            category: sub.category,
            image_url: imageUrl,
            published_at: post.created_utc ? new Date(post.created_utc * 1000).toISOString() : new Date().toISOString(),
            is_official_feed: false,
            tags: ['Reddit', `r/${sub.sub}`, 'Community', sub.category]
          });
        }
      }
    } catch (err) {
      console.warn(`[SocialCollector] Reddit notice for r/${sub.sub}:`, err.message);
    }
  }

  return items;
};

// =============================================================================
// 3. X (Twitter) Space Collector
// =============================================================================
export const fetchTwitterFeeds = async () => {
  const items = [];
  const bearerToken = process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN;

  if (bearerToken && !bearerToken.includes('your_')) {
    try {
      // Query recent tweets from verified space accounts
      const query = encodeURIComponent('(from:NASA OR from:ESA OR from:NASAWebb) -is:retweet');
      const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at,text,public_metrics,entities&max_results=10`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'User-Agent': 'OrbitNotes-Observatory/1.0'
        }
      });

      if (res.ok) {
        const json = await res.json();
        const tweets = json?.data || [];
        for (const t of tweets) {
          const tweetUrl = `https://x.com/NASA/status/${t.id}`;
          items.push({
            title: t.text.slice(0, 90) + (t.text.length > 90 ? '...' : ''),
            summary: t.text,
            content: t.text,
            source_name: 'NASA / Space Dispatches (X)',
            source_url: tweetUrl,
            category: 'Space Missions',
            image_url: '',
            published_at: t.created_at || new Date().toISOString(),
            is_official_feed: true,
            tags: ['X (Twitter)', 'NASA', 'Microblog', 'Space Missions']
          });
        }
      } else {
        console.warn(`[SocialCollector] X API returned status ${res.status}`);
      }
    } catch (err) {
      console.warn('[SocialCollector] X API error:', err.message);
    }
  }

  return items;
};

// =============================================================================
// 4. Bluesky Space Collector (Open AT Protocol public endpoint)
// =============================================================================
export const fetchBlueskyFeeds = async () => {
  const items = [];
  const actors = [
    { handle: 'nasa.gov', name: 'NASA (Bluesky)', category: 'Space Missions' },
    { handle: 'esa.int', name: 'ESA (Bluesky)', category: 'Astrophysics' }
  ];

  for (const a of actors) {
    try {
      const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${a.handle}&limit=5`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const feed = json?.feed || [];
        for (const entry of feed) {
          const post = entry.post;
          if (!post || !post.record || post.record.reply) continue; // skip replies

          const text = post.record.text || '';
          const uriParts = post.uri ? post.uri.split('/') : [];
          const rkey = uriParts[uriParts.length - 1];
          const postUrl = `https://bsky.app/profile/${a.handle}/post/${rkey}`;

          let imageUrl = '';
          if (post.embed?.images?.[0]?.thumb) {
            imageUrl = post.embed.images[0].thumb;
          }

          items.push({
            title: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
            summary: text,
            content: text,
            source_name: a.name,
            source_url: postUrl,
            category: a.category,
            image_url: imageUrl,
            published_at: post.record.createdAt || new Date().toISOString(),
            is_official_feed: true,
            tags: ['Bluesky', a.name, 'Microblog', a.category]
          });
        }
      }
    } catch (err) {
      console.warn(`[SocialCollector] Bluesky notice for ${a.handle}:`, err.message);
    }
  }

  return items;
};

// =============================================================================
// Unified Social Collector Sync
// =============================================================================
export const syncAllSocialMediaFeeds = async () => {
  console.log('[SocialCollector] Scanning multi-platform social media feeds...');
  const results = await Promise.allSettled([
    fetchYouTubeFeeds(),
    fetchRedditFeeds(),
    fetchTwitterFeeds(),
    fetchBlueskyFeeds()
  ]);

  const allItems = [];
  const channelCounts = { youtube: 0, reddit: 0, twitter: 0, bluesky: 0 };

  if (results[0].status === 'fulfilled') {
    allItems.push(...results[0].value);
    channelCounts.youtube = results[0].value.length;
  }
  if (results[1].status === 'fulfilled') {
    allItems.push(...results[1].value);
    channelCounts.reddit = results[1].value.length;
  }
  if (results[2].status === 'fulfilled') {
    allItems.push(...results[2].value);
    channelCounts.twitter = results[2].value.length;
  }
  if (results[3].status === 'fulfilled') {
    allItems.push(...results[3].value);
    channelCounts.bluesky = results[3].value.length;
  }

  const { insertedCount, newItems } = await DiscoveryModel.upsertManyFromFeed(allItems);
  console.log(`[SocialCollector] Finished social sync: ${allItems.length} processed, ${insertedCount} new items added.`);

  return {
    success: true,
    totalFetched: allItems.length,
    newInserted: insertedCount,
    channelCounts,
    syncedAt: new Date().toISOString()
  };
};

export const getSocialChannelsStatus = () => {
  return [
    {
      id: 'youtube',
      name: 'YouTube Space Video Feeds',
      description: 'Official NASA, ESA, and Astrophysics daily research channels',
      status: 'active',
      method: process.env.YOUTUBE_API_KEY && !process.env.YOUTUBE_API_KEY.includes('your_') ? 'Data API v3' : 'Public Channel XML Stream',
      channels: ['NASA Official', 'European Space Agency', 'Anton Petrov Astrophysics']
    },
    {
      id: 'reddit',
      name: 'Reddit Astronomy & Space',
      description: 'Community observations, discoveries, and astrophysics updates',
      status: 'active',
      method: 'Public Reddit JSON Stream',
      channels: ['r/astronomy', 'r/space', 'r/spacenews']
    },
    {
      id: 'bluesky',
      name: 'Bluesky Space Protocol',
      description: 'Real-time open microblogging dispatches from NASA and ESA',
      status: 'active',
      method: 'AT Protocol Public Feed',
      channels: ['@nasa.gov', '@esa.int']
    },
    {
      id: 'twitter',
      name: 'X (Twitter) Developer API',
      description: 'Official mission dispatches and telescope alerts',
      status: process.env.X_BEARER_TOKEN && !process.env.X_BEARER_TOKEN.includes('your_') ? 'active' : 'ready_for_key',
      method: 'Twitter API v2 Bearer Token',
      channels: ['@NASA', '@ESA', '@NASAWebb']
    }
  ];
};
