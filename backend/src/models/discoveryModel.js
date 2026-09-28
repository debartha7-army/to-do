import { supabase } from '../config/supabase.js';
import crypto from 'crypto';

const localDiscoveries = [
  {
    id: 'disc-jwst-dawn-cluster',
    user_id: null,
    title: 'James Webb Space Telescope Uncovers Ancient Galaxy Cluster from Cosmic Dawn',
    summary: 'Astronomers utilizing the NIRCam instrument on JWST have identified an exceptionally dense proto-cluster of galaxies dating to just 400 million years after the Big Bang, challenging standard hierarchical structure formation models.',
    content: 'The proto-cluster, designated A2744-z7p9, contains twelve confirmed spectroscopic members grouped in an ultra-compact redshift volume. Gravitational lensing amplification through Pandora Cluster facilitated identification of high ionizing photon production efficiencies.',
    source_name: 'NASA / JPL',
    source_url: 'https://www.nasa.gov/missions/webb/webb-uncovers-ancient-galaxy-cluster/',
    category: 'Cosmology',
    image_url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    published_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    is_official_feed: true,
    tags: ['JWST', 'Early Universe', 'Cosmology', 'Galaxies'],
    created_at: new Date().toISOString()
  },
  {
    id: 'disc-esa-euclid-perseus',
    user_id: null,
    title: 'ESA Euclid Mission Delivers Landmark Deep-Sky Dark Matter Survey of Perseus',
    summary: 'The European Space Agency Euclid telescope has published its landmark 260-million-pixel mosaic of the Perseus cluster, mapping the influence of dark matter across 100,000 galaxies with unprecedented optical and near-infrared precision.',
    content: 'Through weak gravitational lensing distortions, Euclid scientists have reconstructed a 3D dark-matter filament skeleton extending over 10 megaparsecs, identifying thousands of faint globular clusters orbiting intra-cluster voids.',
    source_name: 'ESA Space Science',
    source_url: 'https://www.esa.int/Science_Exploration/Space_Science/Euclid/Euclid_s_first_images_the_dazzling_edge_of_darkness',
    category: 'Deep Sky',
    image_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    published_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    is_official_feed: true,
    tags: ['Euclid', 'Dark Matter', 'ESA', 'Deep Space'],
    created_at: new Date().toISOString()
  },
  {
    id: 'disc-k218b-subneptune',
    user_id: null,
    title: 'Atmospheric Characterization of Temperate Sub-Neptune K2-18 b Confirms Carbon Biosignatures Under Study',
    summary: 'Spectroscopic transmission observations confirm carbon-bearing molecules methane and carbon dioxide with an absence of ammonia in the hydrogen-rich atmosphere of exoplanet K2-18 b located in its star habitable zone.',
    content: 'The planetary atmosphere displays absorption signatures consistent with a Hycean world scenario—possessing a water ocean beneath an atmospheric mantle. Further transit spectroscopy will constrain dimethyl sulfide (DMS) abundance limits.',
    source_name: 'NASA / JPL',
    source_url: 'https://www.nasa.gov/universe/exoplanets/webb-discovers-methane-carbon-dioxide-in-atmosphere-of-k2-18b/',
    category: 'Exoplanets',
    image_url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    published_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    is_official_feed: true,
    tags: ['Exoplanets', 'Habitable Zone', 'Spectroscopy', 'Sub-Neptunes'],
    created_at: new Date().toISOString()
  }
];

export const DiscoveryModel = {
  async list({ category, search, source } = {}) {
    if (supabase) {
      try {
        let query = supabase.from('discoveries').select('*').order('published_at', { ascending: false });

        if (category && category !== 'All') {
          query = query.eq('category', category);
        }
        if (source && source !== 'All') {
          query = query.ilike('source_name', `%${source}%`);
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,source_name.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[DiscoveryModel] Supabase list failed, using local store:', err.message);
      }
    }

    let results = [...localDiscoveries];
    if (category && category !== 'All') {
      results = results.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }
    if (source && source !== 'All') {
      results = results.filter(d => d.source_name.toLowerCase().includes(source.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.summary && d.summary.toLowerCase().includes(q)) ||
        (d.source_name && d.source_name.toLowerCase().includes(q))
      );
    }
    return results.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  },

  async getById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('discoveries').select('*').eq('id', id).maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DiscoveryModel] Supabase getById failed:', err.message);
      }
    }
    return localDiscoveries.find(d => d.id === id) || null;
  },

  async create(data, userId) {
    const newDiscovery = {
      id: crypto.randomUUID(),
      user_id: userId || null,
      title: data.title,
      summary: data.summary || '',
      content: data.content || '',
      source_name: data.source_name || 'Personal Log',
      source_url: data.source_url || '',
      category: data.category || 'Astrophysics',
      image_url: data.image_url || '',
      published_at: data.published_at || new Date().toISOString(),
      is_official_feed: Boolean(data.is_official_feed),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(t => t.trim()) : []),
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('discoveries')
          .insert([newDiscovery])
          .select()
          .single();

        if (!error && inserted) {
          localDiscoveries.unshift(inserted);
          return inserted;
        }
        if (error) {
          console.warn('[DiscoveryModel] Supabase insert error, falling back locally:', error.message);
        }
      } catch (err) {
        console.warn('[DiscoveryModel] Supabase error:', err.message);
      }
    }

    localDiscoveries.unshift(newDiscovery);
    return newDiscovery;
  },

  async upsertManyFromFeed(items) {
    let insertedCount = 0;
    const newItems = [];

    for (const item of items) {
      const existsLocally = localDiscoveries.some(d => d.source_url === item.source_url || d.title === item.title);
      if (!existsLocally) {
        const entry = {
          id: crypto.randomUUID(),
          user_id: null,
          title: item.title,
          summary: item.summary || item.contentSnippet || '',
          content: item.content || item.summary || '',
          source_name: item.source_name,
          source_url: item.source_url,
          category: item.category || 'Space Missions',
          image_url: item.image_url || '',
          published_at: item.published_at || new Date().toISOString(),
          is_official_feed: true,
          tags: item.tags || ['Official RSS', item.source_name],
          created_at: new Date().toISOString()
        };

        if (supabase) {
          try {
            const { data, error } = await supabase
              .from('discoveries')
              .upsert([entry], { onConflict: 'source_url' })
              .select();

            if (!error && data) {
              localDiscoveries.unshift(entry);
              newItems.push(entry);
              insertedCount++;
              continue;
            }
          } catch (err) {
            console.warn('[DiscoveryModel] Supabase feed upsert error:', err.message);
          }
        }

        localDiscoveries.unshift(entry);
        newItems.push(entry);
        insertedCount++;
      }
    }

    return { insertedCount, newItems };
  },

  async deleteByIdAndUser(id, userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('discoveries')
          .delete()
          .match({ id, user_id: userId })
          .select();

        if (!error && data && data.length > 0) {
          const idx = localDiscoveries.findIndex(d => d.id === id && d.user_id === userId);
          if (idx !== -1) localDiscoveries.splice(idx, 1);
          return true;
        }
      } catch (err) {
        console.warn('[DiscoveryModel] Supabase delete error:', err.message);
      }
    }

    const idx = localDiscoveries.findIndex(d => d.id === id && d.user_id === userId);
    if (idx !== -1) {
      localDiscoveries.splice(idx, 1);
      return true;
    }
    return false;
  }
};
